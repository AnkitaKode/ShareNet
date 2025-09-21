import React, { useState, useEffect } from 'react';

const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  notifications = [], 
  onMarkAsRead, 
  onDelete,
  onNotificationClick 
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };
  
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };
  
  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-96 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Mark all as read
                  notifications.forEach(notif => {
                    if (!notif.read && onMarkAsRead) {
                      onMarkAsRead(notif.id);
                    }
                  });
                }}
                className="text-xs text-blue-400 hover:text-blue-300"
                disabled={!notifications.some(n => !n.read)}
              >
                Mark all as read
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-400">No notifications yet</p>
              <p className="text-xs text-gray-500 mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`relative p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-500/5' : 'bg-transparent'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        !notification.read ? 'bg-blue-500' : 'bg-transparent'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{notification.title || 'Notification'}</p>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.itemTitle && (
                          <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-300">
                            {notification.itemTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-800 text-center">
            <button 
              onClick={() => {
                // Clear all notifications
                if (window.confirm('Are you sure you want to clear all notifications?')) {
                  notifications.forEach(notif => {
                    if (onDelete) onDelete(notif.id);
                  });
                }
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
