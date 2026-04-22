# Postman Collection - Updated v3

## ✅ What's New in v3

### New Features (v3):
1. ✅ **Projects API** - Get active projects with pagination (5 per page)
2. ✅ **Update Profile API** - Users can update birthday, status, and living location
3. ✅ **Profile section reorganized** - Separate folder for profile endpoints

### Updated Features (v2):
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
- ✅ GET `/api/news?page=1` - Get all news paginated (x-api-key + x-api-token required)
- ✅ GET `/api/news/:id` - Get news by ID (x-api-key + x-api-token required)

### Content (1 endpoint)
- ✅ GET `/api/content/about-family` - Get about family content (x-api-key + x-api-token required)

### Settings (5 endpoints)
- ✅ GET `/api/settings` - Get all settings (x-api-key required)
- ✅ GET `/api/settings/template-url` - Get template URL (x-api-key + x-api-token required)
- ✅ GET `/api/settings/tree-url` - Get tree URL (x-api-key + x-api-token required)
- ✅ POST `/api/settings/cache/clear` - Clear cache (x-api-key required)
- ✅ POST `/api/settings/reload` - Reload settings (x-api-key required)

### Projects (1 endpoint) 🆕
- ✅ GET `/api/projects?page=1` - Get active projects paginated (x-api-key + x-api-token required)

### AI (1 endpoint) 🆕
- ✅ POST `/api/ai/rewrite` - Rewrite text using AI (x-api-key required)

### Profile (2 endpoints) 🆕
- ✅ GET `/api/profile` - Get user profile (x-api-key + x-api-token required)
- ✅ PUT `/api/profile` - Update user profile (x-api-key + x-api-token required)

### Health Check (2 endpoints)
- ✅ GET `/` - Server status (no headers required)
- ✅ GET `/api/version-check` - Version and build info (x-api-key required)

**Total: 17 endpoints**

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
4. "Health Check" → "Version Check" → Send
5. Verify version and build info

---

### Step 2: Authentication Flow
```
1. "Authentication" → "1. Send OTP" → Send
2. Check console for OTP code
3. Update OTP in "2. Verify OTP" body
4. "Authentication" → "2. Verify OTP" → Send
   ✅ Token auto-saved!
```

---

### Step 3: Test Profile APIs 🆕
```
1. "Profile" → "Get User Profile" → Send
2. "Profile" → "Update User Profile" → Send
   (Update birthday, status, living)
3. "Profile" → "Get User Profile" → Send (verify changes)
```

---

### Step 4: Test Projects API 🆕
```
1. "Projects" → "Get All Projects (Paginated)" → Send
2. Change page number to 2 → Send
```

---

### Step 5: Test News APIs
```
1. "News" → "Get All News" → Send
2. "News" → "Get News by ID" → Send
```

---

### Step 6: Test Content & Settings
```
1. "Content" → "Get About Family" → Send
2. "Settings" → "Get Template URL" → Send
3. "Settings" → "Get Tree URL" → Send
```

---

### Step 7: Logout
```
1. "Authentication" → "3. Logout" → Send
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

### Public APIs (require only x-api-key):
```
x-api-key: {{api_key}}
```

**Endpoints:**
- Send OTP
- Verify OTP
- Version Check 🆕
- AI Rewrite Text 🆕
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
- Update Profile 🆕
- Get All Projects 🆕
- Get All News
- Get News by ID
- Get About Family
- Get Template URL
- Get Tree URL
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

**Postman collection updated with all 17 endpoints! 🎉**

---

## 🆕 New API Details (v3)

### 1. Get Projects (Paginated)
**Endpoint:** `GET /api/projects?page=1`

**Query Parameters:**
- `page` (optional): Page number, default 1

**Response:**
```json
{
  "is_successful": true,
  "response": {
    "projects": [
      {
        "project_id": 15,
        "name": "Project Name",
        "logo": "logo.jpg",
        "description": "Description",
        "category": "Category",
        "city": ["الرياض", "جده"],
        "external_url": "https://example.com",
        "is_active": 1
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 5,
      "total": 25,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 2. Update User Profile
**Endpoint:** `PUT /api/profile`

**Request Body (all fields optional):**
```json
{
  "birthday": "1995-05-15",
  "status": "موظف",
  "living": "الرياض"
}
```

**Valid Values:**
- **status**: طالب, موظف, غير موظف, اخرى
- **living**: الدمام, الخبر, الرياض, الاحساء, جده, المدينة, مكة, اخرى, الجبيل
- **birthday**: Date in YYYY-MM-DD format

**Response:**
```json
{
  "is_successful": true,
  "response": {
    "user": {
      "user_id": 1,
      "username": "Test User",
      "mobile": "1234567890",
      "birthday": "1995-05-15",
      "status": "موظف",
      "living": "الرياض",
      "is_verified": 1,
      "is_active": 1
    },
    "message": "تم تحديث الملف الشخصي بنجاح"
  }
}
```

### 3. Version Check 🆕
**Endpoint:** `GET /api/version-check`

**Response:**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "app_code": "BE-Family",
  "response": {
    "version": "BUILD-2026-04-11-01",
    "commit": "419f9c7",
    "time": "2026-04-11T12:30:45.123Z",
    "status": "running"
  }
}
```

### 4. AI Rewrite Text 🆕
**Endpoint:** `POST /api/ai/rewrite`

**Request Body:**
```json
{
  "text": "مرحبا بكم في تطبيق العائلة"
}
```

**Success Response (AI worked):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "app_code": "BE-Family",
  "response": {
    "original_text": "مرحبا بكم في تطبيق العائلة",
    "rewritten_text": "أهلاً وسهلاً بكم في تطبيق العائلة",
    "success": true
  }
}
```

**Fallback Response (AI failed):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "app_code": "BE-Family",
  "response": {
    "original_text": "مرحبا بكم في تطبيق العائلة",
    "rewritten_text": "مرحبا بكم في تطبيق العائلة",
    "success": false,
    "message": "فشل إعادة الكتابة، تم إرجاع النص الأصلي"
  }
}
```
