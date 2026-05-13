import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
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

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
};

// Menu APIs
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  getByCategories: () => api.get('/menu/categories'),
  create: (formData) => api.post('/menu', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/menu/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/menu/${id}`),
  toggleAvailability: (id) => api.patch(`/menu/${id}/availability`),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params) => api.get('/orders', { params }),
  getKanban: () => api.get('/orders/kanban'),
  getQueue: () => api.get('/orders/queue'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => api.patch(`/orders/${id}/payment`, { paymentStatus }),
  getPaymentQR: (id) => api.get(`/orders/${id}/payment-qr`),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (period) => api.get('/analytics/revenue', { params: { period } }),
  getPeakHours: () => api.get('/analytics/peak-hours'),
  getTopItems: (params) => api.get('/analytics/top-items', { params }),
  getCustomers: () => api.get('/analytics/customers'),
  getCategories: () => api.get('/analytics/categories'),
};

// Offer APIs
export const offerAPI = {
  getAll: (params) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  validate: (code, orderAmount) => api.post('/offers/validate', { code, orderAmount }),
  toggle: (id) => api.patch(`/offers/${id}/toggle`),
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (formData) => api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications'),
};

// Invoice APIs
export const invoiceAPI = {
  generate: (orderId) => api.get(`/invoice/${orderId}`, { responseType: 'blob' }),
};

export default api;
