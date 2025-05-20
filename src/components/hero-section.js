import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <>
      {/* Mobile layout - visible only on small screens */}
      <div className="md:hidden w-full px-4 pt-4">
        {/* Images in one line (50-50%) */}
        <div className="flex flex-row space-x-2 mb-4">
          {/* First image - 50% - zoomed 30% on right side */}
          <Link to="/products" className="w-1/2 rounded-lg overflow-hidden">
            <div className="relative h-[240px] cursor-pointer">
              <img 
                src="/assets/menu/hero/Hero_Aquatic.jpg" 
                alt="Water Plant Fertilizer" 
                className="w-full h-full object-cover rounded-lg"
                style={{ 
                  objectPosition: "right", 
                  transform: "scale(1.3)" 
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-opacity duration-300"></div>
            </div>
          </Link>
          
          {/* Second image - 50% - with text overlay */}
          <Link to={{
            pathname: "/products",
            state: { scrollToCategory: "Garden Products" }
          }} className="w-1/2 rounded-lg overflow-hidden">
            <div className="relative h-[240px] cursor-pointer">
              <img 
                src="/assets/menu/hero/Lawn and Garden Tile Rotated.jpg" 
                alt="Lawn and Garden" 
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end items-center p-4 pb-6 hover:bg-opacity-10 transition-opacity duration-300">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Lawn &<br />
                    Garden
                  </h2>
                  <div 
                    className="bg-[#F97462] text-white font-bold py-2 px-5 rounded-full w-full hover:bg-opacity-90 transition-all inline-block text-center"
                  >
                    SHOP
                  </div>
                </div>
              </div>
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
            SHOP SUMMER
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
                src="/assets/menu/hero/Hero_Aquatic.jpg" 
                alt="Water Plant Fertilizer" 
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-center p-8 md:p-16 rounded-md hover:bg-opacity-10 transition-opacity duration-300">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-2">
                  GROW<br />
                  SOMETHING<br />
                  BEAUTIFUL
                </h1>
                <p className="text-xl md:text-2xl text-white mb-6">SHOP SUMMER COLLECTION</p>
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
                src="/assets/menu/hero/Lawn and Garden Tile Rotated.jpg" 
                alt="Lawn and Garden" 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end items-center p-8 md:p-10 pb-12 hover:bg-opacity-10 transition-opacity duration-300">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Lawn &<br />
                    Garden
                  </h2>
                  <div 
                    className="bg-[#F97462] text-white font-bold py-3 px-8 rounded-full w-full hover:bg-opacity-90 transition-all inline-block text-center"
                  >
                    SHOP
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
