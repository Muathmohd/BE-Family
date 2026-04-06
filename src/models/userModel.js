const db = require('../config/database');

const userModel = {
  async findUserByMobile(mobile) {
    try {
      const query = 'SELECT * FROM `user` WHERE mobile = ? AND is_active = 1';
      const result = await db.query(query, [mobile]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  async checkRecentOtp(userId) {
    try {
      const query = `
        SELECT * FROM user_otp 
        WHERE user_id = ? 
        AND is_burned = 0 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const result = await db.query(query, [userId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  async createOtp(userId) {
    try {
      await this.burnAllOtpsForUser(userId);
      
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      const query = `
        INSERT INTO user_otp (user_id, otp, is_burned, created_at)
        VALUES (?, ?, 0, NOW())
      `;
      
      const result = await db.query(query, [userId, otp]);
      
      return {
        otp_id: result.rows.insertId,
        otp: otp
      };
    } catch (error) {
      throw new Error(`Failed to create OTP: ${error.message}`);
    }
  },

  async burnAllOtpsForUser(userId) {
    try {
      const query = `
        UPDATE user_otp 
        SET is_burned = 1, burned_at = NOW() 
        WHERE user_id = ? AND is_burned = 0
      `;
      await db.query(query, [userId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to burn OTPs: ${error.message}`);
    }
  },

  async setUserVerified(userId) {
    try {
      const query = `
        UPDATE \`user\` 
        SET is_verified = 1 
        WHERE user_id = ?
      `;
      await db.query(query, [userId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to set user verified: ${error.message}`);
    }
  },

  async verifyOtp(mobile, otp) {
    try {
      const user = await this.findUserByMobile(mobile);
      
      if (!user) {
        return { valid: false, error: 'user_not_found' };
      }

      const query = `
        SELECT * FROM user_otp 
        WHERE user_id = ? 
        AND otp = ? 
        AND is_burned = 0 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      const result = await db.query(query, [user.user_id, otp]);

      if (result.rows.length === 0) {
        return { valid: false, error: 'invalid_or_expired' };
      }

      const otpRecord = result.rows[0];

      const updateQuery = `
        UPDATE user_otp 
        SET is_burned = 1, burned_at = NOW() 
        WHERE user_otp_id = ?
      `;
      
      await db.query(updateQuery, [otpRecord.user_otp_id]);

      await this.setUserVerified(user.user_id);

      const tokenModel = require('./tokenModel');
      const tokenData = await tokenModel.createToken(user.user_id);

      return {
        valid: true,
        user: user,
        token: tokenData.token
      };
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  },

  async sendSms(mobile, otp) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock SMS sent to ${mobile}: Your OTP is ${otp}`);
        resolve({
          success: true,
          message: 'SMS sent successfully (mock)',
          mobile: mobile,
          otp: otp
        });
      }, 100);
    });
  }
};

module.exports = userModel;
