import React from "react";

const Loading = () => {
  return (
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#00B495] mx-auto"></div>
      <p className="text-sm text-gray-600">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
