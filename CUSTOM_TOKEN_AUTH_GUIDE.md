# Custom Token Authentication System

## ✅ Implementation Complete

I've refactored the authentication system from JWT to a custom token-based system according to all your requirements.

---

## Overview

### Authentication Flow

```
1. Send OTP → User submits mobile
2. Verify OTP → User submits mobile + OTP
   ↓
   - Burn OTP (is_burnt = 1)
   - Set user is_verified = 1
   - Generate 32-character token
   - Store token in database
   - Return token
3. Access Protected APIs → Send x-api-token + x-api-key
4. Logout → Invalidate token (has_expired = 1)
```

---

## New Token System

### Token Characteristics
- ✅ **No JWT** - Uses random 32-character hex token
- ✅ **No automatic expiration** - Valid until logout
- ✅ **Database-stored** - Stored in `user_token` table
- ✅ **Single-use per session** - Old tokens invalidated on logout

### Token Generation
```javascript
// Generates random 32-character hex string
crypto.randomBytes(16).toString('hex')
// Example: "a1b2c3d4e5f6789012345678abcdef90"
```

---

## API Endpoints

### 1. Send OTP (No Auth Required)
**POST** `/api/user/otp/send`

**Request:**
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

**Behavior:**
- Burns all previous OTPs for this user
- Generates new 6-digit OTP
- Stores with 10-minute validity
- Sends SMS (mocked)

---

### 2. Verify OTP (No Auth Required)
**POST** `/api/user/otp/verify`

**Request:**
```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "token": "a1b2c3d4e5f6789012345678abcdef90",
    "user": {
      "user_id": 123,
      "username": "john_doe",
      "mobile": "1234567890"
    }
  }
}
```

**What Happens:**
1. Validates OTP (10-minute window, not burned)
2. Burns the OTP (is_burnt = 1, burn_at = NOW())
3. Sets user.is_verified = 1
4. Generates 32-character token
5. Stores token in user_token table
6. Returns token

**Error Responses:**
- `2001` (400) - Mobile number is required
- `2002` (404) - User not found or inactive
- `3003` (400) - OTP is required
- `3001` (400) - Invalid or expired OTP

---

### 3. Logout (Auth Required)
**POST** `/api/auth/logout`

**Headers:**
```
x-api-token: a1b2c3d4e5f6789012345678abcdef90
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "message": "Logged out successfully"
  }
}
```

**What Happens:**
1. Marks token as expired (has_expired = 1)
2. Sets expires_at = NOW()
3. Token can no longer be used

---

### 4. Protected Endpoint Example
**GET** `/api/profile`

**Headers:**
```
x-api-token: a1b2c3d4e5f6789012345678abcdef90
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "user": {
      "user_id": 123,
      "mobile": "1234567890",
      "username": "john_doe",
      "is_verified": 1
    },
    "message": "Profile retrieved successfully"
  }
}
```

---

## Header Requirements for Protected APIs

### Required Headers

1. **x-api-token**
   - User's authentication token
   - 32-character hex string
   - Obtained from OTP verification
   - Example: `a1b2c3d4e5f6789012345678abcdef90`

2. **x-api-key**
   - Platform API key
   - Must match one of: iOS, Android, or Web key
   - Stored in .env file

### API Keys Configuration

**In `.env` file:**
```env
IOS_API_KEY = "ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8"
ANDROID_API_KEY = "android_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
WEB_API_KEY = "web_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
```

**Platform Examples:**
- iOS App: `x-api-key: ios_d7f8e9a0...`
- Android App: `x-api-key: android_a1b2c3d4...`
- Web App: `x-api-key: web_1a2b3c4d...`

---

## Public vs Protected APIs

### Public APIs (No Authentication)
- `POST /api/user/otp/send` - Send OTP
- `POST /api/user/otp/verify` - Verify OTP
- `GET /api/settings` - Get settings
- `POST /api/settings/cache/clear` - Clear cache
- `POST /api/settings/reload` - Reload settings

### Protected APIs (Require x-api-token + x-api-key)
- `POST /api/auth/logout` - Logout
- `GET /api/profile` - Get user profile
- All future endpoints with `authMiddleware`

---

## Database Schema

### user_token Table

```sql
CREATE TABLE user_token (
  user_token_id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) UNSIGNED NOT NULL,
  token VARCHAR(255) NOT NULL,
  is_verified INT(11) DEFAULT 0,
  has_expired INT(11) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);
```

### user Table Addition

```sql
ALTER TABLE user ADD COLUMN is_verified INT(11) DEFAULT 0;
```

**Default Values:**
- `is_verified` = 0 (user not verified)
- After OTP verification → `is_verified` = 1

---

## Authentication Middleware

### How It Works

1. **Extract Headers**
   - `x-api-key` from request headers
   - `x-api-token` from request headers

2. **Validate API Key**
   - Check if API key exists
   - Verify it matches iOS, Android, or Web key
   - Return error 4001 or 4002 if invalid

3. **Validate Token**
   - Check if token exists
   - Query database for token
   - Verify has_expired = 0
   - Verify user is active
   - Return error 3005 or 3006 if invalid

4. **Attach User Data**
   - If valid, attach `req.user` with user info
   - Attach `req.token` for logout use
   - Call `next()`

### Usage in Routes

```javascript
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.post('/public', controller.method);

// Protected route
router.get('/protected', authMiddleware, controller.method);
```

---

## Error Codes

