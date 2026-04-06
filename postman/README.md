# Postman Collection - Updated v2

## ✅ What's New in v2

### Updated Features:
1. ✅ **All endpoints now have `x-api-key` header** (required for all APIs)
2. ✅ **Port updated to 3001** (from 3000)
3. ✅ **5 new API endpoints added:**
   - Get All News (Paginated)
   - Get News by ID
   - Get Template URL
   - Get Tree URL
   - Get About Family Content
4. ✅ **Environment includes all 3 platform keys** (iOS, Android, Web)
5. ✅ **Arabic error messages** by default

---

## 📦 Files to Import

### 1. Collection
`postman/BE-Family-API-Collection.json`

### 2. Environment
`postman/BE-Family-Development.postman_environment.json`

---

## 📋 Complete API List

### Authentication (3 endpoints)
- ✅ POST `/api/user/otp/send` - Send OTP (x-api-key required)
- ✅ POST `/api/user/otp/verify` - Verify OTP (x-api-key required)
- ✅ POST `/api/auth/logout` - Logout (x-api-key + x-api-token required)

### News (2 endpoints)
- ✅ GET `/api/news?page=1` - Get all news paginated (x-api-key required)
- ✅ GET `/api/news/:id` - Get news by ID (x-api-key required)

### Content (1 endpoint)
- ✅ GET `/api/content/about-family` - Get about family content (x-api-key required)

### Settings (5 endpoints)
- ✅ GET `/api/settings` - Get all settings (x-api-key required)
- ✅ GET `/api/settings/template-url` - Get template URL (x-api-key required)
- ✅ GET `/api/settings/tree-url` - Get tree URL (x-api-key required)
- ✅ POST `/api/settings/cache/clear` - Clear cache (x-api-key required)
- ✅ POST `/api/settings/reload` - Reload settings (x-api-key required)

### Protected Routes (1 endpoint)
- ✅ GET `/api/profile` - Get user profile (x-api-key + x-api-token required)

### Health Check (1 endpoint)
- ✅ GET `/` - Server status (no headers required)

**Total: 13 endpoints**

---

## 🔑 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3001` | Server URL |
| `api_key` | iOS key | Default platform key (iOS) |
| `api_key_android` | Android key | Android platform key |
| `api_key_web` | Web key | Web platform key |
| `auth_token` | Auto-filled | User authentication token |
| `mobile` | `1234567890` | Test mobile number |
| `otp` | `123456` | Test OTP code |

---

## 🧪 Testing Workflow

### Step 1: Health Check
1. Open "Health Check" → "Server Status"
2. Click **Send**
3. Verify server is running

---

### Step 2: Test News APIs
```
1. "News" → "Get All News" → Send
2. "News" → "Get News by ID" → Send
```

---

### Step 3: Test Content & Settings
```
1. "Content" → "Get About Family" → Send
2. "Settings" → "Get Template URL" → Send
3. "Settings" → "Get Tree URL" → Send
```

---

### Step 4: Authentication Flow
```
1. "Authentication" → "1. Send OTP" → Send
2. Check console for OTP code
3. Update OTP in "2. Verify OTP" body
4. "Authentication" → "2. Verify OTP" → Send
   ✅ Token auto-saved!
5. "Protected Routes" → "Get User Profile" → Send
6. "Authentication" → "3. Logout" → Send
```

---

## 🌐 Test Different Platforms

### iOS (Default)
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

### Android
Change `api_key` variable to `{{api_key_android}}`
```
x-api-key: android_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

### Web
Change `api_key` variable to `{{api_key_web}}`
```
x-api-key: web_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
```

**Platform-specific URLs** will be returned based on which key you use!

---

## 🎯 Request Headers Summary

### All Public APIs (require only x-api-key):
```
x-api-key: {{api_key}}
```

**Endpoints:**
- Send OTP
- Verify OTP
- Get All News
- Get News by ID
- Get About Family
- Get Template URL
- Get Tree URL
- Get Settings
- Clear Cache
- Reload Settings

### Protected APIs (require both headers):
```
x-api-key: {{api_key}}
x-api-token: {{auth_token}}
```

**Endpoints:**
- Get Profile
- Logout

---

## 🚀 Quick Import Instructions

1. **Open Postman**
2. Click **Import** (top left)
3. **Drag and drop** both files:
   - `postman/BE-Family-API-Collection.json`
   - `postman/BE-Family-Development.postman_environment.json`
4. Select **"BE-Family Development"** from environment dropdown (top right)
5. **Start testing!**

---

## 📱 Arabic Error Messages

All error messages now return in Arabic by default:

**Example Error Response:**
```json
{
  "is_successful": false,
  "error_code": 2001,
  "error_msg": "رقم الجوال مطلوب",
  "app_code": "BE-Family",
  "response": {}
}
```

---

## ✨ Auto-Features

1. **Token Auto-Save** - Verify OTP automatically saves token to environment
2. **Platform Detection** - Template & Tree URLs return based on api_key
3. **Variables** - All values use environment variables for easy configuration
4. **Organized Folders** - APIs grouped logically
5. **Descriptions** - Each request has helpful descriptions

---

**Postman collection updated with all 13 endpoints! 🎉**
