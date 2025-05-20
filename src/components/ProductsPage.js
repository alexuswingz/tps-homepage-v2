import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LeafDivider from './LeafDivider';
import { useCart } from './CartContext';

// Category definitions matching the ShopByPlant component
const categories = [
  {
    name: "HOUSE PLANTS",
    image: "/assets/Collection Tiles Images/Houseplants Tile.jpg",
    category: "Houseplant Products"
  },
  {
    name: "LAWN & GARDEN",
    image: "/assets/Collection Tiles Images/Lawn and Garden Tile.jpg",
    category: "Garden Products"
  },
  {
    name: "HYDRO & AQUATIC",
    image: "/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg",
    category: "Hydrophonic and Aquatic"
  },
  {
    name: "SPECIALTY SUPPLEMENTS",
    image: "/assets/Collection Tiles Images/Specialty Supplements Title.jpg",
    category: "Plant Supplements"
  },
  {
    name: "CURATED BUNDLES",
    image: "/assets/menu/Bundle Builder Tile.jpg",
    category: "Curated Bundles"
  }
];

// Background gradient styles for each product card
const cardBackgrounds = [
  'bg-gradient-to-br from-[#e6f4fa] to-[#d9eef8]', // Light blue gradient
  'bg-gradient-to-br from-[#f2f9e7] to-[#e8f4d9]', // Light green gradient
  'bg-gradient-to-br from-[#fef5e7] to-[#fbecd3]', // Light yellow/cream gradient
  'bg-gradient-to-br from-[#f8effc] to-[#f1e3fa]'  // Light lavender gradient
];

