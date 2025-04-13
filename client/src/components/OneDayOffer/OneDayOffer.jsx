import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../../API/api';
import { DealSkeleton } from '../../components/OneDayOffer/DealSkeleton';

const DealsOfTheDay = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/deals');
        
        if (response.data && response.data.deals && response.data.deals.length > 0) {
          // Get the first active deal
          const activeDeal = response.data.deals[0];
          
          // Format products with endDate for the timer
          const formattedProducts = activeDeal.products.map(product => {
            // Calculate discount if not already applied
            const discountedPrice = product.discountedPrice || 
              product.price - (product.price * (activeDeal.discountPercentage / 100));
            
            // Calculate time remaining
            const endDate = new Date(activeDeal.endDate);
            const now = new Date();
            const timeDifference = endDate - now;
            
            // Format time difference into days, hours, minutes, seconds
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            
            return {
              _id: product._id,
              name: product.name,
              description: product.description,
              price: product.price,
              discountedPrice: discountedPrice,
              oldPrice: product.price,
              image: product.image[0], // First image
              rating: product.rating || 4,
              reviews: product.numReviews || 10,
              stock: product.stock,
              seller: "Grocery Store",
              timeLeft: { days, hours, minutes, seconds }
            };
          });
          
          setDealProducts(formattedProducts);
        } else {
          setDealProducts([]);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        setError("Failed to load deals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeals();
    
    // Refresh timer every minute
    const intervalId = setInterval(fetchDeals, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // If there's an error, display it
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Deals Of The Day</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Deals Of The Day</h2>
      
      {loading ? (
        // Show skeleton loaders while loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <DealSkeleton key={index} />
          ))}
        </div>
      ) : dealProducts.length === 0 ? (
        // If no deals are available
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No deals available at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Please check back later for exciting offers!</p>
        </div>
      ) : (
        // Display products if available
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealProducts.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DealsOfTheDay;