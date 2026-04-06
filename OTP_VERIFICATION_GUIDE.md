# OTP Verification API - Complete Implementation

## ✅ All Requirements Implemented

### New API Endpoint

**POST** `/api/user/otp/verify`

Verify user OTP and generate authentication token.

---

## API Documentation

### 1. Send OTP (Updated)

**Endpoint:** `POST /api/user/otp/send`

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

**Changes:**
- ✅ Burns all previous OTPs for the mobile number
- ✅ Only the latest OTP remains valid

---

### 2. Verify OTP (New)

**Endpoint:** `POST /api/user/otp/verify`

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 123,
      "username": "john_doe",
      "mobile": "1234567890"
    }
  }
}
```

**Error Responses:**
- `2001` (400) - Mobile number is required
- `2002` (404) - User not found or inactive
- `3003` (400) - OTP is required
- `3001` (400) - Invalid or expired OTP
- `3004` (500) - Failed to verify OTP

**Validation Rules:**
1. ✅ OTP must match mobile number
2. ✅ OTP must be within 10-minute validity window
3. ✅ OTP must not be burned (is_burnt = 0)
4. ✅ On success, OTP is immediately marked as burned (is_burnt = 1, burn_at = NOW())
5. ✅ Authentication token is generated and returned

---

### 3. Protected Endpoint Example

**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer <your_token_here>
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
      "username": "john_doe"
    },
    "message": "Profile retrieved successfully"
  }
}
```

**Error Responses:**
- `3005` (401) - Token is required
- `3006` (401) - Invalid or expired token
- `3007` (401) - Unauthorized access

---

## OTP Flow Implementation

### Send OTP Flow

```
1. User submits mobile number
2. System validates user exists
3. System burns all previous OTPs for that user (is_burnt = 1)
4. System generates new 6-digit OTP
5. System stores OTP with create_at = NOW()
6. System sends SMS (mocked)
7. Returns success response
```

### Verify OTP Flow

```
1. User submits mobile + OTP
2. System validates user exists
3. System checks:
   - OTP matches user_id
   - OTP value is correct
   - is_burnt = 0
   - create_at >= NOW() - 10 minutes
4. If valid:
   - Mark OTP as burned (is_burnt = 1, burn_at = NOW())
   - Generate JWT token
   - Return token in response
5. If invalid:
   - Return error response
```

### OTP Burn Rules

**When sending new OTP:**
```sql
UPDATE user_otp 
SET is_burnt = 1, burn_at = NOW() 
WHERE user_id = ? AND is_burnt = 0
```
- All previous OTPs become invalid
- Only the newest OTP can be used

**When verifying OTP:**
```sql
UPDATE user_otp 
SET is_burnt = 1, burn_at = NOW() 
WHERE user_otp_id = ?
```
- Used OTP is marked as burned
- Cannot be reused

---

## Authentication System

### Token Generation

**Location:** `src/helpers/tokenHelper.js`

**JWT Payload:**
```javascript
{
  user_id: 123,
  mobile: "1234567890",
  username: "john_doe",
  iat: 1234567890,
  exp: 1234567890
}
```

**Token Expiry:** 30 days (configurable via JWT_EXPIRES_IN in .env)

### Authentication Middleware

**Location:** `src/middleware/authMiddleware.js`

**Usage:**
```javascript
router.get('/protected-route', authMiddleware, controller.method);
```

**How it works:**
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token signature and expiration
3. Decodes user information
4. Attaches `req.user` with user data
5. Calls next() or returns 401 error

### Protected vs Public APIs

**Public APIs (No Auth Required):**
- `POST /api/user/otp/send` - Send OTP
- `POST /api/user/otp/verify` - Verify OTP
- `GET /api/settings` - Get settings
- `POST /api/settings/cache/clear` - Clear cache
- `POST /api/settings/reload` - Reload settings

**Protected APIs (Auth Required):**
- `GET /api/profile` - Get user profile
- Any future API you add with authMiddleware

**To protect an API:**
```javascript
router.get('/your-route', authMiddleware, yourController.yourMethod);
```

---

## Testing Guide

### 1. Send OTP

```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

### 2. Verify OTP

```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "123456"}'
```

**Save the token from the response!**

### 3. Access Protected Route

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test Invalid Token

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "is_successful": false,
  "error_code": 3006,
  "error_msg": "Invalid or expired token",
  "app_code": "BE-Family",
  "response": {}
}
```

