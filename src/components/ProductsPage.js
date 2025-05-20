import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LeafDivider from './LeafDivider';

const ProductsPage = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Create refs for each category section
  const categoryRefs = useRef({});

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

  // Function to make API calls to Shopify Storefront API using CORS proxy
  const fetchFromStorefrontAPI = async (query) => {
    // API URL for Shopify Storefront API
    const shopifyStorefrontUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
    
    try {
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
    } catch (error) {
      console.error('Error fetching from Shopify API:', error);
      return null;
    }
  };
  
  // Function to fetch all products with pagination
  const fetchAllProducts = async (cursor = null, allProducts = []) => {
    try {
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
            console.log("Fetched products:", inStockProducts);
            setProducts(inStockProducts);
            setLoading(false);
          }
        } else {
          // If API fails to return expected data structure, use fallback data
          console.warn("Invalid data structure returned from API, using fallback data");
          const fallbackData = getFallbackData();
          // Filter out of stock products from fallback data
          const inStockFallbackProducts = fallbackData.filter(product => 
            product.variants.some(variant => variant.available)
          );
          setProducts(inStockFallbackProducts);
          setLoading(false);
        }
      } catch (apiError) {
        console.error('Error with Shopify API request:', apiError);
        const fallbackData = getFallbackData();
        // Filter out of stock products from fallback data
        const inStockFallbackProducts = fallbackData.filter(product => 
          product.variants.some(variant => variant.available)
        );
        setProducts(inStockFallbackProducts);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const fallbackData = getFallbackData();
      // Filter out of stock products from fallback data
      const inStockFallbackProducts = fallbackData.filter(product => 
        product.variants.some(variant => variant.available)
      );
      setProducts(inStockFallbackProducts);
      setLoading(false);
    }
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
    const tagsLower = tags.map(tag => tag.toLowerCase());
    
    // Check houseplant products
    if (
      titleLower.includes('indoor') || 
      titleLower.includes('houseplant') || 
      titleLower.includes('monstera') ||
      titleLower.includes('fiddle leaf') ||
      titleLower.includes('succulent') ||
      titleLower.includes('cactus') ||
      titleLower.includes('snake plant') ||
      titleLower.includes('pothos') ||
      tagsLower.some(tag => tag.includes('indoor')) ||
      tagsLower.some(tag => tag.includes('houseplant'))
    ) {
      return "Houseplant Products";
    }
    
    // Check garden products
    if (
      titleLower.includes('garden') ||
      titleLower.includes('lawn') ||
      titleLower.includes('herb') ||
      titleLower.includes('tomato') ||
      titleLower.includes('vegetable') ||
      titleLower.includes('outdoor') ||
      titleLower.includes('tree') ||
      titleLower.includes('bush') ||
      titleLower.includes('rose') ||
      titleLower.includes('flower') ||
      titleLower.includes('fertilizer') ||
      titleLower.includes('bulb') ||
      titleLower.includes('berry') ||
      titleLower.includes('fruit') ||
      titleLower.includes('pepper') ||
      titleLower.includes('shrub') ||
      titleLower.includes('10-10-10') ||
      titleLower.includes('hydrangea') ||
      titleLower.includes('hibiscus') ||
      titleLower.includes('azalea') ||
      titleLower.includes('gardenia') ||
      titleLower.includes('mycorrhizal') ||
      titleLower.includes('rhododendron') ||
      titleLower.includes('petunia') ||
      titleLower.includes('geranium') ||
      titleLower.includes('hanging basket') ||
      titleLower.includes('daffodil') ||
      titleLower.includes('tulip') ||
      titleLower.includes('mum') ||
      titleLower.includes('ixora') ||
      titleLower.includes('lilac') ||
      titleLower.includes('bloom') ||
      titleLower.includes('bougainvillea') ||
      titleLower.includes('camellia') ||
      titleLower.includes('desert rose') ||
      titleLower.includes('plumeria') ||
      titleLower.includes('pumpkin') ||
      titleLower.includes('potato') ||
      titleLower.includes('garlic') ||
      titleLower.includes('water soluble') ||
      titleLower.includes('fall fertilizer') ||
      titleLower.includes('winter fertilizer') ||
      titleLower.includes('ivy') ||
      titleLower.includes('soil microbes') ||
      titleLower.includes('trichoderma') ||
      titleLower.includes('olive') ||
      titleLower.includes('mango') ||
      titleLower.includes('lime') ||
      titleLower.includes('evergreen') ||
      titleLower.includes('arborvitae') ||
      titleLower.includes('palm') ||
      titleLower.includes('apple') ||
      titleLower.includes('citrus') ||
      titleLower.includes('lemon') ||
      titleLower.includes('avocado') ||
      titleLower.includes('aspen') ||
      titleLower.includes('boxwood') ||
      titleLower.includes('crepe myrtle') ||
      titleLower.includes('dogwood') ||
      titleLower.includes('japanese maple') ||
      titleLower.includes('magnolia') ||
      titleLower.includes('maple') ||
      titleLower.includes('oak') ||
      titleLower.includes('orange') ||
      titleLower.includes('pine') ||
      titleLower.includes('root stimulator') ||
      titleLower.includes('sago palm') ||
      titleLower.includes('jasmine') ||
      tagsLower.some(tag => tag.includes('garden')) ||
      tagsLower.some(tag => tag.includes('outdoor')) ||
      tagsLower.some(tag => tag.includes('tree')) ||
      tagsLower.some(tag => tag.includes('plant food')) ||
      tagsLower.some(tag => tag.includes('lawn'))
    ) {
      return "Garden Products";
    }
    
    // Check hydroponic and aquatic
    if (
      titleLower.includes('hydro') ||
      titleLower.includes('aquatic') ||
      titleLower.includes('water') ||
      titleLower.includes('lily') ||
      tagsLower.some(tag => tag.includes('hydro')) ||
      tagsLower.some(tag => tag.includes('aquatic'))
    ) {
      return "Hydrophonic and Aquatic";
    }
    
    // Check plant supplements
    if (
      titleLower.includes('supplement') ||
      titleLower.includes('fertilizer') ||
      titleLower.includes('nutrient') ||
      titleLower.includes('root stimulator') ||
      tagsLower.some(tag => tag.includes('supplement'))
    ) {
      return "Plant Supplements";
    }
    
    // Check if it's a bundle
    if (
      titleLower.includes('bundle') ||
      titleLower.includes('set') ||
      titleLower.includes('collection') ||
      titleLower.includes('pack') ||
      tagsLower.some(tag => tag.includes('bundle'))
    ) {
      return "Curated Bundles";
    }
    
    // Default category
    return "Houseplant Products";
  };

  // Get fallback data in case API fails
  const getFallbackData = () => {
    return [
      // Houseplant Products
      {
        id: 'product-1',
        name: "INDOOR PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 1203,
        bestSeller: true,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant1', title: '8 oz', price: 14.99, available: true },
          { id: 'variant2', title: '16 oz', price: 24.99, available: true }
        ]
      },
      {
        id: 'product-2',
        name: "MONSTERA PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/monstera-plant-food.png",
        price: 14.99,
        reviews: 1203,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [
          { id: 'variant3', title: '8 oz', price: 14.99, available: true },
          { id: 'variant4', title: '16 oz', price: 24.99, available: false }
        ]
      },
      {
        id: 'product-4',
        name: "FIDDLE LEAF FIG PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/fiddle-leaf-fig-plant-food.png",
        price: 14.99,
        reviews: 1203,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [{ id: 'variant4', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-3',
        name: "SUCCULENT PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 802,
        category: "Houseplant Products",
        backgroundColorLight: "#e0f5ed",
        variants: [{ id: 'variant4', title: '8 oz', price: 14.99, available: true }]
      },
      
      // Garden Products
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
      {
        id: 'product-6',
        name: "TOMATO PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 14.99,
        reviews: 876,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant5', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-9',
        name: "ROSE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 15.99,
        reviews: 567,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant9', title: '8 oz', price: 15.99, available: true }]
      },
      {
        id: 'product-10',
        name: "LAWN FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 16.99,
        reviews: 432,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant10', title: '8 oz', price: 16.99, available: true }]
      },
      {
        id: 'product-11',
        name: "FRUIT TREE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 17.99,
        reviews: 389,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant11', title: '8 oz', price: 17.99, available: true }]
      },
      {
        id: 'product-12',
        name: "FLOWERING PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 14.99,
        reviews: 743,
        category: "Garden Products",
        backgroundColorLight: "#e4f2d7",
        variants: [{ id: 'variant12', title: '8 oz', price: 14.99, available: false }]
      },
      
      // Hydroponic and Aquatic
      {
        id: 'product-7',
        name: "AQUATIC PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/herbs-plant-food.png", 
        price: 16.99,
        reviews: 542,
        category: "Hydrophonic and Aquatic",
        backgroundColorLight: "#d6eaf8",
        variants: [
          { id: 'variant6', title: '8 oz', price: 16.99, available: true },
          { id: 'variant7', title: '16 oz', price: 28.99, available: true },
          { id: 'variant8', title: '32 oz', price: 42.99, available: true }
        ]
      },
      
      // Plant Supplements
      {
        id: 'product-8',
        name: "PLANT GROWTH SUPPLEMENT",
        description: "PLANT FOOD",
        image: "/assets/products/fiddle-leaf-fig-plant-food.png", 
        price: 12.99,
        reviews: 789,
        category: "Plant Supplements",
        backgroundColorLight: "#f9e6d2",
        variants: [{ id: 'variant7', title: '8 oz', price: 12.99, available: true }]
      }
    ];
  };

  useEffect(() => {
    // Fetch real products from API
    fetchAllProducts();
  }, []);
  
  // Handle location state changes
  useEffect(() => {
    // Check if we need to scroll to a specific category from location state
    if (location.state && location.state.scrollToCategory) {
      setActiveCategory(location.state.scrollToCategory);
    }
  }, [location]);

  // Scroll to category section when category is selected
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

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

  // Render a product card
  const renderProductCard = (product) => {
    // Get first available variant
    const availableVariant = product.variants.find(variant => variant.available) || product.variants[0];
    
    return (
      <div 
        key={product.id} 
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
          
          <div className="flex justify-between items-center mb-2 sm:mb-4 text-xs sm:text-base">
            <div className="flex-1 border border-gray-300 rounded-l-full p-1 sm:p-2 pl-2 sm:pl-4 bg-white">
              <span className="font-medium">{availableVariant?.title || '8 Ounces'}</span>
            </div>
            <div className="flex-1 border border-gray-300 rounded-r-full p-1 sm:p-2 pr-2 sm:pr-4 bg-white text-right">
              <span className="font-medium">${availableVariant ? availableVariant.price.toFixed(2) : product.price.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            className="w-full bg-[#ff6b57] hover:bg-[#ff5a43] text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-colors"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    );
  };

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
    }
  });

  return (
    <section className="bg-[#fffbef]">
      {/* Page Title */}
      <div className="text-center pt-8 mb-6">
        <h2 className="text-4xl font-medium text-[#ff6b57] mb-1">Find Your Plant</h2>
        <p className="text-gray-500 tracking-wide text-sm">CHOOSE A COLLECTION</p>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center space-x-3 sm:space-x-6 mb-12">
        {categories.map((category, index) => (
          <button 
            key={index}
            onClick={() => handleCategoryClick(category.category)}
            className={`flex flex-col items-center group w-20 sm:w-24 focus:outline-none ${
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
              />
            </div>
            <span className="font-medium text-gray-800 text-center text-xs">{category.name}</span>
          </button>
        ))}
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
            if (categoryProducts.length === 0) return null;
            
            return (
              <div 
                key={category.category} 
                className="mb-16"
                ref={el => categoryRefs.current[category.category] = el}
              >
                {/* Category Banner */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <div 
                    className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-cover bg-center rounded-lg"
                    style={{ 
                      backgroundImage: `url(${category.image})`,
                      backgroundColor: '#f0f0f0' // Fallback color in case image doesn't load
                    }}
                  >
                    {/* Debugging image to test path */}
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${category.image}`);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.map(product => renderProductCard(product))}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
};

export default ProductsPage; 