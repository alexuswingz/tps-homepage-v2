import React from 'react';
import { Link } from 'react-router-dom';

function MonsteraProductSection() {
  return (
    <section className="py-8 md:py-16 bg-[#fffbef] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="relative">
          <div className="w-full">
            <img 
              src="/assets/unnamed.png" 
              alt="Monstera Plant Food" 
              className="w-full h-[300px] md:h-[600px] object-cover object-center rounded-lg"
            />
            <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 flex flex-col items-end">
              <h2 className="text-4xl md:text-7xl font-bold text-white text-right leading-none md:leading-tight tracking-wide mb-4 md:mb-8" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                GROW<br />
                PLANTS<br />
                FEEL<br />
                GOOD
              </h2>
              <Link 
                to="/products"
                className="inline-block bg-[#ff7e78] text-white px-5 md:px-8 py-2 md:py-2.5 rounded-full text-base md:text-base font-medium hover:bg-[#ff6c65] transition-colors uppercase"
              >
                Shop All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MonsteraProductSection; 