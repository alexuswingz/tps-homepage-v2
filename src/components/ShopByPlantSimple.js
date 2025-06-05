import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProductsByCategory as fetchProductsByCategoryAPI } from '../utils/shopifyApi';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
// Import data files
import { houseplantProductNames, fetchAllHouseplantProducts } from '../data/houseplantProducts';
import { gardenProductNames, fetchAllGardenProducts } from '../data/gardenProducts';
import { hydroponicAquaticProductNames, fetchAllHydroponicAquaticProducts } from '../data/hydroponicAquaticProducts';
import { specialtySupplementNames, fetchAllSpecialtySupplements } from '../data/specialtySupplements';

// Utility functions for products page auto-scrolling (can be imported)
export const useAutoScrollToCategory = (location) => {
  useEffect(() => {
    if (location?.state?.scrollToCategory && location?.state?.targetCategory) {
      const targetCategory = location.state.targetCategory;
      
      console.log(`Auto-scrolling to category: ${targetCategory}`);
      
      // Wait a bit for the page to render, then start intelligent scrolling
      setTimeout(() => {
        waitForProductsAndScroll(targetCategory);
      }, 300);
    }
  }, [location]);
};

// Enhanced auto-scroll function that can be used by products page
export const waitForProductsAndScroll = (sectionId, maxWaitTime = 15000) => {
  const startTime = Date.now();
  const checkInterval = 300; // Check every 300ms for better responsiveness
  
  const checkAndScroll = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    
    // Stop trying after maxWaitTime
    if (elapsedTime > maxWaitTime) {
      console.log('Stopped waiting for products to load, attempting final scroll');
      scrollToSection(sectionId);
      return;
    }
    
    // Check if products have loaded (look for product elements)
    const productElements = document.querySelectorAll(
      '[class*="product"], [class*="card"], .product-card, .glide__slide, [data-product], .product-item'
    );
    const loadingElements = document.querySelectorAll(
      '[class*="loading"], [class*="spinner"], .animate-spin, [class*="skeleton"]'
    );
    
    // Also check if the target section exists
    const targetExists = document.getElementById(sectionId) || 
                        document.querySelector(`[data-category="${sectionId}"]`) ||
                        document.querySelector(`section[id*="${sectionId}"]`);
    
    // If we have target section and products loaded, or if enough time has passed, try scrolling
    if ((targetExists && productElements.length > 0 && loadingElements.length === 0) || elapsedTime > 3000) {
      const scrolled = scrollToSection(sectionId);
      if (scrolled) {
        return; // Successfully scrolled, stop trying
      }
    }
    
    // Continue checking
    setTimeout(checkAndScroll, checkInterval);
  };
  
  // Start checking
  checkAndScroll();
};

