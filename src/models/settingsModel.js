const db = require('../config/database');
const cacheManager = require('../helpers/cacheManager');

const SETTINGS_CACHE_KEY = 'app_settings';

const settingsModel = {
  async loadAllSettings() {
    try {
      const query = 'SELECT `key`, `value` FROM settings';
      const result = await db.query(query);
      
      const settings = {};
      result.rows.forEach(row => {
        settings[row.key] = row.value;
      });
      
      cacheManager.set(SETTINGS_CACHE_KEY, settings);
      
      return settings;
    } catch (error) {
      console.log('111')
      throw new Error(`Failed to load settings: ${error.message}`);
    }
  },

  async getSettings() {
    let settings = cacheManager.get(SETTINGS_CACHE_KEY);
    
    if (!settings) {
      settings = await this.loadAllSettings();
    }
    
    return settings;
  },

  getSetting(key) {
    const settings = cacheManager.get(SETTINGS_CACHE_KEY);
    return settings ? settings[key] : null;
  },

  clearCache() {
    cacheManager.delete(SETTINGS_CACHE_KEY);
    return true;
  },

  async reloadSettings() {
    this.clearCache();
    return await this.loadAllSettings();
  }
};

module.exports = settingsModel;
