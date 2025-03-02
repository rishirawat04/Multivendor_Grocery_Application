import React from 'react';

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
