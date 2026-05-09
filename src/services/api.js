import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, 
});


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


api.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
        
          console.error('Unauthorized: Please log in again');
          localStorage.removeItem('token');
        
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
