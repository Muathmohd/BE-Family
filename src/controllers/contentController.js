const contentModel = require('../models/contentModel');
const ResponseHelper = require('../helpers/responseHelper');

const contentController = {
  async getAboutFamily(req, res) {
    try {
      console.log(`[${req.platform}] Get about family content`);

      const content = await contentModel.getContentByCode('about_family');

      if (!content) {
        return res.status(404).json(
          ResponseHelper.error('5004')
        );
      }

      res.status(200).json(
        ResponseHelper.success({
          content: content.content_text
        })
      );
    } catch (error) {
      console.error('Get About Family Error:', error);
      res.status(500).json(
        ResponseHelper.error('5005')
      );
    }
  }
};

module.exports = contentController;
