import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarsBackground from '../components/StarsBackground';
import { StarIcon } from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...',
    email: 'loading@example.com',
    bio: 'Loading profile information...',
    creditPoints: 0,
    itemsLent: 0,
    itemsBorrowed: 0,
    rating: 0,
    totalRatings: 0,
    joinDate: new Date().toISOString(),
    location: '',
    phone: '',
    isCurrentUser: true, // Flag to check if this is the current user's profile
    isItemOwner: false, // Flag to check if this user is an item owner
    recentActivity: []
  });

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // In a real app, this would be an API call to get the user's profile
    // For now, we'll use mock data with the actual user data from localStorage
    const userProfile = {
      ...userData,
      name: userData.name || 'Alex Johnson',
      email: userData.email || 'alex.johnson@example.com',
      bio: userData.bio || 'Passionate about sharing and community building',
      creditPoints: userData.creditPoints || 420,
      itemsLent: userData.itemsLent || 12,
      itemsBorrowed: userData.itemsBorrowed || 8,
      rating: 4.7,
      totalRatings: 24,
      joinDate: userData.joinDate || '2023-05-15T10:30:00Z',
      location: userData.location || 'San Francisco, CA',
      phone: userData.phone || '+1 (555) 123-4567',
      isCurrentUser: true, // This would be set based on the current user
      isItemOwner: userData.itemsLent > 0, // User is an owner if they have items lent
      recentActivity: [
        { id: 1, type: 'lend', item: 'Power Drill', to: 'Sarah', credits: 15, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 2, type: 'borrow', item: 'Camera Lens', from: 'Mike', credits: 10, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: 3, type: 'update', field: 'Profile', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    };
    
    setUser(userProfile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-300">Manage your ShareX account</p>
          </div>
          <button 
            onClick={() => navigate('/edit-profile')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                {user.isItemOwner && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                    Item Owner
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${star <= Math.floor(user.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill={star <= user.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-300">
                  {user.rating.toFixed(1)} ({user.totalRatings} reviews)
                </span>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1">
                <p className="text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </p>
                {user.phone && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {user.phone}
                  </p>
                )}
                {user.location && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </p>
                )}
              </div>

              <p className="text-gray-400 text-sm mt-3">
                Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              
              {user.bio && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-300 italic">"{user.bio}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-blue-400">{user.creditPoints}</div>
              <div className="text-sm text-gray-300">Available Credits</div>
              <div className="text-xs text-gray-400 mt-1">≈ ${(user.creditPoints * 0.1).toFixed(2)} USD</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-green-400">{user.itemsLent}</div>
              <div className="text-sm text-gray-300">Items Lent</div>
              <div className="text-xs text-gray-400 mt-1">{user.itemsLent > 0 ? 'Active: 2' : 'No active loans'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-yellow-400">{user.itemsBorrowed}</div>
              <div className="text-sm text-gray-300">Items Borrowed</div>
              <div className="text-xs text-gray-400 mt-1">{user.itemsBorrowed > 0 ? 'Active: 1' : 'No active rentals'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
              <div className="flex justify-center items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(user.rating) ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-300">{user.rating.toFixed(1)}/5.0</div>
              <div className="text-xs text-gray-400 mt-1">from 24 reviews</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {user.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'lend' ? 'bg-green-600' : 
                    activity.type === 'borrow' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {activity.type === 'lend' ? '✓' : activity.type === 'borrow' ? '📷' : '👤'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {activity.type === 'lend' ? `Lent ${activity.item} to ${activity.to}` : 
                       activity.type === 'borrow' ? `Borrowed ${activity.item} from ${activity.from}` : 
                       `${activity.field} updated`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {activity.credits && (
                  <span className={`font-medium ${
                    activity.type === 'lend' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {activity.type === 'lend' ? '+' : '-'}{activity.credits} credits
                  </span>
                )}
                {!activity.credits && (
                  <span className="text-gray-400 font-medium">Updated</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
