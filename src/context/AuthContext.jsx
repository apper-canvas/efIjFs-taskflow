import { createContext, useEffect, useState } from 'react';
import { getApperUI, getApperClient } from '../services/ApperService';

// Create context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on first render
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('apperUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Authentication status is handled by Apper SDK
        // No need to manually check token validity
      } catch (err) {
        console.error('Failed to verify authentication', err);
        setError(err);
        // Clear potentially invalid user data
        localStorage.removeItem('apperUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function using ApperUI
  const login = (targetElement) => {
    try {
      const ApperUI = getApperUI();
      const apperClient = getApperClient();
      
      ApperUI.setup(apperClient, {
        target: targetElement,
        clientId: "1fdac86864ea4d7eb21a53de3f15b3a7", // Canvas ID
        hide: [], // Authentication methods to hide (if any)
        view: 'login',
        onSuccess: function(user, account) {
          // Store user details in localStorage
          localStorage.setItem('apperUser', JSON.stringify(user.data));
          setUser(user.data);
        },
        onError: function(error) {
          console.error("Authentication failed:", error);
          setError(error);
        }
      });
      
      ApperUI.showLogin(targetElement);
    } catch (error) {
      console.error('Error setting up login UI:', error);
      setError(error);
    }
  };

  // Signup function using ApperUI
  const signup = (targetElement) => {
    try {
      const ApperUI = getApperUI();
      const apperClient = getApperClient();
      
      ApperUI.setup(apperClient, {
        target: targetElement,
        clientId: "1fdac86864ea4d7eb21a53de3f15b3a7", // Canvas ID
        hide: [], // Authentication methods to hide (if any)
        view: 'signup',
        onSuccess: function(user, account) {
          // Store user details in localStorage
          localStorage.setItem('apperUser', JSON.stringify(user.data));
          setUser(user.data);
        },
        onError: function(error) {
          console.error("Authentication failed:", error);
          setError(error);
        }
      });
      
      ApperUI.showSignup(targetElement);
    } catch (error) {
      console.error('Error setting up signup UI:', error);
      setError(error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear user from state
      setUser(null);
      
      // Remove user data from localStorage
      localStorage.removeItem('apperUser');
      
      // Reload to reset client state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      setError(error);
    }
  };

  // Auth context value
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}