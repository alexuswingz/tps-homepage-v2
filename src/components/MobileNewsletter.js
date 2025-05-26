import React from 'react';

const MobileNewsletter = () => {
  return (
    <div className="md:hidden bg-[#8B7964] text-white py-10 px-6 text-center mx-auto my-4 rounded-lg max-w-sm">
      <h2 className="text-4xl font-bold mb-4">Save 20%</h2>
      <p className="text-lg mb-8">
      Enter your email to save 20% off your first order & stay informed.
      </p>
      <div className="relative mx-auto">
        <input 
          type="email" 
          placeholder="ENTER YOUR EMAIL" 
          className="w-full bg-transparent border border-white rounded-full py-3 px-6 text-white placeholder-white outline-none"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MobileNewsletter; 


