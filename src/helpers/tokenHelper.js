const crypto = require('crypto');

class TokenHelper {
  static generateToken() {
    return crypto.randomBytes(16).toString('hex');
  }

  static generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = TokenHelper;
