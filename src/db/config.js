/**
 * Database configuration for TaskFlow application
 * Sets up IndexedDB database with stores for tasks and projects
 */

const DB_NAME = 'taskflow_db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  TASKS: 'tasks',
  PROJECTS: 'projects'
};

// Open database connection
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    // Handle database upgrade (first time or version change)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create tasks store with id as key path
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const tasksStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
        tasksStore.createIndex('status', 'status', { unique: false });
        tasksStore.createIndex('projectId', 'projectId', { unique: false });
        tasksStore.createIndex('dueDate', 'dueDate', { unique: false });
      }
      
      // Create projects store with id as key path
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        const projectsStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        projectsStore.createIndex('name', 'name', { unique: false });
      }
    };
    
    // Success handler
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    // Error handler
    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Generate unique ID (similar to the current app's approach)
export const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Initial data to seed the database if empty
export const initialTasks = [
  {
    id: "task-1",
    title: "Complete project proposal",
    description: "Draft and finalize the Q3 marketing campaign proposal",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: "high",
    status: "todo",
    projectId: "project-1",
  },
  {
    id: "task-2",
    title: "Review analytics dashboard",
    description: "Check performance metrics and prepare report",
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    priority: "medium",
    status: "inProgress",
    projectId: "project-2",
  },
  {
    id: "task-3",
    title: "Team meeting preparation",
    description: "Prepare agenda and presentation for weekly team meeting",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "low",
    status: "todo",
    projectId: "project-1",
  },
  {
    id: "task-4",
    title: "Client call follow-up",
    description: "Send meeting notes and action items to client",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (overdue)
    priority: "high",
    status: "completed",
    projectId: "project-3",
  }
];

export const initialProjects = [
  { id: "project-1", name: "Marketing Campaign", color: "#6366f1" },
  { id: "project-2", name: "Website Redesign", color: "#ec4899" },
  { id: "project-3", name: "Client Onboarding", color: "#06b6d4" }
];