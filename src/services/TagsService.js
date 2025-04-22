/**
 * Tags service for Apper database operations
 * Provides methods for CRUD operations on tags
 */

import { getApperClient, TABLES, FIELDS, initialTags } from './ApperService';
import TasksService from './TasksService';

class TagsService {
  // Get all tags
  async getAllTags() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TAG.ID,
          FIELDS.TAG.NAME,
          FIELDS.TAG.COLOR
        ],
        pagingInfo: { limit: 100, offset: 0 },
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords(TABLES.TAGS, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }
  
  // Get a tag by ID
  async getTagById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TAG.ID,
          FIELDS.TAG.NAME,
          FIELDS.TAG.COLOR
        ],
        filter: `${FIELDS.TAG.ID} = '${id}'`,
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLES.TAGS, params);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching tag with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Add a new tag
  async addTag(tag) {
    try {
      const apperClient = getApperClient();
      const params = {
        record: tag
      };
      
      const response = await apperClient.createRecord(TABLES.TAGS, params);
      return response.data;
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  }
  
  // Update a tag
  async updateTag(tag) {
    try {
      const apperClient = getApperClient();
      const params = {
        record: tag
      };
      
      const response = await apperClient.updateRecord(TABLES.TAGS, tag.id, params);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }
  
  // Delete a tag and remove it from all tasks
  async deleteTag(id) {
    try {
      // First, get all tasks with this tag
      const tasksWithTag = await TasksService.getTasksByTag(id);
      
      // Remove tag from all tasks that have it
      for (const task of tasksWithTag) {
        await TasksService.removeTagFromTask(task.id, id);
      }
      
      // Then delete the tag
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(TABLES.TAGS, id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tag with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    try {
      const tags = await this.getAllTags();
      if (tags.length === 0) {
        // Add initial tags in sequence
        for (const tag of initialTags) {
          await this.addTag(tag);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing tags:', error);
      throw error;
    }
  }
  
  // Get tasks by tag name
  async getTasksByTagName(tagName) {
    try {
      const apperClient = getApperClient();
      
      // First, find the tag by name
      const params = {
        fields: [FIELDS.TAG.ID],
        filter: `${FIELDS.TAG.NAME} = '${tagName}'`,
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLES.TAGS, params);
      
      if (response.data.length === 0) {
        return []; // Tag not found
      }
      
      const tagId = response.data[0].id;
      
      // Then get all tasks with this tag ID
      return TasksService.getTasksByTag(tagId);
    } catch (error) {
      console.error(`Error fetching tasks with tag name ${tagName}:`, error);
      throw error;
    }
  }
}

export default new TagsService();