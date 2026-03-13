import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;
const RETRY_ATTEMPTS = import.meta.env.VITE_API_RETRY_ATTEMPTS || 3;

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

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic for network errors
    if (!error.response && originalRequest._retryCount < RETRY_ATTEMPTS) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      originalRequest._retryCount++;
      
      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: async (credentials) => {
      return apiClient.post('/auth/login', credentials);
    },
    register: async (data) => {
      return apiClient.post('/auth/register', data);
    }
  },
  items: {
    create: async (itemData) => {
      return apiClient.post('/items/upload', itemData);
    },
    getAll: async () => {
      try {
        const response = await apiClient.get('/items/available');
        console.log('Items fetched successfully:', response.data);
        return response;
      } catch (error) {
        console.error('Error fetching items:', error.message);
        throw error;
      }
    },
    getById: async (itemId) => {
      return apiClient.get(`/items/${itemId}`);
    }
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await apiClient.get(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw new Error('Failed to fetch item details');
  }
};

export const requestToBorrow = async (requestData) => {
  try {
    const response = await apiClient.post('/requests', requestData);

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
    await apiClient.post('/notifications', notificationData);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
