/**
 * Projects service for database operations
 * Provides methods for CRUD operations on projects
 */

import { openDatabase, STORES, generateId, initialProjects } from './config';

class ProjectsService {
  // Get all projects
  async getAllProjects() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readonly');
      const store = transaction.objectStore(STORES.PROJECTS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Get a project by ID
  async getProjectById(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readonly');
      const store = transaction.objectStore(STORES.PROJECTS);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Add a new project
  async addProject(project) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readwrite');
      const store = transaction.objectStore(STORES.PROJECTS);
      
      // Generate ID if not provided
      if (!project.id) {
        project.id = generateId('project');
      }
      
      const request = store.add(project);
      
      request.onsuccess = () => resolve(project);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Update a project
  async updateProject(project) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readwrite');
      const store = transaction.objectStore(STORES.PROJECTS);
      
      const request = store.put(project);
      
      request.onsuccess = () => resolve(project);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Delete a project
  async deleteProject(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readwrite');
      const store = transaction.objectStore(STORES.PROJECTS);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  }
  
  // Initialize with data if empty
  async initializeIfEmpty() {
    const projects = await this.getAllProjects();
    if (projects.length === 0) {
      // Add initial projects in sequence
      for (const project of initialProjects) {
        await this.addProject(project);
      }
      return true;
    }
    return false;
  }
}

export default new ProjectsService();