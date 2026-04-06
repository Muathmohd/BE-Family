const db = require('../config/database');

const newsModel = {
  async getAllNews(page = 1, pageSize = 8) {
    try {
      const offset = (page - 1) * pageSize;
      
      const query = `
        SELECT news_id, title, description, created_at
        FROM news
        WHERE is_active = 1
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const result = await db.query(query, [pageSize, offset]);
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM news
        WHERE is_active = 1
      `;
      
      const countResult = await db.query(countQuery);
      const total = countResult.rows[0].total;
      const totalPages = Math.ceil(total / pageSize);
      
      return {
        news: result.rows,
        pagination: {
          current_page: page,
          page_size: pageSize,
          total_items: total,
          total_pages: totalPages
        }
      };
    } catch (error) {
      throw new Error(`Failed to get news: ${error.message}`);
    }
  },

  async getNewsById(newsId) {
    try {
      const query = `
        SELECT news_id, title, description, created_at
        FROM news
        WHERE news_id = ? AND is_active = 1
        LIMIT 1
      `;
      
      const result = await db.query(query, [newsId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const news = result.rows[0];
      
      const mediaQuery = `
        SELECT news_media_id, media_type, media_url, created_at
        FROM news_media
        WHERE news_id = ?
        ORDER BY created_at ASC
      `;
      
      const mediaResult = await db.query(mediaQuery, [newsId]);
      
      news.media = mediaResult.rows;
      
      return news;
    } catch (error) {
      throw new Error(`Failed to get news by ID: ${error.message}`);
    }
  }
};

module.exports = newsModel;
