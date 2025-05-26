import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <>
      {/* Mobile layout - visible only on small screens */}
      <div className="md:hidden w-full px-4 pt-4">
        {/* Images in one line (70-30%) */}
        <div className="flex flex-row space-x-2 mb-4">
          {/* First image - 70% - zoomed 30% on right side */}
          <Link to="/products" className="w-[70%] rounded-lg overflow-hidden">
            <div className="relative h-[240px] cursor-pointer">
              <img 
                src="/assets/menu/hero/lotus.jpg" 
                alt="Water Plant Fertilizer" 
                className="w-full h-full object-cover rounded-lg"
                style={{ 
                  objectPosition: "85% center", 
                  transform: "scale(1.3)" 
                }}
              />
            </div>
          </Link>
          
          {/* Second image - 30% - with text overlay */}
          <Link to={{
            pathname: "/products",
            state: { scrollToCategory: "Garden Products" }
          }} className="w-[30%] rounded-lg overflow-hidden">
            <div className="relative h-[240px] cursor-pointer">
              <img 
                src="/assets/products/TPS_8oz_Wrap_PNG/TPS_Lotus Fert_8oz_Wrap.png" 
                alt="Lotus Fertilizer" 
                className="w-full h-full object-contain"
                style={{ 
                  transform: "scale(2)" 
                }}
              />
            </div>
          </Link>
        </div>
        
        {/* Text and button centered below */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-black mb-8">
            Grow something<br />beautiful.
          </h1>
          <Link 
            to="/products" 
            className="bg-[#F97462] text-white font-bold py-3 px-12 rounded-full w-auto text-xl hover:bg-opacity-90 transition-all inline-block"
          >
            SHOP ALL
          </Link>
        </div>
      </div>
      
      {/* Desktop layout - hidden on small screens */}
      <div className="max-w-7xl mx-auto px-6 pt-8 hidden md:block">
        <div className="flex flex-row w-full space-x-4">
          {/* Left section - 70% width */}
          <Link to="/products" className="w-[70%] relative">
            <div className="relative h-[500px] cursor-pointer">
              <img 
                src="/assets/menu/hero/lotus.jpg" 
                alt="Water Plant Fertilizer" 
                className="w-full h-full object-cover rounded-md"
                style={{ 
                  objectPosition: "85% center"
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 rounded-md">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-2">
                  GROW<br />
                  SOMETHING<br />
                  BEAUTIFUL
                </h1>
                <p className="text-xl md:text-2xl text-white mb-6"></p>
                <div 
                  className="bg-[#F97462] text-white font-bold py-3 px-8 rounded-full w-max hover:bg-opacity-90 transition-all inline-block"
                >
                  SHOP ALL
                </div>
              </div>
            </div>
          </Link>
          
          {/* Right section - 30% width */}
          <Link to={{
            pathname: "/products",
            state: { scrollToCategory: "Garden Products" }
          }} className="w-[30%] relative">
            <div className="relative h-[500px] overflow-hidden rounded-md cursor-pointer">
              <img 
                src="/assets/products/TPS_8oz_Wrap_PNG/TPS_Lotus Fert_8oz_Wrap.png" 
                alt="Lotus Fertilizer" 
                className="w-full h-full object-contain"
                style={{ 
                  transform: 'scale(1.2)',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
