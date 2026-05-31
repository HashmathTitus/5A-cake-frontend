import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const clearStoredAuth = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminProfile');
};

const getApiErrorMessage = (error, fallback = 'Request failed') => {
  const responseData = error?.response?.data;

  if (!responseData) {
    return error?.message || fallback;
  }

  if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    return responseData.errors[0]?.message || responseData.message || fallback;
  }

  return responseData.message || responseData.error || error?.message || fallback;
};

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

    if (error.response?.status === 401 && !requestUrl.includes('/auth/login')) {
      clearStoredAuth();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export { getApiErrorMessage, clearStoredAuth };

// Auth API
export const authAPI = {
  login: (email, password) => axiosClient.post('/auth/login', { email, password }),
  getProfile: () => axiosClient.get('/auth/profile'),
};

// Events API
export const eventsAPI = {
  getAll: () => axiosClient.get('/events/public'),
  getPublic: () => axiosClient.get('/events/public'),
  getAdmin: () => axiosClient.get('/events/admin'),
  getById: (id) => axiosClient.get(`/events/${id}`),
  create: (formData) => axiosClient.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosClient.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosClient.delete(`/events/${id}`),
  getStats: () => axiosClient.get('/events/stats/overview'),
  generateFeedbackLink: (id) => axiosClient.post(`/events/${id}/feedback-link`),
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
  getAdmin: (query = '') => axiosClient.get(`/feedback/admin/list${query ? `?${query}` : ''}`),
  update: (id, formData) => axiosClient.put(`/feedback/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosClient.delete(`/feedback/admin/${id}`),
  getStats: () => axiosClient.get('/feedback/admin/stats/overview'),
};

// Inquiries API
export const inquiriesAPI = {
  create: (formData) => axiosClient.post('/inquiries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params = '') => axiosClient.get(`/admin/inquiries${params ? `?${params}` : ''}`),
  getStats: () => axiosClient.get('/admin/inquiries/stats/overview'),
  updateStatus: (id, status) => axiosClient.put(`/admin/inquiries/${id}/status`, { status }),
  delete: (id) => axiosClient.delete(`/admin/inquiries/${id}`),
};

// Reviews token API
export const reviewTokenAPI = {
  validate: (eventId, token) => axiosClient.get(`/feedback/validate/${eventId}/${token}`),
  submit: (eventId, token, formData) => axiosClient.post(`/feedback/submit/${eventId}/${token}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default axiosClient;
