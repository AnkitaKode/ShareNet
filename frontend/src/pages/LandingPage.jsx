import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarsBackground from '../components/StarsBackground';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  useEffect(() => {
    console.log(`Landing page visited: ${location.pathname}${location.search}`);
  }, [location]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarsBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <motion.span 
              className="text-white text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ShareX
            </motion.span>
          </Link>
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/browse" className="text-gray-300 hover:text-white transition-colors font-medium">
                Browse
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 sm:py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            Share More,{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              Waste Less
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          >
            Join your community in sharing resources, reducing waste, and building stronger connections.
            Borrow what you need, lend what you don't use.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/signup" 
                className="relative overflow-hidden inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/browse" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
              >
                Browse Items
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Books & Media</h3>
              <p className="text-gray-300">Share books, movies, and educational materials</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tools & Equipment</h3>
              <p className="text-gray-300">Borrow tools and equipment when you need them</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-2">Games & Gadgets</h3>
              <p className="text-gray-300">Share gaming consoles, gadgets, and electronics</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">How ShareX Works</h2>
            <p className="text-xl text-gray-300 mb-12">Simple steps to start sharing in your community</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[1,2,3].map(step => (
                <div key={step} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">{step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step === 1 ? 'List Your Items' : step === 2 ? 'Connect & Borrow' : 'Safe & Secure'}
                  </h3>
                  <p className="text-gray-300">
                    {step === 1 ? "Upload photos and descriptions of items you're willing to share" :
                     step === 2 ? 'Browse available items and connect with neighbors' :
                     'Build trust and strengthen community relationships'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Sharing?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of community members who are already sharing resources and building connections
            </p>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Join ShareX Today
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;