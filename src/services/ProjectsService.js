/**
 * Projects service for Apper database operations
 * Provides methods for CRUD operations on projects
 */

import { getApperClient, TABLES, FIELDS, initialProjects } from './ApperService';

class ProjectsService {
  // Get all projects
  async getAllProjects() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.PROJECT.ID,
          FIELDS.PROJECT.NAME,
          FIELDS.PROJECT.COLOR
        ],
        pagingInfo: { limit: 100, offset: 0 },
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords(TABLES.PROJECTS, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
  // Get a project by ID
  async getProjectById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.PROJECT.ID,
          FIELDS.PROJECT.NAME,
          FIELDS.PROJECT.COLOR
        ],
        filter: `${FIELDS.PROJECT.ID} = '${id}'`,
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLES.PROJECTS, params);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Add a new project
  async addProject(project) {
    try {
      const apperClient = getApperClient();
      const params = {
        record: project
      };
      
      const response = await apperClient.createRecord(TABLES.PROJECTS, params);
      return response.data;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }
  
  // Update a project
  async updateProject(project) {
    try {
      const apperClient = getApperClient();
      const params = {
        record: project
      };
      
      const response = await apperClient.updateRecord(TABLES.PROJECTS, project.id, params);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }
  
  // Delete a project
  async deleteProject(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(TABLES.PROJECTS, id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    try {
      const projects = await this.getAllProjects();
      if (projects.length === 0) {
        // Add initial projects in sequence
        for (const project of initialProjects) {
          await this.addProject(project);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing projects:', error);
      throw error;
    }
  }
}

export default new ProjectsService();