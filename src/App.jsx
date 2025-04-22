import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const navigateToProfile = () => {
    // Navigate to profile page (to be implemented)
    // navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && (
        <header className="sticky top-0 z-10 glass border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                TF
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center mr-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={navigateToProfile}
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"
                    aria-label="User profile"
                  >
                    <User className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                    <span className="text-sm hidden sm:inline text-surface-800 dark:text-surface-200">
                      {user.FirstName || user.Name || 'User'}
                    </span>
                  </motion.button>
                </div>
              )}
              
              {isAuthenticated && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                </motion.button>
              )}
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5 text-amber-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5 text-surface-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {isAuthenticated && (
        <footer className="py-4 border-t border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 text-center text-sm text-surface-500">
            <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;