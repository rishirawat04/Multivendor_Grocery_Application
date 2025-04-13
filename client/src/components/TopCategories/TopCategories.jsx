import React, { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './animation.css'; // Import the CSS file
import api from '../../API/api';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

// Create a CategoryCardSkeleton component for smoother loading experience
const CategoryCardSkeleton = () => (
  <div className="min-w-[150px] bg-green-50 rounded-lg p-4 text-center shadow-md animate-pulse">
    <div className="relative overflow-hidden rounded-full w-16 h-16 mx-auto mb-3 bg-gray-200"></div>
    <div className="h-5 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto mb-2"></div>
    <div className="h-3 bg-gray-200 rounded-lg w-1/3 mx-auto mt-2"></div>
  </div>
);

const TopCategories = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get('category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 200;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 200;
  };

  return (
    <div className="relative mt-20">
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className="text-3xl font-bold">Top Categories</h2>
          <p className="text-gray-600 mt-1">Browse our featured categories</p>
        </div>
        <div className='flex items-center space-x-3'>
          <Link to="/category" className="mr-4">
            <Button
              variant="outlined"
              startIcon={<CategoryIcon />}
              sx={{
                borderColor: '#38a169',
                color: '#38a169',
                '&:hover': {
                  borderColor: '#2f855a',
                  backgroundColor: 'rgba(56, 161, 105, 0.04)',
                },
              }}
            >
              View All
            </Button>
          </Link>
          <div className='flex items-center text-white space-x-3'>
            <button 
              onClick={scrollLeft}
              className="transition-transform hover:scale-105"
            >
              <ArrowBackIcon className='bg-green-600 p-1 rounded-full w-20 text-[50px]' />
            </button>
            <button 
              onClick={scrollRight}
              className="transition-transform hover:scale-105"
            >
              <ArrowForwardIcon className='bg-green-600 p-1 rounded-full w-12' />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4"
        >
          {loading ? (
            // Show skeleton loaders when loading
            Array(6).fill(0).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          ) : (
            categories.map((category) => (
              <Link 
                to={`/category/${category._id}`} 
                key={category._id}
                className="min-w-[150px] bg-green-50 rounded-lg p-4 text-center shadow-md card cursor-pointer hover:bg-green-100 transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-full w-16 h-16 mx-auto mb-3">
                  <img
                    src={category?.imageUrl} // Use the imageUrl from the category
                    alt={category?.name}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{category?.name}</h3>
                <p className="text-sm text-gray-500">
                  {category?.productCount || 0} products
                </p>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  Explore &rarr;
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
