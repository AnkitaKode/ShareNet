import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for valid authentication
    const checkAuth = async () => {
      try {
        // Clean up any existing demo users/tokens
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        // Remove demo authentication data
        if (token === 'demo-auth-token' || 
            (user && JSON.parse(user).email === 'demo@sharenet.com')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('currentUser'); // Also clean up currentUser if it exists
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Both token and user must exist for authentication
        // No auto-creation of demo users - users must login properly
        const isValidAuth = token && user && token !== 'demo-auth-token';
        
        setIsAuthenticated(isValidAuth);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;