---

## Error Codes Reference

### OTP-Related Errors

| Code | Message | HTTP Status |
|------|---------|-------------|
| 2001 | Mobile number is required | 400 |
| 2002 | User not found or inactive | 404 |
| 2003 | Please wait 2 minutes before requesting a new OTP | 429 |
| 2007 | Failed to send OTP | 500 |
| 3001 | Invalid or expired OTP | 400 |
| 3002 | OTP already used | 400 |
| 3003 | OTP is required | 400 |
| 3004 | Failed to verify OTP | 500 |

### Authentication Errors

| Code | Message | HTTP Status |
|------|---------|-------------|
| 3005 | Token is required | 401 |
| 3006 | Invalid or expired token | 401 |
| 3007 | Unauthorized access | 401 |

---

## Configuration

### Environment Variables

Add to `.env`:

```env
JWT_SECRET = "your-super-secret-jwt-key-change-in-production-2024"
JWT_EXPIRES_IN = "30d"
```

**Important:** Change JWT_SECRET in production!

---

## Database Changes

### user_otp Table

No schema changes needed. Uses existing columns:
- `is_burnt` - Marks OTP as used/invalid
- `burn_at` - Timestamp when OTP was burned
- `create_at` - Used to check 10-minute validity

---

## Implementation Checklist

- ✅ OTP validity period: 10 minutes
- ✅ OTP matches mobile number
- ✅ OTP not burned (is_burnt = 0)
- ✅ Burn OTP on successful verification
- ✅ Burn all old OTPs when sending new one
- ✅ Generate JWT token on verification
- ✅ Authentication middleware
- ✅ Token in Authorization header
- ✅ Protect APIs with authMiddleware
- ✅ Public APIs: send OTP, verify OTP, cache APIs
- ✅ Standardized error responses
- ✅ Error codes in JSON file

---

## Architecture Overview

```
┌────────────────────────────────────────────┐
│         OTP Send & Verify Flow             │
└────────────────────────────────────────────┘

Send OTP:
  Request → Controller
    ↓
  Validate user exists
    ↓
  Burn all old OTPs (is_burnt = 1)
    ↓
  Generate new 6-digit OTP
    ↓
  Store in DB (is_burnt = 0)
    ↓
  Send SMS (mocked)
    ↓
  Return success

Verify OTP:
  Request → Controller
    ↓
  Validate user & OTP
    ↓
  Check:
    • OTP correct?
    • is_burnt = 0?
    • Within 10 minutes?
    ↓
  Mark as burned (is_burnt = 1)
    ↓
  Generate JWT token
    ↓
  Return token


┌────────────────────────────────────────────┐
│        Authentication Flow                 │
└────────────────────────────────────────────┘

Protected API Request:
  Request with Authorization header
    ↓
  Auth Middleware
    ↓
  Extract token
    ↓
  Verify JWT
    ↓
  If valid:
    • Attach req.user
    • Call next()
    ↓
  Controller processes request
    ↓
  Return response

  If invalid:
    • Return 401 error
```

---

## Files Modified/Created

### New Files
- `src/helpers/tokenHelper.js` - JWT token operations
- `src/middleware/authMiddleware.js` - Authentication middleware
- `src/controllers/profileController.js` - Example protected endpoint
- `OTP_VERIFICATION_GUIDE.md` - This documentation

### Modified Files
- `src/config/errorMessages.json` - Added OTP/auth error codes
- `src/models/userModel.js` - Added burnAllOtpsForUser() and verifyOtp()
- `src/controllers/userController.js` - Added verifyOtp()
- `src/routes/index.js` - Added verify route and profile route
- `.env` - Added JWT configuration
- `package.json` - Added jsonwebtoken dependency

---

## Security Notes

1. **JWT Secret:** Must be changed in production
2. **Token Expiry:** Default 30 days, adjust as needed
3. **OTP Burning:** Prevents replay attacks
4. **Single-use OTP:** Cannot be reused after verification
5. **Time-based validation:** 10-minute window
6. **Old OTP invalidation:** New OTP burns all previous ones

---

## Next Steps

1. ✅ Test send OTP
2. ✅ Test verify OTP
3. ✅ Save token
4. ✅ Test protected routes
5. Add authMiddleware to all new protected routes
6. Implement refresh token (optional)
7. Add rate limiting (recommended)
8. Add OTP attempt limits (recommended)
