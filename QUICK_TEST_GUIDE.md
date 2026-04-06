# Quick Test Guide - OTP Verification

## Prerequisites
- Server running on port 3000
- User exists in database with mobile number

## Test Flow

### Step 1: Send OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Expected Response:**
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

**Check console for OTP:**
```
Mock SMS sent to 1234567890: Your OTP is 123456
```

---

### Step 2: Verify OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "123456"}'
```

**Expected Response:**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE2NDU1NjIzNDUsImV4cCI6MTY0ODE1NDM0NX0.abc123...",
    "user": {
      "user_id": 123,
      "username": "john_doe",
      "mobile": "1234567890"
    }
  }
}
```

**Copy the token value!**

---

### Step 3: Access Protected Route

Replace `YOUR_TOKEN_HERE` with the token from step 2:

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
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

---

## Test Error Cases

### Test 1: Missing Mobile
```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** Error 2001 - Mobile number is required

---

### Test 2: Missing OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Expected:** Error 3003 - OTP is required

---

### Test 3: Invalid OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "999999"}'
```

**Expected:** Error 3001 - Invalid or expired OTP

---

### Test 4: Reuse OTP (Already Burned)
```bash
# Use the same OTP twice
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "123456"}'
```

**Expected:** Error 3001 - Invalid or expired OTP (because is_burnt = 1)

---

### Test 5: No Token
```bash
curl -X GET http://localhost:3000/api/profile
```

**Expected:** Error 3005 - Token is required

---

### Test 6: Invalid Token
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer invalid_token_123"
```

**Expected:** Error 3006 - Invalid or expired token

---

## Test Old OTP Invalidation

### Step 1: Send first OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Note the OTP from console:** e.g., 111111

---

### Step 2: Send second OTP (within 2 minutes - wait if needed)
Wait 2 minutes, then:

```bash
curl -X POST http://localhost:3000/api/user/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890"}'
```

**Note the new OTP:** e.g., 222222

---

### Step 3: Try to use first OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "111111"}'
```

**Expected:** Error 3001 - Invalid or expired OTP
(Because it was burned when new OTP was generated)

---

### Step 4: Use second OTP
```bash
curl -X POST http://localhost:3000/api/user/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "1234567890", "otp": "222222"}'
```

**Expected:** Success with token

---

## Postman Collection

You can import these as Postman requests:

### 1. Send OTP
- Method: POST
- URL: `{{base_url}}/api/user/otp/send`
- Body (JSON):
```json
{
  "mobile": "1234567890"
}
```

### 2. Verify OTP
- Method: POST
- URL: `{{base_url}}/api/user/otp/verify`
- Body (JSON):
```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

### 3. Get Profile (Protected)
- Method: GET
- URL: `{{base_url}}/api/profile`
- Headers:
  - Authorization: `Bearer {{token}}`

---

## Environment Variables

Create a Postman environment with:
- `base_url`: `http://localhost:3000`
- `token`: (will be set from verify OTP response)

---

## Success Criteria

✅ Send OTP returns success
✅ OTP visible in console
✅ Verify OTP with correct code returns token
✅ Profile endpoint works with token
✅ Old OTPs are invalidated when new one sent
✅ Used OTP cannot be reused
✅ Invalid OTP returns error
✅ Missing token returns 401
✅ Invalid token returns 401
✅ All responses follow standard format
