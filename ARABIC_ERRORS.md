# Error Messages - Arabic Translation

## ✅ All Error Messages Translated to Arabic

### Implementation Details:

**Error Message Structure:**
```json
{
  "errorCode": {
    "en": "English message",
    "ar": "Arabic message (الرسالة بالعربية)"
  }
}
```

**Default Language:** Arabic (ar)
- All errors return Arabic by default
- English available as fallback

---

## 📋 Complete Error Messages List

### Authentication Errors (2xxx)

| Code | English | Arabic |
|------|---------|--------|
| 2001 | Mobile number is required | رقم الجوال مطلوب |
| 2002 | User not found or inactive | المستخدم غير موجود أو غير نشط |
| 2003 | Please wait 2 minutes before requesting a new OTP | يرجى الانتظار دقيقتين قبل طلب رمز تحقق جديد |
| 2004 | Missing or invalid password | كلمة المرور مفقودة أو غير صحيحة |
| 2005 | User not found | المستخدم غير موجود |
| 2006 | Invalid token | الرمز غير صحيح |
| 2007 | Failed to send OTP | فشل إرسال رمز التحقق |
| 2008 | Database error | خطأ في قاعدة البيانات |
| 2009 | Internal server error | خطأ داخلي في الخادم |
| 2010 | Invalid request parameters | معاملات الطلب غير صحيحة |
| 2011 | Failed to load settings | فشل تحميل الإعدادات |
| 2012 | Cache cleared successfully | تم مسح ذاكرة التخزين المؤقت بنجاح |
| 2013 | Failed to clear cache | فشل مسح ذاكرة التخزين المؤقت |

### OTP Errors (3xxx)

| Code | English | Arabic |
|------|---------|--------|
| 3001 | Invalid or expired OTP | رمز التحقق غير صحيح أو منتهي الصلاحية |
| 3002 | OTP already used | رمز التحقق مستخدم بالفعل |
| 3003 | OTP is required | رمز التحقق مطلوب |
| 3004 | Failed to verify OTP | فشل التحقق من رمز التحقق |
| 3005 | Token is required | الرمز مطلوب |
| 3006 | Invalid or expired token | الرمز غير صحيح أو منتهي الصلاحية |
| 3007 | Unauthorized access | وصول غير مصرح به |

### API Key Errors (4xxx)

| Code | English | Arabic |
|------|---------|--------|
| 4001 | API key is required | مفتاح API مطلوب |
| 4002 | Invalid API key | مفتاح API غير صحيح |
| 4003 | Failed to logout | فشل تسجيل الخروج |

### Content Errors (5xxx)

| Code | English | Arabic |
|------|---------|--------|
| 5001 | Failed to retrieve news | فشل استرجاع الأخبار |
| 5002 | News ID is required | معرف الخبر مطلوب |
| 5003 | News not found | الخبر غير موجود |
| 5004 | Content not found | المحتوى غير موجود |
| 5005 | Failed to retrieve content | فشل استرجاع المحتوى |
| 5006 | Template URL not found | رابط القالب غير موجود |
| 5007 | Tree URL not found | رابط شجرة العائلة غير موجود |

---

## 🎯 Usage in Code

### Default (Arabic):
```javascript
res.status(400).json(
  ResponseHelper.error('2001')
);
```

**Response:**
```json
{
  "is_successful": false,
  "error_code": 2001,
  "error_msg": "رقم الجوال مطلوب",
  "app_code": "BE-Family",
  "response": {}
}
```

### Explicit Language:
```javascript
// Arabic
res.status(400).json(
  ResponseHelper.error('2001', 'BE-Family', {}, 'ar')
);

// English
res.status(400).json(
  ResponseHelper.error('2001', 'BE-Family', {}, 'en')
);
```

---

## 🌐 How It Works

1. **Error messages stored in JSON** with both languages
2. **Default language: Arabic** (`ar`)
3. **Fallback to English** if Arabic not available
4. **ResponseHelper automatically selects** language

---

## 📱 Response Examples

### Arabic Response (Default):
```json
{
  "is_successful": false,
  "error_code": 3001,
  "error_msg": "رمز التحقق غير صحيح أو منتهي الصلاحية",
  "app_code": "BE-Family",
  "response": {}
}
```

### English Response (if specified):
```json
{
  "is_successful": false,
  "error_code": 3001,
  "error_msg": "Invalid or expired OTP",
  "app_code": "BE-Family",
  "response": {}
}
```

---

## ✅ Implementation Complete

- ✅ All 33 error messages translated to Arabic
- ✅ ResponseHelper updated to support multiple languages
- ✅ Default language set to Arabic
- ✅ English available as fallback
- ✅ Easy to add more languages in the future

---

## 🔮 Future Enhancement

To support language selection via header:
```javascript
const language = req.headers['accept-language'] === 'en' ? 'en' : 'ar';
res.json(ResponseHelper.error('2001', 'BE-Family', {}, language));
```

**All error messages are now in Arabic! 🇸🇦**
