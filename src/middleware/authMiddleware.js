const tokenModel = require('../models/tokenModel');
const ResponseHelper = require('../helpers/responseHelper');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x-api-token'];

    if (!token) {
      return res.status(401).json(
        ResponseHelper.error('3005')
      );
    }

    try {
      const tokenData = await tokenModel.validateToken(token);
      
      if (!tokenData) {
        return res.status(401).json(
          ResponseHelper.error('3006')
        );
      }

      req.user = {
        user_id: tokenData.user_id,
        mobile: tokenData.mobile,
        username: tokenData.username,
        birthday: tokenData.birthday,
        status: tokenData.status,
        living: tokenData.living,
        is_verified: tokenData.user_is_verified,
        is_active: tokenData.is_active,
        created_at: tokenData.user_created_at
      };

      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json(
        ResponseHelper.error('3006')
      );
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json(
      ResponseHelper.error('3007')
    );
  }
};

module.exports = authMiddleware;
