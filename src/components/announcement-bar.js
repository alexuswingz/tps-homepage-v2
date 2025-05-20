import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

const messages = [
  'Free Shipping Over $15',
  'Buy 3 Save $10',
];

const AnnouncementBar = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (contentRef.current && containerRef.current) {
        const contentW = contentRef.current.offsetWidth;
        const containerW = containerRef.current.offsetWidth;
        
        setContentWidth(contentW);
        setContainerWidth(containerW);
        
        // Calculate how many copies we need to fill the screen at least twice
        // (ensuring we always have content visible during animation)
        const neededCopies = Math.ceil((containerW * 2) / contentW) + 1;
        setCopies(Math.max(2, neededCopies));
      }
    };

    updateMeasurements();
    
    // Handle resize
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  // Calculate animation duration based on content length for a consistent speed feeling
  const duration = contentWidth > 0 ? contentWidth / 50 : 16; // 50px per second

  // Generate dynamic keyframes for pixel-perfect looping
  const marqueeStyle = contentWidth > 0
    ? `@keyframes marquee-scroll { 
         0% { transform: translateX(0); } 
         100% { transform: translateX(-${contentWidth}px); }
       }`
    : '';

  return (
    <div className="bg-coral-500 text-white py-3 overflow-hidden font-bold tracking-wide">
      {contentWidth > 0 && (
        <style>{marqueeStyle}</style>
      )}
      <div 
        ref={containerRef} 
        className="relative w-full overflow-hidden"
      >
        <div
          className="flex whitespace-nowrap"
          style={contentWidth > 0 ? {
            animation: `marquee-scroll ${duration}s linear infinite`,
            willChange: 'transform',
          } : {}}
        >
          {/* Original content to measure */}
          <div ref={contentRef} className="flex">
            {messages.map((msg, idx) => (
              <div key={`original-${idx}`} className="px-8 uppercase">{msg}</div>
            ))}
          </div>
          
          {/* Multiple copies for seamless loop */}
          {Array.from({ length: copies - 1 }).map((_, copyIdx) => (
            <div key={`copy-${copyIdx}`} className="flex">
              {messages.map((msg, msgIdx) => (
                <div 
                  key={`copy-${copyIdx}-msg-${msgIdx}`} 
                  className="px-8 uppercase"
                >
                  {msg}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
