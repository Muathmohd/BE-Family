const settingsModel = require('../models/settingsModel');
const ResponseHelper = require('../helpers/responseHelper');

const settingsController = {
  async getSettings(req, res) {
    try {
      const settings = await settingsModel.getSettings();
      
      res.status(200).json(
        ResponseHelper.success(settings)
      );
    } catch (error) {
      console.error('Get Settings Error:', error);
      res.status(500).json(
        ResponseHelper.error('2011')
      );
    }
  },

  async clearCache(req, res) {
    try {
      settingsModel.clearCache();
      
      res.status(200).json(
        ResponseHelper.success({
          message: 'Cache cleared successfully'
        })
      );
    } catch (error) {
      console.error('Clear Cache Error:', error);
      res.status(500).json(
        ResponseHelper.error('2013')
      );
    }
  },

  async reloadSettings(req, res) {
    try {
      const settings = await settingsModel.reloadSettings();
      
      res.status(200).json(
        ResponseHelper.success({
          message: 'Settings reloaded successfully',
          settings: settings
        })
      );
    } catch (error) {
      console.error('Reload Settings Error:', error);
      res.status(500).json(
        ResponseHelper.error('2011')
      );
    }
  },

  async getTemplateUrl(req, res) {
    try {
      const platform = req.platform;
      console.log(`[${platform}] Get template URL`);

      let settingKey = 'TEMPLATE_URL';
      
      if (platform === 'iOS') {
        settingKey = 'TEMPLATE_URL_IOS';
      } else if (platform === 'Android') {
        settingKey = 'TEMPLATE_URL_ANDROID';
      } else if (platform === 'Web') {
        settingKey = 'TEMPLATE_URL_WEB';
      }

      let templateUrl = settingsModel.getSetting(settingKey);
      
      if (!templateUrl) {
        templateUrl = settingsModel.getSetting('TEMPLATE_URL');
      }

      if (!templateUrl) {
        return res.status(404).json(
          ResponseHelper.error('5006')
        );
      }

      res.status(200).json(
        ResponseHelper.success({
          template_url: templateUrl,
          platform: platform
        })
      );
    } catch (error) {
      console.error('Get Template URL Error:', error);
      res.status(500).json(
        ResponseHelper.error('5005')
      );
    }
  },

  async getTreeUrl(req, res) {
    try {
      const platform = req.platform;
      console.log(`[${platform}] Get tree URL`);

      let settingKey = 'TREE_URL';
      
      if (platform === 'iOS') {
        settingKey = 'TREE_URL_IOS';
      } else if (platform === 'Android') {
        settingKey = 'TREE_URL_ANDROID';
      } else if (platform === 'Web') {
        settingKey = 'TREE_URL_WEB';
      }

      let treeUrl = settingsModel.getSetting(settingKey);
      
      if (!treeUrl) {
        treeUrl = settingsModel.getSetting('TREE_URL');
      }

      if (!treeUrl) {
        return res.status(404).json(
          ResponseHelper.error('5007')
        );
      }

      res.status(200).json(
        ResponseHelper.success({
          tree_url: treeUrl,
          platform: platform
        })
      );
    } catch (error) {
      console.error('Get Tree URL Error:', error);
      res.status(500).json(
        ResponseHelper.error('5005')
      );
    }
  }
};

module.exports = settingsController;
