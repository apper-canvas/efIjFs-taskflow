/**
 * Tags service for database operations
 * Provides methods for CRUD operations on tags
 */

import { openDatabase, STORES, generateId, initialTags } from './config';
import TasksService from './TasksService';

class TagsService {
  // Get all tags
  async getAllTags() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TAGS, 'readonly');
      const store = transaction.objectStore(STORES.TAGS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Get a tag by ID
  async getTagById(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TAGS, 'readonly');
      const store = transaction.objectStore(STORES.TAGS);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Add a new tag
  async addTag(tag) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TAGS, 'readwrite');
      const store = transaction.objectStore(STORES.TAGS);
      
      // Generate ID if not provided
      if (!tag.id) {
        tag.id = generateId('tag');
      }
      
      const request = store.add(tag);
      
      request.onsuccess = () => resolve(tag);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Update a tag
  async updateTag(tag) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TAGS, 'readwrite');
      const store = transaction.objectStore(STORES.TAGS);
      
      const request = store.put(tag);
      
      request.onsuccess = () => resolve(tag);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Delete a tag and remove it from all tasks
  async deleteTag(id) {
    // First, get all tasks with this tag
    const tasksWithTag = await TasksService.getTasksByTag(id);
    
    // Get database connection
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TAGS, STORES.TASKS], 'readwrite');
      const tagStore = transaction.objectStore(STORES.TAGS);
      const taskStore = transaction.objectStore(STORES.TASKS);
      
      // Remove tag from all tasks that have it
      tasksWithTag.forEach(task => {
        task.tags = task.tags.filter(tagId => tagId !== id);
        taskStore.put(task);
      });
      
      // Delete the tag
      const request = tagStore.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    const tags = await this.getAllTags();
    if (tags.length === 0) {
      // Add initial tags in sequence
      for (const tag of initialTags) {
        await this.addTag(tag);
      }
      return true;
    }
    return false;
  }
  
  // Get tasks by tag name
  async getTasksByTagName(tagName) {
    // First, find the tag by name
    const db = await openDatabase();
    const tag = await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TAGS, 'readonly');
      const store = transaction.objectStore(STORES.TAGS);
      const index = store.index('name');
      const request = index.get(tagName);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
    
    if (!tag) {
      return []; // Tag not found
    }
    
    // Then get all tasks with this tag ID
    return TasksService.getTasksByTag(tag.id);
  }
}

export default new TagsService();