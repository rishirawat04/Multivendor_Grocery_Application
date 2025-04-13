import React from 'react';

// Reusable Category Skeleton component for loading state
const CategorySkeleton = () => {
  return (
    <div className="px-6 py-2 rounded-full bg-gray-200 animate-pulse min-w-[120px] h-10 flex items-center justify-center">
      {/* Empty div to maintain the same size as category buttons */}
    </div>
  );
};

export default CategorySkeleton; 