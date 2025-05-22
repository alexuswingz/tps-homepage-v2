import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BuildBundleSection = () => {
  const scrollRef = useRef(null);
  const [productImages, setProductImages] = useState([]);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollIntervalRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  useEffect(() => {
    // Include all product images from the folder
    const images = [
      // Main popular products
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Orchid_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Monstera_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fiddle_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Succulent_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Hydroponic_Nutrients_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Snake Plant_8oz_Wrap.png',

      // Trees
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Palm Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Olive Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Money Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Lemon Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fruit Trees_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Banana Tree_8oz_Wrap.png',

      // Flowers
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Plumeria_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Rhododendron_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Hydrangea_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Hibiscus_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Gardenia_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Rose_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Azalea_8oz_Wrap.png',
      
      // Other plants
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Strawberry_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Herb_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Ficus_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Evergreen_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Citrus_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Christmas Cactus_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Cactus_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Bonsai_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Blueberry_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Bird of Paradise_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Air Plant_8oz_Wrap.png',

      // Specialty items
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Plant Food_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Water Plant Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Lotus_Fert_8oz_Wrap.png',

      // All other products to ensure we include everything
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_African Violet_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Arborvitae_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Apple Tree_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Canopy_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Kratky Hydro Nutrients_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Lawn_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Root Boost_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Tomato_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Ivy Plant Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Winter Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Water Soluble Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Water Garden Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Vegetable Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Tulip Bulb Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Tree and Shrub Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Sulfate of Potash_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Shrub Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Sago Palm Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Rose Bush_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Pumpkin Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Potato Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Potassium Sulfate Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Potassium Nitrate Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Potash Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Plant Food Outdoor_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Plant Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Pitcher Plant Food_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Pine Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Phos & Potash Fertilizer_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Petunia Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Pepper Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Peace Lily Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Orange Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Oak Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Muriate of Potash_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Mum Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Maple Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Magnolia Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Lucky Bamboo Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Lilac Bush Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Japanese Maple Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Ixora Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Instant Plant Food_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Hoya Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Hanging Basket Plant Food_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Geranium Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Garlic Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Garden Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Flowering Plant Food_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fish Fertilizer_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fish Emulsion Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Jardin_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Rosas_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Plantas_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Plantas De Interior_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Orquideas_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Bonsai_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fertilizante Para Arboles Frutales_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Ferrous Sulfate for Plants_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fall Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Elephant Ear Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Dogwood Tree Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Desert Rose Fert_8oz_Wrap.png',
      '/assets/products/TPS_8oz_Wrap_PNG/TPS_Daffodil Bulb Fert_8oz_Wrap.png'
    ];
    
    // Make sure the images array has unique items
    const uniqueImages = Array.from(new Set(images));
    setProductImages(uniqueImages);
  }, []);

  // Setup scrolling function
  const startAutoScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || productImages.length === 0) return;

    let scrollAmount = 0;
    const scrollSpeed = 1.2; // Base speed factor - higher = faster

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      
      if (scrollContainer && !isUserInteracting) {
        // Use requestAnimationFrame's timestamp for smoother animation
        const pixelsToScroll = (elapsed / 16) * scrollSpeed;
        
        // Use transform instead of scrollLeft for smoother GPU-accelerated animation
        scrollAmount += pixelsToScroll;
        
        // Apply the transform to all direct children for smooth movement
        Array.from(scrollContainer.children).forEach(child => {
          child.style.transform = `translateX(${-scrollAmount}px)`;
        });

        // Reset scroll position to create seamless infinite loop effect
        if (scrollAmount >= (scrollContainer.scrollWidth / 3)) {
          scrollAmount = 0;
          Array.from(scrollContainer.children).forEach(child => {
            child.style.transform = `translateX(0px)`;
          });
        }
      }
      
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  };

  // Auto-scrolling effect with improved infinite loop and user interaction handling
  useEffect(() => {
    const cleanup = startAutoScroll();
    return () => {
      if (cleanup) cleanup();
    };
  }, [productImages, isUserInteracting]);

  // Handle user interaction
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleInteractionStart = () => {
      setIsUserInteracting(true);
      clearTimeout(interactionTimeoutRef.current);
    };

    const handleInteractionEnd = () => {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, 1500); // Resume auto-scroll 1.5 seconds after user stops interacting
    };

    // Add event listeners for different interaction types
    scrollContainer.addEventListener('mousedown', handleInteractionStart);
    scrollContainer.addEventListener('touchstart', handleInteractionStart);
    scrollContainer.addEventListener('wheel', handleInteractionStart);
    
    scrollContainer.addEventListener('mouseup', handleInteractionEnd);
    scrollContainer.addEventListener('mouseleave', handleInteractionEnd);
    scrollContainer.addEventListener('touchend', handleInteractionEnd);
    scrollContainer.addEventListener('touchcancel', handleInteractionEnd);
    scrollContainer.addEventListener('wheel', handleInteractionEnd, { passive: true });

    // Cleanup function
    return () => {
      scrollContainer.removeEventListener('mousedown', handleInteractionStart);
      scrollContainer.removeEventListener('touchstart', handleInteractionStart);
      scrollContainer.removeEventListener('wheel', handleInteractionStart);
      
      scrollContainer.removeEventListener('mouseup', handleInteractionEnd);
      scrollContainer.removeEventListener('mouseleave', handleInteractionEnd);
      scrollContainer.removeEventListener('touchend', handleInteractionEnd);
      scrollContainer.removeEventListener('touchcancel', handleInteractionEnd);
      scrollContainer.removeEventListener('wheel', handleInteractionEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(interactionTimeoutRef.current);
    };
  }, []);

  // Error handling for images
  const handleImageError = (e) => {
    // Replace with a default image
    e.target.src = '/assets/products/TPS_8oz_Wrap_PNG/TPS_Plant Food_8oz_Wrap.png';
    e.target.classList.add('error-image');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 md:py-12 lg:py-24">
      <div 
        className="relative w-full rounded-lg overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/Build Bundle Ad Background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="py-8 md:py-12 lg:py-16 px-4 md:px-8">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-2">
              Create your own <span className="text-[#F97462]">bundle!</span>
            </h2>
          </div>

          {/* Product Carousel - Made larger but maintaining section height */}
          <div className="relative overflow-hidden px-1">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-0 py-4 cursor-grab active:cursor-grabbing"
              style={{ 
                scrollBehavior: 'smooth', 
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                willChange: 'transform', // Optimize for animations
                position: 'relative'
              }}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.preventDefault();
                  // User manually scrolling - will be handled by interaction events
                }
              }}
            >
              {/* Duplicate products for infinite loop effect - triple the products for smoother looping */}
              {[...productImages, ...productImages, ...productImages].map((image, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[145px] md:w-[125px] lg:w-[140px] xl:w-[155px] mr-5 md:mr-4 lg:mr-6"
                >
                  <div className="relative flex justify-center items-center">
                    <img 
                      src={image} 
                      alt={`Plant Food Product ${index + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ 
                        maxHeight: '480px', 
                        minHeight: '430px',
                        transform: 'scale(3) translateX(-2%)',
                        transformOrigin: 'center 45%',
                        objectPosition: 'center 45%',
                        objectFit: 'contain'
                      }}
                      onError={handleImageError}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-6 md:mt-10">
            <Link to="/build-bundle">
              <button className="bg-[#F97462] text-white font-bold py-4 px-16 md:px-20 rounded-full text-xl hover:bg-opacity-90 transition-all">
                BUILD A BUNDLE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildBundleSection;
