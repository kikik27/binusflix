import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clean up token if invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Only remove if it was an explicit auth error on a protected route
        console.warn('Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
