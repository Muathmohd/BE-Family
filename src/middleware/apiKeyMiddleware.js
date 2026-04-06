const ResponseHelper = require('../helpers/responseHelper');
require('dotenv').config();

const IOS_API_KEY = process.env.IOS_API_KEY;
const ANDROID_API_KEY = process.env.ANDROID_API_KEY;
const WEB_API_KEY = process.env.WEB_API_KEY;

const apiKeyMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json(
        ResponseHelper.error('4001')
      );
    }

    const validApiKeys = [IOS_API_KEY, ANDROID_API_KEY, WEB_API_KEY];
    if (!validApiKeys.includes(apiKey)) {
      return res.status(401).json(
        ResponseHelper.error('4002')
      );
    }

    // Attach platform info to request for logging
    if (apiKey === IOS_API_KEY) {
      req.platform = 'iOS';
    } else if (apiKey === ANDROID_API_KEY) {
      req.platform = 'Android';
    } else if (apiKey === WEB_API_KEY) {
      req.platform = 'Web';
    }

    next();
  } catch (error) {
    console.error('API Key Middleware Error:', error);
    return res.status(401).json(
      ResponseHelper.error('4002')
    );
  }
};

module.exports = apiKeyMiddleware;
