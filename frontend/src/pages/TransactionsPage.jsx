import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StarsBackground from '../components/StarsBackground';

// A helper function to determine the badge color based on status
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'DECLINED': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'RETURNED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// --- Reusable Transaction Card Component ---
const TransactionCard = ({ transaction, isOwner, onUpdate }) => {
  const { item, borrower, owner, status } = transaction;
  const otherUser = isOwner ? borrower : owner;

  return (
    <div className="transaction-card">
      <img src={item.imageUrl} alt={item.name} className="item-image" />
      <div className="card-details">
        <div className="card-header">
          <span className="item-name">{item.name}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(status)}`}>
            {status}
          </span>
        </div>
        <p className="user-info">
          {isOwner ? `Requested by: ${otherUser.name}` : `Owner: ${otherUser.name}`}
        </p>
      </div>
      {isOwner && status === 'PENDING' && (
        <div className="card-actions">
          <button 
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            onClick={() => onUpdate(transaction.id, 'APPROVED')}
          >
            Approve
          </button>
          <button 
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            onClick={() => onUpdate(transaction.id, 'DECLINED')}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

// --- Credit Purchase Component ---
const CreditPurchase = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(10); // Mock current credits

  const creditPackages = [
    { id: 1, credits: 50, price: 425, popular: false },
    { id: 2, credits: 100, price: 850, popular: true },
    { id: 3, credits: 250, price: 2125, popular: false },
    { id: 4, credits: 500, price: 4250, popular: false },
  ];

  const handlePurchase = async (pkg) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update credits locally (in real app, this would come from API)
      setCurrentCredits(prev => prev + pkg.credits);
      
      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.creditPoints = currentCredits + pkg.credits;
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(`Successfully purchased ${pkg.credits} credits for ₹${pkg.price}!`);
      setSelectedPackage(null);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Purchase Credit Points</h2>
        <p className="text-gray-300">Current Balance: <span className="text-blue-400 font-semibold">{currentCredits} credits</span></p>
        <p className="text-sm text-gray-400 mt-1">≈ ₹{(currentCredits * 8.5).toFixed(2)} INR value</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {creditPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:bg-white/15 cursor-pointer ${
              pkg.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/20'
            } ${selectedPackage?.id === pkg.id ? 'ring-2 ring-green-500/50 border-green-500' : ''}`}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{pkg.credits}</div>
              <div className="text-sm text-gray-300 mb-4">Credits</div>
              <div className="text-2xl font-bold text-white mb-1">₹{pkg.price}</div>
              <div className="text-xs text-gray-400 mb-4">₹{(pkg.price / pkg.credits).toFixed(2)} per credit</div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(pkg);
                }}
                disabled={isProcessing}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedPackage?.id === pkg.id ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isProcessing && selectedPackage?.id === pkg.id ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">How Credits Work</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use credits to borrow items from other users</li>
          <li>• Earn credits by lending your items to others</li>
          <li>• 1 credit ≈ ₹8.50 INR value</li>
          <li>• Credits never expire and are fully refundable</li>
        </ul>
      </div>
    </div>
  );
};

// --- Main Transactions Page Component ---
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('borrowed');

  // This should be replaced with the actual logged-in user's ID
  const currentUserId = 1; 

  useEffect(() => {
    const loadTransactions = () => {
      try {
        // Load transactions from localStorage or use mock data
        const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        // If no stored transactions, create some mock data
        if (storedTransactions.length === 0) {
          const mockTransactions = [
            {
              id: 1,
              item: {
                id: 1,
                name: 'DSLR Camera',
                imageUrl: 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=Camera'
              },
              borrower: { id: 1, name: 'You' },
              owner: { id: 2, name: 'John Smith' },
              status: 'APPROVED'
            },
            {
              id: 2,
              item: {
                id: 2,
                name: 'Power Drill',
                imageUrl: 'https://via.placeholder.com/64x64/059669/FFFFFF?text=Drill'
              },
              borrower: { id: 3, name: 'Sarah Johnson' },
              owner: { id: 1, name: 'You' },
              status: 'PENDING'
            },
            {
              id: 3,
              item: {
                id: 3,
                name: 'Camping Tent',
                imageUrl: 'https://via.placeholder.com/64x64/DC2626/FFFFFF?text=Tent'
              },
              borrower: { id: 1, name: 'You' },
              owner: { id: 4, name: 'Mike Wilson' },
              status: 'RETURNED'
            }
          ];
          
          localStorage.setItem('transactions', JSON.stringify(mockTransactions));
          setTransactions(mockTransactions);
        } else {
          setTransactions(storedTransactions);
        }
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to load transactions');
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, []);

  const handleUpdateRequest = (transactionId, newStatus) => {
    try {
      // Update the state locally
      const updatedTransactions = transactions.map(t => 
        t.id === transactionId ? { ...t, status: newStatus } : t
      );
      
      setTransactions(updatedTransactions);
      
      // Update localStorage
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      
      toast.success(`Request has been ${newStatus.toLowerCase()}.`);
    } catch (err) {
      console.error('Error updating request:', err);
      toast.error('Failed to update request');
    }
  };

  if (loading) return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarsBackground />
      <div className="relative z-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading transactions...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarsBackground />
      <div className="relative z-10 text-center">
        <p className="text-red-400 text-lg">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const borrowedItems = transactions.filter(t => t.borrower.id === currentUserId);
  const lentItems = transactions.filter(t => t.owner.id === currentUserId);

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <style>{`
          .transaction-card { display: flex; align-items-center; gap: 1rem; padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
          .transaction-card:last-child { border-bottom: none; }
          .item-image { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; }
          .card-details { flex-grow: 1; }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
          .item-name { font-weight: 600; color: #ffffff; }
          .user-info { font-size: 0.875rem; color: #9ca3af; }
          .card-actions { display: flex; gap: 0.5rem; }
        `}</style>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Transactions</h1>
          <p className="text-gray-300">Manage your borrowing, lending, and credit purchases</p>
        </div>

        {/* Custom Tabs Implementation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'borrowed'
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Items I've Borrowed
            </button>
            <button
              onClick={() => setActiveTab('lent')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'lent'
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Requests for My Items
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'credits'
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Buy Credits
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'borrowed' && (
              <div>
                {borrowedItems.length > 0 ? (
                  borrowedItems.map(t => <TransactionCard key={t.id} transaction={t} isOwner={false} />)
                ) : (
                  <p className="text-gray-400 text-center py-8">You haven't borrowed any items yet.</p>
                )}
              </div>
            )}
            
            {activeTab === 'lent' && (
              <div>
                {lentItems.length > 0 ? (
                  lentItems.map(t => <TransactionCard key={t.id} transaction={t} isOwner={true} onUpdate={handleUpdateRequest} />)
                ) : (
                  <p className="text-gray-400 text-center py-8">You have no pending requests for your items.</p>
                )}
              </div>
            )}
            
            {activeTab === 'credits' && (
              <CreditPurchase />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
