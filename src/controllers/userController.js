const userModel = require('../models/userModel');
const ResponseHelper = require('../helpers/responseHelper');

const userController = {
  async sendOtp(req, res) {
    try {
      const { mobile } = req.body;

      console.log(`[${req.platform}] Send OTP request for mobile: ${mobile}`);

      if (!mobile) {
        return res.status(400).json(
          ResponseHelper.error('2001')
        );
      }

      const user = await userModel.findUserByMobile(mobile);
      
      if (!user) {
        return res.status(404).json(
          ResponseHelper.error('2002')
        );
      }

      const recentOtp = await userModel.checkRecentOtp(user.user_id);
      
      if (recentOtp) {
        return res.status(429).json(
          ResponseHelper.error('2003')
        );
      }

      const otpData = await userModel.createOtp(user.user_id);
      
      const smsResult = await userModel.sendSms(mobile, otpData.otp);
      
      console.log(`[${req.platform}] OTP sent successfully to ${mobile}`);
      
      res.status(200).json(
        ResponseHelper.success({
          user_id: user.user_id,
          mobile: mobile,
          otp_sent: smsResult.success,
          expires_in: '10 minutes'
        })
      );
      
    } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json(
        ResponseHelper.error('2007')
      );
    }
  },

  async verifyOtp(req, res) {
    try {
      const { mobile, otp } = req.body;

      console.log(`[${req.platform}] Verify OTP request for mobile: ${mobile}`);

      if (!mobile) {
        return res.status(400).json(
          ResponseHelper.error('2001')
        );
      }

      if (!otp) {
        return res.status(400).json(
          ResponseHelper.error('3003')
        );
      }

      const result = await userModel.verifyOtp(mobile, otp);

      if (!result.valid) {
        if (result.error === 'user_not_found') {
          return res.status(404).json(
            ResponseHelper.error('2002')
          );
        } else {
          return res.status(400).json(
            ResponseHelper.error('3001')
          );
        }
      }

      console.log(`[${req.platform}] OTP verified successfully for mobile: ${mobile}`);

      res.status(200).json(
        ResponseHelper.success({
          token: result.token,
          user: {
            user_id: result.user.user_id,
            username: result.user.username,
            mobile: result.user.mobile,
            birthday: result.user.birthday,
            status: result.user.status,
            living: result.user.living,
            is_verified: result.user.is_verified,
            is_active: result.user.is_active,
            created_at: result.user.created_at
          }
        })
      );
      
    } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json(
        ResponseHelper.error('3004')
      );
    }
  }
};

module.exports = userController;
