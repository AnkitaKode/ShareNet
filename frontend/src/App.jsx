import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Lazy load components for better performance
// Note: ProtectedRoute is not lazy-loaded to avoid potential hydration issues

const RequestToBorrowPage = lazy(() => import('./pages/RequestToBorrowPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
import ProtectedRoute from './components/ProtectedRoute';
const AppLayout = lazy(() => import('./components/AppLayout'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const AddItemPage = lazy(() => import('./pages/AddItemPage'));
const ItemDetailPage = lazy(() => import('./pages/ItemDetailPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error boundary for routes
const RouteErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('Route error:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-600 mb-4">We're having trouble loading this page. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Wrapper component for public routes
const PublicRoute = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            {children}
          </Suspense>
        </RouteErrorBoundary>
      </div>
    </div>
  );
};

// Wrapper for protected routes with layout
const ProtectedLayout = ({ children }) => {
  return (
    <AppLayout>
      <RouteErrorBoundary>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          {children}
        </Suspense>
      </RouteErrorBoundary>
    </AppLayout>
  );
};

function App() {
  console.log('App component rendering...');

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignUpPage />
              </motion.div>
            </PublicRoute>
          } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/browse" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BrowsePage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfilePage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/items/:id" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ItemDetailPage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/items/:id/request" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RequestToBorrowPage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat/:userId" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ChatPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EditProfilePage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-item" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AddItemPage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/item/:id" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ItemDetailPage />
              </motion.div>
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={
          <PublicRoute>
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div
                className="w-full max-w-2xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  404 - Page Not Found
                </h1>
                <p className="text-xl text-gray-300 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Available Pages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/" className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <span className="text-blue-400">/</span> Home
                    </Link>
                    <Link to="/login" className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <span className="text-blue-400">/login</span> Login
                    </Link>
                    <Link to="/signup" className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <span className="text-blue-400">/signup</span> Sign Up
                    </Link>
                    <Link to="/dashboard" className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <span className="text-blue-400">/dashboard</span> Dashboard
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </PublicRoute>
        } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;