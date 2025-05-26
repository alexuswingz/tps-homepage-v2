import React, { useRef, useEffect, useState } from 'react';

function ComparisonChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const itemWidth = 100; // Width of each competitor item
        const newIndex = Math.round(scrollPosition / itemWidth);
        setActiveIndex(newIndex);
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  const scrollToCompetitor = (index) => {
    if (scrollContainerRef.current) {
      const itemWidth = 100; // Width of each competitor item
      scrollContainerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-6 pb-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose TPS Plant Foods?</h2>
        
        {/* Desktop View (md and up) */}
        <div className="hidden md:grid md:grid-cols-5 gap-1 rounded-lg overflow-hidden relative">
          {/* Horizontal divider lines - starting from column 2 */}
          <div className="absolute w-4/5 right-0 top-32 h-px bg-gray-200 z-10"></div>
          <div className="absolute w-4/5 right-0 top-64 h-px bg-gray-200 z-10"></div>
          <div className="absolute w-4/5 right-0 top-96 h-px bg-gray-200 z-10"></div>
          
          {/* First Column - Feature Labels */}
          <div className="bg-transparent">
            <div className="h-32 flex items-center justify-center"></div>
            <div className="h-32 flex items-center justify-end">
              <h3 className="text-right pr-6 font-bold text-xl md:text-2xl">MICROS &<br />MACROS</h3>
            </div>
            <div className="h-32 flex items-center justify-end">
              <h3 className="text-right pr-6 font-bold text-xl md:text-2xl">SEAWEED<br />ENRICHED</h3>
            </div>
            <div className="h-32 flex items-center justify-end">
              <h3 className="text-right pr-6 font-bold text-xl md:text-2xl">PLANT<br />SPECIFIC<br />DIRECTIONS</h3>
            </div>
          </div>
          
          {/* Second Column - TPS */}
          <div className="relative rounded-t-lg overflow-hidden mb-[-40px] z-20">
            <div className="absolute inset-0 z-0">
              <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                <source src="/assets/watering.mp4" type="video/mp4" />
              </video>
            </div>
            
            <div className="relative z-10">
              <div className="h-32 flex items-center justify-center p-4">
                <img src="/assets/logo/TPS Basic TPS Leaf White.png" alt="TPS Plant Foods" className="max-h-20" />
              </div>
              
              <div className="h-32 flex items-center justify-center">
                <span className="text-white text-5xl">✓</span>
              </div>
              
              <div className="h-32 flex items-center justify-center">
                <span className="text-white text-5xl">✓</span>
              </div>
              
              <div className="h-32 flex items-center justify-center">
                <span className="text-white text-5xl">✓</span>
              </div>
            </div>
            <div className="h-12 bg-green-900/60 rounded-b-lg shadow-lg"></div>
          </div>
          
          {/* Third Column - Competitor 1 (MiracleGro) */}
          <div>
            <div className="h-32 flex items-center justify-center p-4">
              <img src="/assets/logo/miraclegro.png" alt="Miracle Gro" className="max-h-16" />
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✗</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✗</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center rounded-bl-lg">
              <span className="text-white text-5xl">✗</span>
            </div>
          </div>
          
          {/* Fourth Column - Competitor 2 (Espoma) */}
          <div>
            <div className="h-32 flex items-center justify-center p-4">
              <img src="/assets/logo/espoma.png" alt="Espoma Organic" className="max-h-16" />
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✗</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✓</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✗</span>
            </div>
          </div>
          
          {/* Fifth Column - Competitor 3 (Osmocote) */}
          <div>
            <div className="h-32 flex items-center justify-center p-4">
              <img src="/assets/logo/osmocote.png" alt="Osmocote" className="max-h-16" />
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center rounded-tr-lg">
              <span className="text-white text-5xl">✓</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center">
              <span className="text-white text-5xl">✗</span>
            </div>
            
            <div className="h-32 bg-[#febbbb] flex items-center justify-center rounded-br-lg">
              <span className="text-white text-5xl">✗</span>
            </div>
          </div>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden relative">
            {/* Horizontal divider lines - starting from column 2 */}
            <div className="absolute w-2/3 right-0 top-[72px] h-px bg-gray-200 z-10"></div>
            <div className="absolute w-2/3 right-0 top-[144px] h-px bg-gray-200 z-10"></div>
            <div className="absolute w-2/3 right-0 top-[216px] h-px bg-gray-200 z-10"></div>
            
            {/* First Column - Feature Labels */}
            <div className="bg-transparent">
              <div className="h-[72px] flex items-center justify-center"></div>
              <div className="h-[72px] flex items-center justify-end">
                <h3 className="text-right pr-3 font-bold text-sm">MICROS &<br />MACROS</h3>
              </div>
              <div className="h-[72px] flex items-center justify-end">
                <h3 className="text-right pr-3 font-bold text-sm">SEAWEED<br />ENRICHED</h3>
              </div>
              <div className="h-[72px] flex items-center justify-end">
                <h3 className="text-right pr-3 font-bold text-sm">PLANT<br />SPECIFIC<br />DIRECTIONS</h3>
              </div>
            </div>
            
            {/* Second Column - TPS */}
            <div className="relative rounded-t-lg overflow-hidden mb-[-30px] z-20">
              <div className="absolute inset-0 z-0">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/assets/watering.mp4" type="video/mp4" />
                </video>
              </div>
              
              <div className="relative z-10">
                <div className="h-[72px] flex items-center justify-center p-2">
                  <img src="/assets/logo/TPS Basic TPS Leaf White.png" alt="TPS Plant Foods" className="max-h-12" />
                </div>
                
                <div className="h-[72px] flex items-center justify-center">
                  <span className="text-white text-3xl">✓</span>
                </div>
                
                <div className="h-[72px] flex items-center justify-center">
                  <span className="text-white text-3xl">✓</span>
                </div>
                
                <div className="h-[72px] flex items-center justify-center">
                  <span className="text-white text-3xl">✓</span>
                </div>
              </div>
              <div className="h-8 bg-green-900/60 rounded-b-lg shadow-lg"></div>
            </div>
            
            {/* Scrollable competitors section */}
            <div className="overflow-hidden w-[100px] rounded-lg">
              <div 
                ref={scrollContainerRef}
                className="snap-x snap-mandatory flex overflow-x-auto scrollbar-hide scroll-px-[100px] touch-pan-x"> 
                {/* Third Column - Competitor 1 (MiracleGro) */}
                <div className="w-[100px] flex-none snap-center">
                  <div className="h-[72px] flex items-center justify-center p-2">
                    <img src="/assets/logo/miraclegro.png" alt="Miracle Gro" className="max-h-10" />
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center rounded-tr-lg">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center rounded-bl-lg">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                </div>
                
                {/* Fourth Column - Competitor 2 (Espoma) */}
                <div className="w-[100px] flex-none snap-center">
                  <div className="h-[72px] flex items-center justify-center p-2">
                    <img src="/assets/logo/espoma.png" alt="Espoma Organic" className="max-h-10" />
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center rounded-tr-lg">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center">
                    <span className="text-white text-3xl">✓</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                </div>
                
                {/* Fifth Column - Competitor 3 (Osmocote) */}
                <div className="w-[100px] flex-none snap-center">
                  <div className="h-[72px] flex items-center justify-center p-2">
                    <img src="/assets/logo/osmocote.png" alt="Osmocote" className="max-h-10" />
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center rounded-tr-lg">
                    <span className="text-white text-3xl">✓</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                  
                  <div className="h-[72px] bg-[#febbbb] flex items-center justify-center rounded-br-lg">
                    <span className="text-white text-3xl">✗</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scroll indicators */}
            <div className="col-span-3 mt-4 flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <button 
                  key={index}
                  onClick={() => scrollToCompetitor(index)}
                  className={`w-2 h-2 rounded-full ${activeIndex === index ? 'bg-green-600' : 'bg-gray-300'}`}
                  aria-label={`Show competitor ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonChart; 