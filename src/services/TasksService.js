/**
 * Tasks service for Apper database operations
 * Provides methods for CRUD operations on tasks
 */

import { getApperClient, TABLES, FIELDS, initialTasks } from './ApperService';

class TasksService {
  // Get all tasks
  async getAllTasks() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TASK.ID,
          FIELDS.TASK.TITLE,
          FIELDS.TASK.DESCRIPTION,
          FIELDS.TASK.DUE_DATE,
          FIELDS.TASK.PRIORITY,
          FIELDS.TASK.STATUS,
          FIELDS.TASK.TAGS,
          FIELDS.TASK.PROJECT_ID
        ],
        pagingInfo: { limit: 100, offset: 0 }, // Adjust limit as needed
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords(TABLES.TASKS, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
  
  // Get tasks filtered by status
  async getTasksByStatus(status) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TASK.ID,
          FIELDS.TASK.TITLE,
          FIELDS.TASK.DESCRIPTION,
          FIELDS.TASK.DUE_DATE,
          FIELDS.TASK.PRIORITY,
          FIELDS.TASK.STATUS,
          FIELDS.TASK.TAGS,
          FIELDS.TASK.PROJECT_ID
        ],
        filter: `${FIELDS.TASK.STATUS} = '${status}'`,
        pagingInfo: { limit: 100, offset: 0 },
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords(TABLES.TASKS, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks with status ${status}:`, error);
      throw error;
    }
  }
  
  // Get a single task by ID
  async getTaskById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TASK.ID,
          FIELDS.TASK.TITLE,
          FIELDS.TASK.DESCRIPTION,
          FIELDS.TASK.DUE_DATE,
          FIELDS.TASK.PRIORITY,
          FIELDS.TASK.STATUS,
          FIELDS.TASK.TAGS,
          FIELDS.TASK.PROJECT_ID
        ],
        filter: `${FIELDS.TASK.ID} = '${id}'`,
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLES.TASKS, params);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Add a new task
  async addTask(task) {
    try {
      const apperClient = getApperClient();
      
      // Ensure task has tags array
      if (!task.tags) {
        task.tags = [];
      }
      
      const params = {
        record: task
      };
      
      const response = await apperClient.createRecord(TABLES.TASKS, params);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }
  
  // Update an existing task
  async updateTask(task) {
    try {
      const apperClient = getApperClient();
      
      // Ensure task has tags array
      if (!task.tags) {
        task.tags = [];
      }
      
      const params = {
        record: task
      };
      
      const response = await apperClient.updateRecord(TABLES.TASKS, task.id, params);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
  
  // Update task status
  async updateTaskStatus(taskId, newStatus) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      task.status = newStatus;
      return this.updateTask(task);
    } catch (error) {
      console.error(`Error updating status for task ${taskId}:`, error);
      throw error;
    }
  }
  
  // Delete a task
  async deleteTask(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(TABLES.TASKS, id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Get tasks by tag ID
  async getTasksByTag(tagId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          FIELDS.TASK.ID,
          FIELDS.TASK.TITLE,
          FIELDS.TASK.DESCRIPTION,
          FIELDS.TASK.DUE_DATE,
          FIELDS.TASK.PRIORITY,
          FIELDS.TASK.STATUS,
          FIELDS.TASK.TAGS,
          FIELDS.TASK.PROJECT_ID
        ],
        filter: `${FIELDS.TASK.TAGS} CONTAINS '${tagId}'`,
        pagingInfo: { limit: 100, offset: 0 },
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords(TABLES.TASKS, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks with tag ${tagId}:`, error);
      throw error;
    }
  }
  
  // Add tag to task
  async addTagToTask(taskId, tagId) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      if (!task.tags) {
        task.tags = [];
      }
      
      if (!task.tags.includes(tagId)) {
        task.tags.push(tagId);
        return this.updateTask(task);
      }
      
      return task; // Tag already exists, no change needed
    } catch (error) {
      console.error(`Error adding tag ${tagId} to task ${taskId}:`, error);
      throw error;
    }
  }
  
  // Remove tag from task
  async removeTagFromTask(taskId, tagId) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      if (!task.tags) {
        return task; // No tags to remove
      }
      
      const tagIndex = task.tags.indexOf(tagId);
      if (tagIndex !== -1) {
        task.tags.splice(tagIndex, 1);
        return this.updateTask(task);
      }
      
      return task; // Tag not found on task, no change needed
    } catch (error) {
      console.error(`Error removing tag ${tagId} from task ${taskId}:`, error);
      throw error;
    }
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    try {
      const tasks = await this.getAllTasks();
      if (tasks.length === 0) {
        // Add initial tasks in sequence
        for (const task of initialTasks) {
          await this.addTask(task);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing tasks:', error);
      throw error;
    }
  }
}

export default new TasksService();