import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function to get headers with optional token
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const endpoints = {
  auth: {
    login: async (credentials) => {
      return axios.post(`${API_URL}/auth/login`, credentials, {
        headers: getHeaders()
      });
    },
    register: async (data) => {
      return axios.post(`${API_URL}/auth/register`, data, {
        headers: getHeaders()
      });
    }
  },
  items: {
    create: async (itemData) => {
      return axios.post(`${API_URL}/items/upload`, itemData, {
        headers: getHeaders(true)
      });
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/items/available`, {
          headers: getHeaders(false) // Don't require token for browsing
        });
        console.log('Items fetched successfully:', response.data);
        return response;
      } catch (error) {
        console.error('Error fetching items:', error.message);
        throw error;
      }
    },
    getById: async (itemId) => {
      return axios.get(`${API_URL}/items/${itemId}`, {
        headers: getHeaders(false)
      });
    }
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${API_URL}/items/${itemId}`, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw new Error('Failed to fetch item details');
  }
};

export const requestToBorrow = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/requests`, requestData, {
      headers: getHeaders(true)
    });

    await sendNotification({
      userId: requestData.ownerId,
      type: 'BORROW_REQUEST',
      message: 'New borrow request for your item',
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

const sendNotification = async (notificationData) => {
  try {
    await axios.post(`${API_URL}/notifications`, notificationData, {
      headers: getHeaders(true)
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
