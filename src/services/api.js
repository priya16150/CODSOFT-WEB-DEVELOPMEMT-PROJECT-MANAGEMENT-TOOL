import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle common errors globally
api.interceptors.response.use(
  (response) => {
    // Any status code within 2xx triggers this
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized – token expired or invalid
          console.error('Unauthorized: Please log in again');
          localStorage.removeItem('token');
          // Optional: redirect to login page if not already there
          if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            window.location.href = '/';
          }
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Not found:', data?.message || 'Resource not found');
          break;
        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error(`API Error (${status}):`, data?.message || 'Something went wrong');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: Server not responding');
    } else {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;