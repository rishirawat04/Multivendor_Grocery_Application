import React from 'react';

const CategoryButton = ({ title, imageUrl }) => {
  return (
    <div className="p-2 border rounded-lg flex items-center">
      <img src={imageUrl} alt={title} className="w-6 h-6 object-cover mr-2" />
      <span className="text-sm font-semibold text-black">{title}</span>
    </div>
  );
};

export default CategoryButton;
