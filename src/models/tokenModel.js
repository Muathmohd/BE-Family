const db = require('../config/database');

const tokenModel = {
  async createToken(userId) {
    try {
      const TokenHelper = require('../helpers/tokenHelper');
      const token = TokenHelper.generateToken();
      
      const query = `
        INSERT INTO user_token (user_id, token, is_revoked, created_at)
        VALUES (?, ?, 0, NOW())
      `;
      
      const result = await db.query(query, [userId, token]);
      
      return {
        token_id: result.rows.insertId,
        token: token
      };
    } catch (error) {
      throw new Error(`Failed to create token: ${error.message}`);
    }
  },

  async validateToken(token) {
    try {
      const query = `
        SELECT 
          ut.*, 
          u.user_id, 
          u.username, 
          u.mobile, 
          u.birthday,
          u.status,
          u.living,
          u.is_verified as user_is_verified,
          u.is_active,
          u.created_at as user_created_at
        FROM user_token ut
        JOIN \`user\` u ON ut.user_id = u.user_id
        WHERE ut.token = ? 
        AND ut.is_revoked = 0
        AND u.is_active = 1
        LIMIT 1
      `;
      
      const result = await db.query(query, [token]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Token validation error: ${error.message}`);
    }
  },

  async invalidateToken(token) {
    try {
      const query = `
        UPDATE user_token 
        SET is_revoked = 1, revoked_at = NOW() 
        WHERE token = ?
      `;
      
      await db.query(query, [token]);
      return true;
    } catch (error) {
      throw new Error(`Failed to invalidate token: ${error.message}`);
    }
  },

  async invalidateAllUserTokens(userId) {
    try {
      const query = `
        UPDATE user_token 
        SET is_revoked = 1, revoked_at = NOW() 
        WHERE user_id = ? AND is_revoked = 0
      `;
      
      await db.query(query, [userId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to invalidate user tokens: ${error.message}`);
    }
  }
};

module.exports = tokenModel;
