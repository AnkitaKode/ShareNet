import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { getItemById, requestToBorrow } from '../services/api';
import StarsBackground from '../components/StarsBackground';

const RequestToBorrowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    message: '',
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await getItemById(id);
        setItem(itemData);
        setFormData(prev => ({
          ...prev,
          message: `Hi! I would like to borrow your ${itemData.title}.`
        }));
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item details');
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Send request to backend
      await requestToBorrow({
        itemId: id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        message: formData.message,
        borrowerId: currentUser.uid,
        ownerId: item.ownerId
      });

      // Update UI
      setIsRequested(true);
      toast.success('Borrow request sent successfully!');
      
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/my-requests');
      }, 2000);
      
    } catch (error) {
      console.error('Error sending borrow request:', error);
      toast.error(error.message || 'Failed to send borrow request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative bg-gray-900 text-white flex items-center justify-center">
        <StarsBackground />
        <div className="relative z-10 animate-pulse">Loading item details...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen relative bg-gray-900 text-white flex items-center justify-center">
        <StarsBackground />
        <div className="relative z-10">Item not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-900 text-white p-4">
      <StarsBackground />
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Request to Borrow</h1>
          <p className="text-gray-400 mb-6">Fill in the details below to send a request to the owner</p>
          
          <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-4">${item.price || '0'}/day</span>
                  <span>{item.location || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    required
                    disabled={isRequested || isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    required
                    disabled={isRequested || isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message to Owner
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                placeholder="Write a message to the owner..."
                required
                disabled={isRequested || isSubmitting}
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-gray-600/50 text-gray-300 font-medium rounded-lg hover:bg-gray-700/50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${
                  isRequested 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 min-w-[180px] justify-center`}
                disabled={isRequested || isSubmitting}
              >
                {isRequested ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Requested
                  </>
                ) : (
                  <>
                    {isSubmitting ? 'Sending...' : 'Request to Borrow'}
                    {!isSubmitting && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestToBorrowPage;
