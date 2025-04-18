/**
 * Database configuration for TaskFlow application
 * Sets up IndexedDB database with stores for tasks and projects
 */

const DB_NAME = 'taskflow_db';
const DB_VERSION = 2; // Incremented for schema changes

// Store names
export const STORES = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
  TAGS: 'tags'
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
        tasksStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
      }
      
      // Create projects store with id as key path
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        const projectsStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        projectsStore.createIndex('name', 'name', { unique: false });
      }

      // Create tags store with id as key path
      if (!db.objectStoreNames.contains(STORES.TAGS)) {
        const tagsStore = db.createObjectStore(STORES.TAGS, { keyPath: 'id' });
        tagsStore.createIndex('name', 'name', { unique: true });
      }

      // If upgrading from v1 to v2, add tags to existing tasks
      if (event.oldVersion === 1 && event.newVersion === 2) {
        const transaction = event.target.transaction;
        
        // Add tags index to tasks if it doesn't exist
        const tasksStore = transaction.objectStore(STORES.TASKS);
        if (!tasksStore.indexNames.contains('tags')) {
          tasksStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }
        
        // Update existing tasks to include empty tags array
        tasksStore.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const task = cursor.value;
            if (!task.tags) {
              task.tags = [];
              cursor.update(task);
            }
            cursor.continue();
          }
        };
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
    tags: ["tag-1", "tag-3"]
  },
  {
    id: "task-2",
    title: "Review analytics dashboard",
    description: "Check performance metrics and prepare report",
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    priority: "medium",
    status: "inProgress",
    projectId: "project-2",
    tags: ["tag-2"]
  },
  {
    id: "task-3",
    title: "Team meeting preparation",
    description: "Prepare agenda and presentation for weekly team meeting",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "low",
    status: "todo",
    projectId: "project-1",
    tags: ["tag-3"]
  },
  {
    id: "task-4",
    title: "Client call follow-up",
    description: "Send meeting notes and action items to client",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (overdue)
    priority: "high",
    status: "completed",
    projectId: "project-3",
    tags: ["tag-4"]
  }
];

export const initialProjects = [
  { id: "project-1", name: "Marketing Campaign", color: "#6366f1" },
  { id: "project-2", name: "Website Redesign", color: "#ec4899" },
  { id: "project-3", name: "Client Onboarding", color: "#06b6d4" }
];

export const initialTags = [
  { id: "tag-1", name: "Urgent", color: "#ef4444" },
  { id: "tag-2", name: "Research", color: "#3b82f6" }, 
  { id: "tag-3", name: "Meeting", color: "#10b981" },
  { id: "tag-4", name: "Client", color: "#f59e0b" }
];