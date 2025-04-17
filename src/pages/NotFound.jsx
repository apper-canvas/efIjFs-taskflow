import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
    >
      <div className="w-full max-w-md">
        <div className="mb-8">
          <motion.div 
            className="mx-auto w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="text-4xl">🔍</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="btn-primary"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="font-semibold mb-2">Looking for something?</h2>
          <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
            Try navigating to one of these popular destinations:
          </p>
          <ul className="space-y-2 text-left">
            <li>
              <Link to="/" className="text-primary hover:underline flex items-center">
                <span className="mr-2">•</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/" className="text-primary hover:underline flex items-center">
                <span className="mr-2">•</span> Task Management
              </Link>
            </li>
            <li>
              <Link to="/" className="text-primary hover:underline flex items-center">
                <span className="mr-2">•</span> Projects
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default NotFound;