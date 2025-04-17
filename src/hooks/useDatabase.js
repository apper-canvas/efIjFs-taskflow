import { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

/**
 * Custom hook to access the database context
 * @returns {Object} Database context with tasks and projects services
 */
export function useDatabase() {
  const context = useContext(DatabaseContext);
  
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  
  return context;
}