# Multivendor E-commerce Application

A full-stack MERN (MongoDB, Express, React, Node.js) multivendor e-commerce application with features like user authentication, product management, cart, orders, and payment processing.

## Environment Setup

### Server Configuration

1. Navigate to the server directory and create a `.env` file with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development # or production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Client Configuration

1. Navigate to the client directory and create a `.env` file with:

```
REACT_APP_DEV_API_URL=http://localhost:5000/api/v1
REACT_APP_PROD_API_URL=https://your-production-api-url.com/api/v1
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Development Setup

### Running the Server

```bash
cd server
npm install
npm run dev
```

### Running the Client

```bash
cd client
npm install
npm start
```

## Production Deployment

### Server Deployment

1. Set `NODE_ENV=production` in your server's environment variables
2. Run the server with:

```bash
cd server
npm install
npm run prod
```

### Client Deployment

1. Build the React application:

```bash
cd client
npm install
npm run build:production
```

2. Deploy the `build` folder to your hosting service.

## Environment Variables Management

- The application uses different configurations for development and production environments
- API calls automatically use the correct endpoint based on the current environment
- CORS settings are configured to allow access from authorized domains only

## Tech Stack

- **Frontend**: React, Material-UI, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Processing**: Razorpay
- **Authentication**: JWT

## Features

- User authentication and authorization
- Product management
- Cart and checkout functionality
- Payment processing
- Order management
- Admin dashboard
- Vendor management 