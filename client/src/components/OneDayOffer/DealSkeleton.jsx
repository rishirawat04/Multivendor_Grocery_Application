import React from 'react';

// Reusable Deal Skeleton component for loading state
export const DealSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden relative animate-pulse">
    {/* Image placeholder */}
    <div className="w-full h-48 bg-gray-200"></div>
    
    {/* Timer placeholder */}
    <div className="absolute top-20 left-0 right-0 flex justify-center p-2">
      <div className="flex space-x-2 px-2 py-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 w-14 h-14 rounded flex flex-col items-center justify-center">
            <div className="h-4 w-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Content placeholder */}
    <div className="bg-white mt-2 h-40 p-5">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
        <div className="h-4 w-10 bg-gray-200 rounded ml-2"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex items-center justify-between w-full">
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
); 