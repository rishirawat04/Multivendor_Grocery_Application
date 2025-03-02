import React, { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './animation.css'; // Import the CSS file
import api from '../../API/api';
import { LoadingFallback } from '../../App';

const TopCategories = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
      <div className='flex items-center justify-between'>
        <h2 className="text-2xl font-bold mb-4">Top Categories</h2>
        <div className='flex items-center text-white space-x-3'>
          <button onClick={scrollLeft}>
            <ArrowBackIcon className='bg-green-600 p-1 rounded-full w-20 text-[50px]' />
          </button>
          <button onClick={scrollRight}>
            <ArrowForwardIcon className='bg-green-600 p-1 rounded-full w-12' />
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
        >
          {categories.length === 0 ? (
            <LoadingFallback />  // Show a loading message until data is fetched
          ) : (
            categories.map((category) => (
              <div
                key={category._id}
                className="min-w-[150px] bg-green-50 rounded-lg p-4 text-center shadow-md card"
              >
                {/* Placeholder image since the response doesn't include images */}
                <img
                  src={category?.imageUrl} // Use the imageUrl from the category
                  alt={category?.name}
                  className="w-16 h-16 mx-auto mb-2 object-cover transition-transform hover:scale-110"
                />
                <h3 className="text-lg font-semibold">{category?.name}</h3>
                <p className="text-sm text-gray-500">{category?.subcategoryCount} subcategories</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
