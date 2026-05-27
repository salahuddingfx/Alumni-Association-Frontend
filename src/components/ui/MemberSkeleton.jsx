import React from 'react';

const MemberSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start space-x-4 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default MemberSkeleton;
