import React from 'react';

const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="h-10 w-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

export default Loader;
