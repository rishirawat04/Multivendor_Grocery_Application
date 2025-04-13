import { useEffect, useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from "../../API/api";
import { cartUpdateEvent } from "../AllProducts/ProuductCard";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React from "react";

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TimeUnit = ({ value, unit }) => (
  <div className="flex flex-col items-center bg-white p-2 rounded shadow-sm">
    <span className="text-sm font-bold">{value.toString().padStart(2, '0')}</span>
    <span className="text-xs">{unit}</span>
  </div>
);
  
const ProductCard = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState(product.timeLeft || { days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isExpired, setIsExpired] = useState(false);

  // Update from props when they change
  useEffect(() => {
    if (product.timeLeft) {
      setTimeLeft(product.timeLeft);
    }
  }, [product.timeLeft]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        // Check if time is already at 0
        if (prevTime.days === 0 && prevTime.hours === 0 && 
            prevTime.minutes === 0 && prevTime.seconds === 0) {
          setIsExpired(true);
          clearInterval(timer);
          return prevTime;
        }
        
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          setIsExpired(true);
          clearInterval(timer);
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  // Add to cart function
  const handleAddToCart = async () => {
    if (isExpired) {
      setSnackbarSeverity('error');
      setSnackbarMessage('This offer has expired');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await api.post(
        '/cart',
        {
          productId: product._id,
          quantity: 1
        },
        {
          withCredentials: true
        }
      );
      setSnackbarSeverity('success');
      setSnackbarMessage(response.data.message);
      
      // Dispatch a custom event to notify that the cart has been updated
      document.dispatchEvent(cartUpdateEvent);
    } catch (error) {
      console.error("Add to cart error:", error);
      
      if (error.response?.status === 401) {
        setSnackbarSeverity('warning');
        setSnackbarMessage('Please login to add items to your cart');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(
          error.response?.data?.message || 'Failed to add to cart'
        );
      }
    } finally {
      setSnackbarOpen(true);
    }
  };
  
  // Close snackbar handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover z-0" 
        />
        {isExpired && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded">Offer Expired</span>
          </div>
        )}
      </div>
      
      <div className="absolute top-20 left-0 right-0 flex justify-center p-2">
        <div className="flex space-x-2 px-2 py-1 bg-green-50 bg-opacity-90 rounded shadow">
          <TimeUnit value={timeLeft.days} unit="Days" />
          <TimeUnit value={timeLeft.hours} unit="Hours" />
          <TimeUnit value={timeLeft.minutes} unit="Mins" />
          <TimeUnit value={timeLeft.seconds} unit="Secs" />
        </div>
      </div>
      
      <div className="bg-white mt-2 h-40 z-10">
        <div className="px-5 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 truncate w-full">{product.name}</h3>
          <div className="flex mb-2">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-600 ml-1">({product.reviews})</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Sold by {product.seller}</p>
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-lg font-bold">${(product.discountedPrice || product.price).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>
            <button 
              className={`px-3 py-1 rounded ${isExpired 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'text-green-500 bg-green-100 hover:bg-green-500 hover:text-white ease-in-out duration-300'}`}
              onClick={handleAddToCart}
              disabled={isExpired}
            >
              <ShoppingCartIcon fontSize="small" /> Add
            </button>
          </div>
        </div>
      </div>
      
      {/* MUI Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductCard