const ResponseHelper = require('../helpers/responseHelper');
const userModel = require('../models/userModel');

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
  },

  async updateProfile(req, res) {
    try {
      const { birthday, status, living } = req.body;
      const userId = req.user.user_id;

      console.log(`[${req.platform}] Update profile for user ${userId}`);

      const validStatus = ['طالب', 'موظف', 'غير موظف', 'اخرى'];
      const validLiving = ['الدمام', 'الخبر', 'الرياض', 'الاحساء', 'جده', 'المدينة', 'مكة', 'اخرى', 'الجبيل'];

      if (status && !validStatus.includes(status)) {
        return res.status(400).json(
          ResponseHelper.error('1001', 'حالة غير صالحة. يرجى اختيار واحدة من: طالب، موظف، غير موظف، اخرى')
        );
      }

      if (living && !validLiving.includes(living)) {
        return res.status(400).json(
          ResponseHelper.error('1001', 'مدينة غير صالحة. يرجى اختيار واحدة من المدن المتاحة')
        );
      }

      if (birthday) {
        const birthdayDate = new Date(birthday);
        if (isNaN(birthdayDate.getTime())) {
          return res.status(400).json(
            ResponseHelper.error('1001', 'تاريخ الميلاد غير صالح')
          );
        }
      }

      const profileData = {};
      if (birthday) profileData.birthday = birthday;
      if (status) profileData.status = status;
      if (living) profileData.living = living;

      if (Object.keys(profileData).length === 0) {
        return res.status(400).json(
          ResponseHelper.error('1001', 'لا توجد بيانات للتحديث')
        );
      }

      const updatedUser = await userModel.updateProfile(userId, profileData);

      res.status(200).json(
        ResponseHelper.success({
          user: updatedUser,
          message: 'تم تحديث الملف الشخصي بنجاح'
        })
      );
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json(
        ResponseHelper.error('2009')
      );
    }
  }
};

module.exports = profileController;
