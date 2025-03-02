import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes/route.js';
import { connectDB } from './db.js';
import Razorpay from 'razorpay';
import cors from 'cors'; 
import path from 'path';


// Load environment variables from .env file
dotenv.config();
const app = express();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware for CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,  
}));

// Middleware for cookies and parsing
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(express.json());

// Connect to the database
connectDB();

// Use centralized routes
app.use('/api/v1', routes);

// Start the server and listen on the specified port
const port = process.env.PORT || 4000;
const server = http.createServer(app);



server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});