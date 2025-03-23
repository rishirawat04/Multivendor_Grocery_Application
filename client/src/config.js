// Configuration file to handle environment variables

// API Endpoints
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_PROD_API_URL
  : process.env.REACT_APP_DEV_API_URL;

// Payment Gateway
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

// Environment Information
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENV_NAME = process.env.NODE_ENV;

// Export configuration
const config = {
  API_URL,
  RAZORPAY_KEY_ID,
  IS_PRODUCTION,
  ENV_NAME
};

export default config; 