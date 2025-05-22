import React from 'react';

const MobileNewsletter = () => {
  return (
    <div className="md:hidden bg-[#8B7964] text-white py-10 px-6 text-center">
      <h2 className="text-5xl font-bold mb-4">Save 20%!</h2>
      <p className="text-xl mb-8">
        Knock 20% off your first order<br />
        and stay afloat of the latest deals.
      </p>
      <div className="relative max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="ENTER YOUR EMAIL" 
          className="w-full bg-transparent border border-white rounded-full py-3 px-6 text-white placeholder-white outline-none"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MobileNewsletter; 