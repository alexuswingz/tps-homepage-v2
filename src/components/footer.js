import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#FF5D5D] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Logo */}
          <div className="flex flex-col items-start">
            <img src="/assets/whiteleaf.png" alt="Leaf Icon" className="h-16 mb-4" />
            <img 
              src="/assets/TPS_Plant Food_White_Horiz_Label_Logo.png" 
              alt="TPS Plant Foods Logo" 
              className="h-10 mt-6" 
            />
            <p className="text-sm mt-2">NOURISH EVERY PLANT</p>
          </div>

          {/* Middle Column - Navigation Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="space-y-4">
                <li><a href="#" className="hover:underline">SHOP ALL</a></li>
                <li><a href="#" className="hover:underline">BUILD A BUNDLE</a></li>
                <li><a href="#" className="hover:underline">HOUSEPLANTS</a></li>
                <li><a href="#" className="hover:underline">GARDEN PLANTS</a></li>
                <li><a href="#" className="hover:underline">HYDRO & AQUATIC</a></li>
                <li><a href="#" className="hover:underline">PLANT SUPPLEMENTS</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-4">
                <li><a href="#" className="hover:underline">MY ACCOUNT</a></li>
                <li><a href="#" className="hover:underline">ASK A QUESTION</a></li>
                <li><a href="#" className="hover:underline">BLOG: THE POUR SPOUT</a></li>
                <li><a href="#" className="hover:underline">SHIPPING & RETURNS</a></li>
                <li><a href="#" className="hover:underline">WHOLESALE</a></li>
                <li><a href="#" className="hover:underline">AFFILIATES</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Newsletter Signup */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Get with the program!</h3>
            <p className="mb-4">Stay afloat of all the latest plant care tips, deals, and savings.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="bg-transparent border border-white rounded-l-full py-2 px-4 w-full outline-none" 
              />
              <button className="bg-transparent border border-l-0 border-white rounded-r-full py-2 px-4">
                <span className="text-xl">&gt;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-white/30" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">Copyright TPS Nutrients, 2025</p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:underline">Terms & Conditions</a>
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 