import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

// Static imports must come BEFORE lazy imports
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all page components
const RequestToBorrowPage = lazy(() => import('./pages/RequestToBorrowPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AppLayout = lazy(() => import('./components/AppLayout'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const AddItemPage = lazy(() => import('./pages/AddItemPage'));
const ItemDetailPage = lazy(() => import('./pages/ItemDetailPage'));

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Wrapper for public routes (no auth required)
const PublicRoute = ({ children }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<SuspenseFallback />}>
        {children}
      </Suspense>
    </div>
  </div>
);

// Wrapper for protected routes — AppLayout is lazy so needs its own Suspense
const ProtectedLayout = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <AppLayout>
      <Suspense fallback={<SuspenseFallback />}>
        {children}
      </Suspense>
    </AppLayout>
  </Suspense>
);

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={
            <PublicRoute><LandingPage /></PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <PageTransition><SignUpPage /></PageTransition>
            </PublicRoute>
          } />

          {/* ── Protected Routes ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><Dashboard /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/browse" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><BrowsePage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><TransactionsPage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><ProfilePage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><EditProfilePage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/add-item" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><AddItemPage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          {/* Support both /items/:id and /item/:id */}
          <Route path="/items/:id" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><ItemDetailPage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/item/:id" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><ItemDetailPage /></PageTransition>
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/items/:id/request" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PageTransition><RequestToBorrowPage /></PageTransition>
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

          {/* ── 404 ── */}
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
                  <p className="text-xl text-gray-300 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
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