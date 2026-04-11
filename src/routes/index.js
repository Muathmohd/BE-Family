const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const settingsController = require('../controllers/settingsController');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');
const newsController = require('../controllers/newsController');
const contentController = require('../controllers/contentController');
const projectController = require('../controllers/projectController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Apply API key validation to ALL routes
router.use(apiKeyMiddleware);

// ========================================
// Public routes (only require x-api-key)
// ========================================

// Authentication routes
router.post('/user/otp/send', userController.sendOtp);
router.post('/user/otp/verify', userController.verifyOtp);

// Settings routes (public)
router.get('/settings', settingsController.getSettings);
router.post('/settings/cache/clear', settingsController.clearCache);
router.post('/settings/reload', settingsController.reloadSettings);

// ========================================
// Protected routes (require x-api-key + x-api-token)
// ========================================

// Settings routes (protected)
router.get('/settings/template-url', authMiddleware, settingsController.getTemplateUrl);
router.get('/settings/tree-url', authMiddleware, settingsController.getTreeUrl);

// News routes (protected)
router.get('/news', authMiddleware, newsController.getAllNews);
router.get('/news/:id', authMiddleware, newsController.getNewsById);

// Content routes (protected)
router.get('/content/about-family', authMiddleware, contentController.getAboutFamily);

// Project routes (protected)
router.get('/projects', authMiddleware, projectController.getProjects);

// Auth routes (protected)
router.post('/auth/logout', authMiddleware, authController.logout);

// Profile routes (protected)
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);

module.exports = router;
