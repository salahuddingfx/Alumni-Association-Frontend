import React from 'react';

const EventSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200 relative"></div>
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default EventSkeleton;
