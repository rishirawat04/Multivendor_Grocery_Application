import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
        
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
        } else {
            console.error('Failed to connect to MongoDB after maximum retries. Please check your connection settings.');
            // Don't exit the process to avoid stopping the server completely
            // but log a clear error message for troubleshooting
        }
    }
};

export { connectDB };
