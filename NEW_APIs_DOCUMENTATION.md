# New APIs Implemented - Documentation

## ✅ All 5 APIs Completed

### Files Created:
1. `src/models/newsModel.js` - News database operations
2. `src/models/contentModel.js` - Content database operations  
3. `src/controllers/newsController.js` - News endpoints
4. `src/controllers/contentController.js` - Content endpoints
5. `database/content_table.sql` - Content table schema

### Files Modified:
1. `src/controllers/settingsController.js` - Added template URL & tree URL endpoints
2. `src/routes/index.js` - Added new routes
3. `src/config/errorMessages.json` - Added error codes 5001-5007

---

## 📋 API Endpoints

### 1. Get All News (Paginated)
**GET** `/api/news?page=1`

**Headers:**
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "news": [
      {
        "news_id": 1,
        "title": "News Title",
        "description": "News description...",
        "created_at": "2026-04-06T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "page_size": 8,
      "total_items": 25,
      "total_pages": 4
    }
  }
}
```

**Features:**
- ✅ Paginated (8 items per page)
- ✅ Excludes `is_active` field
- ✅ Only returns active news
- ✅ Ordered by created_at DESC

---

### 2. Get News by ID
**GET** `/api/news/:id`

**Headers:**
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**URL Parameters:**
- `id` (required) - News ID

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "news_id": 1,
    "title": "News Title",
    "description": "Full news description...",
    "created_at": "2026-04-06T10:00:00.000Z",
    "media": [
      {
        "news_media_id": 1,
        "media_type": "image",
        "media_url": "https://example.com/image1.jpg",
        "created_at": "2026-04-06T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "is_successful": false,
  "error_code": 5003,
  "error_msg": "News not found",
  "app_code": "BE-Family",
  "response": {}
}
```

**Features:**
- ✅ Returns news with related media
- ✅ Excludes `is_active` field
- ✅ Returns 404 if not found

---

### 3. Get Template URL
**GET** `/api/settings/template-url`

**Headers:**
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "template_url": "https://example.com/template/ios",
    "platform": "iOS"
  }
}
```

**Features:**
- ✅ Platform-specific URLs
- ✅ Checks for platform-specific key first (e.g., `TEMPLATE_URL_IOS`)
- ✅ Falls back to generic `TEMPLATE_URL` if platform-specific not found
- ✅ Platform auto-detected from `x-api-key` header

**Settings Keys:**
- `TEMPLATE_URL_IOS` - iOS-specific URL
- `TEMPLATE_URL_ANDROID` - Android-specific URL
- `TEMPLATE_URL_WEB` - Web-specific URL
- `TEMPLATE_URL` - Default/fallback URL

---

### 4. Get Family Tree URL
**GET** `/api/settings/tree-url`

**Headers:**
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "tree_url": "https://example.com/family-tree/ios",
    "platform": "iOS"
  }
}
```

**Features:**
- ✅ Platform-specific URLs
- ✅ Same logic as template URL
- ✅ Platform auto-detected from `x-api-key` header

**Settings Keys:**
- `TREE_URL_IOS` - iOS-specific URL
- `TREE_URL_ANDROID` - Android-specific URL
- `TREE_URL_WEB` - Web-specific URL
- `TREE_URL` - Default/fallback URL

---

### 5. Get About Family Content
**GET** `/api/content/about-family`

**Headers:**
```
x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
```

**Success Response (200):**
```json
{
  "is_successful": true,
  "error_code": "",
  "error_msg": "",
  "response": {
    "content": "Welcome to our family! This is the about family content..."
  }
}
```

**Error Response (404):**
```json
{
  "is_successful": false,
  "error_code": 5004,
  "error_msg": "Content not found",
  "app_code": "BE-Family",
  "response": {}
}
```

**Features:**
- ✅ Queries content table with `content_code = 'about_family'`
- ✅ Only returns non-deleted content (`is_deleted = 0`)
- ✅ Excludes backend fields
- ✅ Returns only `content_text`

---

## 🗄️ Database Requirements

### Content Table Schema
Run this SQL to create the content table:
```sql
CREATE TABLE `content` (
  `content_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content_code` VARCHAR(100) NOT NULL,
  `content_text` TEXT NOT NULL,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`content_id`),
  UNIQUE KEY `uq_content_code` (`content_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Settings to Add
```sql
INSERT INTO `settings` (`key`, `value`) VALUES
('TEMPLATE_URL', 'https://example.com/template'),
('TEMPLATE_URL_IOS', 'https://example.com/template/ios'),
('TEMPLATE_URL_ANDROID', 'https://example.com/template/android'),
('TEMPLATE_URL_WEB', 'https://example.com/template/web'),
('TREE_URL', 'https://example.com/family-tree'),
('TREE_URL_IOS', 'https://example.com/family-tree/ios'),
('TREE_URL_ANDROID', 'https://example.com/family-tree/android'),
('TREE_URL_WEB', 'https://example.com/family-tree/web');
```

---

## 🔒 Security

All 5 APIs require `x-api-key` header:
- ✅ Platform tracking (iOS/Android/Web)
- ✅ Request origin validation
- ✅ Consistent with existing APIs

**None of these APIs require authentication token** - they are public APIs.

---

## 📊 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 5001 | Failed to retrieve news | Database error getting news |
| 5002 | News ID is required | Missing news ID parameter |
| 5003 | News not found | News doesn't exist or inactive |
| 5004 | Content not found | Content doesn't exist or deleted |
| 5005 | Failed to retrieve content | Database error getting content |
| 5006 | Template URL not found | Template URL not in settings |
| 5007 | Tree URL not found | Tree URL not in settings |

---

## 🎯 Features Summary

### Get All News
- ✅ Pagination (8 per page)
- ✅ Excludes backend fields
- ✅ Returns pagination metadata
- ✅ Platform logging

### Get News by ID
- ✅ Returns news + media
- ✅ Excludes backend fields
- ✅ 404 if not found

### Get Template URL
- ✅ Platform-specific URLs
- ✅ Fallback to generic URL
- ✅ Auto-detects platform

### Get Tree URL
- ✅ Platform-specific URLs
- ✅ Fallback to generic URL
- ✅ Auto-detects platform

### Get About Family
- ✅ Content by code
- ✅ Excludes deleted content
- ✅ Returns text only

---

## 🧪 Testing

1. **Create content table:**
   ```bash
   mysql -u family-user -p family-dev < database/content_table.sql
   ```

2. **Test endpoints:**
   ```bash
   # Get all news
   curl -H "x-api-key: ios_..." http://localhost:3001/api/news
   
   # Get news by ID
   curl -H "x-api-key: ios_..." http://localhost:3001/api/news/1
   
   # Get template URL
   curl -H "x-api-key: ios_..." http://localhost:3001/api/settings/template-url
   
   # Get tree URL
   curl -H "x-api-key: ios_..." http://localhost:3001/api/settings/tree-url
   
   # Get about family
   curl -H "x-api-key: ios_..." http://localhost:3001/api/content/about-family
   ```

---

**All 5 APIs are ready to use! 🎉**
