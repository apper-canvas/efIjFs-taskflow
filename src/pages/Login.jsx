import { useEffect, useRef, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const authContainerRef = useRef(null);
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // If already authenticated, redirect to home
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  // Initialize login UI when component mounts
  useEffect(() => {
    if (authContainerRef.current) {
      login('#authentication');
    }
  }, [login]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
    >
      <div className="max-w-md w-full p-6 bg-white dark:bg-surface-800 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              TF
            </div>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Welcome to TaskFlow
          </h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Sign in to continue to your tasks
          </p>
        </div>
        
        {/* Authentication container for ApperUI */}
        <div 
          id="authentication" 
          ref={authContainerRef}
          className="min-h-[400px] flex items-center justify-center" 
        />
      </div>
    </motion.div>
  );
}

export default Login;