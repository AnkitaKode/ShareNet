import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Bell, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Check
} from 'lucide-react';
import PropTypes from 'prop-types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/api/notifications`;

// Notification types for better type safety
const NOTIFICATION_TYPES = {
  NEW_REQUEST: 'NEW_REQUEST',
  REQUEST_APPROVED: 'REQUEST_APPROVED',
  REQUEST_DECLINED: 'REQUEST_DECLINED',
};

// Helper to determine the icon based on notification type
const getNotificationIcon = (type) => {
  const iconProps = { className: 'w-5 h-5' };
  
  switch (type) {
    case NOTIFICATION_TYPES.NEW_REQUEST:
      return <MessageSquare {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    case NOTIFICATION_TYPES.REQUEST_APPROVED:
      return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
    case NOTIFICATION_TYPES.REQUEST_DECLINED:
      return <XCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
    default:
      return <Bell {...iconProps} className={`${iconProps.className} text-gray-500`} />;
  }
};

// Notification Item Component
const NotificationItem = ({ notification, onClick }) => {
  const { id, type, message, createdAt, isRead } = notification;
  
  return (
    <div 
      className={`notification-item ${!isRead ? 'bg-blue-50' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Notification: ${message}`}
    >
      <div className="icon-container" aria-hidden="true">
        {getNotificationIcon(type)}
      </div>
      <div className="content-container">
        <p className="message">{message}</p>
        <p className="timestamp" aria-label={`Received on ${new Date(createdAt).toLocaleString()}`}>
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      {!isRead && (
        <span className="unread-indicator" aria-label="Unread notification" />
      )}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    link: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// --- Main Notifications Page Component ---
function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(NOTIFICATIONS_ENDPOINT, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header in a real app
          // 'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications. Please try again later.');
      }
      
      const data = await response.json();
      setNotifications(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      toast.error(err.message);
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const refreshNotifications = () => {
    setRefreshing(true);
    fetchNotifications();
  };
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (notificationIds) => {
    try {
      await Promise.all(
        Array.from(notificationIds).map(id =>
          fetch(`${NOTIFICATIONS_ENDPOINT}/${id}/read`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${getToken()}`,
            },
          })
        )
      );
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          notificationIds.has(n.id) ? { ...n, isRead: true } : n
        )
      );
      
      // Clear selection
      setSelectedNotifications(new Set());
      
      return true;
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      toast.error('Failed to update notifications. Please try again.');
      return false;
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await markAsRead(new Set([notification.id]));
    }
    
    // Navigate if there's a link
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  const handleSelectNotification = (notificationId, event) => {
    event.stopPropagation();
    setSelectedNotifications(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(notificationId)) {
        newSelection.delete(notificationId);
      } else {
        newSelection.add(notificationId);
      }
      return newSelection;
    });
  };
  
  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.size > 0) {
      await markAsRead(selectedNotifications);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            {selectedNotifications.size > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkSelectedAsRead}
                disabled={refreshing}
                className="text-sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark as read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshNotifications}
              disabled={refreshing}
              aria-label="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-500">
              <p>Failed to load notifications.</p>
              <Button 
                variant="ghost" 
                onClick={refreshNotifications}
                disabled={refreshing}
                className="mt-2"
              >
                {refreshing ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
              <p className="mt-1 text-gray-500">We'll notify you when there's something new.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={refreshNotifications}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Check for updates'}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map(notification => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotifications.has(notification.id)}
                  onSelect={handleSelectNotification}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
          
          {refreshing && !loading && (
            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50">
              <RefreshCw className="inline-block w-4 h-4 animate-spin mr-2" />
              Updating notifications...
            </div>
          )}
        </Card>
        
        <style jsx>{`
          .notification-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 1.25rem;
            transition: background-color 0.15s ease;
            position: relative;
            cursor: pointer;
          }
          
          .notification-item:hover {
            background-color: rgba(249, 250, 251, 0.7);
          }
          
          .notification-item:active {
            background-color: rgba(243, 244, 246, 0.7);
          }
          
          .notification-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: transparent;
            transition: background-color 0.2s ease;
          }
          
          .notification-item:not(.read)::before {
            background-color: #3b82f6;
          }
          
          .notification-item:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
            z-index: 10;
          }
          
          .content-container {
            flex: 1;
            min-width: 0;
          }
          
          .message {
            color: #111827;
            font-size: 0.9375rem;
            line-height: 1.4;
            margin-bottom: 0.25rem;
            word-break: break-word;
          }
          
          .timestamp {
            font-size: 0.75rem;
            color: #6b7280;
          }
          
          .unread-indicator {
            width: 8px;
            height: 8px;
            background-color: #3b82f6;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 0.5rem;
          }
          
          @media (max-width: 640px) {
            .notification-item {
              padding: 0.875rem 1rem;
            }
            
            .message {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
