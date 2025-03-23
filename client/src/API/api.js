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

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
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
