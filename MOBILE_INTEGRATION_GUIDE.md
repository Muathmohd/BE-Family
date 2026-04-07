# BE-Family API - Mobile Integration Guide

## 🔐 Important: Authentication Required

**Most endpoints now require authentication!** 

Only these endpoints are public (API key only):
- `/api/user/otp/send`
- `/api/user/otp/verify`
- `/api/settings`
- `/api/settings/cache/clear`
- `/api/settings/reload`

**All other endpoints** (news, content, profile, etc.) require both `x-api-key` AND `x-api-token` headers.

---

## Base Configuration

### API Base URL
```
http://localhost:3001
```

### API Keys (Platform-specific)

**iOS:**
```
7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1
```

**Android:**
```
3c5a9f2e7b4d1a8c6f3e9b5d2a7c1f4e8a6b3d9f5c2e7a1b4d8f6c3e9a5b7d2c4f8e1
```

**Web:**
```
8b3e5a1c9f7d2e4a6c8b1f5d3e9a7c2f6d4b8e1a9c5f3d7b2e6a4c8f1d5e9a3c7b6f2
```

---

## Authentication Headers

All API requests require specific headers:

### Public Endpoints (Only API Key Required)
These endpoints only require the `x-api-key` header:
- `/api/user/otp/send` - Send OTP
- `/api/user/otp/verify` - Verify OTP
- `/api/settings` - Get all settings
- `/api/settings/cache/clear` - Clear cache
- `/api/settings/reload` - Reload settings

**Headers:**
```
x-api-key: <your_platform_api_key>
```

### Protected Endpoints (Authentication Token Required)
All other endpoints require BOTH headers:
```
x-api-key: <your_platform_api_key>
x-api-token: <user_auth_token>
```

**Protected endpoints include:**
- News (get all, get by ID)
- Content (about family)
- Settings (template URL, tree URL)
- Profile
- Logout

---

## API Endpoints

### 1. Health Check

#### Server Status
- **Method:** `GET`
- **Endpoint:** `/`
- **Headers:** None required
- **Description:** Check if server is running

**Example Request:**
```bash
curl http://localhost:3001/
```

**Example Response:**
```json
{
  "status": true,
  "response": {
    "message": "BE-Family API",
    "status": "Server is running",
    "version": "1.0.0"
  }
}
```

---

### 2. Authentication

#### 2.1 Send OTP
- **Method:** `POST`
- **Endpoint:** `/api/user/otp/send`
- **Headers:** `x-api-key`
- **Body:**
```json
{
  "mobile": "1234567890"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/user/otp/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -d '{"mobile":"1234567890"}'
```

**Example Response:**
```json
{
  "status": true,
  "response": {
    "message": "OTP sent successfully"
  }
}
```

#### 2.2 Verify OTP
- **Method:** `POST`
- **Endpoint:** `/api/user/otp/verify`
- **Headers:** `x-api-key`
- **Body:**
```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -d '{"mobile":"1234567890","otp":"123456"}'
```

**Example Response:**
```json
{
  "status": true,
  "response": {
    "token": "abc123def456...",
    "user": {
      "id": 1,
      "mobile": "1234567890",
      "name": "User Name"
    }
  }
}
```

**Important:** Save the `token` from this response - you'll need it for all protected endpoints.

#### 2.3 Logout
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Headers:** `x-api-key`, `x-api-token`

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: abc123def456..."
```

---

### 3. News

#### 3.1 Get All News (Paginated)
- **Method:** `GET`
- **Endpoint:** `/api/news?page=1`
- **Headers:** `x-api-key`, `x-api-token` ⚠️ **REQUIRES AUTHENTICATION**
- **Query Parameters:**
  - `page` (optional): Page number (default: 1, 8 items per page)

**Example Request:**
```bash
curl http://localhost:3001/api/news?page=1 \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: YOUR_AUTH_TOKEN"
```

#### 3.2 Get News by ID
- **Method:** `GET`
- **Endpoint:** `/api/news/{id}`
- **Headers:** `x-api-key`, `x-api-token` ⚠️ **REQUIRES AUTHENTICATION**

**Example Request:**
```bash
curl http://localhost:3001/api/news/1 \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: YOUR_AUTH_TOKEN"
```

---

### 4. Content

#### 4.1 Get About Family
- **Method:** `GET`
- **Endpoint:** `/api/content/about-family`
- **Headers:** `x-api-key`, `x-api-token` ⚠️ **REQUIRES AUTHENTICATION**

**Example Request:**
```bash
curl http://localhost:3001/api/content/about-family \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: YOUR_AUTH_TOKEN"
```

---

### 5. Settings

#### 5.1 Get All Settings
- **Method:** `GET`
- **Endpoint:** `/api/settings`
- **Headers:** `x-api-key` ✅ **PUBLIC ENDPOINT**

**Example Request:**
```bash
curl http://localhost:3001/api/settings \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1"
```

#### 5.2 Clear Settings Cache
- **Method:** `POST`
- **Endpoint:** `/api/settings/cache/clear`
- **Headers:** `x-api-key` ✅ **PUBLIC ENDPOINT**

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/settings/cache/clear \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1"
```

