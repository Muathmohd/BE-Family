const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const settingsController = require('../controllers/settingsController');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');
const newsController = require('../controllers/newsController');
const contentController = require('../controllers/contentController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Apply API key validation to ALL routes
router.use(apiKeyMiddleware);

// Authentication routes (public - only require x-api-key)
router.post('/user/otp/send', userController.sendOtp);
router.post('/user/otp/verify', userController.verifyOtp);

// Settings routes (public)
router.get('/settings', settingsController.getSettings);
router.post('/settings/cache/clear', settingsController.clearCache);
router.post('/settings/reload', settingsController.reloadSettings);
router.get('/settings/template-url', settingsController.getTemplateUrl);
router.get('/settings/tree-url', settingsController.getTreeUrl);

// News routes (public)
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);

// Content routes (public)
router.get('/content/about-family', contentController.getAboutFamily);

// Protected routes (require x-api-key + x-api-token)
router.post('/auth/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, profileController.getProfile);

module.exports = router;
