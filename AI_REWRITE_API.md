# AI Rewrite Text API - COMPLETED ✅

## New AI-Powered Endpoint Added

A new API endpoint has been created that uses DeepSeek AI to rewrite text content.

---

## Endpoint Details

**POST** `/api/ai/rewrite`

**Authentication:** Requires `x-api-key` header only (public endpoint)

**Request Body:**
```json
{
  "text": "Your text to rewrite here"
}
```

---

## How It Works

1. User sends text to the API
2. API calls DeepSeek AI API to rewrite the text
3. If AI succeeds, returns rewritten text
4. If AI fails or errors, returns original text (graceful fallback)

---

## Response Format

### Success (AI worked):
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

### Fallback (AI failed):
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

---

## Usage Examples

### Using cURL:
```bash
curl -X POST "http://localhost:3001/api/ai/rewrite" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا بكم في تطبيق العائلة"
  }'
```

### Using JavaScript (Fetch):
```javascript
async function rewriteText(text) {
  try {
    const response = await fetch('http://localhost:3001/api/ai/rewrite', {
      method: 'POST',
      headers: {
        'x-api-key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    
    if (data.is_successful) {
      console.log('Original:', data.response.original_text);
      console.log('Rewritten:', data.response.rewritten_text);
      console.log('Success:', data.response.success);
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
rewriteText('مرحبا بكم في تطبيق العائلة');
```

### Using Axios:
```javascript
const axios = require('axios');

async function rewriteText(text) {
  try {
    const response = await axios.post('http://localhost:3001/api/ai/rewrite', 
      { text },
      {
        headers: {
          'x-api-key': 'YOUR_API_KEY'
        }
      }
    );

    console.log('Rewritten text:', response.data.response.rewritten_text);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Usage
rewriteText('مرحبا بكم في تطبيق العائلة');
```

---

## Files Created/Modified

### Created:
1. ✅ `src/controllers/aiController.js` - New controller for AI operations

### Modified:
2. ✅ `src/routes/index.js` - Added AI route
3. ✅ `package.json` - Installed axios dependency
4. ✅ `postman/BE-Family-API-Collection.json` - Added AI endpoint
5. ✅ `postman/README.md` - Updated documentation

---

## Features

### Graceful Fallback
- If DeepSeek API is down or returns an error, the API still returns HTTP 200
- Original text is returned in `rewritten_text` field
- `success: false` flag indicates fallback mode
- User experience remains smooth even if AI fails

### Error Handling
- Validates that `text` parameter is provided
- 30-second timeout on external API calls
- Catches and logs all errors
- Returns appropriate error messages in Arabic

### No Authentication Required
- Only requires `x-api-key` header (like other public endpoints)
- No user token needed
- Can be used without logging in

---

## External API Details

**Provider:** DeepSeek AI  
**Model:** deepseek-chat  
**API URL:** https://api.deepseek.com/chat/completions  
**Timeout:** 30 seconds

---

## Dependencies

### New Package Installed:
- **axios** (v1.7.9) - HTTP client for making requests to DeepSeek API

To install manually:
```bash
npm install axios
```

---

## API Statistics

| Category | Endpoints |
|----------|-----------|
| Authentication | 3 |
| News | 2 |
| Content | 1 |
| Settings | 5 |
| Projects | 1 |
| **AI** 🆕 | **1** |
| Profile | 2 |
| Health Check | 2 |
| **Total** | **17** |

---

## Testing

### Test in Postman:
1. Import the updated collection
2. Go to "AI" → "Rewrite Text"
3. Modify the text in the body
4. Click Send
5. Check the `rewritten_text` field in the response

### Test with cURL:
```bash
# Test with Arabic text
curl -X POST "http://localhost:3001/api/ai/rewrite" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8" \
  -H "Content-Type: application/json" \
  -d '{"text": "مرحبا بكم في تطبيق العائلة"}'

# Test with English text
curl -X POST "http://localhost:3001/api/ai/rewrite" \
  -H "x-api-key: ios_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8" \
  -H "Content-Type: application/json" \
  -d '{"text": "Welcome to the Family App"}'
```

---

## Security Note

⚠️ **Important:** The DeepSeek API key is currently hardcoded in the controller. For production, you should:

1. Move it to `.env` file:
```env
DEEPSEEK_API_KEY=sk-c457e454de6f46a5bf3f0634d4e37a9f
```

2. Update the controller to use environment variable:
```javascript
'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
```

---

✅ **AI Rewrite Text API is now live and ready to use!**
