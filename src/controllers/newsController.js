const newsModel = require('../models/newsModel');
const ResponseHelper = require('../helpers/responseHelper');

const newsController = {
  async getAllNews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 8;

      console.log(`[${req.platform}] Get all news - Page ${page}`);

      const result = await newsModel.getAllNews(page, pageSize);

      res.status(200).json(
        ResponseHelper.success(result)
      );
    } catch (error) {
      console.error('Get All News Error:', error);
      res.status(500).json(
        ResponseHelper.error('5001')
      );
    }
  },

  async getNewsById(req, res) {
    try {
      const newsId = req.params.id;

      console.log(`[${req.platform}] Get news by ID: ${newsId}`);

      if (!newsId) {
        return res.status(400).json(
          ResponseHelper.error('5002')
        );
      }

      const news = await newsModel.getNewsById(newsId);

      if (!news) {
        return res.status(404).json(
          ResponseHelper.error('5003')
        );
      }

      res.status(200).json(
        ResponseHelper.success(news)
      );
    } catch (error) {
      console.error('Get News By ID Error:', error);
      res.status(500).json(
        ResponseHelper.error('5001')
      );
    }
  }
};

module.exports = newsController;
