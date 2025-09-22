import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationPanel from './NotificationPanel';
import SettingsPanel from './SettingsPanel';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailUpdates: true,
    language: 'en'
  });
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load notifications and settings from localStorage on component mount
  useEffect(() => {
    loadNotifications();
    loadSettings();
    
    // Set up polling for new notifications
    const notificationInterval = setInterval(loadNotifications, 30000); // Check every 30 seconds
    
    return () => clearInterval(notificationInterval);
  }, []);
  
  const loadNotifications = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      // Filter notifications for current user and sort by most recent
      const userNotifications = storedNotifications
        .filter(n => n.userId === currentUser.id || n.isOwner === undefined)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };
  
  const loadSettings = () => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      if (Object.keys(savedSettings).length > 0) {
        setSettings(prev => ({
          ...prev,
          ...savedSettings
        }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };
  
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };
  
  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    
    // Update in local storage
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAllNotifications = allNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };
  
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    // Update in local storage
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAllNotifications = allNotifications.filter(n => n.id !== id);
    
    localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'Browse', href: '/browse', icon: 'search' },
    { name: 'Transactions', href: '/transactions', icon: 'credit-card' },
    { name: 'Add Item', href: '/add-item', icon: 'plus-circle' },
    { name: 'Profile', href: '/profile', icon: 'user' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    setShowSettings(false);
    
    // Mark all notifications as read when opening the panel
    if (newState && unreadCount > 0) {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Update in local storage
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedAllNotifications = allNotifications.map(n => 
        !n.read ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };
  
  const handleSettingChange = (name, value) => {
    const newSettings = { ...settings, [name]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    // Apply theme changes immediately
    if (name === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      {/* Sidebar */}
      <div className="w-64 bg-black bg-opacity-70 backdrop-blur-sm shadow-lg border-r border-gray-800 flex flex-col h-screen">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">ShareX</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-500'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="mr-3">
                  <IconComponent name={item.icon} />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section for settings, notifications, and logout */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={toggleNotifications}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
          >
            <span className="relative mr-3">
              <IconComponent name="bell" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </span>
            Notifications
          </button>

          <button
            onClick={toggleSettings}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
          >
            <span className="mr-3">
              <IconComponent name="settings" />
            </span>
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
          >
            <span className="mr-3">
              <IconComponent name="log-out" />
            </span>
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-black/70 backdrop-blur-sm border-b border-gray-800">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Welcome to ShareX
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleNotifications}
                className="p-2 text-gray-400 hover:text-white relative"
              >
                <IconComponent name="bell" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={toggleSettings}
                className="p-2 text-gray-400 hover:text-white"
              >
                <IconComponent name="settings" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onDelete={deleteNotification}
        onNotificationClick={(notification) => {
          if (notification.itemId) {
            navigate(`/items/${notification.itemId}`);
            setShowNotifications(false);
          }
        }}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingChange={handleSettingChange}
      />
    </motion.div>
  );
};

// Helper component for icons
const IconComponent = ({ name }) => {
  const icons = {
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    search: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    'plus-circle': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    bell: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'log-out': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    'credit-card': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  };

  return icons[name] || <span>?</span>;
};

export default AppLayout;