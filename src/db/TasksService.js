/**
 * Tasks service for database operations
 * Provides methods for CRUD operations on tasks
 */

import { openDatabase, STORES, generateId, initialTasks } from './config';

class TasksService {
  // Get all tasks
  async getAllTasks() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readonly');
      const store = transaction.objectStore(STORES.TASKS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Get tasks filtered by status
  async getTasksByStatus(status) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readonly');
      const store = transaction.objectStore(STORES.TASKS);
      const index = store.index('status');
      const request = index.getAll(status);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Get a single task by ID
  async getTaskById(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readonly');
      const store = transaction.objectStore(STORES.TASKS);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Add a new task
  async addTask(task) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readwrite');
      const store = transaction.objectStore(STORES.TASKS);
      
      // Generate ID if not provided
      if (!task.id) {
        task.id = generateId('task');
      }
      
      const request = store.add(task);
      
      request.onsuccess = () => resolve(task);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Update an existing task
  async updateTask(task) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readwrite');
      const store = transaction.objectStore(STORES.TASKS);
      
      const request = store.put(task);
      
      request.onsuccess = () => resolve(task);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Update task status
  async updateTaskStatus(taskId, newStatus) {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    task.status = newStatus;
    return this.updateTask(task);
  }
  
  // Delete a task
  async deleteTask(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.TASKS, 'readwrite');
      const store = transaction.objectStore(STORES.TASKS);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    const tasks = await this.getAllTasks();
    if (tasks.length === 0) {
      // Add initial tasks in sequence
      for (const task of initialTasks) {
        await this.addTask(task);
      }
      return true;
    }
    return false;
  }
}

export default new TasksService();