import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Plus, 
  Calendar, 
  LayoutGrid, 
  List
} from "lucide-react";
import MainFeature from "../components/MainFeature";

// Sample initial data
const initialTasks = [
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

const initialProjects = [
  { id: "project-1", name: "Marketing Campaign", color: "#6366f1" },
  { id: "project-2", name: "Website Redesign", color: "#ec4899" },
  { id: "project-3", name: "Client Onboarding", color: "#06b6d4" }
];

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [projects] = useState(initialProjects);
  const [viewMode, setViewMode] = useState("list"); // list, grid, calendar
  const [filter, setFilter] = useState("all"); // all, todo, inProgress, completed
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "todo") return task.status === "todo";
    if (filter === "inProgress") return task.status === "inProgress";
    if (filter === "completed") return task.status === "completed";
    return true;
  });
  
  const getProjectById = (id) => {
    return projects.find(project => project.id === id) || { name: "No Project", color: "#94a3b8" };
  };
  
  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  
  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, {
      id: `task-${Date.now()}`,
      ...newTask,
    }]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setFilter("all")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  filter === "all" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <ListTodo size={18} />
                <span>All Tasks</span>
              </button>
              <button 
                onClick={() => setFilter("todo")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  filter === "todo" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <Clock size={18} />
                <span>To Do</span>
              </button>
              <button 
                onClick={() => setFilter("inProgress")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  filter === "inProgress" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock size={18} />
                </motion.div>
                <span>In Progress</span>
              </button>
              <button 
                onClick={() => setFilter("completed")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  filter === "completed" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <CheckCircle2 size={18} />
                <span>Completed</span>
              </button>
            </nav>
          </div>
          
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3">Projects</h2>
            <div className="space-y-1">
              {projects.map(project => (
                <div 
                  key={project.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
              ))}
              <button className="flex items-center gap-2 p-2 text-surface-500 hover:text-primary transition-colors w-full">
                <Plus size={16} />
                <span>Add Project</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            
            <div className="flex items-center gap-2">
              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-1 flex">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md ${
                    viewMode === "list" 
                      ? "bg-white dark:bg-surface-700 shadow-sm" 
                      : "text-surface-500"
                  }`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-surface-700 shadow-sm" 
                      : "text-surface-500"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("calendar")}
                  className={`p-1.5 rounded-md ${
                    viewMode === "calendar" 
                      ? "bg-white dark:bg-surface-700 shadow-sm" 
                      : "text-surface-500"
                  }`}
                  aria-label="Calendar view"
                >
                  <Calendar size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <MainFeature 
            tasks={filteredTasks} 
            projects={projects}
            getProjectById={getProjectById}
            onTaskStatusChange={handleTaskStatusChange}
            onAddTask={handleAddTask}
            viewMode={viewMode}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Home;