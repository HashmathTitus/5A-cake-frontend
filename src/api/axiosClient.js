import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';

    if (error.response?.status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminProfile');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => axiosClient.post('/auth/login', { email, password }),
  register: (name, email, password) => axiosClient.post('/auth/register', { name, email, password }),
  getProfile: () => axiosClient.get('/auth/profile'),
};

// Events API
export const eventsAPI = {
  getAll: () => axiosClient.get('/events'),
  getById: (id) => axiosClient.get(`/events/${id}`),
  create: (formData) => axiosClient.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosClient.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosClient.delete(`/events/${id}`),
  getStats: () => axiosClient.get('/events/stats/overview'),
};

// Feedback API
export const feedbackAPI = {
  getPublic: (eventId = '', page = 1, limit = 12) =>
    axiosClient.get(`/feedback/public/list?eventId=${eventId}&page=${page}&limit=${limit}`),
  getById: (id) => axiosClient.get(`/feedback/public/${id}`),
  create: (formData) => axiosClient.post('/feedback/public/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  // Admin
  getAll: (eventId = '', rating = '', page = 1, limit = 10, search = '') =>
    axiosClient.get(
      `/feedback/admin/list?eventId=${eventId}&rating=${rating}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    ),
  update: (id, formData) => axiosClient.put(`/feedback/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosClient.delete(`/feedback/admin/${id}`),
  getStats: () => axiosClient.get('/feedback/admin/stats/overview'),
};

export default axiosClient;