| Code | Message | HTTP Status | Description |
|------|---------|-------------|-------------|
| 2001 | Mobile number is required | 400 | Missing mobile in request |
| 2002 | User not found or inactive | 404 | User doesn't exist |
| 2003 | Wait 2 minutes before new OTP | 429 | Rate limit hit |
| 3001 | Invalid or expired OTP | 400 | OTP verification failed |
| 3003 | OTP is required | 400 | Missing OTP in request |
| 3004 | Failed to verify OTP | 500 | Server error during verification |
| 3005 | Token is required | 401 | Missing x-api-token header |
| 3006 | Invalid or expired token | 401 | Token validation failed |
| 3007 | Unauthorized access | 401 | General auth error |
| 4001 | API key is required | 401 | Missing x-api-key header |
| 4002 | Invalid API key | 401 | API key doesn't match |
| 4003 | Failed to logout | 500 | Server error during logout |

---

## Testing Guide

### Prerequisites
- User exists in database with mobile number
- Run database migration for user_token table

### Test Flow

#### 1. Send OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Check console for OTP code**

---

#### 2. Verify OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "123456"}'
```

**Save the token from response!**

---

#### 3. Access Protected Route
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "x-api-token: YOUR_TOKEN_HERE" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8"
```

---

#### 4. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "x-api-token: YOUR_TOKEN_HERE" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8"
```

---

#### 5. Try Using Token After Logout (Should Fail)
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "x-api-token: YOUR_TOKEN_HERE" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8"
```

**Expected:** Error 3006 - Invalid or expired token

---

### Error Test Cases

#### Test: Missing API Key
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "x-api-token: YOUR_TOKEN_HERE"
```
**Expected:** Error 4001 - API key is required

---

#### Test: Invalid API Key
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "x-api-token: YOUR_TOKEN_HERE" \
  -H "x-api-key: invalid_key_123"
```
**Expected:** Error 4002 - Invalid API key

---

#### Test: Missing Token
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8"
```
**Expected:** Error 3005 - Token is required

---

## Implementation Details

### Files Created

1. **`src/models/tokenModel.js`**
   - createToken() - Generate and store token
   - validateToken() - Validate token from headers
   - invalidateToken() - Mark token as expired
   - invalidateAllUserTokens() - Logout all sessions

2. **`src/controllers/authController.js`**
   - logout() - Logout endpoint handler

3. **`database/user_token_table.sql`**
   - Database schema for user_token table

4. **`CUSTOM_TOKEN_AUTH_GUIDE.md`**
   - This documentation

### Files Modified

1. **`src/helpers/tokenHelper.js`**
   - Removed JWT logic
   - Added generateToken() - 32-char random hex
   - Added generateApiKey() - 64-char random hex

2. **`src/models/userModel.js`**
   - Added setUserVerified() - Set is_verified = 1
   - Updated verifyOtp() - Now creates custom token
   - Stores token in database

3. **`src/middleware/authMiddleware.js`**
   - Validates x-api-key header
   - Validates x-api-token header
   - Queries database for token validation
   - No JWT verification

4. **`src/controllers/userController.js`**
   - No changes needed (uses updated models)

5. **`src/routes/index.js`**
   - Added logout route

6. **`src/config/errorMessages.json`**
   - Added 4001: API key is required
   - Added 4002: Invalid API key
   - Added 4003: Failed to logout

7. **`.env`**
   - Removed JWT_SECRET and JWT_EXPIRES_IN
   - Added IOS_API_KEY
   - Added ANDROID_API_KEY
   - Added WEB_API_KEY

8. **`package.json`**
   - Removed jsonwebtoken dependency

---

## Security Features

✅ **Custom Token System**
- Random 32-character tokens
- Database-stored for validation
- No client-side token manipulation

✅ **Platform API Keys**
- Separate keys for iOS, Android, Web
- Server-side validation
- Easy to rotate if compromised

✅ **OTP Security**
- 10-minute validity
- Single-use (burned after verification)
- Old OTPs invalidated on new request

✅ **Token Lifecycle**
- Created only after OTP verification
- Valid until explicit logout
- Cannot be reused after logout

✅ **User Verification**
- Default is_verified = 0
- Set to 1 only after OTP verification
- Tracks verification status

---

## Production Recommendations

1. **Generate Strong API Keys**
   ```javascript
   const crypto = require('crypto');
   console.log('iOS:', crypto.randomBytes(32).toString('hex'));
   console.log('Android:', crypto.randomBytes(32).toString('hex'));
   console.log('Web:', crypto.randomBytes(32).toString('hex'));
   ```

2. **Use HTTPS**
   - Encrypt token transmission
   - Protect API keys in transit

3. **Implement Rate Limiting**
   - Limit OTP requests per IP
   - Limit failed login attempts

4. **Add Token Cleanup**
   - Periodically delete very old expired tokens
   - Keep database lean

5. **Monitor API Key Usage**
   - Log which platform keys are used
   - Detect suspicious patterns

6. **Real SMS Integration**
   - Replace mock SMS with actual service
   - Add SMS delivery tracking

---

## Summary

✅ **Custom 32-character tokens** instead of JWT
✅ **Database-stored tokens** with validation
✅ **Platform API keys** (iOS, Android, Web)
✅ **Dual header authentication** (x-api-token + x-api-key)
✅ **User verification status** (is_verified field)
✅ **Logout functionality** with token invalidation
✅ **No automatic token expiry**
✅ **OTP burn rules** properly implemented
✅ **All requirements met**

---

## Quick Reference

### Headers for Protected APIs
```
x-api-token: a1b2c3d4e5f6789012345678abcdef90
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

### Protect a Route
```javascript
router.get('/my-route', authMiddleware, controller.myMethod);
```

### Access User Data in Controller
```javascript
async myMethod(req, res) {
  const userId = req.user.user_id;
  const mobile = req.user.mobile;
  const isVerified = req.user.is_verified;
  // ... your logic
}
```

---

**Implementation Complete! 🎉**
