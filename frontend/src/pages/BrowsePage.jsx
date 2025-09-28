import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StarsBackground from '../components/StarsBackground';

const ItemCard = ({ item, navigate }) => {
  // Ensure the item has all required properties
  const itemData = {
    id: item.id || Date.now(),
    name: item.name || 'Untitled Item',
    description: item.description || 'No description available',
    category: item.category || 'Uncategorized',
    condition: item.condition || 'Good',
    pricePerDay: item.pricePerDay || 0,
    location: item.location || 'Location not specified',
    imageUrl: item.imageUrl || 'https://via.placeholder.com/300x200/6B7280/FFFFFF?text=No+Image',
    owner: item.owner || 'Unknown',
    rating: item.rating || 0,
    available: item.available !== undefined ? item.available : true,
    ownerId: item.ownerId || 'unknown',
    createdAt: item.createdAt || new Date().toISOString()
  };

  const handleItemClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Item clicked:', itemData);
    if (navigate) {
      console.log('Navigating to:', `/items/${itemData.id}`);
      // Pass the complete item data to the detail page with proper mapping
      const itemForDetailPage = {
        ...itemData,
        title: itemData.name, // Map name to title for ItemDetailPage compatibility
        price: itemData.pricePerDay // Map pricePerDay to price for ItemDetailPage compatibility
      };
      navigate(`/items/${itemData.id}`, { 
        state: { 
          item: itemForDetailPage 
        } 
      });
      
      // Log a view notification
      const viewNotification = {
        id: `view_${Date.now()}`,
        type: 'ITEM_VIEW',
        title: 'Item Viewed',
        message: `You viewed ${itemData.name}`,
        itemId: itemData.id,
        itemTitle: itemData.name,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      localStorage.setItem('notifications', JSON.stringify([...notifications, viewNotification]));
    } else {
      console.error('Navigate function not available');
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={handleItemClick}
      onKeyDown={(e) => e.key === 'Enter' && handleItemClick(e)}
    >
      {/* Rest of the ItemCard JSX remains the same */}
      <div className="relative mb-4">
        <img 
          src={itemData.imageUrl} 
          alt={itemData.name}
          className="w-full h-48 object-cover rounded-lg border border-white/20"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Image+Error';
          }}
        />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          item.available 
            ? 'bg-green-500/90 text-white' 
            : 'bg-red-500/90 text-white'
        }`}>
          {item.available ? 'Available' : 'Borrowed'}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white truncate">{itemData.name}</h3>
          <p className="text-blue-400 text-sm">{itemData.category}</p>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
          {itemData.description}
        </p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            itemData.condition === 'Excellent' ? 'bg-green-500/20 text-green-400' :
            itemData.condition === 'Good' ? 'bg-blue-500/20 text-blue-400' :
            itemData.condition === 'Fair' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {itemData.condition}
          </span>
          <span className="text-gray-400 text-xs">• {itemData.location}</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-blue-400 font-bold text-xl">₹{(itemData.pricePerDay * 8.5).toFixed(0)}</p>
            <p className="text-gray-400 text-xs">per day</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Owner: {itemData.owner}</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-gray-300 text-sm">{itemData.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickUpload, setShowQuickUpload] = useState(false);
  const [quickUploadData, setQuickUploadData] = useState({
    name: '',
    category: '',
    pricePerDay: '',
    image: null
  });
  const [uploadPreview, setUploadPreview] = useState(null);

  // Load items from localStorage database
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        let storedItems = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
        
        // If no items exist, create some sample data
        if (storedItems.length === 0) {
          const sampleItems = [
            {
              id: 1,
              name: 'Power Drill',
              description: 'Professional grade power drill with various bits included',
              category: 'Tools',
              condition: 'Excellent',
              pricePerDay: 15,
              location: 'Downtown',
              imageUrl: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Power+Drill',
              owner: 'John Smith',
              rating: 4.8,
              available: true,
              ownerId: 'user1',
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              name: 'Camera Lens',
              description: '50mm f/1.8 lens perfect for portraits',
              category: 'Electronics',
              condition: 'Good',
              pricePerDay: 25,
              location: 'Uptown',
              imageUrl: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Camera+Lens',
              owner: 'Sarah Johnson',
              rating: 4.9,
              available: true,
              ownerId: 'user2',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 3,
              name: 'Camping Tent',
              description: '4-person waterproof camping tent',
              category: 'Outdoor',
              condition: 'Good',
              pricePerDay: 20,
              location: 'Suburbs',
              imageUrl: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Camping+Tent',
              owner: 'Mike Wilson',
              rating: 4.5,
              available: true,
              ownerId: 'user3',
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ];
          
          localStorage.setItem('shareNetItems', JSON.stringify(sampleItems));
          storedItems = sampleItems;
        }
        
        const sortedItems = storedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedItems);
        console.log(`Loaded ${sortedItems.length} items from database`);
      } catch (error) {
        console.error('Error loading items from database:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
    
    const handleStorageChange = () => {
      loadItems();
    };
    
    const handleItemAdded = (event) => {
      console.log('New item added:', event.detail);
      loadItems(); // Refresh the items list
      toast.success(`New item "${event.detail.item.name}" is now available for all users!`);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('itemAdded', handleItemAdded);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('itemAdded', handleItemAdded);
    };
  }, []);

  // Get unique categories from actual items
  const getCategories = () => {
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    return ['All', ...uniqueCategories.sort()];
  };

  const categories = getCategories();

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header and search bar */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Browse Items</h1>
          <p className="text-gray-300">Find items to borrow from your community</p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All" className="bg-gray-800 text-white">All Categories</option>
            {categories && categories.length > 0 && categories
              .filter(cat => cat !== 'All')
              .map(category => (
                <option key={category} value={category} className="bg-gray-800 text-white">{category}</option>
              ))
            }
          </select>
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items && items.length > 0 ? (
              items
                .filter(item => 
                  (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .filter(item => 
                  selectedCategory === 'All' || item.category === selectedCategory
                )
                .map((item) => (
                  <ItemCard 
                    key={item.id || Date.now()}
                    item={item}
                    navigate={navigate}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No items found. Be the first to add an item!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
