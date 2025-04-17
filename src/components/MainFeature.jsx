import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";

function MainFeature({ tasks, projects, getProjectById, onTaskStatusChange, onAddTask, viewMode }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "todo",
    projectId: projects[0]?.id || "",
  });
  const [activeTaskId, setActiveTaskId] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      status: "todo",
      projectId: projects[0]?.id || "",
    });
    setIsAddingTask(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setIsAddingTask(false);
    }
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={16} className="text-red-500" />;
      case "medium":
        return <Clock size={16} className="text-amber-500" />;
      case "low":
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <Clock size={16} className="text-amber-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "inProgress":
        return <Clock size={16} className="text-amber-500" />;
      case "todo":
        return <Clock size={16} className="text-surface-400" />;
      default:
        return <Clock size={16} className="text-surface-400" />;
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    onTaskStatusChange(taskId, newStatus);
    setActiveTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Task Button */}
      {!isAddingTask && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingTask(true)}
          className="w-full btn-outline border-dashed flex items-center justify-center gap-2 py-3"
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </motion.button>
      )}

      {/* Add Task Form */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClickOutside}
          >
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="card w-full max-w-md p-6 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="What needs to be done?"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleChange}
                    rows="3"
                    className="input"
                    placeholder="Add details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleChange}
                        className="input pl-10"
                      />
                      <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleChange}
                        className="input appearance-none pr-10"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium mb-1">
                    Project
                  </label>
                  <div className="relative">
                    <select
                      id="projectId"
                      name="projectId"
                      value={newTask.projectId}
                      onChange={handleChange}
                      className="input appearance-none pr-10"
                    >
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newTask.title.trim()}
                >
                  Create Task
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      {viewMode === "list" && (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-surface-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-surface-500 mb-4">
                  {filter === "all" 
                    ? "You don't have any tasks yet. Create your first task to get started!"
                    : `You don't have any ${filter} tasks. Change the filter or add a new task.`}
                </p>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="btn-primary mx-auto"
                >
                  <Plus size={18} className="mr-1" />
                  Add Your First Task
                </button>
              </motion.div>
            ) : (
              tasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`task-item task-priority-${task.priority} ${
                    task.status === "completed" ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => handleStatusChange(
                        task.id, 
                        task.status === "completed" ? "todo" : "completed"
                      )}
                      className={`w-5 h-5 rounded-full border ${
                        task.status === "completed"
                          ? "bg-green-500 border-green-500 flex items-center justify-center"
                          : "border-surface-300 dark:border-surface-600 hover:border-green-500 dark:hover:border-green-500"
                      }`}
                    >
                      {task.status === "completed" && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium ${
                        task.status === "completed" ? "line-through text-surface-500" : ""
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                          className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                        >
                          <MoreVertical size={16} className="text-surface-500" />
                        </button>
                        
                        <AnimatePresence>
                          {activeTaskId === task.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-8 z-10 w-48 card p-1 shadow-soft"
                            >
                              <button
                                onClick={() => handleStatusChange(task.id, "todo")}
                                className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                              >
                                <Clock size={16} />
                                <span>Mark as To Do</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, "inProgress")}
                                className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                              >
                                <Clock size={16} className="text-amber-500" />
                                <span>Mark as In Progress</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, "completed")}
                                className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                              >
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span>Mark as Completed</span>
                              </button>
                              <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                              <button className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                                <Edit size={16} />
                                <span>Edit Task</span>
                              </button>
                              <button className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-red-500">
                                <Trash2 size={16} />
                                <span>Delete Task</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: getProjectById(task.projectId).color + '20',
                          color: getProjectById(task.projectId).color
                        }}
                      >
                        {getProjectById(task.projectId).name}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs">
                        {getStatusIcon(task.status)}
                        <span className="text-surface-600 dark:text-surface-400">
                          {task.status === "todo" ? "To Do" : 
                           task.status === "inProgress" ? "In Progress" : 
                           "Completed"}
                        </span>
                      </div>
                      
                      <div className={`flex items-center gap-1 text-xs ${
                        isPast(new Date(task.dueDate)) && task.status !== "completed"
                          ? "text-red-500"
                          : "text-surface-600 dark:text-surface-400"
                      }`}>
                        <CalendarIcon size={14} />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`card overflow-visible task-priority-${task.priority} ${
                task.status === "completed" ? "opacity-70" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-medium ${
                    task.status === "completed" ? "line-through text-surface-500" : ""
                  }`}>
                    {task.title}
                  </h3>
                  
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                      className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <MoreVertical size={16} className="text-surface-500" />
                    </button>
                    
                    <AnimatePresence>
                      {activeTaskId === task.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 z-10 w-48 card p-1 shadow-soft"
                        >
                          <button
                            onClick={() => handleStatusChange(task.id, "todo")}
                            className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                          >
                            <Clock size={16} />
                            <span>Mark as To Do</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(task.id, "inProgress")}
                            className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                          >
                            <Clock size={16} className="text-amber-500" />
                            <span>Mark as In Progress</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(task.id, "completed")}
                            className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                          >
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Mark as Completed</span>
                          </button>
                          <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                          <button className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                            <Edit size={16} />
                            <span>Edit Task</span>
                          </button>
                          <button className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-red-500">
                            <Trash2 size={16} />
                            <span>Delete Task</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: getProjectById(task.projectId).color + '20',
                      color: getProjectById(task.projectId).color
                    }}
                  >
                    {getProjectById(task.projectId).name}
                  </div>
                  
                  <div className={`flex items-center gap-1 text-xs ${
                    isPast(new Date(task.dueDate)) && task.status !== "completed"
                      ? "text-red-500"
                      : "text-surface-600 dark:text-surface-400"
                  }`}>
                    <CalendarIcon size={14} />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 p-3 flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs">
                  {getStatusIcon(task.status)}
                  <span className="text-surface-600 dark:text-surface-400">
                    {task.status === "todo" ? "To Do" : 
                     task.status === "inProgress" ? "In Progress" : 
                     "Completed"}
                  </span>
                </div>
                
                <button
                  onClick={() => handleStatusChange(
                    task.id, 
                    task.status === "completed" ? "todo" : "completed"
                  )}
                  className={`w-5 h-5 rounded-full border ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500 flex items-center justify-center"
                      : "border-surface-300 dark:border-surface-600 hover:border-green-500 dark:hover:border-green-500"
                  }`}
                >
                  {task.status === "completed" && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
          
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card p-8 text-center col-span-full"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                <CheckCircle2 size={24} className="text-surface-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-surface-500 mb-4">
                You don't have any tasks yet. Create your first task to get started!
              </p>
              <button
                onClick={() => setIsAddingTask(true)}
                className="btn-primary mx-auto"
              >
                <Plus size={18} className="mr-1" />
                Add Your First Task
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="card p-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Calendar View</h2>
            <p className="text-surface-500">Coming soon in the next update!</p>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center p-2 font-medium text-surface-500">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-square border border-surface-200 dark:border-surface-700 rounded-lg p-1 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <div className="text-xs text-surface-500">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainFeature;