import axios from 'axios';

// Create a global Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/'      
});

export default api;


// const baseURL =
//   process.env.NODE_ENV === 'development'
//     ? process.env.REACT_APP_DEV_API_URL
//     : process.env.REACT_APP_PROD_API_URL;

// const api = axios.create({
//   baseURL,
// });

// export default api;
