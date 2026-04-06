const db = require('../config/database');

const contentModel = {
  async getContentByCode(contentCode) {
    try {
      const query = `
        SELECT content_text
        FROM content
        WHERE content_code = ? AND is_deleted = 0
        LIMIT 1
      `;
      
      const result = await db.query(query, [contentCode]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get content: ${error.message}`);
    }
  }
};

module.exports = contentModel;
