import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PROD_API_URL 
  : process.env.REACT_APP_DEV_API_URL;

// Create a global Axios instance with the appropriate baseURL
const api = axios.create({
  baseURL,
  withCredentials: true
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Token might be expired, clear it
      if (error.response.data.message === 'Not authorized, token failed' || 
          error.response.data.message === 'Not authorized, no token') {
        console.warn('Authentication token is invalid or expired');
        // You could trigger a logout or token refresh here
      }
    }
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export default api;


// const baseURL =
//   process.env.NODE_ENV === 'development'
//     ? process.env.REACT_APP_DEV_API_URL
//     : process.env.REACT_APP_PROD_API_URL;

// const api = axios.create({
//   baseURL,
// });

// export default api;
