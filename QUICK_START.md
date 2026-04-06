# Quick Start Guide

## Setup Steps

### 1. Create Settings Table
Run this SQL in your database:
```bash
mysql -u famliy-user -p famliy-dev < database/settings_table.sql
```

Or manually execute the SQL from `database/settings_table.sql`

### 2. Start the Server
```bash
npm start
```

You should see:
```
Loading application settings...
Settings loaded successfully
Server is running on port 3000
Environment: dev
```

---

## Test the New Features

### 1. Test Standardized Response - OTP Send
```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Success Response:**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "user_id": 123,
    "mobile": "1234567890",
    "otp_sent": true,
    "expires_in": "10 minutes"
  }
}
```

**Error Response (user not found):**
```json
{
  "is_successful": false,
  "error_code": 2002,
  "error_msg": "User not found or inactive",
  "app_code": "BE-Family",
  "response": {}
}
```

### 2. Test Settings Cache - Get Settings
```bash
curl http://localhost:3000/api/settings
```

**Response:**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "api_base_url": "https://api.example.com",
    "sms_gateway_url": "https://sms.example.com",
    "otp_expiry_minutes": "10",
    "max_otp_attempts": "3",
    "app_version": "1.0.0"
  }
}
```

### 3. Test Cache Management - Clear Cache
```bash
curl -X POST http://localhost:3000/api/settings/cache/clear
```

### 4. Test Cache Management - Reload Settings
```bash
curl -X POST http://localhost:3000/api/settings/reload
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Request Flow                         │
└─────────────────────────────────────────────────────────┘

1. Request → Route → Controller
2. Controller validates & calls Model
3. Model queries Database
4. Controller uses ResponseHelper with error code
5. ResponseHelper looks up error message from JSON
6. Returns standardized response


┌─────────────────────────────────────────────────────────┐
│                  Settings Cache Flow                     │
└─────────────────────────────────────────────────────────┘

App Start:
  └─> Load Settings from DB → Store in Cache

Runtime:
  └─> Read from Cache (no DB query)

Cache Clear/Reload:
  └─> Clear Cache → Load fresh from DB → Store in Cache


┌─────────────────────────────────────────────────────────┐
│                   Error Code System                      │
└─────────────────────────────────────────────────────────┘

Controller:
  └─> Pass error code: ResponseHelper.error('2002')
       └─> Look up in errorMessages.json
            └─> Return: "User not found or inactive"
```

---

## Files You Can Customize

### Add New Error Messages
Edit: `src/config/errorMessages.json`
```json
{
  "2014": "Your custom error message"
}
```

### Use in Controller
```javascript
res.json(ResponseHelper.error('2014'));
```

### Add New Settings
Insert into database:
```sql
INSERT INTO settings (`key`, `value`) 
VALUES ('new_setting', 'new_value');
```

Then reload:
```bash
curl -X POST http://localhost:3000/api/settings/reload
```

### Access Settings in Code
```javascript
const settingsModel = require('../models/settingsModel');

// In any controller
const settings = await settingsModel.getSettings();
const specificValue = settingsModel.getSetting('api_base_url');
```

---

## Key Benefits

✅ **Consistency** - All APIs use the same response structure
✅ **Maintainability** - Error messages in one place
✅ **Performance** - Settings cached, no repeated DB queries
✅ **Flexibility** - Easy to update settings without code changes
✅ **Scalability** - Cache system ready for Redis/Memcached
✅ **i18n Ready** - Error system supports multiple languages
