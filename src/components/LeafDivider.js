import React from 'react';

const LeafDivider = () => {
  return (
    <div className="flex items-center justify-center w-full my-12 px-4 overflow-hidden">
      <div className="w-full max-w-[350px] h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 to-gray-400 transform transition-all duration-700 hover:scale-x-105 origin-right"></div>
      
      <div className="relative mx-6 flex items-center justify-center group transition-all duration-300 hover:scale-110">
        <div className="absolute w-10 h-10 bg-gradient-to-br from-white/90 to-white/60 rounded-full shadow-sm"></div>
        <div className="absolute w-10 h-10 rounded-full bg-green-50/30 animate-pulse"></div>
        <img 
          src="/assets/leaf-gif.gif" 
          alt="Decorative leaf animation"
          className="w-12 h-12 object-contain z-10 relative drop-shadow-sm"
        />
      </div>
      
      <div className="w-full max-w-[350px] h-[1.5px] bg-gradient-to-l from-transparent via-gray-300 to-gray-400 transform transition-all duration-700 hover:scale-x-105 origin-left"></div>
    </div>
  );
};

export default LeafDivider; 