// Improved scroll function with better element detection
export const scrollToSection = (sectionId) => {
  try {
    // Multiple strategies to find the target element
    let targetElement = null;
    
    // Strategy 1: Direct ID match
    targetElement = document.getElementById(sectionId);
    
    // Strategy 2: Data attribute match
    if (!targetElement) {
      targetElement = document.querySelector(`[data-category="${sectionId}"]`);
    }
    
    // Strategy 3: Partial ID match
    if (!targetElement) {
      targetElement = document.querySelector(`[id*="${sectionId}"]`);
    }
    
    // Strategy 4: Class name match
    if (!targetElement) {
      targetElement = document.querySelector(`[class*="${sectionId}"]`);
    }
    
    // Strategy 5: Section with matching content
    if (!targetElement) {
      const sections = document.querySelectorAll('section, div[id], .category-section, .product-category');
      targetElement = Array.from(sections).find(el => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className?.toLowerCase() || '';
        const id = el.id?.toLowerCase() || '';
        
        return text.includes(sectionId.toLowerCase()) ||
               className.includes(sectionId.toLowerCase()) ||
               id.includes(sectionId.toLowerCase());
      });
    }
    
    // Strategy 6: Find by heading text
    if (!targetElement) {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const matchingHeading = Array.from(headings).find(heading => 
        heading.textContent?.toLowerCase().includes(sectionId.toLowerCase())
      );
      if (matchingHeading) {
        targetElement = matchingHeading.closest('section, div[id], .category-section');
      }
    }
    
    if (targetElement) {
      // Calculate offset for fixed headers
      const headerOffset = 120; // Adjust based on your header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Smooth scroll to the element
      window.scrollTo({
        top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
        behavior: 'smooth'
      });
      
      // Add visual highlight to the target section (optional)
      targetElement.style.outline = '2px solid #ff6b6b';
      setTimeout(() => {
        targetElement.style.outline = '';
      }, 2000);
      
      console.log(`Successfully scrolled to section: ${sectionId}`);
      return true;
    } else {
      console.log(`Section not found: ${sectionId}. Available elements:`, 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(Boolean)
      );
      return false;
    }
  } catch (error) {
    console.error('Error scrolling to section:', error);
    
    // Fallback to hash-based scrolling
    try {
      window.location.hash = `#${sectionId}`;
    } catch (hashError) {
      console.error('Hash navigation also failed:', hashError);
    }
    return false;
  }
};

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
  const [selectedCategory, setSelectedCategory] = useState("Houseplant Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [glideDisabled, setGlideDisabled] = useState(false);
  const [preloadedProducts, setPreloadedProducts] = useState({});
  const [categoryLoadingStatus, setCategoryLoadingStatus] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
        gap: isMobile ? 12 : 24,
        perView: isMobile ? 2.2 : 3.5,
        breakpoints: {
          480: {
            perView: 2.2,
            gap: 10
          },
          375: {
            perView: 2.2,
            gap: 8
          },
          320: {
            perView: 2.1,
            gap: 6
          }
        }
      });

      glide.mount();

      return () => {
        glide.destroy();
      };
    }
  }, [products, isMobile]);

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

  // Generate random rating for demo purposes
  const generateRandomRating = () => {
    return (Math.random() * (5 - 4) + 4).toFixed(1);
  };





  // Get product names from data files by category
  const getProductNamesByCategory = (category) => {
    const categoryProductNames = {
      "Houseplant Products": houseplantProductNames,
      "Garden Products": gardenProductNames,
      "Hydrophonic and Aquatic": hydroponicAquaticProductNames,
      "Plant Supplements": specialtySupplementNames
    };

    return categoryProductNames[category] || [];
  };

  // Get the appropriate number of products based on mobile/web view
  const getProductCountForView = (allProductNames, isMobile) => {
    if (isMobile) {
      return allProductNames.slice(0, 5); // Top 5 for mobile
    }
    return allProductNames; // All products for web
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

  // Improved progressive loading - load categories one by one and show immediately
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
        rating: product.rating || generateRandomRating(),
        reviews: product.reviews || Math.floor(Math.random() * 800) + 200,
        bestSeller: product.bestSeller || index === 0
      }));
      
      console.log(`Successfully loaded ${enrichedProducts.length} products for ${category}`);
      
      // Update preloaded products state immediately
      setPreloadedProducts(prev => ({
        ...prev,
        [category]: enrichedProducts
      }));
      
      // Update category loading status
      setCategoryLoadingStatus(prev => ({
        ...prev,
        [category]: 'loaded'
      }));
      
      // If this is the currently selected category, update products display immediately
      if (category === selectedCategory) {
        const productsToShow = getProductCountForView(enrichedProducts, isMobile);
        setProducts(productsToShow);
        
        if (isInitialLoad) {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      }
      
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
      
      // Update preloaded products with mock data
      setPreloadedProducts(prev => ({
        ...prev,
        [category]: mockProducts
      }));
      
      // If this is the currently selected category, show mock products
      if (category === selectedCategory) {
                 const productsToShow = getProductCountForView(mockProducts, isMobile);
        setProducts(productsToShow);
        
        if (isInitialLoad) {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      }
      
      return mockProducts;
    }
  };

  // Progressive loading - start with default category and load others in background
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
    
    // Load the initial/selected category first
    await loadCategoryProducts(selectedCategory, true);
    
    // Load remaining categories in background
    const remainingCategories = categoriesToLoad.filter(cat => cat !== selectedCategory);
    
    // Load remaining categories one by one in background (don't await)
    remainingCategories.forEach((category, index) => {
      // Stagger the loading slightly to avoid overwhelming the API
      setTimeout(() => {
        loadCategoryProducts(category, false);
      }, (index + 1) * 500); // 500ms delay between each category
    });
  };

  const handleCategoryClick = (category) => {
    console.log(`Switching to category: ${category}`);
    setSelectedCategory(category);
    
    // Check if this category is already loaded
    if (preloadedProducts[category]) {
      const categoryProducts = preloadedProducts[category];
      const productsToShow = getProductCountForView(categoryProducts, isMobile);
      setProducts(productsToShow);
      console.log(`Switched to ${category} with ${productsToShow.length} products`);
    } else {
      // Category not loaded yet - show loading state and start loading
      const categoryStatus = categoryLoadingStatus[category];
      
      if (categoryStatus !== 'loading') {
        console.log(`Category ${category} not loaded yet, starting load...`);
        setLoading(true);
        loadCategoryProducts(category, false).then(() => {
          setLoading(false);
        });
      } else {
        console.log(`Category ${category} is currently loading...`);
        setLoading(true);
        
        // Set up a listener for when this category finishes loading
        const checkCategoryLoaded = () => {
          if (preloadedProducts[category]) {
            const categoryProducts = preloadedProducts[category];
            const productsToShow = getProductCountForView(categoryProducts, isMobile);
            setProducts(productsToShow);
            setLoading(false);
            console.log(`Category ${category} finished loading`);
          } else {
            // Check again in 500ms
            setTimeout(checkCategoryLoaded, 500);
          }
        };
        checkCategoryLoaded();
      }
    }
  };

  // Handle mobile/web view changes - refresh products with appropriate count
  useEffect(() => {
    if (initialLoadComplete && preloadedProducts[selectedCategory]) {
      const categoryProducts = preloadedProducts[selectedCategory];
      const productsToShow = getProductCountForView(categoryProducts, isMobile);
      setProducts(productsToShow);
      console.log(`View changed to ${isMobile ? 'mobile' : 'web'}, showing ${productsToShow.length} products`);
    }
  }, [isMobile, selectedCategory, initialLoadComplete, preloadedProducts]);

  // Check if there are more products available than currently shown
  const hasMoreProducts = () => {
    if (!preloadedProducts[selectedCategory]) return false;
    const totalProducts = preloadedProducts[selectedCategory].length;
    const currentlyShown = products.length;
    return totalProducts > currentlyShown;
  };

  // Handle "See All" button click with improved navigation
  const handleSeeAllClick = () => {
    // Navigate to products page with the current category
    const categoryRoutes = {
      "Houseplant Products": { route: "/products", hash: "#houseplants", category: "houseplants" },
      "Garden Products": { route: "/products", hash: "#garden", category: "garden" }, 
      "Hydrophonic and Aquatic": { route: "/products", hash: "#hydroponic", category: "hydroponic" },
      "Plant Supplements": { route: "/products", hash: "#supplements", category: "supplements" }
    };
    
    const targetInfo = categoryRoutes[selectedCategory] || { route: "/products", hash: "", category: "" };
    
    // Navigate with state to help the products page identify the target section
    navigate(targetInfo.route, { 
      state: { 
        targetCategory: targetInfo.category,
        targetHash: targetInfo.hash,
        scrollToCategory: true,
        fromShopByPlant: true,
        timestamp: Date.now() // Add timestamp to ensure fresh navigation
      } 
    });
  };

  // See All Button Component
  const SeeAllButton = () => (
    <div className="see-all-card"
      onClick={handleSeeAllClick}
    >
      {/* Text */}
      <div className="text-center mb-3">
        <h3 className="font-bold text-gray-800 text-sm mb-1">SEE ALL</h3>
        <p className="text-xs text-gray-600 leading-tight">
          View all {preloadedProducts[selectedCategory]?.length || 0} products
        </p>
        <p className="text-xs text-[#ff6b6b] font-medium mt-1">
          in this category
        </p>
      </div>
      
      {/* Orange Arrow Icon - moved to bottom */}
      <div className="bg-[#ff6b6b] rounded-full p-3 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );

  // Start progressive loading on mount
  useEffect(() => {
    startProgressiveLoading();
  }, []);

  // Get category loading status for display
  const getCategoryLoadingStatus = (category) => {
    return categoryLoadingStatus[category] || 'pending';
  };

  // Check if a category has products available
  const isCategoryReady = (category) => {
    return preloadedProducts[category] && preloadedProducts[category].length > 0;
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

  return (
    <div className="bg-[#fffbef] py-2 sm:py-8">
      <style>
        {`
          .glide {
            padding: 20px 20px !important;
            margin: -20px -20px;
            background: transparent;
            overflow: visible !important;
          }
          
          .glide__slide {
            height: auto;
            padding: 12px;
            overflow: visible !important;
          }

          /* Prevent GlideJS from interfering with dropdown elements */
          [data-no-drag] {
            pointer-events: auto !important;
            touch-action: auto !important;
            user-select: auto !important;
          }

          .product-card {
            background: linear-gradient(145deg, #e8f4f2 0%, #f3e6e0 100%);
            border-radius: 20px;
            padding: 12px;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 107, 107, 0.1);
            position: relative;
            overflow: visible !important;
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
              padding: 10px 10px !important;
              margin: -10px -10px;
            }

            .glide__slide {
              padding: 5px;
              min-width: 0;
            }

            .product-card, .see-all-card {
              padding: 8px;
              min-height: 320px;
              max-height: 320px;
              max-width: none;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .see-all-card {
              justify-content: center;
              text-align: center;
            }

            .product-name-container {
              height: 20px;
              margin-bottom: 0.5rem;
              flex-shrink: 0;
            }

            .product-name-container h3 {
              font-size: 0.75rem;
              line-height: 1.1;
              font-weight: 600;
            }

            .product-image-container {
              height: 100px !important;
              margin-bottom: 0.5rem;
              flex-shrink: 0;
            }

            .product-image {
              padding: 6px;
            }

            .best-seller-badge {
              font-size: 0.6rem;
              padding: 0.2rem 0.5rem;
              top: 0.5rem;
              left: 0.5rem;
            }

            .rating-container {
              transform: scale(0.85);
              transform-origin: left;
              margin-bottom: 0.25rem;
            }

            /* Variant selector mobile optimization */
            .variant-selector-mobile {
              margin-bottom: 0.25rem;
              flex-shrink: 0;
            }

            .variant-selector-mobile select,
            .variant-selector-mobile .custom-dropdown {
              font-size: 0.65rem;
              padding: 4px;
              height: 28px;
            }

            .variant-selector-mobile .custom-dropdown .h-4 {
              height: 12px;
            }

            .variant-selector-mobile .custom-dropdown .h-6 {
              height: 14px;
            }

            .variant-selector-mobile .custom-dropdown .mr-1 {
              margin-right: 0.125rem;
            }

            .variant-selector-mobile .custom-dropdown .mr-2 {
              margin-right: 0.25rem;
            }

            /* Button mobile optimization */
            .add-to-cart-btn {
              padding: 0.4rem 0.6rem;
              font-size: 0.7rem;
              height: 36px;
              flex-shrink: 0;
              margin-top: auto;
            }

            /* Reviews section mobile */
            .reviews-mobile {
              margin-bottom: 0.25rem;
              transform: scale(0.85);
              transform-origin: left;
            }
          }

          @media (max-width: 480px) {
            .product-card, .see-all-card {
              padding: 6px;
              min-height: 300px;
              max-height: 300px;
            }

            .product-image-container {
              height: 90px !important;
            }

            .product-name-container h3 {
              font-size: 0.7rem;
            }

            .variant-selector-mobile select,
            .variant-selector-mobile .custom-dropdown {
              font-size: 0.6rem;
              padding: 4px;
              height: 28px;
            }

            .variant-selector-mobile .custom-dropdown .h-4 {
              height: 10px;
            }

            .variant-selector-mobile .custom-dropdown .h-6 {
              height: 12px;
            }

            .add-to-cart-btn {
              font-size: 0.65rem;
              height: 32px;
            }
          }

          @media (max-width: 375px) {
            .glide {
              padding: 8px 8px !important;
              margin: -8px -8px;
            }

            .product-card, .see-all-card {
              padding: 6px;
              min-height: 280px;
              max-height: 280px;
            }

            .product-image-container {
              height: 80px !important;
            }

            .product-name-container h3 {
              font-size: 0.65rem;
            }

            .variant-selector-mobile select,
            .variant-selector-mobile .custom-dropdown {
              font-size: 0.55rem;
              padding: 3px;
              height: 26px;
            }
          }

          @media (max-width: 320px) {
            .glide {
              padding: 6px 6px !important;
              margin: -6px -6px;
            }

            .product-card, .see-all-card {
              padding: 4px;
              min-height: 260px;
              max-height: 260px;
            }

            .product-image-container {
              height: 70px !important;
            }

            .product-name-container h3 {
              font-size: 0.6rem;
            }

            .variant-selector-mobile select,
            .variant-selector-mobile .custom-dropdown {
              font-size: 0.5rem;
              padding: 2px;
              height: 24px;
            }
          }

          /* See All Button Styles */
          .see-all-card {
            background: linear-gradient(145deg, #e8f4f2 0%, #f3e6e0 100%);
            border-radius: 20px;
            padding: 12px;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            border: 2px dashed #ff6b6b;
            position: relative;
            overflow: visible !important;
            backdrop-filter: blur(10px);
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .see-all-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255, 107, 107, 0.15);
            border-style: solid;
            background: linear-gradient(145deg, #f0f6f4 0%, #f5ebe6 100%);
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
                {categories.map((cat, index) => {
                  const loadingStatus = getCategoryLoadingStatus(cat.category);
                  const isReady = isCategoryReady(cat.category);
                  
                  return (
                    <div key={cat.category} className="block">
                      <button
                        onClick={() => handleCategoryClick(cat.category)}
                        className="text-left transition-all duration-200 flex items-center space-x-2"
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
                        
                        {/* Loading indicator */}
                        {loadingStatus === 'loading' && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#ff6b6b]"></div>
                        )}
                        
                        {/* Ready indicator */}
                        {isReady && loadingStatus === 'loaded' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Tile Layout */}
          <div className="hidden sm:flex justify-center gap-6 overflow-x-auto pb-4 px-4 no-scrollbar">
            {categories.map((cat) => {
              const loadingStatus = getCategoryLoadingStatus(cat.category);
              const isReady = isCategoryReady(cat.category);
              
              return (
                <button
                  key={cat.category}
                  onClick={() => handleCategoryClick(cat.category)}
                  className="flex-shrink-0 group relative"
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
                      
                      {/* Loading overlay */}
                      {loadingStatus === 'loading' && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                      
                      {/* Ready indicator */}
                      {isReady && loadingStatus === 'loaded' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
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
                    {/* Loading status indicator */}
                    {loadingStatus === 'loading' && (
                      <div className="text-xs text-[#ff6b6b] mt-1">Loading...</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-4 sm:py-12 bg-[#fffbef]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#FF6B6B] mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              Loading {categories.find(cat => cat.category === selectedCategory)?.name.replace('\n', ' ')} products...
            </p>
            <p className="mt-2 text-gray-500 text-xs sm:text-sm">
              {initialLoadComplete ? 'Switching categories...' : 'Initial load in progress...'}
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="relative" ref={glideRef}>
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {products.map((product, index) => (
                    <li className="glide__slide" key={product.id}>
                      <ProductCard product={product} index={index} isMobile={isMobile} />
                    </li>
                  ))}
                  
                  {/* Add See All button as additional slide on mobile when more products are available */}
                  {isMobile && hasMoreProducts() && (
                    <li className="glide__slide" key="see-all-slide">
                      <SeeAllButton />
                    </li>
                  )}
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

            {/* See All Button - Non-mobile fallback (outside carousel) */}
            {!isMobile && hasMoreProducts() && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSeeAllClick}
                  className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8c8c] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <span>View All {preloadedProducts[selectedCategory]?.length || 0} Products</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-[#fffbef]">
            <div className="bg-gradient-to-br from-[#e8f4f2] to-[#f3e6e0] rounded-lg shadow-sm p-6 sm:p-8 mx-2 sm:mx-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {categories.find(cat => cat.category === selectedCategory)?.name.replace('\n', ' ')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {categories.find(cat => cat.category === selectedCategory)?.description}
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