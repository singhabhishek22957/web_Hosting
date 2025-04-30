import React from "react";

const LoadingPopUp = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50">
      <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
        {/* Circular Loader */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPopUp;
