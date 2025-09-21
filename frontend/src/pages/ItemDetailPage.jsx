import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarsBackground from '../components/StarsBackground';
import { toast } from 'sonner';
import { MessageSquare, Heart, Bell, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchItemDetails = () => {
      try {
        // First check if item was passed in location state
        const locationState = window.history.state?.usr?.state;
        if (locationState?.item) {
          setItem(locationState.item);
          setLoading(false);
          return;
        }

        // If not in state, try to find in localStorage
        const storedItems = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
        const foundItem = storedItems.find(item => item.id.toString() === id);
        
        if (foundItem) {
          setItem({
            id: foundItem.id,
            title: foundItem.name || foundItem.title || 'Untitled Item',
            description: foundItem.description || 'No description available',
            category: foundItem.category || 'Uncategorized',
            condition: foundItem.condition || 'Good',
            price: foundItem.pricePerDay || foundItem.price || 0,
            location: foundItem.location || 'Location not specified',
            imageUrl: foundItem.imageUrl || 'https://via.placeholder.com/800x500/6B7280/FFFFFF?text=No+Image',
            owner: foundItem.owner || 'Unknown',
            ownerId: foundItem.ownerId,
            rating: foundItem.rating || 0,
            available: foundItem.available !== undefined ? foundItem.available : true,
            createdAt: foundItem.createdAt || new Date().toISOString()
          });
        } else {
          setError('Item not found in database');
        }
      } catch (err) {
        console.error('Error loading item:', err);
        setError('Error loading item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
    loadNotifications();
    
    // Set up polling for new notifications
    const notificationInterval = setInterval(loadNotifications, 30000); // Check every 30 seconds
    
    return () => clearInterval(notificationInterval);
  }, [id]);

  const loadNotifications = () => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Filter notifications for current user
      const userNotifications = storedNotifications
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };
  
  const markAsRead = (id) => {
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
  
  const deleteNotification = (id, e) => {
    e.stopPropagation();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    // Update in local storage
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAllNotifications = allNotifications.filter(n => n.id !== id);
    
    localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  // Handle Message Owner
  const handleMessageOwner = () => {
    if (!item) return;
    // Use item.owner as the chat ID and pass the owner's name
    navigate(`/chat/${item.owner || '1'}`, { 
      state: { 
        ownerName: item.owner, // This should be the owner's name
        itemName: item.title,
        itemId: item.id,
        initialMessage: true
      } 
    });
  };

  // Handle Request to Borrow
  const handleRequestToBorrow = async () => {
    if (!item || isRequested) return;
    
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const now = new Date().toISOString();
      
      // Create notification for item owner
      const ownerNotification = {
        id: `notif_${Date.now()}_owner`,
        type: 'BORROW_REQUEST',
        title: 'New Borrow Request',
        message: `${currentUser.name || 'Someone'} has requested to borrow your ${item.title}`,
        itemId: id,
        itemTitle: item.title,
        requesterId: currentUser.id,
        requesterName: currentUser.name || 'User',
        timestamp: now,
        read: false,
        isOwner: true
      };
      
      // Create confirmation for requester
      const requesterNotification = {
        id: `notif_${Date.now()}_requester`,
        type: 'REQUEST_CONFIRMATION',
        title: 'Request Sent',
        message: `You've requested to borrow ${item.title}`,
        itemId: id,
        itemTitle: item.title,
        ownerId: item.ownerId,
        ownerName: item.owner,
        timestamp: now,
        read: false,
        isOwner: false
      };
      
      // Save notifications to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = [
        ...notifications,
        ownerNotification,
        requesterNotification
      ];
      
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Update UI
      setIsRequested(true);
      toast.success('Borrow request sent successfully!');
      
      // Update item to mark as requested
      const items = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
      const updatedItems = items.map(i => 
        i.id.toString() === id 
          ? { ...i, requested: true, requestDate: now, requesterId: currentUser.id }
          : i
      );
      localStorage.setItem('shareNetItems', JSON.stringify(updatedItems));
      
    } catch (error) {
      console.error('Error sending borrow request:', error);
      toast.error('Failed to send borrow request');
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = () => {
    if (!item) return;
    
    const newWishlistStatus = !isInWishlist;
    setIsInWishlist(newWishlistStatus);
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      let updatedWishlist;
      
      if (newWishlistStatus) {
        // Add to wishlist if not already there
        if (!wishlist.includes(id)) {
          updatedWishlist = [...wishlist, id];
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          toast.success('Added to wishlist');
        }
      } else {
        // Remove from wishlist
        updatedWishlist = wishlist.filter(itemId => itemId !== id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        toast.info('Removed from wishlist');
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };

  // Check if item is in wishlist and if current user has already requested it
  useEffect(() => {
    if (!id) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(wishlist.includes(id));
      
      // Check if current user has already requested this item
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const items = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
      const currentItem = items.find(i => i.id.toString() === id);
      
      if (currentItem && currentItem.requesterId === currentUser.id) {
        setIsRequested(true);
      }
    } catch (err) {
      console.error('Error checking item status:', err);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-3">Item Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || 'The item you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.href = '/browse'}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Browse Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex">
      {/* Notification Panel */}
      <div 
        className={`fixed left-0 top-0 bottom-0 w-80 bg-gray-900 border-r border-gray-700 z-20 transform transition-transform duration-300 ease-in-out ${
          isNotificationOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <button 
            onClick={() => setIsNotificationOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-400 text-center mt-8">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  !notification.read ? 'bg-gray-800/50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{notification.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => deleteNotification(notification.id, e)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isNotificationOpen ? 'ml-80' : ''
      }`}>
      <StarsBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="mb-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          ← Back to Browse
        </button>

        {/* Item Detail Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-80 object-cover rounded-lg border border-white/20"
              />
              
              {/* Owner Info */}
              <div className="mt-6 bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Item Owner</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.owner.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.owner}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">{item.description}</p>
              
              {/* Item Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white font-medium">{item.category}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Condition:</span>
                  <span className="text-green-400 font-medium">{item.condition}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Daily Rate:</span>
                  <span className="text-blue-400 font-bold text-xl">₹{item.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Location:</span>
                  <span className="text-white font-medium">{item.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  onClick={handleRequestToBorrow}
                  disabled={isRequested}
                  className={`${
                    isRequested 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  } text-white font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 w-full transition-all duration-300 transform hover:scale-105`}
                >
                  {isRequested ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Requested
                    </>
                  ) : (
                    'Request to Borrow'
                  )}
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleMessageOwner}
                    className="flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Owner
                  </button>
                  <button 
                    onClick={handleAddToWishlist}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium border transition-colors ${
                      isInWishlist 
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 hover:bg-pink-600/20' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 ${isInWishlist ? 'fill-pink-400' : ''}`} 
                    />
                    {isInWishlist ? 'In Wishlist' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
      
      {/* Notification Bell */}
      <button 
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="fixed left-4 top-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-full z-10 hover:bg-gray-800 transition-colors border border-gray-700 shadow-lg"
      >
        <div className="relative">
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
