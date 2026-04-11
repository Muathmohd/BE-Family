const projectModel = require('../models/projectModel');
const ResponseHelper = require('../helpers/responseHelper');

const projectController = {
  async getProjects(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5; // Fixed limit of 5 projects per page

      console.log(`[${req.platform}] Get projects - Page: ${page}`);

      // Validate page number
      if (page < 1) {
        return res.status(400).json(
          ResponseHelper.error('1001', 'Invalid page number')
        );
      }

      
      // Get projects and total count
      const [projects, total] = await Promise.all([
        projectModel.getActiveProjects(page, limit),
        projectModel.getTotalActiveProjects()
      ]);

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        ResponseHelper.success({
          projects: projects,
          pagination: {
            current_page: page,
            per_page: limit,
            total: total,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
          }
        })
      );
    } catch (error) {
      console.error('Get Projects Error:', error);
      res.status(500).json(
        ResponseHelper.error('5005')
      );
    }
  }
};

module.exports = projectController;