#### 5.3 Reload Settings from Database
- **Method:** `POST`
- **Endpoint:** `/api/settings/reload`
- **Headers:** `x-api-key` ✅ **PUBLIC ENDPOINT**

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/settings/reload \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1"
```

#### 5.4 Get Template URL
- **Method:** `GET`
- **Endpoint:** `/api/settings/template-url`
- **Headers:** `x-api-key`, `x-api-token` ⚠️ **REQUIRES AUTHENTICATION**
- **Description:** Returns platform-specific template URL based on your API key

**Example Request:**
```bash
curl http://localhost:3001/api/settings/template-url \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: YOUR_AUTH_TOKEN"
```

#### 5.5 Get Tree URL
- **Method:** `GET`
- **Endpoint:** `/api/settings/tree-url`
- **Headers:** `x-api-key`, `x-api-token` ⚠️ **REQUIRES AUTHENTICATION**
- **Description:** Returns platform-specific family tree URL based on your API key

**Example Request:**
```bash
curl http://localhost:3001/api/settings/tree-url \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: YOUR_AUTH_TOKEN"
```

---

### 6. Protected Endpoints

These endpoints require both `x-api-key` AND `x-api-token` headers.

#### 6.1 Get User Profile
- **Method:** `GET`
- **Endpoint:** `/api/profile`
- **Headers:** `x-api-key`, `x-api-token`

**Example Request:**
```bash
curl http://localhost:3001/api/profile \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1" \
  -H "x-api-token: abc123def456..."
```

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "status": true,
  "response": {
    // response data here
  }
}
```

### Error Response
```json
{
  "status": false,
  "error": {
    "code": "error_code",
    "message": "Error message in Arabic"
  }
}
```

---

## Error Codes

Common error codes you might encounter:

### API Key Errors
- `4001`: API key is required (x-api-key header missing)
- `4002`: Invalid API key

### Authentication Token Errors
- `3005`: Token is required (x-api-token header missing)
- `3006`: Invalid or expired token ⚠️ **PRIMARY TOKEN ERROR**
- `3007`: Unauthorized access

### OTP Errors
- `3001`: Invalid or expired OTP
- `3002`: OTP already used
- `3003`: OTP is required
- `3004`: Failed to verify OTP

### General Errors
- `2009`: Internal server error
- `2008`: Database error
- `2010`: Invalid request parameters

### Content Errors
- `5001`: Failed to retrieve news
- `5003`: News not found
- `5004`: Content not found
- `5006`: Template URL not found
- `5007`: Tree URL not found

**Note:** When a token is invalid or expired, you'll receive error code `3006`. The mobile app should handle this by redirecting the user to re-authenticate (send OTP again).

---

## Token Validation Flow

All protected endpoints validate the authentication token in the following order:

1. **Check if token exists** in `x-api-token` header
   - If missing → Error `3005`: "Token is required"

2. **Validate token** against database
   - If invalid or expired → Error `3006`: "Invalid or expired token"
   - If any other error → Error `3007`: "Unauthorized access"

3. **Allow request** if token is valid

### Handling Token Errors

When your mobile app receives a token error:

```javascript
// Pseudo-code example
if (errorCode === 3005 || errorCode === 3006 || errorCode === 3007) {
  // Clear stored token
  clearAuthToken();
  
  // Redirect to login/OTP screen
  redirectToLogin();
}
```

---

## Integration Checklist

### For iOS Team:
- [ ] Use iOS API key: `7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1`
- [ ] Add `x-api-key` header to **ALL** requests
- [ ] Store auth token securely after OTP verification
- [ ] Add `x-api-token` header for protected endpoints (news, content, profile, etc.)
- [ ] Implement token error handling (errors 3005, 3006, 3007)
- [ ] Redirect to login on token errors

### For Android Team:
- [ ] Use Android API key: `3c5a9f2e7b4d1a8c6f3e9b5d2a7c1f4e8a6b3d9f5c2e7a1b4d8f6c3e9a5b7d2c4f8e1`
- [ ] Add `x-api-key` header to **ALL** requests
- [ ] Store auth token securely after OTP verification
- [ ] Add `x-api-token` header for protected endpoints (news, content, profile, etc.)
- [ ] Implement token error handling (errors 3005, 3006, 3007)
- [ ] Redirect to login on token errors

### For Web Team:
- [ ] Use Web API key: `8b3e5a1c9f7d2e4a6c8b1f5d3e9a7c2f6d4b8e1a9c5f3d7b2e6a4c8f1d5e9a3c7b6f2`
- [ ] Add `x-api-key` header to **ALL** requests
- [ ] Store auth token securely after OTP verification
- [ ] Add `x-api-token` header for protected endpoints (news, content, profile, etc.)
- [ ] Implement token error handling (errors 3005, 3006, 3007)
- [ ] Redirect to login on token errors

---

## Testing

You can use the provided Postman collection (`postman/BE-Family-API-Collection.json`) to test all endpoints.

### Quick Test:
```bash
# Test if server is running
curl http://localhost:3001/

# Test with API key
curl http://localhost:3001/api/settings \
  -H "x-api-key: 7f9a2e8b5d4c1a6f3e8b9d2c5a7f1e4b9c3a5e7f2d8b4a6c1e9f5a3d7c2b8e4a6f1"
```

---

## Notes

1. **API Keys are Platform-Specific:** Use the correct API key for your platform (iOS, Android, or Web)
2. **Token Management:** The auth token should be stored securely and included in all protected endpoint requests
3. **Token Expiration:** If you receive a token error (4004), re-authenticate using OTP
4. **Base URL:** Currently using `http://localhost:3001` for development. This will be updated for production.

---

## Support

For questions or issues, contact the backend team.

**Document Version:** 1.0  
**Last Updated:** April 6, 2026
