const tokenModel = require('../models/tokenModel');
const ResponseHelper = require('../helpers/responseHelper');

const authController = {
  async logout(req, res) {
    try {
      const token = req.token;

      await tokenModel.invalidateToken(token);

      res.status(200).json(
        ResponseHelper.success({
          message: 'Logged out successfully'
        })
      );
    } catch (error) {
      console.error('Logout Error:', error);
      res.status(500).json(
        ResponseHelper.error('4003')
      );
    }
  }
};

module.exports = authController;
