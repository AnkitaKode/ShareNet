import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Get item by ID
export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${API_URL}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw new Error('Failed to fetch item details');
  }
};

// Request to borrow an item
export const requestToBorrow = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/requests`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Send notification to the item owner
    await sendNotification({
      userId: requestData.ownerId,
      type: 'BORROW_REQUEST',
      message: `New borrow request for your item`,
      data: {
        itemId: requestData.itemId,
        requesterId: requestData.borrowerId,
        startDate: requestData.startDate,
        endDate: requestData.endDate
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating borrow request:', error);
    throw new Error(error.response?.data?.message || 'Failed to send borrow request');
  }
};

// Send notification to user
const sendNotification = async (notificationData) => {
  try {
    await axios.post(`${API_URL}/notifications`, notificationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    // Don't throw error for notification failures
  }
};
