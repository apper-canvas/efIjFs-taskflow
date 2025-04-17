import { createContext, useEffect, useState } from 'react';
import TasksService from '../db/TasksService';
import ProjectsService from '../db/ProjectsService';

// Create context
export const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize database on first render
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        
        // Initialize tasks and projects if needed
        const tasksInitialized = await TasksService.initializeIfEmpty();
        const projectsInitialized = await ProjectsService.initializeIfEmpty();
        
        setIsInitialized(true);
        console.log('Database initialized', { 
          tasksInitialized, 
          projectsInitialized 
        });
      } catch (err) {
        console.error('Failed to initialize database', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  // Database context value with services
  const value = {
    isInitialized,
    isLoading,
    error,
    tasks: TasksService,
    projects: ProjectsService,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}