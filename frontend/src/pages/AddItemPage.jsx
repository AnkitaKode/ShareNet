import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarsBackground from '../components/StarsBackground';

const AddItemPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    category: '',
    condition: 'Good',
    pricePerDay: '',
    location: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    'Books & Media', 'Tools & Equipment', 'Electronics', 'Sports & Recreation',
    'Home & Garden', 'Photography', 'Musical Instruments', 'Clothing & Accessories'
  ];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  // Redirect after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/browse'), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: name === 'pricePerDay' ? parseInt(value) || '' : value
    }));
  };

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (!file.type.startsWith('image/')) return 'Please select a valid image file (PNG, JPG, etc.)';
    if (file.size > 5 * 1024 * 1024) return 'Image size must be less than 5MB';
    return null;
  };

  const processFile = (file) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setItemData(prev => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleUploadClick();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!itemData.name.trim()) return setError('Item name is required');
    if (!itemData.description.trim()) return setError('Description is required');
    if (!itemData.location.trim()) return setError('Location is required');
    if (!itemData.image) return setError('Please upload an image of your item');

    setUploading(true);

    try {
      // Simulate backend by storing in localStorage
      const existingItems = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
      const newItem = {
        id: Date.now(),
        ...itemData,
        pricePerDay: parseInt(itemData.pricePerDay) || 0,
        imageUrl: imagePreview,
        available: true,
        owner: 'Current User',
        rating: 5.0,
        createdAt: new Date().toISOString()
      };

      existingItems.push(newItem);
      localStorage.setItem('shareNetItems', JSON.stringify(existingItems));

      setSuccess(true);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <StarsBackground />
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Item Added Successfully!</h2>
          <p className="text-gray-300">Redirecting to browse page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Add New Item</h1>
          <p className="text-gray-300">Share something with your community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Item Name *</label>
              <input
                type="text"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                placeholder="e.g., Professional Camera Lens"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                value={itemData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your item..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Condition *</label>
                <select
                  name="condition"
                  value={itemData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Daily Rate (Credits) *</label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={itemData.pricePerDay}
                  onChange={handleChange}
                  min="1"
                  placeholder="25"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={itemData.location}
                  onChange={handleChange}
                  placeholder="e.g., Downtown, North Campus"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Photo *</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
              >
                {!imagePreview ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDragging ? 'text-blue-400' : 'text-gray-400'}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className={`text-lg mb-1 ${isDragging ? 'text-blue-300' : 'text-gray-300'}`}>
                      {isDragging ? 'Drop the image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-400">PNG, JPG (max 5MB)</p>
                  </motion.div>
                ) : (
                  <motion.div className="relative" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="relative group">
                      <img src={imagePreview} alt="Preview" className="w-full max-w-xs mx-auto h-48 object-cover rounded-lg border border-white/20 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/10 transition-all duration-300" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImagePreview(null); setItemData(prev => ({ ...prev, image: null })); }}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all transform hover:scale-110"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Click to change image</p>
                  </motion.div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
              </div>
            </div>

            {/* Error */}
            {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4"><p className="text-red-300">{error}</p></div>}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={uploading}
                whileHover={!uploading ? { scale: 1.02 } : {}}
                whileTap={!uploading ? { scale: 0.98 } : {}}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : 'Add Item'}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Tips for Success</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Use clear, high-quality photos</li>
            <li>• Write detailed descriptions</li>
            <li>• Set fair pricing based on item value</li>
            <li>• Be honest about condition</li>
            <li>• Respond quickly to requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
