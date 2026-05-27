import React from 'react';

const NoticeSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-4 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default NoticeSkeleton;
