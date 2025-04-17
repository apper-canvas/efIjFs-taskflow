import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 text-center"
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-surface-200 dark:text-surface-800">404</h1>
        <h2 className="mt-8 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-4 text-surface-600 dark:text-surface-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex gap-2">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;