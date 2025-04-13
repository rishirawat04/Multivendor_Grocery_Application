import React from 'react';

// Skeleton loader for OfferSection component
export const OfferSectionSkeleton = () => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden bg-gray-50 animate-pulse">
      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-7 bg-gray-200 rounded w-3/5 mb-2"></div>
        
        {/* Text placeholder */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2 mt-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        
        <div className="flex justify-between">
          {/* Button placeholder */}
          <div className="mt-20 h-10 w-32 bg-gray-200 rounded-full"></div>
          
          {/* Image placeholder */}
          <div className="relative h-40 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const OfferSection = ({ title, discount, image, bgColor }) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${bgColor}`}>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 my-4 mr-30">There are many variations of passages of Lorem Ipsum available.There are many variations of passages of Lorem Ipsum available.</p>
        
        <div className="flex justify-between">
          <button className="mt-20 bg-green-500 text-white h-10 px-2 rounded-full w-32 hover:bg-green-600 whitespace-nowrap">
            Shop Now
          </button>
          <div className="relative h-40 ">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full    transition-transform hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
