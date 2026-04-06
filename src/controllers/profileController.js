const ResponseHelper = require('../helpers/responseHelper');

const profileController = {
  async getProfile(req, res) {
    try {
      res.status(200).json(
        ResponseHelper.success({
          user: req.user,
          message: 'Profile retrieved successfully'
        })
      );
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json(
        ResponseHelper.error('2009')
      );
    }
  }
};

module.exports = profileController;
