# BE-Family - Node.js MVC Application

A Node.js application built with Express.js following the MVC (Model-View-Controller) design pattern with MySQL database integration.

## Features

- ✅ **Standardized API Response Structure** - All APIs follow the same response format
- ✅ **Centralized Error Management** - Error messages managed via JSON file with error codes
- ✅ **Settings Cache System** - Application settings loaded from database and cached
- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **MySQL Database** - Production-ready database integration

## Project Structure

```
BE-Family/
├── database/
│   └── settings_table.sql    # Settings table schema
├── src/
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   └── errorMessages.json # Centralized error messages
│   ├── controllers/
│   │   ├── userController.js # User business logic
│   │   └── settingsController.js # Settings management
│   ├── helpers/
│   │   ├── responseHelper.js # Standardized response formatter
│   │   └── cacheManager.js   # In-memory cache system
│   ├── models/
│   │   ├── userModel.js      # User database operations
│   │   └── settingsModel.js  # Settings database operations
│   └── routes/
│       └── index.js          # API routes
├── server.js                  # Application entry point
├── package.json
├── .env                       # Environment variables
└── README.md
```

## MVC Architecture

- **Models** (`src/models/`): Handle database operations and business data
- **Views**: JSON responses (REST API)
- **Controllers** (`src/controllers/`): Process requests and coordinate between models and responses
- **Routes** (`src/routes/`): Define API endpoints

## Error Codes

All error messages are centralized in `src/config/errorMessages.json`:

| Error Code | Error Message |
|------------|---------------|
| 2001 | Mobile number is required |
| 2002 | User not found or inactive |
| 2003 | Please wait 2 minutes before requesting a new OTP |
| 2004 | Missing or invalid password |
| 2005 | User not found |
| 2006 | Invalid token |
| 2007 | Failed to send OTP |
| 2008 | Database error |
| 2009 | Internal server error |
| 2010 | Invalid request parameters |
| 2011 | Failed to load settings |
| 2012 | Cache cleared successfully |
| 2013 | Failed to clear cache |

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Your `.env` file is already configured with database credentials

3. **Setup Database Tables**
   ```bash
   # Execute the settings table schema
   mysql -u your_user -p your_database < database/settings_table.sql
   ```

4. **Start the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Response Structure

All APIs follow a standardized response format:

### Success Response
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

### Success Response (No Data)
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {}
}
```

### Error Response
```json
{
  "is_successful": false,
  "error_code": 2002,
  "error_msg": "User not found or inactive",
  "app_code": "BE-Family",
  "response": {}
}
```

## API Endpoints

### User Endpoints

#### POST `/api/user/otp/send`
Send OTP to user mobile

**Request Body:**
```json
{
  "mobile": "1234567890"
}
```

**Success Response (200):**
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

**Error Responses:**
- `2001` (400) - Mobile number is required
- `2002` (404) - User not found or inactive
- `2003` (429) - Please wait 2 minutes before requesting a new OTP
- `2007` (500) - Failed to send OTP

### Settings Endpoints

#### GET `/api/settings`
Get all application settings from cache

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "api_base_url": "https://api.example.com",
    "sms_gateway_url": "https://sms.example.com",
    "otp_expiry_minutes": "10"
  }
}
```

#### POST `/api/settings/cache/clear`
Clear the settings cache

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "message": "Cache cleared successfully"
  }
}
```

#### POST `/api/settings/reload`
Reload settings from database and update cache

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "message": "Settings reloaded successfully",
    "settings": { ... }
  }
}
```

### Root Endpoint

#### GET `/`
API status and version

## Features Breakdown

### 1. Standardized API Response Structure

All APIs return responses in a unified format:
- `is_successful`: Boolean indicating success/failure
- `error_code`: Numeric error code (empty string on success)
- `error_msg`: Human-readable error message (empty string on success)
- `app_code`: Application identifier (only in error responses)
- `response`: Object containing the actual response data

**Implementation:**
- `src/helpers/responseHelper.js` - Central response formatter
- Used across all controllers

### 2. Centralized Error Management

Error messages are managed from a JSON file:
- All error messages stored in `src/config/errorMessages.json`
- Each error mapped to a unique error code
- Controllers only pass error codes
- System automatically resolves codes to messages

**Benefits:**
- Easy to maintain and update error messages
- Consistent error handling across the application
- Support for internationalization (i18n) in the future
- Single source of truth for all error messages

### 3. Settings Cache System

Application settings loaded from database and cached:
- Settings stored in `settings` database table
- Loaded into memory cache on application startup
- Accessible throughout the application via `settingsModel`
- API endpoints to manage cache

**Flow:**
1. App starts → Load all settings from DB into cache
2. Runtime → Read from cache (no DB queries)
3. Admin action → Clear/reload cache via API
4. Next access → Fresh data from database

**Implementation:**
- `src/helpers/cacheManager.js` - In-memory cache system
- `src/models/settingsModel.js` - Settings database operations
- `src/controllers/settingsController.js` - Cache management APIs

## Business Logic

### OTP Send Flow

1. **Validate Request**: Check if mobile number is provided
2. **User Validation**: Check if user exists in database and is active
3. **Rate Limiting**: Check if user has requested OTP in last 2 minutes with `is_burnt = 0`
4. **Generate OTP**: Create random 6-digit number
5. **Store OTP**: Insert into `user_otp` table
6. **Send SMS**: Call SMS service (currently mocked)
7. **Return Response**: Send success response to client

### Database Tables

**user**
- `user_id` (int, primary key, auto_increment)
- `username` (varchar 255)
- `mobile` (int 20)
- `created_at` (timestamp)
- `is_active` (int, default 1)

**user_otp**
- `user_otp_id` (int, primary key, auto_increment)
- `user_id` (int, foreign key)
- `otp` (int 11)
- `is_burnt` (int, default 0)
- `create_at` (timestamp)
- `burn_at` (timestamp, nullable)

**settings**
- `settings_id` (int, primary key, auto_increment)
- `key` (varchar 255, unique)
- `value` (varchar 255)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Usage Examples

- **Express.js** - Web framework
- **MySQL** - SQL database
- **mysql2** - MySQL client with promises
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **nodemon** - Development auto-reload

## Next Steps

1. Create additional models for your entities
2. Add more controllers for business logic
3. Implement authentication middleware
4. Add input validation
5. Create database migrations
6. Add error handling middleware
7. Implement logging
8. Add unit tests

## License

ISC
