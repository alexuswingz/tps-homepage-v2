import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LeafDivider from './LeafDivider';
import { useCart } from './CartContext';
import { useNav } from './NavContext';
import ProductCard from './ProductCard';

// Import data files like ShopByPlantSimple
import { houseplantProductNames, fetchAllHouseplantProducts } from '../data/houseplantProducts';
import { gardenProductNames, fetchAllGardenProducts } from '../data/gardenProducts';
import { hydroponicAquaticProductNames, fetchAllHydroponicAquaticProducts } from '../data/hydroponicAquaticProducts';
import { specialtySupplementNames, fetchAllSpecialtySupplements } from '../data/specialtySupplements';

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

// Background gradient styles for each product card (same as ShopByPlantSimple)
const cardBackgrounds = [
  'bg-[#def0f9]', // Default light blue color
  'bg-[#def0f9]', // Default light blue color
  'bg-[#def0f9]', // Default light blue color
  'bg-[#def0f9]'  // Default light blue color
];

// Global debounce mechanism to prevent multiple rapid calls
const addToCartDebounce = new Map();

// Shop All Card Component
const ShopAllCard = ({ category, index }) => {
  const navigate = useNavigate();
  
  const handleShopAllClick = () => {
    navigate(`/category/${encodeURIComponent(category.category)}`);
  };
  
  return (
    <div className="flex items-center justify-center h-full">
      {/* Shop All button - centered in the grid space */}
      <button 
        onClick={handleShopAllClick}
        className="w-3/4 font-bold text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white shadow-sm"
      >
        SHOP ALL
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};





// Get product names from data files by category (from ShopByPlantSimple)
const getProductNamesByCategory = (category) => {
  const categoryProductNames = {
    "Houseplant Products": houseplantProductNames,
    "Garden Products": gardenProductNames,
    "Hydrophonic and Aquatic": hydroponicAquaticProductNames,
    "Plant Supplements": specialtySupplementNames
  };

  return categoryProductNames[category] || [];
};

// Filter products to ensure they belong to the correct category (from ShopByPlantSimple)
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

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileMenuOpen } = useNav();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVisibleCategory, setCurrentVisibleCategory] = useState("");
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [showMobileCategorySticky, setShowMobileCategorySticky] = useState(false);
  const [mobileCategoryExpanded, setMobileCategoryExpanded] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [categoryLoadingStatus, setCategoryLoadingStatus] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryRefs = useRef({});
  const observerRef = useRef(null);
  const overlayScrollRef = useRef(null);
  const scrollAttempts = useRef(0);
  const mobileCategoryStickyRef = useRef(null);

  // Hook to detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Separate effect to handle mobile menu state changes immediately
  useEffect(() => {
    // Immediately hide sticky when mobile menu opens
    if (mobileMenuOpen && window.innerWidth < 768) {
      setShowMobileCategorySticky(false);
    } else if (!mobileMenuOpen && window.innerWidth < 768) {
      // Re-evaluate if sticky should be shown when menu closes
      const scrollPosition = window.scrollY;
      // Show sticky if scrolled past category list AND there's either an active category OR a visible category
      const shouldShowMobileSticky = scrollPosition > 200 && (activeCategory || currentVisibleCategory) && !mobileMenuOpen;
      console.log('Mobile sticky logic:', { 
        scrollPosition, 
        activeCategory, 
        currentVisibleCategory, 
        mobileMenuOpen, 
        shouldShowMobileSticky,
        currentShowState: showMobileCategorySticky
      });
      setShowMobileCategorySticky(shouldShowMobileSticky);
    }
  }, [mobileMenuOpen, activeCategory, currentVisibleCategory]);

  // Track scroll position to show/hide the category overlay
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowCategoryOverlay(scrollPosition > 400);
      
      // Mobile sticky category logic
      if (window.innerWidth < 768) { // Mobile breakpoint
        // Show sticky when scrolled past the mobile category list (around 200px) and there's either 
        // an active category (user clicked) OR a currently visible category (from intersection observer)
        // but hide when mobile menu is open
        const shouldShowMobileSticky = scrollPosition > 200 && (activeCategory || currentVisibleCategory) && !mobileMenuOpen;
        console.log('Mobile sticky logic:', { 
          scrollPosition, 
          activeCategory, 
          currentVisibleCategory, 
          mobileMenuOpen, 
          shouldShowMobileSticky,
          currentShowState: showMobileCategorySticky
        });
        setShowMobileCategorySticky(shouldShowMobileSticky);
        
        // Note: Removed auto-close on scroll to allow users to interact with dropdown
      } else {
        // Hide mobile sticky on desktop
        setShowMobileCategorySticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Run once on mount to check initial position
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory, currentVisibleCategory, mobileMenuOpen]);
  
  // Set up intersection observer to detect which category is currently visible
  useEffect(() => {
    if (products.length === 0) return;
    
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Adjust rootMargin based on device type
    const isMobile = window.innerWidth < 768;
    const options = {
      root: null, // use viewport
      rootMargin: isMobile ? '-120px 0px -150px 0px' : '-100px 0px -300px 0px', // More appropriate for mobile
      threshold: 0.1
    };
    
    // Create observer
    observerRef.current = new IntersectionObserver((entries) => {
      // Don't update category if we're in the middle of programmatic scrolling
      if (isProgrammaticScroll) {
        console.log('Skipping intersection update - programmatic scroll in progress');
        return;
      }
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id;
          console.log('Intersection detected for:', categoryId);
          
          // Extract category name from element ID (format: category-xxx-xxx)
          if (categoryId && categoryId.startsWith('category-')) {
            const categorySlug = categoryId.replace('category-', '');
            console.log('Category slug:', categorySlug);
            
            // Find the matching category from our categories array by converting category name to slug format
            const matchedCategory = categories.find(cat => {
              const categorySlugFromName = cat.category.toLowerCase().replace(/\s+/g, '-');
              console.log('Comparing:', categorySlugFromName, 'with', categorySlug);
              return categorySlugFromName === categorySlug;
            });
            
            if (matchedCategory) {
              console.log('Setting currentVisibleCategory to:', matchedCategory.category);
              setCurrentVisibleCategory(matchedCategory.category);
            } else {
              console.warn('No matching category found for slug:', categorySlug);
            }
          }
        }
      });
    }, options);
    
    // Observe each category section
    const refsToObserve = Object.values(categoryRefs.current).filter(ref => ref !== null);
    console.log('Setting up intersection observer for', refsToObserve.length, 'category sections');
    
    refsToObserve.forEach(ref => {
      if (ref) {
        console.log('Observing element with ID:', ref.id);
        observerRef.current.observe(ref);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products, categories, isProgrammaticScroll]);

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
      // Top 5 houseplant product names in priority order
      const topHouseplantProducts = [
        "Monstera Plant Food",
        "Indoor Plant Food", 
        "Fiddle Leaf Fig Plant Food",
        "Christmas Cactus Fertilizer",
        "Bird of Paradise Fertilizer"
      ];
      
      // Additional houseplant products to fetch
      const additionalHouseplantProducts = [
        "Money Tree Fertilizer", "Jade Fertilizer",
        "Cactus Fertilizer", "Succulent Plant Food", "Bonsai Fertilizer",
        "Air Plant Fertilizer", "Snake Plant Fertilizer", "House Plant Food",
        "Mycorrhizal Fungi for Houseplants", "Granular Houseplant Food", 
        "Granular Monstera Fertilizer", "Granular Lemon Tree Fertilizer",
        "Granular Indoor Plant Food", "Granular Fig Tree Fertilizer", 
        "Granular Bonsai Fertilizer", "Monstera Root Supplement",
        "Houseplant Root Supplement", "Succulent Root Supplement",
        "Ficus Root Supplement", "Orchid Root Supplement",
        "Instant Plant Food", "Ficus Fertilizer", "Banana Tree Fertilizer", 
        "Philodendron Fertilizer", "Dracaena Fertilizer",
        "Aloe Vera Fertilizer", "ZZ Plant Fertilizer",
        "Tropical Plant Fertilizer", "Pothos Fertilizer", "Bromeliad Fertilizer",
        "African Violet Fertilizer", "Alocasia Fertilizer", "Anthurium Fertilizer", 
        "Bamboo Fertilizer", "Brazilian Wood Plant Food", "Carnivorous Plant Food", 
        "Curry Leaf Plant Fertilizer", "Elephant Ear Fertilizer", "Hoya Fertilizer", 
        "Lucky Bamboo Fertilizer", "Orchid Plant Food", "Peace Lily Fertilizer", "Pitcher Plant Food"
      ];
      
      // Combine lists with top products first
      const allHouseplantProducts = [...topHouseplantProducts, ...additionalHouseplantProducts];

      console.log("Fetching houseplant products by exact names...");
      
      // Create query conditions for each product name
      const titleQueries = allHouseplantProducts.map(name => `title:'${name}'`).join(' OR ');
      
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
        
        // FORCE all products to the Houseplant Products category for these specific products
        fetchedProducts.forEach(product => {
          product.category = "Houseplant Products";
          console.log(`FORCED category assignment: "${product.name}" → Houseplant Products`);
        });
        
        // Sort products by the priority order of top products
        const sortedProducts = fetchedProducts.sort((a, b) => {
          const aIndex = topHouseplantProducts.findIndex(name => 
            a.name.toLowerCase().includes(name.toLowerCase()) || 
            name.toLowerCase().includes(a.name.toLowerCase())
          );
          const bIndex = topHouseplantProducts.findIndex(name => 
            b.name.toLowerCase().includes(name.toLowerCase()) || 
            name.toLowerCase().includes(b.name.toLowerCase())
          );
          
          // If both products are in top 5, sort by their index
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one is in top 5, prioritize it
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither is in top 5, maintain original order
          return 0;
        });
        
        return sortedProducts;
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
        console.error("Alternative API returned no data");
        return getFallbackHouseplantProducts();
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        console.log("Found alternative houseplant products:", result.data.products.edges.length);
        
        // Filter for houseplant-related products
        const houseplantProducts = result.data.products.edges
          .map(mapProductFromShopify)
          .filter(product => {
            const titleLower = product.name.toLowerCase();
            return titleLower.includes('indoor') || 
                   titleLower.includes('houseplant') || 
                   titleLower.includes('monstera') ||
                   titleLower.includes('fiddle') ||
                   titleLower.includes('cactus') ||
                   titleLower.includes('bird of paradise') ||
                   product.category === "Houseplant Products";
          });
        
        // Set category for all filtered products
        houseplantProducts.forEach(product => {
          product.category = "Houseplant Products";
        });
        
        return houseplantProducts.length > 0 ? houseplantProducts : getFallbackHouseplantProducts();
      } else {
        console.log("No alternative houseplant products found, using fallback");
        return getFallbackHouseplantProducts();
      }
    } catch (error) {
      console.error("Error in alternative houseplant fetch:", error);
      return getFallbackHouseplantProducts();
    }
  };

  // Function to get fallback houseplant products when API fails
  const getFallbackHouseplantProducts = () => {
    console.log("Using fallback houseplant products");
    
    return [
      {
        id: 'monstera-plant-food',
        name: 'MONSTERA PLANT FOOD',
        description: 'PLANT FOOD',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Monstera_8oz_Wrap.png',
        price: 14.99,
        reviews: 1458,
        rating: 4.9,
        bestSeller: true,
        category: 'Houseplant Products',
        backgroundColorLight: '#e0f5ed',
        variants: [
          { id: 'monstera-8oz', title: '8 Ounces', price: 14.99, available: true },
          { id: 'monstera-16oz', title: '16 Ounces', price: 24.99, available: true },
          { id: 'monstera-32oz', title: '32 Ounces', price: 39.99, available: true }
        ]
      },
      {
        id: 'indoor-plant-food',
        name: 'INDOOR PLANT FOOD',
        description: 'PLANT FOOD',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Indoor_8oz_Wrap.png',
        price: 14.99,
        reviews: 1203,
        rating: 4.8,
        bestSeller: true,
        category: 'Houseplant Products',
        backgroundColorLight: '#e0f5ed',
        variants: [
          { id: 'indoor-8oz', title: '8 Ounces', price: 14.99, available: true },
          { id: 'indoor-16oz', title: '16 Ounces', price: 24.99, available: true },
          { id: 'indoor-32oz', title: '32 Ounces', price: 39.99, available: true }
        ]
      },
      {
        id: 'fiddle-leaf-fig-plant-food',
        name: 'FIDDLE LEAF FIG PLANT FOOD',
        description: 'PLANT FOOD',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fiddle Leaf Fig_8oz_Wrap.png',
        price: 14.99,
        reviews: 987,
        rating: 4.8,
        bestSeller: false,
        category: 'Houseplant Products',
        backgroundColorLight: '#e0f5ed',
        variants: [
          { id: 'fiddle-8oz', title: '8 Ounces', price: 14.99, available: true },
          { id: 'fiddle-16oz', title: '16 Ounces', price: 24.99, available: true }
        ]
      },
      {
        id: 'christmas-cactus-fertilizer',
        name: 'CHRISTMAS CACTUS FERTILIZER',
        description: 'PLANT FOOD',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Christmas Cactus_8oz_Wrap.png',
        price: 14.99,
        reviews: 742,
        rating: 4.7,
        bestSeller: false,
        category: 'Houseplant Products',
        backgroundColorLight: '#e0f5ed',
        variants: [
          { id: 'christmas-cactus-8oz', title: '8 Ounces', price: 14.99, available: true },
          { id: 'christmas-cactus-16oz', title: '16 Ounces', price: 24.99, available: true }
        ]
      },
      {
        id: 'bird-of-paradise-fertilizer',
        name: 'BIRD OF PARADISE FERTILIZER',
        description: 'PLANT FOOD',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Bird of Paradise_8oz_Wrap.png',
        price: 14.99,
        reviews: 623,
        rating: 4.6,
        bestSeller: false,
        category: 'Houseplant Products',
        backgroundColorLight: '#e0f5ed',
        variants: [
          { id: 'bird-paradise-8oz', title: '8 Ounces', price: 14.99, available: true },
          { id: 'bird-paradise-16oz', title: '16 Ounces', price: 24.99, available: true }
        ]
      }
    ];
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
          console.log(`FORCED category assignment: "${product.name}" → Garden Products`);
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
      available: edge.node.availableForSale && edge.node.quantityAvailable > 0,
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
    
    // Enhanced best seller detection
    const bestSeller = node.tags.some(tag => 
      tag.toLowerCase().includes('best') && tag.toLowerCase().includes('seller')
    ) || Math.random() < 0.2; // Add some randomness for demo
    
    const reviewCount = Math.floor(Math.random() * 1500) + 50; // Random review count for demonstration
    
    const mappedProduct = {
      id: node.id,
      name: node.title,
      description: "PLANT FOOD",
      image: images.length > 0 ? images[0].src : "/assets/products/indoor-plant-food.png",
      price: defaultVariant ? defaultVariant.price : (parseFloat(node.priceRange.minVariantPrice.amount) || 14.99),
      reviews: reviewCount,
      rating: (Math.random() * (5 - 4) + 4).toFixed(1),
      bestSeller: bestSeller,
      category: category,
      backgroundColorLight: background.light,
      variants: variants.length > 0 ? variants : [
        { 
          id: `${node.id}-default`, 
          title: '8 Ounce', 
          price: parseFloat(node.priceRange.minVariantPrice.amount) || 14.99, 
          available: true, 
          quantity: 100 
        }
      ]
    };
    
    console.log(`Mapped product "${mappedProduct.name}" to category: ${mappedProduct.category}`);
    return mappedProduct;
  };

  // Function to determine product category based on title and tags
  const determineProductCategory = (title, tags) => {
    const titleLower = title.toLowerCase();
    const tagsLower = tags ? tags.map(tag => tag.toLowerCase()) : [];
    
    // Enhanced Garden products keywords with more specific patterns
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
      "root stimulator for trees", "sago palm", "shrub", "jasmine"
    ];
    
    // Enhanced houseplant keywords with more specific patterns
    const houseplantKeywords = [
      'money tree', 'jade', 'christmas cactus', 'cactus', 'succulent', 'bonsai', 
      'air plant', 'snake plant', 'house plant', 'houseplant', 
      'indoor plant', 'monstera', 'fiddle leaf', 'ficus', 'banana tree',
      'philodendron', 'dracaena', 'bird of paradise', 'aloe vera', 'zz plant',
      'tropical plant', 'pothos', 'bromeliad', 'african violet', 'alocasia',
      'anthurium', 'bamboo', 'brazilian wood', 'carnivorous plant', 'curry leaf',
      'elephant ear', 'hoya', 'lucky bamboo', 'orchid', 'peace lily', 'pitcher plant'
    ];
    
    // Enhanced hydro and aquatic keywords
    const hydroAquaticKeywords = [
      'hydroponic', 'aquatic', 'aquarium', 'pond', 'water garden', 'water plant', 
      'lotus', 'liquid plant food', 'water lily', 'aqua', 
      'fish tank', 'fish safe', 'water feature', 'hydroponic nutrients'
    ];
    
    // Enhanced specialty supplements keywords
    const specialtyKeywords = [
      'supplement', 'booster', 'enhancer', 'stimulator', 'root supplement', 
      'mycorrhizal fungi', 'microbes', 'trichoderma', 'nutrient', 'bio stimulant',
      'probiotics', 'vitamins', 'kelp extract', 'worm castings', 'humic acid',
      'fulvic acid', 'silica', 'ferrous sulfate', 'calcium for plants', 
      'potassium fertilizer', 'nitrogen', 'phosphorus', 'fish emulsion'
    ];
    
    // Enhanced bundle keywords
    const bundleKeywords = [
      'bundle', 'kit', 'collection', 'pack', 'set', 'combo', 'gift set',
      'starter kit', 'essentials', 'complete', 'package'
    ];

    // Debug logging for categorization
    console.log(`Categorizing product: "${title}" with tags:`, tags);

    // First check for bundles since they might contain other keywords
    if (
      bundleKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => bundleKeywords.some(keyword => tag.includes(keyword)))
    ) {
      console.log(`→ Categorized as Curated Bundles`);
      return "Curated Bundles";
    }
    
    // Check for hydro and aquatic products (more specific matching)
    if (
      hydroAquaticKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => hydroAquaticKeywords.some(keyword => tag.includes(keyword))) ||
      (titleLower.includes('hydro') && !titleLower.includes('hydrangea')) ||
      titleLower.includes('aquatic')
    ) {
      console.log(`→ Categorized as Hydrophonic and Aquatic`);
      return "Hydrophonic and Aquatic";
    }
    
    // Check for specialty supplements (enhanced matching)
    if (
      specialtyKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => specialtyKeywords.some(keyword => tag.includes(keyword))) ||
      (titleLower.includes('supplement') && !titleLower.includes('tree')) ||
      titleLower.includes('stimulator') ||
      titleLower.includes('booster')
    ) {
      console.log(`→ Categorized as Plant Supplements`);
      return "Plant Supplements";
    }
    
    // Check for garden products (comprehensive matching)
    if (
      gardenSpecificKeywords.some(keyword => titleLower.includes(keyword)) ||
      titleLower.includes('garden') ||
      titleLower.includes('lawn') ||
      titleLower.includes('outdoor') ||
      titleLower.includes('tree fertilizer') ||
      titleLower.includes('rose') ||
      titleLower.includes('flower') ||
      titleLower.includes('vegetable') ||
      titleLower.includes('fruit') ||
      tagsLower.some(tag => tag.includes('garden')) ||
      tagsLower.some(tag => tag.includes('outdoor')) ||
      tagsLower.some(tag => tag.includes('tree')) ||
      tagsLower.some(tag => tag.includes('lawn')) ||
      // Enhanced tree detection
      (titleLower.includes('tree') && !titleLower.includes('money tree'))
    ) {
      console.log(`→ Categorized as Garden Products`);
      return "Garden Products";
    }
    
    // Check for houseplant products (enhanced matching)
    if (
      houseplantKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => tag.includes('indoor')) ||
      tagsLower.some(tag => tag.includes('houseplant')) ||
      titleLower.includes('indoor') ||
      titleLower.includes('houseplant')
    ) {
      console.log(`→ Categorized as Houseplant Products`);
      return "Houseplant Products";
    }
    
    // General fertilizer check - if it includes fertilizer but hasn't been categorized yet
    if (titleLower.includes('fertilizer') || titleLower.includes('plant food')) {
      // Check typical garden vs indoor keywords with enhanced logic
      if (
        titleLower.includes('outdoor') || 
        titleLower.includes('garden') ||
        titleLower.includes('tree') ||
        titleLower.includes('lawn') ||
        titleLower.includes('rose') ||
        titleLower.includes('vegetable') ||
        titleLower.includes('fruit') ||
        titleLower.includes('citrus') ||
        titleLower.includes('berry')
      ) {
        console.log(`→ Categorized as Garden Products (fertilizer fallback)`);
        return "Garden Products";
      } else if (
        titleLower.includes('indoor') || 
        titleLower.includes('house') ||
        titleLower.includes('houseplant') ||
        titleLower.includes('monstera') ||
        titleLower.includes('fiddle') ||
        titleLower.includes('cactus')
      ) {
        console.log(`→ Categorized as Houseplant Products (fertilizer fallback)`);
        return "Houseplant Products";
      }
      
      // Default fertilizer to Garden Products if no other match
      console.log(`→ Categorized as Garden Products (default fertilizer)`);
      return "Garden Products";
    }
    
    // General default for unmatched products
    console.log(`→ Categorized as Houseplant Products (default)`);
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

  // Progressive loading - load categories one by one and show immediately
  const loadCategoryProducts = async (category, isInitialLoad = false) => {
    console.log(`Loading products for category: ${category}`);
    
    // Set loading status for this category
    setCategoryLoadingStatus(prev => ({
      ...prev,
      [category]: 'loading'
    }));

    try {
      let productData = [];
      
      // Get all product names for the category from data files
      const allProductNames = getProductNamesByCategory(category);
      
      console.log(`Found ${allProductNames.length} total product names for ${category}`);
      
      if (allProductNames.length > 0) {
        try {
          // Import the fetchProductsByNames function and fetch ALL products for this category
          const { fetchProductsByNames } = await import('../utils/shopifyApi');
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout after 20 seconds')), 20000)
          );
          
          const fetchPromise = fetchProductsByNames(allProductNames);
          productData = await Promise.race([fetchPromise, timeoutPromise]);
          
          console.log(`Found ${productData.length} products from Shopify API for ${category}`);
          
          // Filter products to ensure they match the category
          productData = filterProductsByCategory(productData, category, allProductNames);
          console.log(`After filtering: ${productData.length} products match category ${category}`);
        } catch (apiError) {
          console.error(`API error for ${category}:`, apiError);
          productData = []; // Reset to empty array if API fails
        }
      }
      
      // If no products found or API failed, try the fallback method
      if (productData.length === 0) {
        console.log(`No products found with API for ${category}, trying fallback data file functions`);
        
        try {
          switch (category) {
            case "Houseplant Products":
              productData = await fetchAllHouseplantProducts();
              break;
            case "Garden Products":
              productData = await fetchAllGardenProducts();
              break;
            case "Hydrophonic and Aquatic":
              productData = await fetchAllHydroponicAquaticProducts();
              break;
            case "Plant Supplements":
              productData = await fetchAllSpecialtySupplements();
              break;
          }
          
          // Filter these products too
          productData = filterProductsByCategory(productData, category);
          
          console.log(`After fallback: ${productData.length} total products for ${category}`);
        } catch (fallbackError) {
          console.error('Error with fallback data fetch:', fallbackError);
          
          // Final fallback: use mock data for this category
          productData = generateMockProductsForCategory(category);
          console.log(`Using mock data: ${productData.length} products for ${category}`);
        }
      }
      
      // Ensure all products have the correct category assigned and proper formatting
      const enrichedProducts = productData.map((product, index) => ({
        ...product,
        category: category,
        rating: product.rating || ((Math.random() * (5 - 4) + 4).toFixed(1)),
        reviews: product.reviews || Math.floor(Math.random() * 800) + 200,
        bestSeller: product.bestSeller || index === 0
      }));
      
      console.log(`Successfully loaded ${enrichedProducts.length} products for ${category}`);
      
      // Update categorized products state immediately
      setCategorizedProducts(prev => ({
        ...prev,
        [category]: enrichedProducts
      }));
      
      // Update category loading status
      setCategoryLoadingStatus(prev => ({
        ...prev,
        [category]: 'loaded'
      }));
      
      // Update the combined products display immediately
      const updatedCategorizedProducts = {
        ...categorizedProducts,
        [category]: enrichedProducts
      };
      const combinedProducts = Object.values(updatedCategorizedProducts).flat();
      setProducts(combinedProducts);
      
      if (isInitialLoad) {
        setLoading(false);
        setInitialLoadComplete(true);
      }
      
      console.log(`Total products now: ${combinedProducts.length}`);
      return enrichedProducts;
      
    } catch (error) {
      console.error(`Error loading products for ${category}:`, error);
      
      // Set error status
      setCategoryLoadingStatus(prev => ({
        ...prev,
        [category]: 'error'
      }));
      
      // Return mock data for this category to prevent complete failure
      const mockProducts = generateMockProductsForCategory(category);
      console.log(`Using mock data for ${category}: ${mockProducts.length} products`);
      
      // Update categorized products with mock data
      setCategorizedProducts(prev => ({
        ...prev,
        [category]: mockProducts
      }));
      
      // Update combined products display
      const updatedCategorizedProducts = {
        ...categorizedProducts,
        [category]: mockProducts
      };
      const combinedProducts = Object.values(updatedCategorizedProducts).flat();
      setProducts(combinedProducts);
      
      if (isInitialLoad) {
        setLoading(false);
        setInitialLoadComplete(true);
      }
      
      return mockProducts;
    }
  };

  // Start progressive loading - houseplants first, then others in background
  const startProgressiveLoading = async () => {
    console.log('Starting progressive loading...');
    setLoading(true);
    
    // Categories to load
    const categoriesToLoad = [
      "Houseplant Products",
      "Garden Products", 
      "Hydrophonic and Aquatic",
      "Plant Supplements"
    ];
    
    // Load houseplants first (most popular category)
    await loadCategoryProducts("Houseplant Products", true);
    
    // Load remaining categories in background
    const remainingCategories = categoriesToLoad.filter(cat => cat !== "Houseplant Products");
    
    // Load remaining categories one by one in background (don't await)
    remainingCategories.forEach((category, index) => {
      // Stagger the loading slightly to avoid overwhelming the API
      setTimeout(() => {
        loadCategoryProducts(category, false);
      }, (index + 1) * 700); // 700ms delay between each category
    });
  };

  // Generate mock products for a category when API fails
  const generateMockProductsForCategory = (category) => {
    const mockData = {
      "Houseplant Products": [
        {
          id: `mock-houseplant-1`,
          name: "Indoor Plant Food",
          description: "Perfect nutrition for your indoor plants",
          image: "/assets/products/placeholder.png",
          price: 12.99,
          rating: 4.5,
          reviews: 245,
          bestSeller: true,
          category: category,
          variants: [{
            id: "mock-variant-1",
            title: "8 oz Bottle",
            price: 12.99,
            available: true,
            quantity: 10
          }],
          hasAvailableVariants: true
        },
        {
          id: `mock-houseplant-2`,
          name: "Monstera Plant Food",
          description: "Specialized nutrition for Monstera plants",
          image: "/assets/products/placeholder.png",
          price: 15.99,
          rating: 4.7,
          reviews: 189,
          bestSeller: false,
          category: category,
          variants: [{
            id: "mock-variant-2",
            title: "8 oz Bottle",
            price: 15.99,
            available: true,
            quantity: 8
          }],
          hasAvailableVariants: true
        }
      ],
      "Garden Products": [
        {
          id: `mock-garden-1`,
          name: "All Purpose Garden Fertilizer",
          description: "Complete nutrition for outdoor plants",
          image: "/assets/products/placeholder.png",
          price: 18.99,
          rating: 4.4,
          reviews: 156,
          bestSeller: true,
          category: category,
          variants: [{
            id: "mock-variant-3",
            title: "1 lb Container",
            price: 18.99,
            available: true,
            quantity: 15
          }],
          hasAvailableVariants: true
        }
      ],
      "Hydrophonic and Aquatic": [
        {
          id: `mock-hydro-1`,
          name: "Hydroponic Nutrient Solution",
          description: "Complete liquid nutrition for hydroponic systems",
          image: "/assets/products/placeholder.png",
          price: 22.99,
          rating: 4.6,
          reviews: 98,
          bestSeller: true,
          category: category,
          variants: [{
            id: "mock-variant-4",
            title: "16 oz Bottle",
            price: 22.99,
            available: true,
            quantity: 12
          }],
          hasAvailableVariants: true
        }
      ],
      "Plant Supplements": [
        {
          id: `mock-supplement-1`,
          name: "Calcium for Plants",
          description: "Essential calcium supplement for plant health",
          image: "/assets/products/placeholder.png",
          price: 16.99,
          rating: 4.3,
          reviews: 134,
          bestSeller: true,
          category: category,
          variants: [{
            id: "mock-variant-5",
            title: "8 oz Bottle",
            price: 16.99,
            available: true,
            quantity: 20
          }],
          hasAvailableVariants: true
        }
      ]
    };

    return mockData[category] || [];
  };

  // Get category loading status for display
  const getCategoryLoadingStatus = (category) => {
    return categoryLoadingStatus[category] || 'pending';
  };

  // Check if a category has products available
  const isCategoryReady = (category) => {
    return categorizedProducts[category] && categorizedProducts[category].length > 0;
  };

  // Keep the original methods as backup
  const fetchProductsByCategoryFallback = async () => {
    try {
      console.log("Using fallback fetch method...");
      
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
      console.error("Error in fallback fetchProductsByCategory:", error);
      fetchFallbackProducts();
    }
  };

  useEffect(() => {
    // Start progressive loading instead of waiting for all categories
    startProgressiveLoading();
    
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
      
      console.log("Waiting for products to load before scrolling to:", mappedCategory);
      
      // Function to attempt scrolling
      const attemptScroll = () => {
        if (!loading && products.length > 0 && categoryRefs.current[mappedCategory]) {
          console.log("Products loaded, enabling auto-scroll to category:", mappedCategory);
          
          // Enable auto-scroll instead of direct scrolling
          setShouldAutoScroll(true);
          
          return true; // Scroll enabled successfully
        }
        return false; // Scroll not successful yet
      };

      // Try to scroll immediately if possible
      if (!attemptScroll() && scrollAttempts.current < 50) { // Limit to 5 seconds of attempts
        const scrollInterval = setInterval(() => {
          if (attemptScroll() || scrollAttempts.current >= 50) {
            clearInterval(scrollInterval);
          }
          scrollAttempts.current++;
        }, 100);

        return () => {
          clearInterval(scrollInterval);
          scrollAttempts.current = 0;
        };
      }
    }
  }, [location.search, loading, products]);

  // Scroll to category section when category is selected
  useEffect(() => {
    if (shouldAutoScroll && activeCategory && categoryRefs.current[activeCategory]) {
      console.log("Scrolling to active category:", activeCategory);
      
      // Set programmatic scroll flag
      setIsProgrammaticScroll(true);
      
      // Calculate offset based on device type
      const isMobile = window.innerWidth < 768;
      let yOffset;
      
      if (isMobile) {
        // Mobile: Account for navbar (107px) + sticky selector (approx 70px) + some padding
        // Reduce offset when sticky is visible to bring content closer
        yOffset = showMobileCategorySticky ? -190 : -180;
      } else {
        // Desktop: Account for navbar height + some padding
        yOffset = -130;
      }
      
      const element = categoryRefs.current[activeCategory];
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Reset both flags after scrolling completes
      setTimeout(() => {
        setIsProgrammaticScroll(false);
        setShouldAutoScroll(false);
      }, 1000);
    } else if (shouldAutoScroll && activeCategory) {
      console.warn("Category ref not found for:", activeCategory);
      setShouldAutoScroll(false); // Reset flag if category not found
    }
  }, [activeCategory, showMobileCategorySticky, shouldAutoScroll]);

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
    
    // Close mobile category expanded state when selecting a category
    setMobileCategoryExpanded(false);
    
    // Also set as current visible for the overlay highlighting
    setCurrentVisibleCategory(category);
    
    // Enable auto-scroll for this category change
    setShouldAutoScroll(true);
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

  // Handle click outside mobile sticky category selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileCategoryStickyRef.current && !mobileCategoryStickyRef.current.contains(event.target)) {
        setMobileCategoryExpanded(false);
      }
    };

    if (mobileCategoryExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileCategoryExpanded]);

  // Group products by category with enhanced validation
  const groupedProducts = {};
  
  // Initialize empty arrays for each category
  categories.forEach(category => {
    groupedProducts[category.category] = [];
  });
  
  // Add a total count for debugging
  let totalProductsProcessed = 0;
  let miscategorizedProducts = [];
  
  // Populate the grouped products with validation
  products.forEach(product => {
    totalProductsProcessed++;
    
    if (groupedProducts[product.category]) {
      groupedProducts[product.category].push(product);
      console.log(`✓ Product "${product.name}" correctly assigned to ${product.category}`);
    } else {
      // Product has an invalid category, try to fix it
      console.warn(`⚠️ Product category not recognized: ${product.category} for product: ${product.name}`);
      
      // Re-determine the category
      const correctedCategory = determineProductCategory(product.name, []);
      product.category = correctedCategory;
      
      if (groupedProducts[correctedCategory]) {
        groupedProducts[correctedCategory].push(product);
        console.log(`🔧 Fixed categorization: "${product.name}" → ${correctedCategory}`);
      } else {
        // Last resort: put in Houseplant Products
        product.category = "Houseplant Products";
        groupedProducts["Houseplant Products"].push(product);
        miscategorizedProducts.push(product);
        console.error(`❌ Could not categorize "${product.name}", defaulting to Houseplant Products`);
      }
    }
  });
  
  // Enhanced debugging logs
  console.log("=== PRODUCT CATEGORIZATION SUMMARY ===");
  console.log(`Total products processed: ${totalProductsProcessed}`);
  console.log(`Miscategorized products: ${miscategorizedProducts.length}`);
  
  Object.keys(groupedProducts).forEach(cat => {
    const count = groupedProducts[cat].length;
    const percentage = totalProductsProcessed > 0 ? ((count / totalProductsProcessed) * 100).toFixed(1) : 0;
    console.log(`${cat}: ${count} products (${percentage}%)`);
    
    // Log first few product names for verification
    if (count > 0) {
      const sampleProducts = groupedProducts[cat].slice(0, 3).map(p => p.name).join(', ');
      console.log(`  Sample products: ${sampleProducts}${count > 3 ? '...' : ''}`);
    }
  });
  
  if (miscategorizedProducts.length > 0) {
    console.warn("Miscategorized products:", miscategorizedProducts.map(p => p.name));
  }
  
  console.log("======================================");

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
        
        // FORCE all products to the Hydrophonic and Aquatic category
        fetchedProducts.forEach(product => {
          product.category = "Hydrophonic and Aquatic";
          console.log(`FORCED category assignment: "${product.name}" → Hydrophonic and Aquatic`);
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
        
        // FORCE all products to the Plant Supplements category
        fetchedProducts.forEach(product => {
          product.category = "Plant Supplements";
          console.log(`FORCED category assignment: "${product.name}" → Plant Supplements`);
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
        
        // FORCE all products to the Curated Bundles category
        fetchedProducts.forEach(product => {
          product.category = "Curated Bundles";
          console.log(`FORCED category assignment: "${product.name}" → Curated Bundles`);
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

  // Handle URL parameters for category scrolling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get('category');

    if (categoryFromURL) {
      setActiveCategory(categoryFromURL);
      setCurrentVisibleCategory(categoryFromURL);
      
      console.log("Attempting to scroll to category:", categoryFromURL);
      
      // Function to attempt scrolling
      const attemptScroll = () => {
        if (!loading && products.length > 0 && categoryRefs.current[categoryFromURL]) {
          console.log("Products loaded, enabling auto-scroll to category:", categoryFromURL);
          
          // Enable auto-scroll instead of direct scrolling
          setShouldAutoScroll(true);
          
          return true; // Scroll enabled successfully
        }
        return false; // Scroll not successful yet
      };

      // Try to scroll immediately if possible
      if (!attemptScroll() && scrollAttempts.current < 50) { // Limit to 5 seconds of attempts
        const scrollInterval = setInterval(() => {
          if (attemptScroll() || scrollAttempts.current >= 50) {
            clearInterval(scrollInterval);
          }
          scrollAttempts.current++;
        }, 100);

        return () => {
          clearInterval(scrollInterval);
          scrollAttempts.current = 0;
        };
      }
    }
  }, [location.search, loading, products]);

  // Sync activeCategory with currentVisibleCategory during manual scrolling on mobile
  useEffect(() => {
    // Only sync when not doing programmatic scrolling and currentVisibleCategory exists and is different
    if (!isProgrammaticScroll && currentVisibleCategory && currentVisibleCategory !== activeCategory) {
      console.log('Syncing activeCategory with currentVisibleCategory:', currentVisibleCategory);
      setActiveCategory(currentVisibleCategory);
    }
  }, [currentVisibleCategory, isProgrammaticScroll, activeCategory]);

  return (
    <section className="bg-[#fffbef]">
      {/* Page Title */}
      <div className="text-center pt-2 mb-6">
        <h2 className="text-4xl font-medium text-[#ff6b57] mb-1 hidden sm:block">Find Your Plant</h2>
        <p className="text-gray-500 tracking-wide text-sm hidden sm:block">CHOOSE A COLLECTION</p>
      </div>

      {/* Mobile Plant Categories Header */}
      <div className="block sm:hidden px-4 mb-2">
        <h1 className="text-4xl font-bold text-[#ff6b6b]">Plant Categories</h1>
      </div>

      {/* Category Selection */}
      <div className="relative mb-2 sm:mb-12">
        {/* Mobile List Layout */}
        <div className="block sm:hidden">
          <div className="px-4">
            <div className="space-y-0.5 pb-1 mb-8">
              {categories.map((cat, index) => (
                <div key={cat.category} className="block">
                  <button
                    onClick={() => handleCategoryClick(cat.category)}
                    className="text-left transition-all duration-200"
                  >
                    <div className={`inline-block ${
                      activeCategory === cat.category
                        ? 'border-2 border-[#ff6b6b] rounded-full px-3 py-1 bg-white'
                        : 'px-3 py-1'
                    }`}>
                      <span className="text-base font-medium text-black">
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
        <div className="hidden sm:flex justify-center overflow-x-auto pb-4 px-4 scrollbar-hide">
          <div className="flex space-x-6 mb-8 sm:mb-12 flex-wrap justify-center">
            {categories.map((category, index) => (
              <button 
                key={index}
                onClick={() => handleCategoryClick(category.category)}
                className={`flex flex-col items-center group w-24 focus:outline-none flex-shrink-0 mb-4 ${
                  activeCategory === category.category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`overflow-hidden rounded-md mb-2 w-20 h-20 ${
                  activeCategory === category.category ? 'ring-2 ring-[#ff6b57]' : ''
                }`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
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
      </div>

      {/* Category Navigation Overlay - shown when scrolled down (desktop only) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white bg-opacity-95 shadow-lg border-t border-gray-200 transition-all duration-300 transform hidden md:block ${
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
              className="bg-[#ff6b57] text-white p-2 rounded-full shadow-md hover:bg-[#e55c4a] flex-shrink-0 ml-2"
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Category Selector - shown when scrolled down (mobile only) */}
      <div 
        ref={mobileCategoryStickyRef}
        className={`fixed left-0 right-0 z-50 bg-[#fffbef] shadow-lg transition-all duration-300 transform md:hidden ${
          showMobileCategorySticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ top: '107px' }} // Position below navbar (42px announcement + 65px navbar)
      >
        <div className="px-4 py-3">
          <div className="relative">
            {/* Plant Categories Header with Caret */}
            <button
              onClick={() => setMobileCategoryExpanded(!mobileCategoryExpanded)}
              className="w-full flex items-center justify-between bg-white border-2 border-[#ff6b6b] rounded-full px-4 py-2 text-left"
            >
              <span className="text-base font-medium text-black">
                {currentVisibleCategory ? 
                  categories.find(cat => cat.category === currentVisibleCategory)?.name.replace('\n', ' ') :
                  (activeCategory ? 
                    categories.find(cat => cat.category === activeCategory)?.name.replace('\n', ' ') : 
                    'Plant Categories'
                  )
                }
              </span>
              <svg 
                className={`w-5 h-5 text-[#ff6b6b] transition-transform duration-200 ${
                  mobileCategoryExpanded ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Category List */}
            {mobileCategoryExpanded && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#fffbef] shadow-lg max-h-60 overflow-y-auto z-10">
                {categories.map((cat, index) => (
                  <button
                    key={cat.category}
                    onClick={() => handleCategoryClick(cat.category)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                      (currentVisibleCategory ? currentVisibleCategory === cat.category : activeCategory === cat.category) ? 'bg-[#ff6b6b] text-white' : 'text-black'
                    }`}
                  >
                    <span className="text-base font-medium">
                      {cat.name.replace('\n', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products by Category */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#FF6B6B] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Loading products...
          </p>
          <p className="mt-2 text-gray-500 text-xs sm:text-sm">
            {initialLoadComplete ? 'Loading additional categories...' : 'Initial load in progress...'}
          </p>
          <div className="mt-4 space-y-2">
            {Object.entries(categoryLoadingStatus).map(([category, status]) => (
              <div key={category} className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                <span>{category.replace('Hydrophonic and Aquatic', 'Hydro & Aquatic')}</span>
                {status === 'loading' && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#ff6b6b]"></div>}
                {status === 'loaded' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                {status === 'error' && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {categories.map((category, index) => {
            const categoryProducts = categorizedProducts[category.category] || [];
            
            // Always render the category section, even if empty - we'll show a message
            return (
              <div 
                key={category.category} 
                className="mb-16"
                ref={el => categoryRefs.current[category.category] = el}
                id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {categoryProducts.length > 0 ? (
                    <>
                      {/* Modern "See All" Header Card - Mobile Only */}
                      <div className="block md:hidden">
                        <div 
                          onClick={() => handleSeeAllClick(category.category)}
                          className="cursor-pointer group transition-all duration-300"
                          style={{ height: '98px' }}
                        >
                          {/* Content */}
                          <div className="flex items-center justify-between p-4 h-full">
                            <div className="flex-1">
                              <h3 className="text-gray-900 text-xl font-bold mb-1">
                                {category.name.replace('\n', ' ')}
                              </h3>
                              <div className="inline-block bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-full">
                                Top Trending
                              </div>
                            </div>
                            
                            {/* Modern CTA Button */}
                            <div className="flex items-center space-x-4 bg-[#ff6b57] hover:bg-[#ff5a43] rounded-full px-6 py-3 transition-all duration-300">
                              <span className="text-white font-semibold text-sm">SHOP ALL</span>
                              <svg 
                                className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Products Grid */}
                      <div className="grid grid-cols-2 gap-4 md:hidden">
                        {categoryProducts.slice(0, 5).map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} isMobile={isMobile} />
                        ))}
                        {/* Shop All Card as the last item */}
                        <ShopAllCard category={category} index={5} />
                      </div>
                      
                      {/* Desktop view: Modern "See All" Header + Products */}
                      <div className="hidden md:block">
                        {/* Desktop "See All" Header Card */}
                        <div 
                          onClick={() => handleSeeAllClick(category.category)}
                          className="cursor-pointer group transition-all duration-300 mb-4"
                          style={{ height: '126px' }}
                        >
                          {/* Content */}
                          <div className="flex items-center justify-between p-8 h-full">
                            <div className="flex-1">
                              <h3 className="text-gray-900 text-3xl font-bold mb-2">
                                {category.name.replace('\n', ' ')}
                              </h3>
                              <div className="inline-block bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full">
                                Top Trending
                              </div>
                            </div>
                            
                            {/* Modern CTA Button */}
                            <div className="flex items-center space-x-6 bg-[#ff6b57] hover:bg-[#ff5a43] rounded-full px-12 py-6 transition-all duration-300">
                              <span className="text-white font-semibold text-lg">Shop All Products</span>
                              <svg 
                                className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Products Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          {categoryProducts.slice(0, 7).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} isMobile={isMobile} />
                          ))}
                          {/* Shop All Card as the last item */}
                          <ShopAllCard category={category} index={7} />
                        </div>
                      </div>
                    </>
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

export default ProductsPage; 