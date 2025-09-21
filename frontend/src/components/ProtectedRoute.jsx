import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate an async auth check
    const checkAuth = async () => {
      try {
        // Check for auth token or create a demo user
        let token = localStorage.getItem('authToken');
        let user = localStorage.getItem('user');
        
        // If no auth token exists, create a demo session
        if (!token) {
          token = 'demo-auth-token';
          localStorage.setItem('authToken', token);
        }
        
        // If no user exists, create a demo user
        if (!user) {
          const demoUser = {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@sharenet.com',
            avatar: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=DU'
          };
          localStorage.setItem('user', JSON.stringify(demoUser));
        }
        
        setIsAuthenticated(!!token);
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