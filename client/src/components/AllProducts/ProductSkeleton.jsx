import React from 'react';

// Reusable Product Skeleton component for loading state
const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-40 bg-gray-200"></div>
      
      {/* Content placeholder */}
      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        
        {/* Rating placeholder */}
        <div className="flex space-x-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-3 h-3 bg-gray-200 rounded"></div>
          ))}
          <div className="h-3 w-8 bg-gray-200 rounded ml-1"></div>
        </div>
        
        {/* Price placeholder */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-2 items-center">
            <div className="h-5 w-14 bg-gray-200 rounded"></div>
            <div className="h-4 w-10 bg-gray-200 rounded line-through"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton; 