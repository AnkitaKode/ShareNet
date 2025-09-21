import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request retry logic
let retryCount = 0;
const maxRetries = parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3;

// Bind handler once to properly remove later
const handleRequest = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleRequestError = (error) => Promise.reject(error);

const handleResponse = (response) => response;

const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

api.interceptors.request.use(handleRequest, handleRequestError);
api.interceptors.response.use(handleResponse, handleResponseError);

export const endpoints = {
  auth: {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
  },
  items: {
    getAll: () => api.get('/items/available'),
    getById: (id) => api.get(`/items/${id}`),
    create: (data) => api.post('/items/upload', data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`),
  },
  user: {
    getProfile: (userId) => api.get(`/user/profile?userId=${userId}`),
    updateProfile: (data) => api.put('/user/profile', data),
    buyCredit: (userId, amount) => api.post(`/users/buy-credit?userId=${userId}&amount=${amount}`),
    getUser: (id) => api.get(`/users/${id}`),
  },
  transactions: {
    getUserTransactions: (userId) => api.get(`/transactions/user/${userId}`),
    create: (data) => api.post('/transactions/create', data),
  },
  chats: {
    getChatsBetweenUsers: (user1, user2) => api.get(`/chats/${user1}/${user2}`),
    sendMessage: (data) => api.post('/chats/send', data),
  },
};

export default api;
