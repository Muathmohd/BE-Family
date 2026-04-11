const db = require('../config/database');

const projectModel = {
  async getActiveProjects(page = 1, limit = 5) {
    try {
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT 
          project_id,
          name,
          logo,
          description,
          category,
          city,
          external_url,
          is_active
        FROM project 
        WHERE is_active = 1 
        ORDER BY project_id DESC 
        LIMIT ? OFFSET ?
      `;
      
      const result = await db.query(query, [limit, offset]);
      
      // Parse city field as array for each project
      const projects = result.rows.map(project => ({
        ...project,
        city: this.parseCityToArray(project.city)
      }));
      
      return projects;
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  },

  async getTotalActiveProjects() {
    try {
      const query = 'SELECT COUNT(*) as total FROM project WHERE is_active = 1';
      const result = await db.query(query);
      return result.rows[0].total;
    } catch (error) {
      throw new Error(`Failed to get total projects: ${error.message}`);
    }
  },

  parseCityToArray(city) {
    if (!city) {
      return [];
    }
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(city);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      // If not JSON, try comma-separated values
      if (typeof city === 'string') {
        return city.split(',').map(c => c.trim()).filter(c => c.length > 0);
      }
      
      return [city];
    }
  }
};

module.exports = projectModel;
