import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { DatabaseContext } from '../context/DatabaseContext';

function Home() {
  const { tasks, projects, tags, isLoading } = useContext(DatabaseContext);
  const [tasksList, setTasksList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoading(true);
        
        // Fetch tasks, projects, and tags
        const tasksData = await tasks.getAllTasks();
        const projectsData = await projects.getAllProjects();
        const tagsData = await tags.getAllTags();
        
        setTasksList(tasksData);
        setProjectsList(projectsData);
        setTagsList(tagsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (!isLoading) {
      loadData();
    }
  }, [tasks, projects, tags, isLoading]);

  // Find project name by ID
  const getProjectName = (projectId) => {
    const project = projectsList.find(p => p.id === projectId);
    return project ? project.Name : 'No Project';
  };
  
  // Find tag names by IDs
  const getTaskTags = (taskTagIds) => {
    if (!taskTagIds || !taskTagIds.length) return [];
    
    return taskTagIds
      .map(tagId => {
        const tag = tagsList.find(t => t.id === tagId);
        return tag ? { id: tag.id, name: tag.Name, color: tag.color } : null;
      })
      .filter(Boolean);
  };

  // Show loading state
  if (isLoading || isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-surface-900 dark:text-white">Your Tasks</h2>
      
      {tasksList.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow p-6 text-center">
          <p className="text-surface-600 dark:text-surface-400">No tasks found. Create your first task to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasksList.map(task => (
            <motion.div
              key={task.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-lg shadow overflow-hidden"
            >
              <div className={`h-2 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-surface-900 dark:text-white">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    task.status === 'inProgress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                  }`}>
                    {task.status === 'inProgress' ? 'In Progress' : 
                     task.status === 'completed' ? 'Completed' : 'To Do'}
                  </span>
                </div>
                
                <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
                  {task.description || 'No description provided'}
                </p>
                
                <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-3">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: projectsList.find(p => p.id === task.projectId)?.color || '#6366f1' }}></span>
                  {getProjectName(task.projectId)}
                </div>
                
                {/* Task tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getTaskTags(task.tags).map(tag => (
                      <span 
                        key={tag.id}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${tag.color}20`, // Add transparency
                          color: tag.color,
                          border: `1px solid ${tag.color}`
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Home;