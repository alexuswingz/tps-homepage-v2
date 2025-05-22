import React, { useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.css';
import '@glidejs/glide/dist/css/glide.theme.css';

// Custom glide styling
const customStyles = `
.ingredients-slider .glide__slide {
  height: auto;
}
.ingredients-slider .glide__arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.ingredients-slider .glide__arrow {
  position: absolute;
  z-index: 2;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.ingredients-slider .glide__arrow--left {
  left: 10px;
}
.ingredients-slider .glide__arrow--right {
  right: 10px;
}
@media (max-width: 640px) {
  .ingredients-slider .glide__arrows {
    display: none;
  }
}
`;

const IngredientsSlider = () => {
  // Create a ref for the Glide slider
  const sliderRef = useRef(null);
  const glideRef = useRef(null);

  // Ingredients data
  const ingredients = [
    {
      name: "BORON",
      icon: "/assets/Icons/Micronutrients-IconsBoron-Icon.png",
      description: "Boron helps plants develop new growth, flow-ers, and fruits by aiding in cell wall formation and nutrient transport. It's crucial during blooming and pollination stages.",
      deficiencySigns: "Hollow stems, poor flower set, brittle leaves.",
      color: "#F6E486" // Yellow
    },
    {
      name: "COPPER",
      icon: "/assets/Icons/Micronutrients-IconsCopper-Icon.png",
      description: "Copper activates important enzymes and helps strengthen plant tissues. It supports re-production and lignin production, which boosts disease resistance and stem strength.",
      deficiencySigns: "Wilting, poor growth, leaf browning.",
      color: "#FFC69E" // Orange
    },
    {
      name: "IRON",
      icon: "/assets/Icons/Micronutrients-IconsIron-Icon.png",
      description: "Iron is essential for chlorophyll production and helps plants absorb energy from the sun. It supports respiration and healthy metabolism in nutrient-poor soils.",
      deficiencySigns: "Yellowing leaves with green veins (interveinal chlorosis).",
      color: "#FFADAD" // Pink/Light Red
    },
    {
      name: "MANGANESE",
      icon: "/assets/Icons/Micronutrients-IconsManganese-Icon.png",
      description: "Manganese helps with photosynthesis, nitrogen metabolism, and chloroplast development for energy conversion and growth.",
      deficiencySigns: "Pale leaves, reduced growth rate.",
      color: "#E1B0FF" // Purple
    },
    {
      name: "ZINC",
      icon: "/assets/Icons/Micronutrients-IconsZinc-Icon.png",
      description: "Zinc is vital for enzyme function and plant hormone regulation. It promotes healthy growth, flowering, and fruit development.",
      deficiencySigns: "Stunted growth, small leaves, chlorosis between veins.",
      color: "#B2E6D4" // Light Teal
    },
    {
      name: "CALCIUM",
      icon: "/assets/Icons/Micronutrients-IconsCalcium-Icon.png",
      description: "Calcium strengthens cell walls and supports new growth development. It aids in nutrient uptake and overall plant structure.",
      deficiencySigns: "Leaf curling, blossom end rot, weak stems.",
      color: "#9FD8FF" // Light Blue
    },
    {
      name: "MAGNESIUM",
      icon: "/assets/Icons/Micronutrients-IconsMagnesium-Icon.png",
      description: "Magnesium is the central atom in chlorophyll molecules. It's essential for photosynthesis and activates many enzymes needed for growth.",
      deficiencySigns: "Yellowing between leaf veins, older leaves affected first.",
      color: "#B9E69F" // Light Green
    }
  ];

  // Initialize Glide when component mounts
  useEffect(() => {
    // Inject custom CSS
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    if (sliderRef.current && !glideRef.current) {
      // Initialize Glide
      glideRef.current = new Glide(sliderRef.current, {
        type: 'carousel',
        startAt: 0,
        perView: 4,
        gap: 20,
        bound: true,
        peek: { before: 0, after: 100 },
        breakpoints: {
          1280: { perView: 3.5, peek: { before: 0, after: 80 } },
          1024: { perView: 2.5, peek: { before: 0, after: 60 } },
          768: { perView: 1.5, peek: { before: 0, after: 40 } },
          640: { perView: 1, peek: { before: '20%', after: '20%' } }
        }
      });
      
      // Mount Glide after a short delay to ensure DOM is ready
      setTimeout(() => {
        glideRef.current.mount();
      }, 100);
    }

    return () => {
      // Cleanup Glide instance on unmount
      if (glideRef.current) {
        glideRef.current.destroy();
      }
      // Remove the style element
      if (styleSheet.parentNode) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  return (
    <section className="bg-[#fffbef] w-full overflow-hidden py-12 ingredients-slider">
      {/* Centered heading */}
      <div className="w-full text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#FF5757]">
          What's Inside?
        </h2>
      </div>

      {/* Full width slider */}
      <div className="glide w-full" ref={sliderRef}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {ingredients.map((ingredient, index) => (
              <li 
                key={index} 
                className="glide__slide"
              >
                <div 
                  className="rounded-xl overflow-hidden h-full"
                  style={{ backgroundColor: ingredient.color, height: '100%' }}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <img 
                          src={ingredient.icon} 
                          alt={ingredient.name}
                          className="w-10 h-10 object-contain" 
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{ingredient.name}</h3>
                    </div>
                    
                    <p className="mb-4 text-gray-800 leading-relaxed">
                      {ingredient.description}
                    </p>
                    
                    <div>
                      <h4 className="font-bold mb-1">Deficiency Signs:</h4>
                      <p className="text-gray-800">{ingredient.deficiencySigns}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation arrows */}
        <div className="glide__arrows" data-glide-el="controls">
          <button 
            className="glide__arrow glide__arrow--left bg-white rounded-full p-2 shadow-md"
            data-glide-dir="<"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            className="glide__arrow glide__arrow--right bg-white rounded-full p-2 shadow-md"
            data-glide-dir=">"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Bullets for mobile */}
        <div className="glide__bullets mt-4 flex justify-center md:hidden" data-glide-el="controls[nav]">
          {ingredients.map((_, index) => (
            <button 
              key={index}
              className="glide__bullet mx-1 w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400"
              data-glide-dir={`=${index}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IngredientsSlider; 