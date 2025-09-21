import React, { useState, useEffect } from 'react';

const SettingsPanel = ({ 
  isOpen, 
  onClose, 
  settings = {
    notifications: true,
    darkMode: true,
    emailUpdates: true,
    language: 'en',
  },
  onSettingChange
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  
  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setLocalSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Notify parent component of the change
    if (onSettingChange) {
      onSettingChange(name, newValue);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Settings are already saved via onSettingChange
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-96 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Settings</h3>
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
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">NOTIFICATION PREFERENCES</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">Push Notifications</p>
                  <p className="text-xs text-gray-400">Receive push notifications for updates</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="notifications"
                    checked={localSettings.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${localSettings.notifications ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">Email Notifications</p>
                  <p className="text-xs text-gray-400">Get notified via email</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailUpdates"
                    checked={localSettings.emailUpdates}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${localSettings.emailUpdates ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">APPEARANCE</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">Dark Mode</p>
                  <p className="text-xs text-gray-400">Switch between light and dark theme</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="darkMode"
                    checked={localSettings.darkMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${localSettings.darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">LANGUAGE</label>
            <select
              id="language"
              name="language"
              value={localSettings.language}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="en" className="bg-gray-800 text-white">English</option>
              <option value="es" className="bg-gray-800 text-white">Español</option>
              <option value="fr" className="bg-gray-800 text-white">Français</option>
              <option value="de" className="bg-gray-800 text-white">Deutsch</option>
              <option value="zh" className="bg-gray-800 text-white">中文</option>
              <option value="ja" className="bg-gray-800 text-white">日本語</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-800 mt-8">
            <div className="flex justify-between space-x-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors flex-1"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex-1"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
