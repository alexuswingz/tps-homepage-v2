import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

// Product Card Component (same as in ProductsPage.js)
const ProductCard = ({ product }) => {
  // State to track selected quantity for this product
  const [quantity, setQuantity] = useState(1);
  // State to track selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  // State for dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Ref for dropdown container
  const dropdownRef = React.useRef(null);
  
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
  
  return (
    <div 
      className="bg-gradient-to-br from-[#e0f5ed] to-[#d0f0e5] rounded-lg overflow-hidden shadow-sm relative"
      style={{ backgroundImage: `linear-gradient(to bottom right, ${product.backgroundColorLight || '#e0f5ed'}, #d0f0e5)` }}
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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Function to determine product category based on title and tags (reused from ProductsPage.js)
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

  // Function to map Shopify product data to our format (reused from ProductsPage.js)
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

  // Function to fetch products by category
  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoading(true);
      console.log(`Fetching products for category: ${categoryName}`);

      // Updated GraphQL query to fetch products
      const query = `
        {
          products(first: 100) {
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
        console.error("API returned no data or invalid response");
        setLoading(false);
        return;
      }
      
      if (result.data.products && result.data.products.edges.length > 0) {
        // Map products to our format
        const allProducts = result.data.products.edges.map(mapProductFromShopify);
        
        // Filter products by the specified category
        const categoryProducts = allProducts.filter(product => 
          product.category === categoryName
        );
        
        console.log(`Found ${categoryProducts.length} products for category ${categoryName}`);
        setProducts(categoryProducts);
      } else {
        console.log(`No products found for category ${categoryName}`);
        setProducts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setLoading(false);
      setProducts([]);
    }
  };

  // Get category info when component mounts
  useEffect(() => {
    if (categoryId) {
      const decodedCategoryId = decodeURIComponent(categoryId);
      
      // Find the category in our categories array
      const category = categories.find(cat => cat.category === decodedCategoryId);
      
      if (category) {
        setCategoryInfo(category);
        fetchProductsByCategory(decodedCategoryId);
      } else {
        console.error(`Category not found: ${decodedCategoryId}`);
        // Redirect to the main products page if category not found
        navigate('/products');
      }
    }
  }, [categoryId, navigate]);

  return (
    <section className="bg-[#fffbef]">
      {/* Category Banner */}
      {categoryInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-8">
          <div className="relative rounded-lg overflow-hidden w-full h-48 sm:h-72 md:h-96">
            <img 
              src={categoryInfo.image} 
              alt={categoryInfo.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${categoryInfo.image}`);
                e.target.src = "/assets/Collection Tiles Images/default-category.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                {categoryInfo.name}
              </h1>
              <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl drop-shadow-md">
                All Products
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back to main products link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button 
          onClick={() => navigate('/products')} 
          className="inline-flex items-center text-[#ff6b57] hover:text-[#ff5a43] font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Collections
        </button>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products available in this category</p>
            <button 
              onClick={() => navigate('/products')} 
              className="mt-4 bg-[#ff6b57] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#ff5a43] transition-colors duration-200"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>

      {/* Add some bottom padding */}
      <div className="h-16 sm:h-20"></div>
    </section>
  );
};

export default CategoryPage; 