// Product Card Component
const ProductCard = ({ product, index }) => {
  // State to track selected quantity for this product
  const [quantity, setQuantity] = useState(1);
  // State to track selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  // State for dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Ref for dropdown container
  const dropdownRef = useRef(null);
  
  const { addToCart } = useCart();
  
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
  
  // Calculate max quantity that can be ordered (respect inventory limits)
  const maxQuantity = activeVariant && activeVariant.available 
    ? (activeVariant.quantity > 0 ? activeVariant.quantity : 10)  // Default to 10 if no quantity specified
    : 0;
  
  // Ensure quantity doesn't exceed available stock when variant changes
  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity || 1);
    }
  }, [maxQuantity, quantity, activeVariant]);
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (activeVariant && activeVariant.available) {
      addToCart(product, activeVariant, quantity);
    }
  };
  
  const selectVariant = (variant) => {
    setSelectedVariant(variant);
    setDropdownOpen(false);
  };

  // Function to render star ratings
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

  // Function to format product name to match design
  const formatProductName = (name) => {
    const upperName = name.toUpperCase();
    
    if (upperName.length > 20) {
      const words = upperName.split(' ');
      const half = Math.ceil(words.length / 2);
      const firstHalf = words.slice(0, half).join(' ');
      const secondHalf = words.slice(half).join(' ');
      
      return (
        <div className="product-name-container h-16 sm:h-20 flex flex-col justify-start">
          <p className="text-base sm:text-xl font-bold text-gray-800">{firstHalf}</p>
          <p className="text-base sm:text-xl font-bold text-gray-800">{secondHalf}</p>
        </div>
      );
    }
    
    return (
      <div className="product-name-container h-16 sm:h-20 flex flex-col justify-start">
        <p className="text-base sm:text-xl font-bold text-gray-800 truncate overflow-hidden">{upperName}</p>
        <div className="h-4 sm:h-6"></div>
      </div>
    );
  };
  
  // Only show dropdown if there are multiple variants
  const hasMultipleVariants = product.variants.length > 1;
  
  // Get alternating background instead of random
  const getCategoryBackground = () => {
    const backgroundIndex = index % cardBackgrounds.length;
    return cardBackgrounds[backgroundIndex];
  };
  
  return (
    <div 
      className={`${getCategoryBackground()} rounded-lg overflow-hidden shadow-sm relative`}
    >
      {product.bestSeller && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#ff6b57] text-white font-bold py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm">
          BEST SELLER!
        </div>
      )}
      
      <div className="p-3 sm:p-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-32 sm:h-48 mx-auto mb-2 sm:mb-4 object-contain mix-blend-multiply"
        />
        
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          {renderStars()}
          <span className="text-gray-600 text-xs sm:text-sm">{product.reviews} reviews</span>
        </div>
        
        {formatProductName(product.name)}
        
        {/* Variant selection dropdown */}
        <div className="relative mb-2 sm:mb-4" ref={dropdownRef}>
          <div 
            onClick={() => hasMultipleVariants && setDropdownOpen(!dropdownOpen)}
            className={`flex justify-between items-center ${hasMultipleVariants ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex flex-1 items-center justify-between border border-gray-300 rounded-full bg-white relative overflow-hidden">
              <div className="flex-1 p-2 pl-4 text-xs sm:text-sm">
                <span className="font-medium">{activeVariant?.title || '8 Ounces'}</span>
              </div>
              
              <div className="flex-1 p-2 pr-4 text-right text-xs sm:text-sm">
                <span className="font-medium">${activeVariant ? activeVariant.price.toFixed(2) : product.price.toFixed(2)}</span>
              </div>
              
              {hasMultipleVariants && (
                <div className="absolute right-4 pointer-events-none">
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
                  onClick={() => selectVariant(variant)}
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
        
        {/* Quantity selector - only show if the product is available */}
        {activeVariant && activeVariant.available && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <label htmlFor={`quantity-${product.id}`} className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
              Quantity: {maxQuantity > 0 ? `(${maxQuantity} available)` : ''}
            </label>
            <div className="flex items-center border border-gray-300 rounded self-start sm:self-auto">
              <button 
                onClick={decrementQuantity}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                id={`quantity-${product.id}`}
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 px-2 py-1 text-center text-sm border-x border-gray-300"
              />
              <button 
                onClick={incrementQuantity}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          className={`w-full font-bold text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center
            ${activeVariant && activeVariant.available 
              ? 'bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white shadow-sm' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          disabled={!activeVariant || !activeVariant.available || maxQuantity === 0}
        >
          {activeVariant && activeVariant.available ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              ADD TO CART
            </>
          ) : maxQuantity === 0 ? 'OUT OF STOCK' : 'UNAVAILABLE'}
        </button>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [currentVisibleCategory, setCurrentVisibleCategory] = useState("");
  const categoryRefs = useRef({});
  const observerRef = useRef(null);
  const overlayScrollRef = useRef(null); // Reference to the horizontal scrolling container

  // Track scroll position to show/hide the category overlay
  useEffect(() => {
    const handleScroll = () => {
      // Show overlay once scrolled past the initial category selection (roughly 400px)
      const scrollPosition = window.scrollY;
      setShowCategoryOverlay(scrollPosition > 400);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Run once on mount to check initial position
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Set up intersection observer to detect which category is currently visible
  useEffect(() => {
    if (products.length === 0) return;
    
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const options = {
      root: null, // use viewport
      rootMargin: '-100px 0px -300px 0px', // top, right, bottom, left
      threshold: 0.1
    };
    
    // Create observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id;
          // Extract category name from element ID (format: category-xxx-xxx)
          if (categoryId && categoryId.startsWith('category-')) {
            const categoryName = categoryId.replace('category-', '').replace(/-/g, ' ');
            // Find the matching category from our categories array
            const matchedCategory = categories.find(cat => 
              cat.category.toLowerCase().replace(/\s+/g, '-') === categoryName
            );
            
            if (matchedCategory) {
              setCurrentVisibleCategory(matchedCategory.category);
              console.log('Currently visible category:', matchedCategory.category);
            }
          }
        }
      });
    }, options);
    
    // Observe each category section
    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products, categories]);

  // Function to make API calls to Shopify Storefront API using CORS proxy
  const fetchFromStorefrontAPI = async (query) => {
    // API URL for Shopify Storefront API
    const shopifyStorefrontUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
    
    try {
      console.log("Making API request to Shopify Storefront...");
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
        console.error(`API request failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received API response");
      return data;
    } catch (error) {
      console.error('Error fetching from Shopify API:', error.message);
      return null;
    }
  };
  
  // Function to fetch all products with pagination
  const fetchAllProducts = async (cursor = null, allProducts = []) => {
    try {
      // Updated GraphQL query to fetch more product details
      const query = `
        {
          products(first: 50${cursor ? `, after: "${cursor}"` : ''}) {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
                      }
                    }
                  }
                }
                metafields(first: 5, namespace: "custom") {
                  edges {
                    node {
                      key
                      value
                      namespace
                    }
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const result = await fetchFromStorefrontAPI(query);
        
        // Check if we got data back
        if (result && result.data && result.data.products && result.data.products.edges) {
          const newProducts = [...allProducts, ...result.data.products.edges.map(mapProductFromShopify)];
          
          // If there are more pages, fetch them
          if (result.data.products.pageInfo.hasNextPage) {
            return fetchAllProducts(result.data.products.pageInfo.endCursor, newProducts);
          } else {
            // Filter out products that have no available variants
            const inStockProducts = newProducts.filter(product => 
              product.variants.some(variant => variant.available)
            );
            console.log("Total products fetched:", inStockProducts.length);
            setProducts(inStockProducts);
            setLoading(false);
            return inStockProducts;
          }
        } else {
          // If API fails to return expected data structure, use fallback data
          console.warn("Invalid data structure returned from API, using fallback data");
          return fetchFallbackProducts();
        }
      } catch (apiError) {
        console.error('Error with Shopify API request:', apiError);
        return fetchFallbackProducts();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return fetchFallbackProducts();
    }
  };

  // Function to fetch products by names from the provided list
  const fetchHouseplantProducts = async () => {
    try {
      // Exact houseplant product names from the first image
      const houseplantProducts = [
        "Money Tree Fertilizer", "Jade Fertilizer", "Christmas Cactus Fertilizer",
        "Cactus Fertilizer", "Succulent Plant Food", "Bonsai Fertilizer",
        "Air Plant Fertilizer", "Snake Plant Fertilizer", "House Plant Food",
        "Mycorrhizal Fungi for Houseplants", "Granular Houseplant Food", 
        "Granular Monstera Fertilizer", "Granular Lemon Tree Fertilizer",
        "Granular Indoor Plant Food", "Granular Fig Tree Fertilizer", 
        "Granular Bonsai Fertilizer", "Monstera Root Supplement",
        "Houseplant Root Supplement", "Succulent Root Supplement",
        "Ficus Root Supplement", "Orchid Root Supplement", "Indoor Plant Food",
        "Instant Plant Food", "Ficus Fertilizer", "Banana Tree Fertilizer", 
        "Philodendron Fertilizer", "Dracaena Fertilizer",
        "Bird of Paradise Fertilizer", "Aloe Vera Fertilizer", "ZZ Plant Fertilizer",
        "Tropical Plant Fertilizer", "Pothos Fertilizer", "Bromeliad Fertilizer",
        "Fiddle Leaf Fig Plant Food", "Monstera Plant Food", "African Violet Fertilizer",
        "Alocasia Fertilizer", "Anthurium Fertilizer", "Bamboo Fertilizer",
        "Brazilian Wood Plant Food", "Carnivorous Plant Food", "Curry Leaf Plant Fertilizer",
        "Elephant Ear Fertilizer", "Hoya Fertilizer", "Lucky Bamboo Fertilizer",
        "Orchid Plant Food", "Peace Lily Fertilizer", "Pitcher Plant Food"
      ];

      console.log("Fetching houseplant products by exact names...");
      
      // Create query conditions for each product name
      const titleQueries = houseplantProducts.map(name => `title:'${name}'`).join(' OR ');
      
      const query = `
        {
          products(first: 100, query: "${titleQueries}") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      // Due to query length limitations, we might need to batch this
      // Let's try with the direct query first
      const result = await fetchFromStorefrontAPI(query);
      
      if (!result || !result.data) {
        console.error("API returned no data or invalid response");
        
        // If the main query fails, let's try a simpler approach
        console.log("Trying alternative query approach for houseplant products...");
        return await fetchHouseplantProductsAlternative();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        console.log("Found houseplant products:", result.data.products.edges.length);
        
        // Map to our format
        const fetchedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Set all products to the Houseplant Products category for these specific products
        fetchedProducts.forEach(product => {
          product.category = "Houseplant Products";
        });
        
        return fetchedProducts;
      } else {
        console.log("No houseplant products found using exact names, trying alternative approach");
        return await fetchHouseplantProductsAlternative();
      }
    } catch (error) {
      console.error("Error fetching houseplant products:", error);
      return await fetchHouseplantProductsAlternative();
    }
  };
  
  // Alternative approach for fetching houseplant products
  const fetchHouseplantProductsAlternative = async () => {
    try {
      console.log("Using alternative approach for houseplant products...");
      
      // Try a simplified query for common houseplant terms
      const query = `
        {
          products(first: 100, query: "houseplant OR indoor plant OR fertilizer") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("Alternative API query returned no data");
        return [];
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const mappedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter to only include products that should go into the Houseplant category
        const houseplantProducts = mappedProducts.filter(product => 
          determineProductCategory(product.name, []) === "Houseplant Products"
        );
        
        console.log("Found alternative houseplant products:", houseplantProducts.length);
        return houseplantProducts;
      } else {
        console.log("No houseplant products found with alternative approach");
        return [];
      }
    } catch (error) {
      console.error("Error in alternative houseplant products approach:", error);
      return [];
    }
  };

  // Function to fetch garden products
  const fetchGardenProducts = async () => {
    try {
      // Exact garden product names from the second image
      const gardenProducts = [
        "Bougainvillea Fertilizer", "Camellia Fertilizer", "Cut Flower Food",
        "Desert Rose Fertilizer", "Flowering Fertilizer", "Rose Bush Fertilizer",
        "Rose Fertilizer", "Plumeria Fertilizer", "Hydrangea Fertilizer",
        "Hibiscus Fertilizer", "Azalea Fertilizer", "Gardenia Fertilizer",
        "Rhododendron Fertilizer", "Petunia Fertilizer", "Geranium Fertilizer",
        "Hanging Basket Plant Food", "Flowering Plant Food", "Daffodil Bulb Fertilizer",
        "Tulip Bulb Fertilizer", "Mum Fertilizer", "Ixora Fertilizer",
        "Bulb Fertilizer", "Lilac Bush Fertilizer", "Bloom Fertilizer",
        "Berry Fertilizer", "Pepper Fertilizer", "Tomato Fertilizer",
        "Strawberry Fertilizer", "Blueberry Fertilizer", "Herbs and Leafy Greens Plant Food",
        "Vegetable Fertilizer", "Pumpkin Fertilizer", "Potato Fertilizer",
        "Garlic Fertilizer", "Water Soluble Fertilizer", "Garden Fertilizer",
        "Plant Food Outdoor", "Plant Food", "Plant Fertilizer",
        "All Purpose Fertilizer", "All Purpose NPK Fertilizer", "Starter Fertilizer",
        "10-10-10 for General Use", "10-10-10 for Vegetables", "10-10-10 for Plants",
        "Fall Fertilizer", "Winter Fertilizer", "Ivy Plant Food",
        "Lawn Fertilizer", "Mycorrhizal Fungi for Trees", "Mycorrhizal Fungi for Palm Trees",
        "Mycorrhizal Fungi for Gardens", "Mycorrhizal Fungi for Citrus Trees",
        "Mycorrhizal Fungi", "Root Booster for Plants", "Soil Microbes for Gardening",
        "Trichoderma for Plants", "Peach Tree Fertilizer", "Olive Tree Fertilizer",
        "Mango Tree Fertilizer", "Lime Tree Fertilizer", "Evergreen Fertilizer",
        "Arborvitae Fertilizer", "Palm Fertilizer", "Apple Tree Fertilizer",
        "Citrus Fertilizer", "Tree Fertilizer", "Fruit Tree Fertilizer",
        "Lemon Tree Fertilizer", "Avocado Tree Fertilizer", "10-10-10 for Trees",
        "Aspen Tree Fertilizer", "Boxwood Fertilizer", "Crepe Myrtle Fertilizer",
        "Dogwood Tree Fertilizer", "Japanese Maple Fertilizer", "Magnolia Tree Fertilizer",
        "Maple Tree Fertilizer", "Oak Tree Fertilizer", "Orange Tree Fertilizer",
        "Pine Tree Fertilizer", "Root Stimulator for Trees", "Sago Palm Fertilizer",
        "Shrub Fertilizer", "Tree And Shrub Fertilizer", "Jasmine Fertilizer"
      ];

      console.log("Fetching garden products by exact names...");
      
      // Due to query length limitations, try with batches
      // First batch of product names
      const firstBatch = gardenProducts.slice(0, 30);
      const secondBatch = gardenProducts.slice(30);
      
      const titleQueryFirstBatch = firstBatch.map(name => `title:'${name}'`).join(' OR ');
      
      const queryFirstBatch = `
        {
          products(first: 100, query: "${titleQueryFirstBatch}") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      // Fetch first batch
      const resultFirstBatch = await fetchFromStorefrontAPI(queryFirstBatch);
      let gardenProductsList = [];
      
      if (resultFirstBatch && resultFirstBatch.data && resultFirstBatch.data.products && resultFirstBatch.data.products.edges.length > 0) {
        const firstBatchProducts = resultFirstBatch.data.products.edges.map(mapProductFromShopify);
        gardenProductsList = [...firstBatchProducts];
        console.log("Found garden products in first batch:", firstBatchProducts.length);
      }
      
      // Fetch second batch if needed
      if (secondBatch.length > 0) {
        const titleQuerySecondBatch = secondBatch.map(name => `title:'${name}'`).join(' OR ');
        
        const querySecondBatch = `
          {
            products(first: 100, query: "${titleQuerySecondBatch}") {
              pageInfo {
                hasNextPage
                endCursor
              }
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
                        width
                        height
                      }
                    }
                  }
                  variants(first: 20) {
                    edges {
                      node {
                        id
                        title
                        price {
                          amount
                          currencyCode
                        }
                        availableForSale
                        quantityAvailable
                        sku
                        compareAtPrice {
                          amount
                          currencyCode
                        }
                        selectedOptions {
                          name
                          value
                        }
                        image {
                          transformedSrc
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        
        const resultSecondBatch = await fetchFromStorefrontAPI(querySecondBatch);
        
        if (resultSecondBatch && resultSecondBatch.data && resultSecondBatch.data.products && resultSecondBatch.data.products.edges.length > 0) {
          const secondBatchProducts = resultSecondBatch.data.products.edges.map(mapProductFromShopify);
          gardenProductsList = [...gardenProductsList, ...secondBatchProducts];
          console.log("Found garden products in second batch:", secondBatchProducts.length);
        }
      }
      
      // If we found products, set them all to the Garden Products category
      if (gardenProductsList.length > 0) {
        gardenProductsList.forEach(product => {
          product.category = "Garden Products";
        });
        
        console.log("Total garden products found:", gardenProductsList.length);
        return gardenProductsList;
      } else {
        console.log("No garden products found using exact names, trying alternative approach");
        return await fetchGardenProductsAlternative();
      }
    } catch (error) {
      console.error("Error fetching garden products:", error);
      return await fetchGardenProductsAlternative();
    }
  };
  
  // Alternative approach for fetching garden products
  const fetchGardenProductsAlternative = async () => {
    try {
      console.log("Using alternative approach for garden products...");
      
      // Try a simplified query for common garden terms
      const query = `
        {
          products(first: 100, query: "garden OR outdoor OR lawn OR tree fertilizer OR rose OR vegetable") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("Alternative API query returned no data for garden products");
        return [];
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const mappedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter to only include products that should go into the Garden category
        const gardenProducts = mappedProducts.filter(product => 
          determineProductCategory(product.name, []) === "Garden Products"
        );
        
        console.log("Found alternative garden products:", gardenProducts.length);
        return gardenProducts.length > 0 ? gardenProducts : getFallbackGardenProducts();
      } else {
        console.log("No garden products found with alternative approach");
        return getFallbackGardenProducts();
      }
    } catch (error) {
      console.error("Error in alternative garden products approach:", error);
      return getFallbackGardenProducts();
    }
  };

  // Function to fetch fallback data
  const fetchFallbackProducts = () => {
    console.log("Using fallback product data");
      const fallbackData = getFallbackData();
      const inStockFallbackProducts = fallbackData.filter(product => 
        product.variants.some(variant => variant.available)
      );
      setProducts(inStockFallbackProducts);
      setLoading(false);
    return inStockFallbackProducts;
  };

  // Function to map Shopify product data to our format
  const mapProductFromShopify = ({ node }) => {
    // Extract all images (not just the first one)
    const images = node.images.edges.map(edge => ({
      src: edge.node.transformedSrc,
      alt: edge.node.altText || node.title,
      width: edge.node.width,
      height: edge.node.height
    }));
    
    // Extract the variants with their details
    const variants = node.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
      available: edge.node.availableForSale,
      quantity: edge.node.quantityAvailable || 0,
      sku: edge.node.sku || "",
      options: edge.node.selectedOptions || [],
      image: edge.node.image ? edge.node.image.transformedSrc : null
    }));
    
    // Find first available variant
    const availableVariants = variants.filter(variant => variant.available);
    const defaultVariant = availableVariants.length > 0 ? availableVariants[0] : (variants.length > 0 ? variants[0] : null);
    
    // Determine which category this product belongs to based on its title/tags
    let category = determineProductCategory(node.title, node.tags);
    
    // Map background colors for different product categories
    const backgroundColors = {
      "Houseplant Products": { light: "#e0f5ed", dark: "#d0f0e5" },
      "Garden Products": { light: "#e4f2d7", dark: "#d8ebc4" },
      "Hydrophonic and Aquatic": { light: "#d6eaf8", dark: "#c5ddf0" },
      "Plant Supplements": { light: "#f9e6d2", dark: "#f7d9b9" },
      "Curated Bundles": { light: "#f0e6f5", dark: "#e6d4f0" },
    };
    
    // Default background colors
    const defaultBackground = { light: "#e0f5ed", dark: "#d0f0e5" };
    const background = backgroundColors[category] || defaultBackground;
    
    const bestSeller = node.tags.some(tag => 
      tag.toLowerCase().includes('best') && tag.toLowerCase().includes('seller')
    );
    
    const reviewCount = Math.floor(Math.random() * 1500) + 50; // Random review count for demonstration
    
    return {
      id: node.id,
      name: node.title,
      description: "PLANT FOOD",
      image: images.length > 0 ? images[0].src : "/assets/products/indoor-plant-food.png",
      price: defaultVariant ? defaultVariant.price : (parseFloat(node.priceRange.minVariantPrice.amount) || 14.99),
      reviews: reviewCount,
      bestSeller: bestSeller,
      category: category,
      backgroundColorLight: background.light,
      variants: variants
    };
  };

  // Function to determine product category based on title and tags
  const determineProductCategory = (title, tags) => {
    const titleLower = title.toLowerCase();
    const tagsLower = tags ? tags.map(tag => tag.toLowerCase()) : [];
    
    // Garden products from the provided list
    const gardenSpecificKeywords = [
      "bougainvillea", "camellia", "cut flower", "desert rose", "flowering", 
      "rose bush", "rose", "plumeria", "hydrangea", "hibiscus", 
      "azalea", "gardenia", "rhododendron", "petunia", "geranium", 
      "hanging basket", "daffodil", "tulip", "mum", "ixora", "bulb", 
      "lilac", "bloom", "berry", "pepper", "tomato", "strawberry", 
      "blueberry", "herbs", "leafy greens", "vegetable", "pumpkin", 
      "potato", "garlic", "water soluble", "garden", "outdoor",
      "all purpose", "npk", "starter", "10-10-10", "fall fertilizer", 
      "winter fertilizer", "lawn", "mycorrhizal fungi for trees",
      "mycorrhizal fungi for palm trees", "mycorrhizal fungi for gardens",
      "mycorrhizal fungi for citrus trees", "mycorrhizal fungi for palm", 
      "root booster", "soil microbes", "trichoderma",
      "peach tree", "olive tree", "mango tree", "lime tree", "evergreen",
      "arborvitae", "palm", "apple tree", "citrus", "fruit tree",
      "lemon tree", "avocado tree", "aspen tree", "boxwood",
      "crepe myrtle", "dogwood", "japanese maple", "magnolia",
      "maple tree", "oak tree", "orange tree", "pine tree", 
      "root stimulator for trees", "sago palm", "shrub"
    ];
    
    // Enhanced check for houseplant products
    const houseplantKeywords = [
      'money tree', 'jade', 'christmas cactus', 'cactus', 'succulent', 'bonsai', 
      'air plant', 'snake plant', 'house plant', 'houseplant', 
      'indoor plant', 'monstera', 'fiddle leaf', 'ficus', 'banana tree',
      'philodendron', 'dracaena', 'bird of paradise', 'aloe vera', 'zz plant',
      'tropical plant', 'pothos', 'bromeliad', 'african violet', 'alocasia',
      'anthurium', 'bamboo', 'brazilian wood', 'carnivorous plant', 'curry leaf',
      'elephant ear', 'hoya', 'lucky bamboo', 'orchid', 'peace lily', 'pitcher plant'
    ];
    
    // New keywords for hydro and aquatic products
    const hydroAquaticKeywords = [
      'hydro', 'aquatic', 'aquarium', 'pond', 'water garden', 'water plant', 
      'lotus', 'hydroponic', 'liquid plant food', 'water lily', 'aqua', 
      'fish tank', 'fish safe', 'water feature'
    ];
    
    // New keywords for specialty supplements
    const specialtyKeywords = [
      'supplement', 'booster', 'enhancer', 'stimulator', 'root supplement', 
      'mycorrhizal fungi', 'microbes', 'trichoderma', 'nutrient', 'bio stimulant',
      'probiotics', 'vitamins', 'kelp extract', 'worm castings', 'humic acid',
      'fulvic acid', 'silica'
    ];
    
    // New keywords for curated bundles
    const bundleKeywords = [
      'bundle', 'kit', 'collection', 'pack', 'set', 'combo', 'gift set',
      'starter kit', 'essentials', 'complete', 'package'
    ];

    // First check for bundles since they might contain other keywords
    if (
      bundleKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => bundleKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Curated Bundles";
    }
    
    // Check for hydro and aquatic products
    if (
      hydroAquaticKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => hydroAquaticKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Hydrophonic and Aquatic";
    }
    
    // Check for specialty supplements
    if (
      specialtyKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => specialtyKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Plant Supplements";
    }
    
    // Check for garden products
    if (
      gardenSpecificKeywords.some(keyword => titleLower.includes(keyword)) ||
      titleLower.includes('garden') ||
      titleLower.includes('lawn') ||
      titleLower.includes('outdoor') ||
      titleLower.includes('tree fertilizer') ||
      titleLower.includes('rose') ||
      titleLower.includes('flower') ||
      tagsLower.some(tag => tag.includes('garden')) ||
      tagsLower.some(tag => tag.includes('outdoor')) ||
      tagsLower.some(tag => tag.includes('tree')) ||
      tagsLower.some(tag => tag.includes('lawn'))
    ) {
      return "Garden Products";
    }
    
    // Check for houseplant products
    if (
      houseplantKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => tag.includes('indoor')) ||
      tagsLower.some(tag => tag.includes('houseplant'))
    ) {
      return "Houseplant Products";
    }
    
    // General fertilizer check - if it includes fertilizer but hasn't been categorized yet
    if (titleLower.includes('fertilizer') || titleLower.includes('plant food')) {
      // Check typical garden vs indoor keywords
      if (
        titleLower.includes('outdoor') || 
        titleLower.includes('garden') ||
        titleLower.includes('tree') ||
        titleLower.includes('lawn') ||
        titleLower.includes('rose') ||
        titleLower.includes('vegetable') ||
        titleLower.includes('fruit')
      ) {
        return "Garden Products";
      } else if (
        titleLower.includes('indoor') || 
        titleLower.includes('house') ||
        titleLower.includes('houseplant')
      ) {
        return "Houseplant Products";
      }
      
      // Default fertilizer to Garden Products if no other match
      return "Garden Products";
    }
    
    // General default
    return "Houseplant Products";
  };

  // Get fallback data in case API fails
  const getFallbackData = () => {
    return [
      // Houseplant Products based on the image
      {
        id: 'product-money-tree',
        name: "MONEY TREE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 876,
        bestSeller: true,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-money-tree-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-jade',
        name: "JADE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 654,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-jade-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-christmas-cactus',
        name: "CHRISTMAS CACTUS FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 532,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-christmas-cactus-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-cactus',
        name: "CACTUS FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 721,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-cactus-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-succulent',
        name: "SUCCULENT PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 802,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-succulent-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-bonsai',
        name: "BONSAI FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 468,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-bonsai-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-air-plant',
        name: "AIR PLANT FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 14.99,
        reviews: 356,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-air-plant-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-snake-plant',
        name: "SNAKE PLANT FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 589,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-snake-plant-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-house-plant',
        name: "HOUSE PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 1203,
        bestSeller: true,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-house-plant-1', title: '8 oz', price: 14.99, available: true },
          { id: 'variant-house-plant-2', title: '16 oz', price: 24.99, available: true }
        ]
      },
      {
        id: 'product-mycorrhizal',
        name: "MYCORRHIZAL FUNGI FOR HOUSEPLANTS",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 19.99,
        reviews: 245,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant-mycorrhizal-1', title: '8 oz', price: 19.99, available: true }
        ]
      },
      // Additional houseplant products from the image
      // ... (rest of the houseplant products)
      
      // Garden Products based on the second image
      {
        id: 'product-rose',
        name: "ROSE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 15.99,
        reviews: 567,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-rose-1', title: '8 oz', price: 15.99, available: true }
        ]
      },
      {
        id: 'product-tomato',
        name: "TOMATO FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 14.99,
        reviews: 452,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-tomato-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-lawn',
        name: "LAWN FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 16.99,
        reviews: 342,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-lawn-1', title: '8 oz', price: 16.99, available: true }
        ]
      },
      {
        id: 'product-vegetable',
        name: "VEGETABLE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 15.99,
        reviews: 289,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-vegetable-1', title: '8 oz', price: 15.99, available: true }
        ]
      },
      {
        id: 'product-citrus',
        name: "CITRUS FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 17.99,
        reviews: 178,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-citrus-1', title: '8 oz', price: 17.99, available: true }
        ]
      },
      // ... (other garden products if needed)
      
      // Other original products
      {
        id: 'product-5',
        name: "HERBS & LEAFY GREENS",
        description: "PLANT FOOD",
        image: "/assets/products/herbs-plant-food.png",
        price: 14.99,
        reviews: 299,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant3', title: '8 oz', price: 14.99, available: true }]
      },
      // ... (remaining original products)
    ];
  };

  // Alternative method to get products
  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch products by category...");
      
      // First try to fetch houseplant products specifically
      const houseplantProducts = await fetchHouseplantProducts();
      console.log("Fetched houseplant products:", houseplantProducts.length);
      
      // Also fetch garden products
      const gardenProducts = await fetchGardenProducts();
      console.log("Fetched garden products:", gardenProducts.length);
      
      // Fetch hydro and aquatic products
      const hydroAquaticProducts = await fetchHydroAquaticProducts();
      console.log("Fetched hydro & aquatic products:", hydroAquaticProducts.length);
      
      // Fetch specialty supplements products
      const specialtyProducts = await fetchSpecialtySupplements();
      console.log("Fetched specialty supplements:", specialtyProducts.length);
      
      // Fetch curated bundles products
      const bundleProducts = await fetchCuratedBundles();
      console.log("Fetched curated bundles:", bundleProducts.length);
      
      // Combine all categories
      const combinedProducts = [
        ...houseplantProducts, 
        ...gardenProducts, 
        ...hydroAquaticProducts,
        ...specialtyProducts,
        ...bundleProducts
      ];
      
      // Filter for available products
      const availableProducts = combinedProducts.filter(product => 
        product.variants.some(variant => variant.available)
      );
      
      if (availableProducts.length > 0) {
        console.log(`Found ${availableProducts.length} available products from categories`);
        setProducts(availableProducts);
        setLoading(false);
        return;
      }
      
      // If no specific products were found or none are available, fetch all products
      console.log("Falling back to fetching all products...");
      const allProducts = await fetchAllProducts();
      
      // If we still don't have products, use fallback
      if (!allProducts || allProducts.length === 0) {
        console.log("No products found, using fallback data");
        fetchFallbackProducts();
      }
    } catch (error) {
      console.error("Error in fetchProductsByCategory:", error);
      fetchFallbackProducts();
    }
  };

  useEffect(() => {
    // Try fetching products by category, which will first attempt to get houseplant products
    // and then fetch all other products
    fetchProductsByCategory();
    
    // Debug log to verify categories
    console.log("Available categories:", categories.map(cat => cat.category));
  }, []);
  
  // Handle location state changes
  useEffect(() => {
    // Check if we need to scroll to a specific category from location state
    if (location.state && location.state.scrollToCategory) {
      // Map navbar category names to actual category names
      const categoryMap = {
        "House Plants": "Houseplant Products",
        "Garden Products": "Garden Products",
        "Hydro & Aquatic": "Hydrophonic and Aquatic",
        "Specialty Supplements": "Plant Supplements"
      };
      
      const mappedCategory = categoryMap[location.state.scrollToCategory] || location.state.scrollToCategory;
      setActiveCategory(mappedCategory);
      setCurrentVisibleCategory(mappedCategory);
      
      console.log("Scrolling to category from location state:", mappedCategory);
      
      // Add a small delay to ensure the UI is ready before scrolling
      setTimeout(() => {
        if (categoryRefs.current[mappedCategory]) {
          // For mobile, we need to account for the fixed navbar height
          const navbarHeight = window.innerWidth < 768 ? 107 : 120;
          const yOffset = -navbarHeight - 10; // Additional 10px buffer
          
          const element = categoryRefs.current[mappedCategory];
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location]);

  // Scroll to category section when category is selected
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      console.log("Scrolling to active category:", activeCategory);
      
      // For mobile, we need to account for the fixed navbar height
      const navbarHeight = window.innerWidth < 768 ? 107 : 120;
      const yOffset = -navbarHeight - 10; // Additional 10px buffer
      
      const element = categoryRefs.current[activeCategory];
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (activeCategory) {
      console.warn("Category ref not found for:", activeCategory);
    }
  }, [activeCategory]);

  // Function to scroll the active category into view in the horizontal scrollbar
  const scrollActiveCategoryIntoView = (categoryName) => {
    if (!overlayScrollRef.current) return;
    
    // Find the button element for this category
    const categoryButtons = overlayScrollRef.current.querySelectorAll('button');
    const activeButton = Array.from(categoryButtons).find(button => 
      button.textContent.trim() === categoryName
    );
    
    if (activeButton) {
      // Calculate position to center the button in the scroll view
      const container = overlayScrollRef.current;
      const containerWidth = container.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      
      // Calculate scroll position to center the button
      const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      // Scroll smoothly
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    setActiveCategory(category);
    
    // Also set as current visible for the overlay highlighting
    setCurrentVisibleCategory(category);
    
    // Find the matching category in the original data to get its name
    const categoryObj = categories.find(cat => cat.category === category);
    if (categoryObj) {
      // After a short delay to allow the overlay to update
      setTimeout(() => {
        scrollActiveCategoryIntoView(categoryObj.name);
      }, 100);
    }
  };

  // Scroll active category into view when current visible category changes
  useEffect(() => {
    if (currentVisibleCategory && showCategoryOverlay) {
      const categoryObj = categories.find(cat => cat.category === currentVisibleCategory);
      if (categoryObj) {
        scrollActiveCategoryIntoView(categoryObj.name);
      }
    }
  }, [currentVisibleCategory, showCategoryOverlay, categories]);

  // Group products by category
  const groupedProducts = {};
  
  // Initialize empty arrays for each category
  categories.forEach(category => {
    groupedProducts[category.category] = [];
  });
  
  // Populate the grouped products
  products.forEach(product => {
    if (groupedProducts[product.category]) {
      groupedProducts[product.category].push(product);
    } else {
      console.warn(`Product category not recognized: ${product.category}`, product);
    }
  });
  
  // Log category product counts for debugging
  console.log("Product counts by category:", 
    Object.keys(groupedProducts).map(cat => `${cat}: ${groupedProducts[cat].length}`).join(", ")
  );

  // Function to fetch hydro and aquatic products
  const fetchHydroAquaticProducts = async () => {
    try {
      // Hydro & Aquatic product names from the provided list
      const hydroAquaticProducts = [
        "Liquid Plant Food", "Lotus Fertilizer", "Aquarium Plant Fertilizer",
        "Aquatic Plant Fertilizer", "Water Garden Fertilizer", "Water Plant Fertilizer",
        "Hydroponic Nutrients", "Hydroponic Plant Food"
      ];

      console.log("Fetching hydro & aquatic products by exact names...");
      
      // Create query conditions for each product name
      const titleQueries = hydroAquaticProducts.map(name => `title:'${name}'`).join(' OR ');
      
      const query = `
        {
          products(first: 100, query: "${titleQueries}") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("API returned no data or invalid response for hydro & aquatic products");
        return await fetchHydroAquaticProductsAlternative();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        console.log("Found hydro & aquatic products:", result.data.products.edges.length);
        
        // Map to our format
        const fetchedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Set all products to the Hydrophonic and Aquatic category
        fetchedProducts.forEach(product => {
          product.category = "Hydrophonic and Aquatic";
        });
        
        return fetchedProducts;
      } else {
        console.log("No hydro & aquatic products found using exact names, trying alternative approach");
        return await fetchHydroAquaticProductsAlternative();
      }
    } catch (error) {
      console.error("Error fetching hydro & aquatic products:", error);
      return await fetchHydroAquaticProductsAlternative();
    }
  };
  
  // Alternative approach for fetching hydro & aquatic products
  const fetchHydroAquaticProductsAlternative = async () => {
    try {
      console.log("Using alternative approach for hydro & aquatic products...");
      
      // Try a simplified query for common hydro & aquatic terms
      const query = `
        {
          products(first: 100, query: "hydroponic OR aquatic OR aquarium OR water garden OR lotus") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("Alternative API query returned no data for hydro & aquatic products");
        // Return fallback hydro products
        return getFallbackHydroAquaticProducts();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const mappedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter to only include products that should go into the Hydro category
        const hydroProducts = mappedProducts.filter(product => 
          determineProductCategory(product.name, []) === "Hydrophonic and Aquatic"
        );
        
        console.log("Found alternative hydro & aquatic products:", hydroProducts.length);
        return hydroProducts.length > 0 ? hydroProducts : getFallbackHydroAquaticProducts();
      } else {
        console.log("No hydro & aquatic products found with alternative approach");
        return getFallbackHydroAquaticProducts();
      }
    } catch (error) {
      console.error("Error in alternative hydro & aquatic products approach:", error);
      return getFallbackHydroAquaticProducts();
    }
  };

  // Get fallback hydro and aquatic products
  const getFallbackHydroAquaticProducts = () => {
    return [
      {
        id: 'product-aquatic',
        name: "AQUATIC PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/aquatic-plant-food.png", 
        price: 16.99,
        reviews: 124,
        category: "Hydrophonic and Aquatic",
        backgroundColorLight: "#d6eaf8",
        variants: [
          { id: 'variant-aquatic-1', title: '8 oz', price: 16.99, available: true }
        ]
      },
      {
        id: 'product-hydroponic',
        name: "HYDROPONIC PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/hydroponic-food.png", 
        price: 19.99,
        reviews: 98,
        category: "Hydrophonic and Aquatic",
        backgroundColorLight: "#d6eaf8",
        variants: [
          { id: 'variant-hydroponic-1', title: '8 oz', price: 19.99, available: true }
        ]
      },
      {
        id: 'product-lotus',
        name: "LOTUS FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/lotus-fertilizer.png", 
        price: 18.99,
        reviews: 65,
        category: "Hydrophonic and Aquatic",
        backgroundColorLight: "#d6eaf8",
        variants: [
          { id: 'variant-lotus-1', title: '8 oz', price: 18.99, available: true }
        ]
      },
      {
        id: 'product-water-garden',
        name: "WATER GARDEN FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/water-garden.png", 
        price: 17.99,
        reviews: 82,
        category: "Hydrophonic and Aquatic",
        backgroundColorLight: "#d6eaf8",
        variants: [
          { id: 'variant-water-garden-1', title: '8 oz', price: 17.99, available: true }
        ]
      }
    ];
  };

  // Function to fetch specialty supplements products
  const fetchSpecialtySupplements = async () => {
    try {
      // Specialty supplements product names
      const specialtyProducts = [
        "Root Supplement", "Plant Nutrient Boost", "Soil Enhancer",
        "Growth Stimulator", "Bloom Booster", "Mycorrhizal Fungi",
        "Root Stimulator", "Soil Microbes", "Trichoderma",
        "Nutrient Pack", "Bio Stimulant", "Plant Probiotics",
        "Plant Vitamins", "Kelp Extract", "Worm Castings",
        "Humic Acid", "Fulvic Acid", "Silica Supplement"
      ];

      console.log("Fetching specialty supplements by exact names...");
      
      // Create query conditions for each product name
      const titleQueries = specialtyProducts.map(name => `title:'${name}'`).join(' OR ');
      
      const query = `
        {
          products(first: 100, query: "${titleQueries}") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("API returned no data or invalid response for specialty supplements");
        return await fetchSpecialtySupplementsAlternative();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        console.log("Found specialty supplements products:", result.data.products.edges.length);
        
        // Map to our format
        const fetchedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Set all products to the Plant Supplements category
        fetchedProducts.forEach(product => {
          product.category = "Plant Supplements";
        });
        
        return fetchedProducts;
      } else {
        console.log("No specialty supplements found using exact names, trying alternative approach");
        return await fetchSpecialtySupplementsAlternative();
      }
    } catch (error) {
      console.error("Error fetching specialty supplements:", error);
      return await fetchSpecialtySupplementsAlternative();
    }
  };

  // Alternative approach for fetching specialty supplements
  const fetchSpecialtySupplementsAlternative = async () => {
    try {
      console.log("Using alternative approach for specialty supplements...");
      
      // Try a simplified query for common specialty supplement terms
      const query = `
        {
          products(first: 100, query: "supplement OR nutrient OR stimulator OR booster OR microbes OR enhancer") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("Alternative API query returned no data for specialty supplements");
        // Return fallback specialty products
        return getFallbackSpecialtyProducts();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const mappedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter to only include products that should go into the Plant Supplements category
        const specialtyProducts = mappedProducts.filter(product => 
          determineProductCategory(product.name, []) === "Plant Supplements"
        );
        
        console.log("Found alternative specialty supplements:", specialtyProducts.length);
        return specialtyProducts.length > 0 ? specialtyProducts : getFallbackSpecialtyProducts();
      } else {
        console.log("No specialty supplements found with alternative approach");
        return getFallbackSpecialtyProducts();
      }
    } catch (error) {
      console.error("Error in alternative specialty supplements approach:", error);
      return getFallbackSpecialtyProducts();
    }
  };

  // Get fallback specialty supplement products
  const getFallbackSpecialtyProducts = () => {
    return [
      {
        id: 'product-root-supplement',
        name: "ROOT SUPPLEMENT",
        description: "PLANT FOOD",
        image: "/assets/products/root-supplement.png", 
        price: 21.99,
        reviews: 145,
        category: "Plant Supplements",
        backgroundColorLight: "#f9e6d2",
        variants: [
          { id: 'variant-root-supplement-1', title: '8 oz', price: 21.99, available: true }
        ]
      },
      {
        id: 'product-mycorrhizal',
        name: "MYCORRHIZAL FUNGI",
        description: "PLANT FOOD",
        image: "/assets/products/mycorrhizal-fungi.png", 
        price: 24.99,
        reviews: 132,
        bestSeller: true,
        category: "Plant Supplements",
        backgroundColorLight: "#f9e6d2",
        variants: [
          { id: 'variant-mycorrhizal-1', title: '8 oz', price: 24.99, available: true }
        ]
      },
      {
        id: 'product-growth-stimulator',
        name: "GROWTH STIMULATOR",
        description: "PLANT FOOD",
        image: "/assets/products/growth-stimulator.png", 
        price: 19.99,
        reviews: 89,
        category: "Plant Supplements",
        backgroundColorLight: "#f9e6d2",
        variants: [
          { id: 'variant-growth-stimulator-1', title: '8 oz', price: 19.99, available: true }
        ]
      },
      {
        id: 'product-bloom-booster',
        name: "BLOOM BOOSTER",
        description: "PLANT FOOD",
        image: "/assets/products/bloom-booster.png", 
        price: 18.99,
        reviews: 112,
        category: "Plant Supplements",
        backgroundColorLight: "#f9e6d2",
        variants: [
          { id: 'variant-bloom-booster-1', title: '8 oz', price: 18.99, available: true }
        ]
      }
    ];
  };

  // Function to fetch curated bundles products
  const fetchCuratedBundles = async () => {
    try {
      // Curated bundles product names
      const bundleProducts = [
        "Houseplant Bundle", "Starter Kit", "Garden Essentials Pack",
        "Plant Care Collection", "Indoor Bundle", "Outdoor Bundle",
        "Complete Care Kit", "Specialty Plants Bundle", "Fertilizer Collection",
        "Grower's Pack", "Seasonal Bundle", "Gift Set"
      ];

      console.log("Fetching curated bundles by exact names...");
      
      // Create query conditions for each product name
      const titleQueries = bundleProducts.map(name => `title:'${name}'`).join(' OR ');
      
      const query = `
        {
          products(first: 100, query: "${titleQueries} OR tag:bundle OR tag:collection OR tag:kit") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("API returned no data or invalid response for curated bundles");
        return await fetchCuratedBundlesAlternative();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        console.log("Found curated bundles:", result.data.products.edges.length);
        
        // Map to our format
        const fetchedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Set all products to the Curated Bundles category
        fetchedProducts.forEach(product => {
          product.category = "Curated Bundles";
        });
        
        return fetchedProducts;
      } else {
        console.log("No curated bundles found using exact names, trying alternative approach");
        return await fetchCuratedBundlesAlternative();
      }
    } catch (error) {
      console.error("Error fetching curated bundles:", error);
      return await fetchCuratedBundlesAlternative();
    }
  };

  // Alternative approach for fetching curated bundles
  const fetchCuratedBundlesAlternative = async () => {
    try {
      console.log("Using alternative approach for curated bundles...");
      
      // Try a simplified query for common bundle terms
      const query = `
        {
          products(first: 100, query: "bundle OR kit OR collection OR pack OR set") {
            pageInfo {
              hasNextPage
              endCursor
            }
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
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                      sku
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        transformedSrc
                        altText
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
      
      if (!result || !result.data) {
        console.error("Alternative API query returned no data for curated bundles");
        // Return fallback bundle products
        return getFallbackBundleProducts();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const mappedProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter to only include products that should go into the Curated Bundles category
        const bundleProducts = mappedProducts.filter(product => 
          determineProductCategory(product.name, []) === "Curated Bundles"
        );
        
        console.log("Found alternative curated bundles:", bundleProducts.length);
        return bundleProducts.length > 0 ? bundleProducts : getFallbackBundleProducts();
      } else {
        console.log("No curated bundles found with alternative approach");
        return getFallbackBundleProducts();
      }
    } catch (error) {
      console.error("Error in alternative curated bundles approach:", error);
      return getFallbackBundleProducts();
    }
  };

  // Get fallback bundle products
  const getFallbackBundleProducts = () => {
    return [
      {
        id: 'product-houseplant-bundle',
        name: "HOUSEPLANT BUNDLE",
        description: "PLANT FOOD",
        image: "/assets/products/houseplant-bundle.png", 
        price: 44.99,
        reviews: 78,
        bestSeller: true,
        category: "Curated Bundles",
        backgroundColorLight: "#f0e6f5",
        variants: [
          { id: 'variant-houseplant-bundle-1', title: 'Complete Set', price: 44.99, available: true }
        ]
      },
      {
        id: 'product-starter-kit',
        name: "PLANT CARE STARTER KIT",
        description: "PLANT FOOD",
        image: "/assets/products/starter-kit.png", 
        price: 39.99,
        reviews: 56,
        category: "Curated Bundles",
        backgroundColorLight: "#f0e6f5",
        variants: [
          { id: 'variant-starter-kit-1', title: 'Basic Kit', price: 39.99, available: true }
        ]
      },
      {
        id: 'product-garden-essentials',
        name: "GARDEN ESSENTIALS PACK",
        description: "PLANT FOOD",
        image: "/assets/products/garden-essentials.png", 
        price: 49.99,
        reviews: 43,
        category: "Curated Bundles",
        backgroundColorLight: "#f0e6f5",
        variants: [
          { id: 'variant-garden-essentials-1', title: 'Complete Pack', price: 49.99, available: true }
        ]
      },
      {
        id: 'product-seasonal-bundle',
        name: "SEASONAL GROWTH BUNDLE",
        description: "PLANT FOOD",
        image: "/assets/products/seasonal-bundle.png", 
        price: 54.99,
        reviews: 32,
        category: "Curated Bundles",
        backgroundColorLight: "#f0e6f5",
        variants: [
          { id: 'variant-seasonal-bundle-1', title: 'Full Set', price: 54.99, available: true }
        ]
      }
    ];
  };

  // Get fallback garden products
  const getFallbackGardenProducts = () => {
    return [
      {
        id: 'product-rose',
        name: "ROSE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/rose-fertilizer.png", 
        price: 15.99,
        reviews: 567,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-rose-1', title: '8 oz', price: 15.99, available: true }
        ]
      },
      {
        id: 'product-tomato',
        name: "TOMATO FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/tomato-fertilizer.png", 
        price: 14.99,
        reviews: 452,
        bestSeller: true,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-tomato-1', title: '8 oz', price: 14.99, available: true }
        ]
      },
      {
        id: 'product-lawn',
        name: "LAWN FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/lawn-fertilizer.png", 
        price: 16.99,
        reviews: 342,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-lawn-1', title: '8 oz', price: 16.99, available: true }
        ]
      },
      {
        id: 'product-citrus',
        name: "CITRUS FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/citrus-fertilizer.png", 
        price: 17.99,
        reviews: 178,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [
          { id: 'variant-citrus-1', title: '8 oz', price: 17.99, available: true }
        ]
      }
    ];
  };

  // Function to handle See All button click
  const handleSeeAllClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-[#fffbef]">
      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/products" className="block relative rounded-lg overflow-hidden w-full h-48 sm:h-72 md:h-96 cursor-pointer">
          <img 
            src="/assets/team-planting.jpg" 
            alt="Team planting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity duration-300"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Premium Plant Food
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl drop-shadow-md">
              For Healthier, Happier Plants
            </p>
          </div>
        </Link>
      </div>

      {/* Page Title */}
      <div className="text-center pt-8 mb-6">
        <h2 className="text-4xl font-medium text-[#ff6b57] mb-1">Find Your Plant</h2>
        <p className="text-gray-500 tracking-wide text-sm">CHOOSE A COLLECTION</p>
      </div>

      {/* Category Selection */}
      <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 px-4 scrollbar-hide">
        <div className="flex space-x-3 sm:space-x-6 mb-8 sm:mb-12 sm:flex-wrap sm:justify-center">
          {categories.map((category, index) => (
            <button 
              key={index}
              onClick={() => handleCategoryClick(category.category)}
              className={`flex flex-col items-center group w-20 sm:w-24 focus:outline-none flex-shrink-0 sm:flex-shrink sm:mb-4 ${
                activeCategory === category.category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`overflow-hidden rounded-md mb-2 w-16 h-16 sm:w-20 sm:h-20 ${
                activeCategory === category.category ? 'ring-2 ring-[#ff6b57]' : ''
              }`}>
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load category image: ${category.image}`);
                    e.target.src = "/assets/Collection Tiles Images/default-category.jpg";
                  }}
                />
              </div>
              <span className="font-medium text-gray-800 text-center text-xs">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Navigation Overlay - shown when scrolled down */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white bg-opacity-95 shadow-lg border-t border-gray-200 transition-all duration-300 transform ${
          showCategoryOverlay ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto py-2 px-4">
          <div className="flex items-center justify-between">
            <div 
              ref={overlayScrollRef}
              className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1 pt-1 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((category, index) => {
                // Determine if this category is active (either clicked or currently visible)
                const isActive = activeCategory === category.category || 
                              (!activeCategory && currentVisibleCategory === category.category);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.category)}
                    className={`whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? 'bg-[#ff6b57] text-white font-medium shadow-sm scale-105' 
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#ff6b57] text-white p-2 rounded-full shadow-md hover:bg-[#e55c4a] flex-shrink-0 ml-2 transform hover:scale-105 transition-transform"
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products by Category */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {categories.map((category, index) => {
            const categoryProducts = groupedProducts[category.category] || [];
            
            // Always render the category section, even if empty - we'll show a message
            return (
              <div 
                key={category.category} 
                className="mb-16"
                ref={el => categoryRefs.current[category.category] = el}
                id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Category Banner */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <Link 
                    to={`/category/${encodeURIComponent(category.category)}`}
                    className="block relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-cover bg-center rounded-lg cursor-pointer"
                    style={{ 
                      backgroundColor: '#f0f0f0' // Fallback color in case image doesn't load
                    }}
                  >
                    {/* Image with fallback handling */}
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${category.image}`);
                        e.target.style.backgroundColor = '#f0f0f0';
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
                      <div>
                        <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">
                          Grow beautiful
                        </h1>
                        <h2 className="text-white text-5xl md:text-6xl font-bold">
                          {category.name}
                        </h2>
                      </div>
                    </div>
                    
                    {/* See All Button */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-8 md:pr-16">
                      <div 
                        className="bg-white text-[#ff6b57] px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#ff6b57] hover:text-white transition-colors duration-200"
                      >
                        See All
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-600">No products available in this category</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Add some bottom padding to ensure content isn't hidden behind the overlay */}
      <div className="h-16 sm:h-20"></div>
    </section>
  );
};

// Add a CSS rule for hiding scrollbars to the component export
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default ProductsPage; 