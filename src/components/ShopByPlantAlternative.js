import React, { useState, useEffect, useRef } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '../styles/glide-custom.css';

const ShopByPlantAlternative = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Houseplant Products");
  const glideRef = useRef(null);

  // Background gradient styles for each product card
  const cardBackgrounds = [
    'bg-gradient-to-br from-[#e6f4fa] to-[#d9eef8]', // Light blue gradient
    'bg-gradient-to-br from-[#f2f9e7] to-[#e8f4d9]', // Light green gradient
    'bg-gradient-to-br from-[#fef5e7] to-[#fbecd3]', // Light yellow/cream gradient
    'bg-gradient-to-br from-[#f8effc] to-[#f1e3fa]'  // Light lavender gradient
  ];
  
  // Helper function to get alternating background
  const getRandomBackground = (index = 0) => {
    const backgroundIndex = index % cardBackgrounds.length;
    return cardBackgrounds[backgroundIndex];
  };

  // Function to format the product name with product type on separate lines
  const formatProductName = (name) => {
    // Convert to uppercase for consistency
    const upperName = name.toUpperCase();
    
    // Find where to split the name (before "PLANT", "FERTILIZER", "FOOD", etc.)
    const keywords = ["PLANT", "FERTILIZER", "FOOD", "SUPPLEMENT"];
    let splitIndex = -1;
    
    for (const keyword of keywords) {
      const index = upperName.indexOf(keyword);
      if (index !== -1) {
        splitIndex = index;
        break;
      }
    }
    
    // If we found a place to split
    if (splitIndex > 0) {
      const firstPart = upperName.substring(0, splitIndex).trim();
      const secondPart = upperName.substring(splitIndex).trim();
      
      return (
        <div className="product-name-container h-20 flex flex-col justify-start">
          <p className="text-xl font-bold text-gray-800 mb-1 truncate overflow-hidden">{firstPart}</p>
          <p className="text-lg text-gray-700 truncate overflow-hidden">{secondPart}</p>
        </div>
      );
    }
    
    // Fallback if no split is possible
    return (
      <div className="product-name-container h-20 flex flex-col justify-start">
        <p className="text-xl font-bold text-gray-800 truncate overflow-hidden">{upperName}</p>
        <div className="h-6"></div>
      </div>
    );
  };

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

  // List of house plant product names
  const houseplantProducts = [
    "Money Tree Fertilizer",
    "Jade Fertilizer",
    "Christmas Cactus Fertilizer",
    "Cactus Fertilizer",
    "Succulent Plant Food",
    "Bonsai Fertilizer",
    "Air Plant Fertilizer",
    "Snake Plant Fertilizer",
    "House Plant Food",
    "Mycorrhizal Fungi for Houseplants",
    "Granular Houseplant Food",
    "Granular Monstera Fertilizer",
    "Granular Lemon Tree Fertilizer",
    "Granular Indoor Plant Food",
    "Granular Fig Tree Fertilizer",
    "Granular Bonsai Fertilizer",
    "Monstera Root Supplement",
    "Houseplant Root Supplement",
    "Succulent Root Supplement",
    "Root Supplement",
    "Orchid Root Supplement",
    "Indoor Plant Food",
    "Instant Plant Food",
    "Ficus Fertilizer",
    "Banana Tree Fertilizer",
    "Philodendron Fertilizer",
    "Fern Fertilizer",
    "Dracaena Fertilizer",
    "Bird of Paradise Fertilizer",
    "Aloe Vera Fertilizer",
    "ZZ Plant Fertilizer",
    "Tropical Plant Fertilizer",
    "Pothos Fertilizer",
    "Bromeliad Fertilizer",
    "Fiddle Leaf Fig Plant Food",
    "Monstera Plant Food",
    "African Violet Fertilizer",
    "Alocasia Fertilizer",
    "Anthurium Fertilizer",
    "Bamboo Fertilizer",
    "Brazilian Wood Plant Food",
    "Carnivorous Plant Food",
    "Curry Leaf Plant Fertilizer",
    "Elephant Ear Fertilizer",
    "Hoya Fertilizer",
    "Lucky Bamboo Fertilizer",
    "Orchid Plant Food",
    "Peace Lily Fertilizer",
    "Pitcher Plant Food"
  ];

  // Function to fetch products from Shopify Storefront API
  const fetchFromStorefrontAPI = async (query) => {
    const shopifyStorefrontUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
    
    const response = await fetch(shopifyStorefrontUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': 'd5720278d38b25e4bc1118b31ff0f045',
        'Origin': window.location.origin,
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
  };

  // Function to fetch all products with title matching our list
  const fetchAllProducts = async () => {
    try {
      // Simpler query that searches for products containing these terms
      const query = `
        {
          products(first: 250, query: "title:*Plant* OR title:*Fertilizer* OR title:*Food*") {
            edges {
              node {
                id
                title
                description
                tags
                productType
                vendor
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      transformedSrc
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = await fetchFromStorefrontAPI(query);
      if (result.data && result.data.products) {
        const mappedProducts = result.data.products.edges
          .map(({ node }) => ({
            id: node.id,
            name: node.title,
            description: node.description || "",
            image: node.images.edges[0]?.node.transformedSrc || "/assets/products/placeholder.png",
            price: parseFloat(node.priceRange.minVariantPrice.amount),
            category: determineCategory(node.title),
            variants: node.variants.edges.map(({ node: variant }) => ({
              id: variant.id,
              title: variant.title,
              price: parseFloat(variant.price.amount),
              compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
              available: variant.availableForSale,
              sku: variant.sku
            })),
            rating: generateRandomRating(),
            reviews: Math.floor(Math.random() * 800) + 200
          }))
          // Filter to only include products from our house plant products list
          .filter(product => houseplantProducts.includes(product.name))
          // Sort to match the order in houseplantProducts array
          .sort((a, b) => {
            const indexA = houseplantProducts.findIndex(name => name === a.name);
            const indexB = houseplantProducts.findIndex(name => name === b.name);
            return indexA - indexB;
          });

        setProducts(mappedProducts);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getFallbackData());
      setLoading(false);
    }
  };

  // Helper function to determine product category
  const determineCategory = (title) => {
    if (houseplantProducts.includes(title)) {
      return "Houseplant Products";
    }
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("indoor") || lowerTitle.includes("houseplant")) {
      return "Houseplant Products";
    } else if (lowerTitle.includes("garden") || lowerTitle.includes("outdoor")) {
      return "Garden Products";
    } else if (lowerTitle.includes("hydro") || lowerTitle.includes("aquatic")) {
      return "Hydrophonic and Aquatic";
    } else {
      return "Plant Supplements";
    }
  };

  // Generate random rating for demo purposes
  const generateRandomRating = () => {
    return (Math.random() * (5 - 4) + 4).toFixed(1);
  };

  // Fallback data in case API fails
  const getFallbackData = () => {
    return [
      {
        id: 'product-1',
        name: "INDOOR PLANT FOOD",
        description: "Essential nutrients for healthy indoor plants",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 1203,
        rating: 4.8,
        category: "Houseplant Products",
        variants: [{ id: 'variant1', title: '8 oz', price: 14.99, available: true }]
      },
      // Add more fallback products as needed
    ];
  };

  // Filter products
  const filteredProducts = products
    .filter(product => selectedCategory ? product.category === selectedCategory : true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!loading && filteredProducts.length > 0 && glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'slider',
        bound: true,
        rewind: false,
        perView: 4,
        gap: 16,
        breakpoints: {
          1280: { perView: 3 },
          1024: { perView: 2.1 },
          768: { perView: 2.1 },
          640: { perView: 2.1 },
          480: { perView: 2.1 }
        }
      });

      glide.mount();

      return () => {
        glide.destroy();
      };
    }
  }, [loading, filteredProducts]);

  // Render star rating
  const renderStars = (rating, reviews) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-[#FF6B6B]">{rating}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map(i => (
            <svg
              key={i}
              className={`w-4 h-4 ${i <= Math.floor(rating) ? 'text-[#FF6B6B]' : 'text-gray-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600 text-xs sm:text-sm">({reviews})</span>
      </div>
    );
  };

  // Get the current selected category object
  const getCurrentCategory = () => {
    return categories.find(cat => cat.category === selectedCategory);
  };

  // Product card component for the available products
  const ProductCard = ({ product, onSelect, index }) => {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Initialize selected variant on mount
    useEffect(() => {
      // Find the 8oz variant or default to first available variant
      const initialVariant = product.variants.find(v => 
        (v.title.toLowerCase().includes('8 oz') || v.title.toLowerCase().includes('8 ounce')) && v.available
      ) || product.variants.find(v => v.available) || product.variants[0];
      
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
    const activeVariant = selectedVariant || 
      product.variants.find(v => v.available) || 
      product.variants[0];
    
    const available = activeVariant && activeVariant.available;
    
    // Only show dropdown if there are multiple variants
    const hasMultipleVariants = product.variants.length > 1;
    
    return (
      <div 
        className={`rounded-lg overflow-hidden shadow-sm relative ${product.backgroundClass || getRandomBackground(index)}`}
        onClick={() => available && onSelect(product, activeVariant)}
      >
        {product.bestSeller && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#ff6b57] text-white font-bold py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm">
            BEST SELLER!
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-sm sm:text-base">OUT OF STOCK</span>
          </div>
        )}
        <div className="p-3 sm:p-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-32 sm:h-48 mx-auto mb-2 sm:mb-4 object-contain mix-blend-multiply"
          />
          
          <div className="flex items-center justify-between mb-1 sm:mb-3">
            {renderStars(product.rating, product.reviews)}
          </div>
          
          <div className="mb-2 sm:mb-4">
            {formatProductName(product.name)}
          </div>
          
          {/* Variant selection dropdown */}
          <div className="relative mb-2 sm:mb-4" ref={dropdownRef}>
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
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                {product.variants.map((variant, idx) => (
                  <div 
                    key={variant.id || idx}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      setSelectedVariant(variant);
                      setDropdownOpen(false);
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
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, activeVariant);
            }}
            className={`w-full font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-colors text-xs sm:text-base ${available ? 'bg-[#ff6b57] hover:bg-[#ff5a43] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!available}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fff9f2] py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-1">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#ff6b6b] mb-2">Shop by Plant</h1>
          <p className="text-gray-500 text-sm sm:text-base tracking-widest uppercase">Choose a Collection</p>
        </div>

        {/* Category Navigation - Mobile Scrollable */}
        <div className="relative mb-8 sm:mb-12">
          <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-4 px-1 sm:px-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className="flex-shrink-0 group"
              >
                <div className="relative p-1">
                  <div className={`w-20 h-20 sm:w-32 sm:h-32 relative overflow-hidden transition-transform duration-200 origin-center ${
                    selectedCategory === cat.category
                      ? 'border-2 border-black group-hover:scale-105'
                      : 'group-hover:scale-105'
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-opacity duration-200 ${
                        selectedCategory === cat.category
                          ? 'opacity-100'
                          : 'opacity-90 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  {cat.name.split('\n').map((line, i) => (
                    <div 
                      key={i} 
                      className={`${
                        i === 0 
                          ? 'font-bold text-black tracking-wide'
                          : 'text-gray-400 tracking-wider'
                      } ${
                        selectedCategory === cat.category
                          ? i === 0 ? 'text-black' : 'text-gray-500'
                          : i === 0 ? 'text-gray-400' : 'text-gray-400'
                      } text-[10px] sm:text-sm whitespace-nowrap transition-colors duration-200`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid with Glide.js */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#FF6B6B] mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="relative -mx-0 sm:mx-0">
            <div className="glide" ref={glideRef}>
              <div className="glide__track" data-glide-el="track">
                <div className="glide__slides">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="glide__slide px-1 sm:px-2">
                      <ProductCard product={product} onSelect={(product, variant) => addToCart(product, variant)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="glide__arrows hidden sm:block" data-glide-el="controls">
                <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">No products found in this category.</p>
            <button
              onClick={() => setSelectedCategory("Houseplant Products")}
              className="bg-[#FF6B6B] text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-[#ff5a43] transition-colors duration-200"
            >
              View House Plants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByPlantAlternative; 