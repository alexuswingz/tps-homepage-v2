import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { fetchProductsByCategory as fetchProductsByCategoryAPI } from '../utils/shopifyApi';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

// Custom styles for Swiper
const swiperStyles = `
  .products-swiper {
    padding: 20px 10px 40px !important;
    margin: -20px -10px -40px;
  }
  
  .swiper-pagination {
    bottom: 0 !important;
  }
  
  .swiper-pagination-bullet {
    background: #ff6b6b !important;
    opacity: 0.5;
  }
  
  .swiper-pagination-bullet-active {
    opacity: 1;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: #ff6b6b !important;
  }
  
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 24px;
    font-weight: bold;
  }
  
  .swiper-button-disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    .products-swiper {
      padding: 10px 5px 30px !important;
      margin: -10px -5px -30px;
    }
  }
`;

const ShopByPlantSimple = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Houseplant Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const glideRef = useRef(null);

  // Hook to detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize Glide
  useEffect(() => {
    if (products.length > 0 && glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'slider',
        bound: true,
        rewind: false,
        gap: 24,
        perView: isMobile ? 2 : 3.5,
        breakpoints: {
          640: {
            perView: 2,
            gap: 12
          }
        }
      });

      glide.mount();

      return () => {
        glide.destroy();
      };
    }
  }, [products, isMobile]);

  // Background gradient styles for each product card (same as ProductsPage)
  const cardBackgrounds = [
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]'  // Default light blue color
  ];

  // Product categories with their respective images
  const categories = [
    {
      name: "HOUSE\nPLANTS",
      image: "/assets/Collection Tiles Images/Houseplants Tile.jpg",
      category: "Houseplant Products",
      description: "Specialized nutrition for your indoor plants"
    },
    {
      name: "LAWN &\nGARDEN",
      image: "/assets/Collection Tiles Images/Lawn and Garden Tile.jpg",
      category: "Garden Products",
      description: "Essential nutrients for outdoor plants"
    },
    {
      name: "HYDRO &\nAQUATIC",
      image: "/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg",
      category: "Hydrophonic and Aquatic",
      description: "Solutions for water-based plant systems"
    },
    {
      name: "SPECIALTY\nSUPPLEMENTS",
      image: "/assets/Collection Tiles Images/Specialty Supplements Title.jpg",
      category: "Plant Supplements",
      description: "Advanced formulas for specific needs"
    },
    {
      name: "CURATED\nBUNDLES",
      image: "/assets/menu/Bundle Builder Tile.jpg",
      category: "Bundles",
      description: "Pre-selected combinations for optimal results"
    }
  ];

  // Helper function to get alternating background (same as ProductsPage)
  const getCategoryBackground = (index) => {
    const backgroundIndex = index % cardBackgrounds.length;
    return cardBackgrounds[backgroundIndex];
  };

  // Function to format product name as single line
  const formatProductName = (name) => {
    const upperName = name.toUpperCase();
    
    return (
      <div className="product-name-container h-8 flex items-center mb-3">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight tracking-tight w-full truncate">
          {upperName}
        </h3>
      </div>
    );
  };

  // Function to render star ratings (same as ProductsPage)
  const renderStars = () => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-[#ff6b57] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  // Generate random rating for demo purposes
  const generateRandomRating = () => {
    return (Math.random() * (5 - 4) + 4).toFixed(1);
  };

  // Product card component (exactly same as ProductsPage)
  const ProductCard = ({ product, index }) => {
    // State to track selected variant
    const [selectedVariant, setSelectedVariant] = useState(null);
    // State for dropdown open/close
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // State to prevent double-clicks
    const [isAdding, setIsAdding] = useState(false);
    // State for image loading
    const [imageError, setImageError] = useState(false);
    // Ref for dropdown container
    const dropdownRef = useRef(null);
    
    // Initialize selected variant on component mount
    useEffect(() => {
      // Find first available variant or default to first variant
      const initialVariant = product.variants.find(variant => variant.available) || product.variants[0];
      setSelectedVariant(initialVariant);
    }, [product.variants]);
    
    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      
      // Add event listener when dropdown is open
      if (dropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      // Cleanup
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [dropdownOpen]);
    
    // Get active variant (selected or first available)
    const activeVariant = selectedVariant || (product.variants.find(variant => variant.available) || product.variants[0]);
    
    const handleAddToCart = async (e) => {
      e.stopPropagation(); // Prevent navigation when clicking add to cart
      
      // Prevent double-clicks
      if (isAdding) {
        return;
      }
      
      if (activeVariant && activeVariant.available) {
        setIsAdding(true);
        
        try {
          addToCart(product, activeVariant, 1);
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
        
        // Reset the adding state after a delay
        setTimeout(() => {
          setIsAdding(false);
        }, 1000);
      }
    };
    
    const handleCardClick = () => {
      // Extract the numeric ID portion from the Shopify ID format
      let id = product.id;
      
      // Check if the ID is in Shopify's gid format and extract just the numeric part
      if (typeof id === 'string' && id.includes('gid://shopify/Product/')) {
        id = id.split('/').pop();
      }
      
      navigate(`/product/${id}`);
    };
    
    const selectVariant = (variant) => {
      setSelectedVariant(variant);
      setDropdownOpen(false);
    };

    // Handle image error
    const handleImageError = () => {
      setImageError(true);
    };

    // Get image source with fallback
    const getImageSrc = () => {
      if (imageError) {
        return "/assets/products/placeholder.png";
      }
      
      // Ensure the image URL is properly formatted
      let imageSrc = product.image;
      if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
        imageSrc = `https:${imageSrc}`;
      }
      
      return imageSrc || "/assets/products/placeholder.png";
    };
    
    // Only show dropdown if there are multiple variants
    const hasMultipleVariants = product.variants.length > 1;
    
    return (
      <div 
        className={`${getCategoryBackground(index)} rounded-lg overflow-hidden shadow-sm relative cursor-pointer`}
        onClick={handleCardClick}
        style={{ overflow: 'visible' }}
      >
        {product.bestSeller && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#ff6b57] text-white font-bold py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm z-10">
            BEST SELLER!
          </div>
        )}
        
        <div className="p-3 sm:p-6" style={{ overflow: 'visible' }}>
          <div className="relative h-32 sm:h-48 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <img 
              src={getImageSrc()}
              alt={product.name} 
              className="h-full w-auto object-contain"
              style={{ backgroundColor: 'transparent' }}
              onError={handleImageError}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">Image not available</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800 text-xs sm:text-sm font-medium">{product.rating || generateRandomRating()}</span>
              {renderStars()}
              <span className="text-gray-600 text-xs sm:text-sm">({product.reviews})</span>
            </div>
          </div>
          
          {formatProductName(product.name)}
          
          {/* Variant selection dropdown */}
          <div className="relative mb-1 sm:mb-2" ref={dropdownRef} style={{ zIndex: dropdownOpen ? 50 : 'auto' }}>
            <div 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when clicking dropdown
                if (hasMultipleVariants) setDropdownOpen(!dropdownOpen);
              }}
              className={`flex justify-between items-center ${hasMultipleVariants ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center border border-gray-300 rounded-full bg-white relative overflow-hidden w-full">
                <div className="w-[55%] sm:w-[65%] p-2 pl-4 text-xs sm:text-sm truncate">
                  <span className="font-medium">{activeVariant?.title || '8 Ounces'}</span>
                </div>
                
                <div className="h-5 border-l border-gray-300"></div>
                
                <div className="w-[45%] sm:w-[35%] p-2 pr-8 sm:pr-10 text-center text-xs sm:text-sm">
                  <span className="font-medium">${activeVariant ? activeVariant.price.toFixed(2) : product.price.toFixed(2)}</span>
                </div>
                
                {hasMultipleVariants && (
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {hasMultipleVariants && (
                  <div className={`absolute inset-0 bg-gray-100 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 ${dropdownOpen ? 'bg-opacity-20' : ''}`}></div>
                )}
              </div>
            </div>
            
            {/* Dropdown options */}
            {hasMultipleVariants && dropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                {product.variants.map((variant, idx) => (
                  <div 
                    key={variant.id || idx}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      selectVariant(variant);
                    }}
                    className={`p-2 px-4 text-xs sm:text-sm cursor-pointer transition-colors duration-150
                      ${!variant.available ? 'text-gray-400 hover:bg-gray-50' : 'hover:bg-gray-100'}
                      ${activeVariant?.id === variant.id ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{variant.title}</span>
                      <span>${variant.price.toFixed(2)}</span>
                    </div>
                    {!variant.available && (
                      <span className="text-xs text-red-500 block mt-1">Out of stock</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="border border-gray-200 rounded-full bg-white p-2 sm:p-2.5 mb-3 sm:mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs sm:text-base pl-1.5 sm:pl-2 text-gray-800">{activeVariant?.title || '8 Ounce'}</span>
                <span className="bg-[#f3e6e0] px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-base text-gray-800">
                  ${activeVariant ? activeVariant.price.toFixed(2) : product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-full font-bold text-xs sm:text-base py-2 sm:py-2.5 px-3 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center
              ${activeVariant && activeVariant.available 
                ? 'bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white shadow-sm' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!activeVariant || !activeVariant.available}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            ADD TO CART
          </button>
        </div>
      </div>
    );
  };

  // Get top 5 product names by category from the data files
  const getTop5ProductNamesByCategory = (category) => {
    const categoryProductNames = {
      "Houseplant Products": [
        "Monstera Plant Food",
        "Indoor Plant Food", 
        "Fiddle Leaf Fig Plant Food",
        "Christmas Cactus Fertilizer",
        "Bird of Paradise Fertilizer"
      ],
      "Hydrophonic and Aquatic": [
        "Liquid Plant Food",
        "Lotus Fertilizer", 
        "Hydroponic Nutrients",
        "Aquatic Plant Fertilizer",
        "Water Plant Fertilizer"
      ],
      "Garden Products": [
        "Hydrangea Fertilizer",
        "Lemon Tree Fertilizer", 
        "Gardenia Fertilizer",
        "Hibiscus Fertilizer",
        "Arborvitae Tree Fertilizer"
      ],
      "Plant Supplements": [
        "Ferrous Sulfate For Plants",
        "Silica for Plants", 
        "Fish Emulsion Fertilizer",
        "Calcium for Plants",
        "Potassium Fertilizer"
      ]
    };

    return categoryProductNames[category] || [];
  };

  // Filter products to ensure they belong to the correct category
  const filterProductsByCategory = (products, category, targetNames = []) => {
    return products.filter(product => {
      const productName = product.name.toLowerCase();
      
      // First check if the product name matches any of our target names exactly
      if (targetNames.length > 0) {
        const isTargetProduct = targetNames.some(targetName => {
          const targetLower = targetName.toLowerCase();
          return productName.includes(targetLower) || 
                 targetLower.includes(productName) ||
                 productName === targetLower;
        });
        if (isTargetProduct) return true;
      }
      
      // Category-specific filtering with more precise rules
      switch (category) {
        case "Houseplant Products":
          return (
            productName.includes('indoor') ||
            productName.includes('houseplant') ||
            productName.includes('monstera') ||
            productName.includes('fiddle') ||
            productName.includes('christmas cactus') ||
            productName.includes('bird of paradise') ||
            productName.includes('succulent') ||
            productName.includes('snake plant') ||
            productName.includes('orchid') ||
            productName.includes('fern') ||
            productName.includes('bonsai') ||
            productName.includes('money tree') ||
            productName.includes('pothos') ||
            productName.includes('philodendron') ||
            productName.includes('african violet') ||
            productName.includes('air plant') ||
            productName.includes('peace lily')
          ) && !productName.includes('garden') && !productName.includes('lawn') && !productName.includes('outdoor');
          
        case "Garden Products":
          return (
            productName.includes('hydrangea') ||
            productName.includes('lemon tree') ||
            productName.includes('gardenia') ||
            productName.includes('hibiscus') ||
            productName.includes('arborvitae') ||
            productName.includes('citrus') ||
            productName.includes('tomato') ||
            productName.includes('rose') ||
            productName.includes('lawn') ||
            productName.includes('garden') ||
            productName.includes('tree') ||
            productName.includes('fruit') ||
            productName.includes('vegetable') ||
            productName.includes('outdoor')
          ) && !productName.includes('indoor') && !productName.includes('houseplant') && !productName.includes('hydroponic');
          
        case "Hydrophonic and Aquatic":
          return (
            productName.includes('liquid plant') ||
            productName.includes('lotus') ||
            productName.includes('hydroponic') ||
            productName.includes('aquatic') ||
            productName.includes('water plant') ||
            productName.includes('water garden')
          );
          
        case "Plant Supplements":
          return (
            productName.includes('ferrous sulfate') ||
            productName.includes('silica for plants') ||
            productName.includes('fish emulsion') ||
            productName.includes('calcium for plants') ||
            productName.includes('potassium fertilizer') ||
            productName.includes('supplement') ||
            productName.includes('nitrogen') ||
            productName.includes('phosphorus') ||
            productName.includes('root supplement') ||
            productName.includes('compost') ||
            productName.includes('seaweed')
          ) && !productName.includes('tree') && !productName.includes('garden');
          
        default:
          return false;
      }
    });
  };

  // Category-specific search when exact names don't work
  const searchProductsForCategory = async (category) => {
    const { searchProductsByName } = await import('../utils/shopifyApi');
    
    let searchResults = [];
    
    // Use very specific search terms for each category
    const categorySearchTerms = {
      "Houseplant Products": ["monstera", "fiddle leaf", "indoor plant", "christmas cactus", "bird of paradise"],
      "Garden Products": ["hydrangea", "lemon tree", "gardenia", "hibiscus", "arborvitae"],
      "Hydrophonic and Aquatic": ["liquid plant food", "lotus fertilizer", "hydroponic nutrients", "aquatic plant", "water plant"],
      "Plant Supplements": ["ferrous sulfate", "silica plants", "fish emulsion", "calcium plants", "potassium fertilizer"]
    };
    
    const searchTerms = categorySearchTerms[category] || ["plant"];
    
    for (const term of searchTerms) {
      try {
        const results = await searchProductsByName(term, 5);
        const filteredResults = filterProductsByCategory(results, category);
        searchResults.push(...filteredResults);
        
        if (searchResults.length >= 5) break;
      } catch (error) {
        console.error(`Error searching with term "${term}":`, error);
      }
    }
    
    // Remove duplicates and return top 5
    const uniqueResults = searchResults.filter((product, index, array) => 
      array.findIndex(p => p.id === product.id) === index
    );
    
    return uniqueResults.slice(0, 5);
  };

  // Fallback products for each category
  const getFallbackProductsForCategory = (category) => {
    const fallbackProducts = {
      "Houseplant Products": [
        {
          id: 'fallback-monstera-hp',
          name: 'Monstera Plant Food',
          description: 'Premium nutrition for Monstera plants',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 1458,
          rating: 4.9,
          bestSeller: true,
          category: "Houseplant Products",
          variants: [{ id: 'var-hp-1', title: '8 Ounce', price: 14.99, available: true, quantity: 100 }]
        },
        {
          id: 'fallback-indoor-hp',
          name: 'Indoor Plant Food',
          description: 'All-purpose indoor plant nutrition',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 1203,
          rating: 4.8,
          bestSeller: false,
          category: "Houseplant Products",
          variants: [{ id: 'var-hp-2', title: '8 Ounce', price: 14.99, available: true, quantity: 200 }]
        },
        {
          id: 'fallback-fiddle-hp',
          name: 'Fiddle Leaf Fig Plant Food',
          description: 'Specialized nutrition for fiddle leaf figs',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 987,
          rating: 4.8,
          bestSeller: false,
          category: "Houseplant Products",
          variants: [{ id: 'var-hp-3', title: '8 Ounce', price: 14.99, available: true, quantity: 150 }]
        },
        {
          id: 'fallback-cactus-hp',
          name: 'Christmas Cactus Fertilizer',
          description: 'Perfect for holiday cacti',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 742,
          rating: 4.7,
          bestSeller: false,
          category: "Houseplant Products",
          variants: [{ id: 'var-hp-4', title: '8 Ounce', price: 14.99, available: true, quantity: 120 }]
        },
        {
          id: 'fallback-bird-hp',
          name: 'Bird of Paradise Fertilizer',
          description: 'Tropical plant nutrition',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 623,
          rating: 4.6,
          bestSeller: false,
          category: "Houseplant Products",
          variants: [{ id: 'var-hp-5', title: '8 Ounce', price: 14.99, available: true, quantity: 90 }]
        }
      ],
      "Garden Products": [
        {
          id: 'fallback-hydrangea-gp',
          name: 'Hydrangea Fertilizer',
          description: 'Color-enhancing nutrition for hydrangeas',
          image: '/assets/products/placeholder.png',
          price: 16.99,
          reviews: 1156,
          rating: 4.8,
          bestSeller: true,
          category: "Garden Products",
          variants: [{ id: 'var-gp-1', title: '16 Ounce', price: 16.99, available: true, quantity: 120 }]
        },
        {
          id: 'fallback-lemon-gp',
          name: 'Lemon Tree Fertilizer',
          description: 'Citrus-specific nutrition for healthy fruit production',
          image: '/assets/products/placeholder.png',
          price: 18.99,
          reviews: 943,
          rating: 4.9,
          bestSeller: false,
          category: "Garden Products",
          variants: [{ id: 'var-gp-2', title: '16 Ounce', price: 18.99, available: true, quantity: 85 }]
        },
        {
          id: 'fallback-gardenia-gp',
          name: 'Gardenia Fertilizer',
          description: 'Specialized nutrition for fragrant gardenias',
          image: '/assets/products/placeholder.png',
          price: 17.99,
          reviews: 678,
          rating: 4.7,
          bestSeller: false,
          category: "Garden Products",
          variants: [{ id: 'var-gp-3', title: '8 Ounce', price: 17.99, available: true, quantity: 65 }]
        },
        {
          id: 'fallback-hibiscus-gp',
          name: 'Hibiscus Fertilizer',
          description: 'Bloom-boosting nutrition for hibiscus plants',
          image: '/assets/products/placeholder.png',
          price: 15.99,
          reviews: 512,
          rating: 4.6,
          bestSeller: false,
          category: "Garden Products",
          variants: [{ id: 'var-gp-4', title: '8 Ounce', price: 15.99, available: true, quantity: 95 }]
        },
        {
          id: 'fallback-arborvitae-gp',
          name: 'Arborvitae Tree Fertilizer',
          description: 'Evergreen nutrition for healthy growth',
          image: '/assets/products/placeholder.png',
          price: 19.99,
          reviews: 445,
          rating: 4.8,
          bestSeller: false,
          category: "Garden Products",
          variants: [{ id: 'var-gp-5', title: '24 Ounce', price: 19.99, available: true, quantity: 40 }]
        }
      ],
      "Hydrophonic and Aquatic": [
        {
          id: 'fallback-liquid-ha',
          name: 'Liquid Plant Food',
          description: 'Concentrated liquid nutrition for all plants',
          image: '/assets/products/placeholder.png',
          price: 18.99,
          reviews: 723,
          rating: 4.7,
          bestSeller: true,
          category: "Hydrophonic and Aquatic",
          variants: [{ id: 'var-ha-1', title: '16 Ounce', price: 18.99, available: true, quantity: 90 }]
        },
        {
          id: 'fallback-lotus-ha',
          name: 'Lotus Fertilizer',
          description: 'Specialized nutrition for lotus and water lilies',
          image: '/assets/products/placeholder.png',
          price: 22.99,
          reviews: 412,
          rating: 4.8,
          bestSeller: false,
          category: "Hydrophonic and Aquatic",
          variants: [{ id: 'var-ha-2', title: '8 Ounce', price: 22.99, available: true, quantity: 35 }]
        },
        {
          id: 'fallback-hydroponic-ha',
          name: 'Hydroponic Nutrients',
          description: 'Complete nutrient solution for hydroponic systems',
          image: '/assets/products/placeholder.png',
          price: 24.99,
          reviews: 567,
          rating: 4.9,
          bestSeller: false,
          category: "Hydrophonic and Aquatic",
          variants: [{ id: 'var-ha-3', title: '32 Ounce', price: 24.99, available: true, quantity: 25 }]
        },
        {
          id: 'fallback-aquatic-ha',
          name: 'Aquatic Plant Fertilizer',
          description: 'Safe nutrition for aquarium and pond plants',
          image: '/assets/products/placeholder.png',
          price: 19.99,
          reviews: 289,
          rating: 4.6,
          bestSeller: false,
          category: "Hydrophonic and Aquatic",
          variants: [{ id: 'var-ha-4', title: '8 Ounce', price: 19.99, available: true, quantity: 55 }]
        },
        {
          id: 'fallback-water-ha',
          name: 'Water Plant Fertilizer',
          description: 'General purpose fertilizer for water gardens',
          image: '/assets/products/placeholder.png',
          price: 17.99,
          reviews: 334,
          rating: 4.5,
          bestSeller: false,
          category: "Hydrophonic and Aquatic",
          variants: [{ id: 'var-ha-5', title: '8 Ounce', price: 17.99, available: true, quantity: 70 }]
        }
      ],
      "Plant Supplements": [
        {
          id: 'fallback-ferrous-ps',
          name: 'Ferrous Sulfate For Plants',
          description: 'Iron supplement for greener, healthier plants',
          image: '/assets/products/placeholder.png',
          price: 11.99,
          reviews: 834,
          rating: 4.7,
          bestSeller: true,
          category: "Plant Supplements",
          variants: [{ id: 'var-ps-1', title: '8 Ounce', price: 11.99, available: true, quantity: 110 }]
        },
        {
          id: 'fallback-silica-ps',
          name: 'Silica for Plants',
          description: 'Strengthening supplement for plant structure',
          image: '/assets/products/placeholder.png',
          price: 13.99,
          reviews: 667,
          rating: 4.6,
          bestSeller: false,
          category: "Plant Supplements",
          variants: [{ id: 'var-ps-2', title: '4 Ounce', price: 13.99, available: true, quantity: 75 }]
        },
        {
          id: 'fallback-fish-ps',
          name: 'Fish Emulsion Fertilizer',
          description: 'Organic fish-based plant nutrition',
          image: '/assets/products/placeholder.png',
          price: 14.99,
          reviews: 589,
          rating: 4.8,
          bestSeller: false,
          category: "Plant Supplements",
          variants: [{ id: 'var-ps-3', title: '16 Ounce', price: 14.99, available: true, quantity: 60 }]
        },
        {
          id: 'fallback-calcium-ps',
          name: 'Calcium for Plants',
          description: 'Essential calcium supplement for plant health',
          image: '/assets/products/placeholder.png',
          price: 12.99,
          reviews: 423,
          rating: 4.5,
          bestSeller: false,
          category: "Plant Supplements",
          variants: [{ id: 'var-ps-4', title: '8 Ounce', price: 12.99, available: true, quantity: 85 }]
        },
        {
          id: 'fallback-potassium-ps',
          name: 'Potassium Fertilizer',
          description: 'Potassium boost for flowering and fruiting',
          image: '/assets/products/placeholder.png',
          price: 13.49,
          reviews: 356,
          rating: 4.7,
          bestSeller: false,
          category: "Plant Supplements",
          variants: [{ id: 'var-ps-5', title: '8 Ounce', price: 13.49, available: true, quantity: 90 }]
        }
      ]
    };

    return fallbackProducts[category] || fallbackProducts["Houseplant Products"];
  };

  // Fetch products from Shopify API using the ranked data files
  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    
    try {
      console.log(`Fetching products for category: ${category}`);
      
      let productData = [];
      
      // Get top 5 product names for the category
      const top5Names = getTop5ProductNamesByCategory(category);
      
      if (top5Names.length > 0) {
        // Import the fetchProductsByNames function and fetch these specific products
        const { fetchProductsByNames } = await import('../utils/shopifyApi');
        productData = await fetchProductsByNames(top5Names);
        
        console.log(`Found ${productData.length} products from Shopify API for ${category}`);
        
        // Filter products to ensure they match the category
        productData = filterProductsByCategory(productData, category, top5Names);
        console.log(`After filtering: ${productData.length} products match category ${category}`);
        
        // If we didn't get all 5 products, try to get more from the full data file
        if (productData.length < 5) {
          console.log(`Only found ${productData.length} products, trying to get more from full data file...`);
          
          try {
            let allCategoryProducts = [];
            switch (category) {
              case "Houseplant Products":
                const { fetchAllHouseplantProducts } = await import('../data/houseplantProducts');
                allCategoryProducts = await fetchAllHouseplantProducts();
                break;
              case "Garden Products":
                const { fetchAllGardenProducts } = await import('../data/gardenProducts');
                allCategoryProducts = await fetchAllGardenProducts();
                break;
              case "Hydrophonic and Aquatic":
                const { fetchAllHydroponicAquaticProducts } = await import('../data/hydroponicAquaticProducts');
                allCategoryProducts = await fetchAllHydroponicAquaticProducts();
                break;
              case "Plant Supplements":
                const { fetchAllSpecialtySupplements } = await import('../data/specialtySupplements');
                allCategoryProducts = await fetchAllSpecialtySupplements();
                break;
            }
            
            // Filter these products too
            allCategoryProducts = filterProductsByCategory(allCategoryProducts, category);
            
            // Merge with existing products, avoiding duplicates
            const existingIds = new Set(productData.map(p => p.id));
            const newProducts = allCategoryProducts.filter(p => !existingIds.has(p.id)).slice(0, 5 - productData.length);
            productData = [...productData, ...newProducts];
            
            console.log(`After fallback: ${productData.length} total products`);
          } catch (fallbackError) {
            console.error('Error with fallback data fetch:', fallbackError);
          }
        }
      }
      
      // If still no products, use category-specific search
      if (productData.length === 0) {
        console.log('No products found with exact names, using category-specific search');
        productData = await searchProductsForCategory(category);
      }
      
      // Final fallback if still no products
      if (productData.length === 0) {
        console.log('Using hardcoded fallback products for', category);
        productData = getFallbackProductsForCategory(category);
      }
      
      // Ensure all products have the correct category assigned and proper formatting
      const enrichedProducts = productData.slice(0, 5).map((product, index) => ({
        ...product,
        category: category, // Ensure category is set correctly
        rating: product.rating || generateRandomRating(),
        reviews: product.reviews || Math.floor(Math.random() * 800) + 200,
        // Mark top product as best seller
        bestSeller: product.bestSeller || index === 0,
        // Ensure proper variant structure
        variants: product.variants && product.variants.length > 0 ? product.variants : [
          { 
            id: `${product.id}-default`, 
            title: '8 Ounce', 
            price: product.price || 14.99, 
            available: true, 
            quantity: 100 
          }
        ]
      }));
      
      console.log(`Successfully fetched ${enrichedProducts.length} products for ${category}`);
      setProducts(enrichedProducts);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Final fallback - use category-specific fallback data
      try {
        const fallbackProducts = getFallbackProductsForCategory(category);
        setProducts(fallbackProducts.slice(0, 5));
      } catch (fallbackError) {
        console.error('All fallbacks failed:', fallbackError);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get the current selected category object
  const getCurrentCategory = () => {
    return categories.find(cat => cat.category === selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Fetch products for the selected category
    fetchProductsByCategory(category);
  };

  // Fetch initial products
  useEffect(() => {
    fetchProductsByCategory(selectedCategory);
  }, []);

  return (
    <div className="bg-[#fffbef] py-2 sm:py-8">
      <style>
        {`
          .glide {
            padding: 20px 20px !important;
            margin: -20px -20px;
            background: transparent;
          }
          
          .glide__slide {
            height: auto;
            padding: 12px;
          }

          .product-card {
            background: linear-gradient(145deg, #e8f4f2 0%, #f3e6e0 100%);
            border-radius: 20px;
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 107, 107, 0.1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }

          .product-name-container {
            text-align: left;
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
          }

          .product-name-container h3 {
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 1rem;
            line-height: 1.2;
          }

          .product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #ff6b6b 0%, #ff8c8c 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255, 107, 107, 0.15);
            background: linear-gradient(145deg, #e8f4f2 0%, #f5ebe6 100%);
          }

          .product-card:hover::before {
            opacity: 1;
          }

          .product-image-container {
            position: relative;
            padding-bottom: 100%;
            margin-bottom: 16px;
            border-radius: 12px;
            overflow: hidden;
          }

          .product-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 12px;
            background: transparent;
          }
          
          .glide__arrows {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            z-index: 2;
          }
          
          .glide__arrow {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e8f4f2 0%, #f3e6e0 100%);
            border: none;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
            color: #ff6b6b;
          }
          
          .glide__arrow:hover {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8c8c 100%);
            color: white;
          }
          
          .glide__arrow--left {
            left: 10px;
          }
          
          .glide__arrow--right {
            right: 10px;
          }

          .price-tag {
            background: linear-gradient(135deg, #e8f4f2 0%, #f5ebe6 100%);
            border: 1px solid rgba(255, 107, 107, 0.1);
            border-radius: 999px;
            padding: 0.75rem;
            transition: all 0.3s ease;
          }

          .add-to-cart-btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8c8c 100%);
            color: white;
            border: none;
            border-radius: 999px;
            padding: 0.75rem 1.5rem;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .add-to-cart-btn:hover {
            background: linear-gradient(135deg, #ff5a5a 0%, #ff7b7b 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
          }

          .best-seller-badge {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8c8c 100%);
            color: white;
            padding: 0.25rem 1rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: bold;
            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
          }

          .category-card {
            background: linear-gradient(145deg, #e8f4f2 0%, #f3e6e0 100%);
            border-radius: 16px;
            transition: all 0.3s ease;
          }

          .category-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px rgba(255, 107, 107, 0.12);
          }
          
          @media (max-width: 640px) {
            .glide {
              padding: 12px 12px !important;
              margin: -12px -12px;
            }

            .glide__slide {
              padding: 6px;
            }

            .product-card {
              padding: 12px;
              transform: scale(0.95);
            }

            .product-name-container {
              height: 24px;
              margin-bottom: 0.5rem;
            }

            .product-name-container h3 {
              font-size: 0.875rem;
            }

            .variant-price-container {
              padding: 0.375rem;
              margin-bottom: 0.5rem;
            }

            .price-tag {
              padding: 0.25rem 0.625rem;
              font-size: 0.75rem;
            }

            .add-to-cart-btn {
              padding: 0.5rem 0.75rem;
              font-size: 0.75rem;
            }

            .product-image-container {
              margin-bottom: 0.5rem;
            }

            .product-image {
              padding: 8px;
            }

            .best-seller-badge {
              font-size: 0.65rem;
              padding: 0.25rem 0.625rem;
              top: 0.375rem;
              left: 0.375rem;
            }

            .rating-container {
              transform: scale(0.85);
              transform-origin: left;
              margin-bottom: 0.375rem;
            }
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-1 bg-[#fffbef]">
          <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#ff8c8c] mb-2 hidden sm:block">Shop by Plant</h1>
          <p className="text-gray-600 text-sm sm:text-base tracking-widest uppercase hidden sm:block">Choose a Collection</p>
        </div>

        {/* Mobile Plant Categories Header */}
        <div className="block sm:hidden px-2 xs:px-4 mb-2 bg-[#fffbef]">
          <h1 className="text-3xl xs:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#ff8c8c]">Plant Categories</h1>
        </div>

        {/* Category Navigation - Mobile List / Desktop Tiles */}
        <div className="relative mb-2 sm:mb-12 bg-[#fffbef]">
          {/* Mobile List Layout */}
          <div className="block sm:hidden">
            <div className="px-2 xs:px-4">
              <div className="space-y-0.5 pb-1">
                {categories.map((cat, index) => (
                  <div key={cat.category} className="block">
                    <button
                      onClick={() => handleCategoryClick(cat.category)}
                      className="text-left transition-all duration-200"
                    >
                      <div className={`inline-block ${
                        selectedCategory === cat.category
                          ? 'border-2 border-[#ff6b6b] rounded-full px-2 xs:px-3 py-1 bg-white'
                          : 'px-2 xs:px-3 py-1'
                      }`}>
                        <span className="text-sm xs:text-base font-medium text-black">
                          {cat.name.replace('\n', ' ')}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Tile Layout */}
          <div className="hidden sm:flex justify-center gap-6 overflow-x-auto pb-4 px-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleCategoryClick(cat.category)}
                className="flex-shrink-0 group"
              >
                <div className="relative p-1">
                  <div className={`w-32 h-32 relative overflow-hidden transition-transform duration-200 origin-center category-card ${
                    selectedCategory === cat.category
                      ? 'border-2 border-[#ff6b6b]'
                      : ''
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  {cat.name.split('\n').map((line, i) => (
                    <div 
                      key={i} 
                      className={`${
                        i === 0 
                          ? 'font-bold text-gray-800 tracking-wide'
                          : 'text-gray-500 tracking-wider'
                      } ${
                        selectedCategory === cat.category
                          ? i === 0 ? 'text-[#ff6b6b]' : 'text-gray-600'
                          : i === 0 ? 'text-gray-600' : 'text-gray-400'
                      } text-sm whitespace-nowrap transition-colors duration-200`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-4 sm:py-12 bg-[#fffbef]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#FF6B6B] mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="relative" ref={glideRef}>
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {products.map((product, index) => (
                    <li className="glide__slide" key={product.id}>
                      <div className="product-card">
                        {product.bestSeller && (
                          <div className="best-seller-badge">
                            BEST SELLER!
                          </div>
                        )}
                        
                        <div className="product-image-container">
                          <img 
                            src={product.image || "/assets/products/placeholder.png"}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.src = "/assets/products/placeholder.png";
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-800 text-sm font-medium">{product.rating || generateRandomRating()}</span>
                            {renderStars()}
                            <span className="text-gray-600 text-xs">({product.reviews})</span>
                          </div>
                        </div>

                        {formatProductName(product.name)}

                        <div className="flex-grow">
                          <div className="border border-gray-200 rounded-full bg-white p-2 sm:p-2.5 mb-3 sm:mb-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-xs sm:text-base pl-1.5 sm:pl-2 text-gray-800">{product.variants?.[0]?.title || '8 Ounce'}</span>
                              <span className="bg-[#f3e6e0] px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-base text-gray-800">
                                ${product.variants?.[0]?.price?.toFixed(2) || product.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, product.variants?.[0], 1);
                          }}
                          className={`w-full font-bold text-xs sm:text-base py-2 sm:py-2.5 px-3 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center
                            ${product.variants?.[0] && product.variants?.[0].available 
                              ? 'bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white shadow-sm' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                          disabled={!product.variants?.[0] || !product.variants?.[0].available}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          ADD TO CART
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Glide Arrows */}
              {!isMobile && (
                <div className="glide__arrows" data-glide-el="controls">
                  <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-[#fffbef]">
            <div className="bg-gradient-to-br from-[#e8f4f2] to-[#f3e6e0] rounded-lg shadow-sm p-6 sm:p-8 mx-2 sm:mx-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {getCurrentCategory()?.name.replace('\n', ' ')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {getCurrentCategory()?.description}
              </p>
              <p className="text-gray-500 mb-4">No products found in this category.</p>
              <button
                onClick={() => handleCategoryClick("Houseplant Products")}
                className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8c8c] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200"
              >
                View House Plants
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopByPlantSimple; 