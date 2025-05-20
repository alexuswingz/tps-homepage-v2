import React, { useRef, useLayoutEffect, useState } from 'react';

const AnimatedLeafDivider = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const reverseContentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [copies, setCopies] = useState(3);

  // Divider content items - matching the image
  const dividerItems = [
    { text: 'SIMPLE FORMULAS', id: 1 },
    { text: '1 MILLION GROWERS SERVED', id: 2 },
    { text: 'FUN AND EASY', id: 3 },
  ];

  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (contentRef.current && containerRef.current && reverseContentRef.current) {
        const contentW = contentRef.current.offsetWidth;
        const containerW = containerRef.current.offsetWidth;
        
        setContentWidth(contentW);
        setContainerWidth(containerW);
        
        // Calculate how many copies we need to fill the screen at least twice
        const neededCopies = Math.ceil((containerW * 2) / contentW) + 1;
        setCopies(Math.max(3, neededCopies));
      }
    };

    updateMeasurements();
    
    // Handle resize
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  // Calculate animation duration based on content length for a consistent speed
  const duration = contentWidth > 0 ? contentWidth / 30 : 25; // Slower speed for better visibility

  // Generate dynamic keyframes for pixel-perfect looping
  const marqueeStyle = contentWidth > 0
    ? `@keyframes divider-scroll-left { 
         0% { transform: translateX(0); } 
         100% { transform: translateX(-${contentWidth}px); }
       }
       @keyframes divider-scroll-right { 
         0% { transform: translateX(-${contentWidth}px); } 
         100% { transform: translateX(0); }
       }`
    : '';

  return (
    <div className="py-6 bg-[#fffbef] overflow-hidden">
      {contentWidth > 0 && (
        <style>{marqueeStyle}</style>
      )}
      <div 
        ref={containerRef} 
        className="relative w-full overflow-hidden"
      >
        {/* First line - left to right */}
        <div
          className="flex items-center whitespace-nowrap mb-4"
          style={contentWidth > 0 ? {
            animation: `divider-scroll-left ${duration}s linear infinite`,
            willChange: 'transform',
          } : {}}
        >
          {/* Original content to measure */}
          <div ref={contentRef} className="flex items-center whitespace-nowrap">
            {dividerItems.map((item) => (
              <div key={`original-${item.id}`} className="flex items-center mx-8 md:mx-12 whitespace-nowrap">
                <img 
                  src="/assets/leaf.png" 
                  alt="Leaf icon" 
                  className="w-6 h-6 md:w-8 md:h-8 object-contain mr-3"
                />
                <span className="text-lg md:text-xl font-bold text-black whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Multiple copies for seamless loop */}
          {Array.from({ length: copies - 1 }).map((_, copyIdx) => (
            <div key={`copy-${copyIdx}`} className="flex items-center whitespace-nowrap">
              {dividerItems.map((item) => (
                <div 
                  key={`copy-${copyIdx}-item-${item.id}`} 
                  className="flex items-center mx-8 md:mx-12 whitespace-nowrap"
                >
                  <img 
                    src="/assets/leaf.png" 
                    alt="Leaf icon" 
                    className="w-6 h-6 md:w-8 md:h-8 object-contain mr-3"
                  />
                  <span className="text-lg md:text-xl font-bold text-black whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Second line - right to left */}
        <div
          className="flex items-center whitespace-nowrap"
          style={contentWidth > 0 ? {
            animation: `divider-scroll-right ${duration}s linear infinite`,
            willChange: 'transform',
          } : {}}
        >
          {/* Original content to measure for reverse direction */}
          <div ref={reverseContentRef} className="flex items-center whitespace-nowrap">
            {dividerItems.map((item) => (
              <div key={`reverse-original-${item.id}`} className="flex items-center mx-8 md:mx-12 whitespace-nowrap">
                <img 
                  src="/assets/leaf.png" 
                  alt="Leaf icon" 
                  className="w-6 h-6 md:w-8 md:h-8 object-contain mr-3"
                />
                <span className="text-lg md:text-xl font-bold text-black whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Multiple copies for seamless loop in reverse direction */}
          {Array.from({ length: copies - 1 }).map((_, copyIdx) => (
            <div key={`reverse-copy-${copyIdx}`} className="flex items-center whitespace-nowrap">
              {dividerItems.map((item) => (
                <div 
                  key={`reverse-copy-${copyIdx}-item-${item.id}`} 
                  className="flex items-center mx-8 md:mx-12 whitespace-nowrap"
                >
                  <img 
                    src="/assets/leaf.png" 
                    alt="Leaf icon" 
                    className="w-6 h-6 md:w-8 md:h-8 object-contain mr-3"
                  />
                  <span className="text-lg md:text-xl font-bold text-black whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLeafDivider; 