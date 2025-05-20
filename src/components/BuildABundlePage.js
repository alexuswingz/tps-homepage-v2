import React, { useState, useEffect, useRef } from 'react';

const BuildABundlePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Houseplant Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [bundleCount, setBundleCount] = useState(0);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const pageTopRef = useRef(null);
  
  // List of houseplant product names from the image
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
    "Indoor Plant Food",
    "Fiddle Leaf Fig Plant Food",
    "Monstera Plant Food",
    "African Violet Fertilizer"
  ];
  
  // List of lawn and garden product names from the image
  const lawnGardenProducts = [
    "Bougainvillea Fertilizer",
    "Camellia Fertilizer",
    "Cut Flower Food",
    "Desert Rose Fertilizer",
    "Flowering Fertilizer",
    "Rose Bush Fertilizer",
    "Rose Fertilizer",
    "Plumeria Fertilizer",
    "Hydrangea Fertilizer",
    "Hibiscus Fertilizer",
    "Azalea Fertilizer",
    "Gardenia Fertilizer",
    "Rhododendron Fertilizer",
    "Petunia Fertilizer",
    "Geranium Fertilizer",
    "Hanging Basket Plant Food",
    "Flowering Plant Food",
    "Daffodil Bulb Fertilizer",
    "Tulip Bulb Fertilizer",
    "Mum Fertilizer",
    "Ixora Fertilizer",
    "Bulb Fertilizer",
    "Lilac Bush Fertilizer",
    "Bloom Fertilizer",
    "Berry Fertilizer",
    "Pepper Fertilizer",
    "Tomato Fertilizer",
    "Strawberry Fertilizer",
    "Blueberry Fertilizer",
    "Herbs and Leafy Greens Plant Food",
    "Vegetable Fertilizer",
    "Pumpkin Fertilizer",
    "Potato Fertilizer",
    "Garlic Fertilizer",
    "Water Soluble Fertilizer",
    "Garden Fertilizer",
    "Plant Food Outdoor",
    "Lawn Fertilizer",
    "All Purpose Fertilizer",
    "All Purpose NPK Fertilizer",
    "Starter Fertilizer",
    "10-10-10 for General Use",
    "10-10-10 for Vegetables",
    "10-10-10 for Plants",
    "Fall Fertilizer",
    "Winter Fertilizer",
    "Tree Fertilizer",
    "Fruit Tree Fertilizer",
    "Apple Tree Fertilizer",
    "Citrus Fertilizer",
    "Lemon Tree Fertilizer",
    "Shrub Fertilizer"
  ];
  
  // List of hydro and aquatic product names from the image
  const hydroAquaticProducts = [
    "Aquarium Plant Fertilizer",
    "Aquatic Plant Fertilizer",
    "Water Garden Fertilizer",
    "Hydroponic Nutrients",
    "Hydroponic Plant Food"
  ];
  
  // List of specialty supplements product names from the image
  const specialtySupplements = [
    "Fish Fertilizer",
    "Root Boost",
    "Calcium for Plants",
    "Seaweed Fertilizer"
  ];

  const categories = [
    { id: 1, name: 'ALL PRODUCTS', image: '/assets/Export Landing Page Main Images/Homepage Image 2.jpg', category: ''},
    { id: 2, name: 'HOUSE PLANTS', image: '/assets/Collection Tiles Images/Houseplants Tile.jpg', category: 'Houseplant Products'},
    { id: 3, name: 'LAWN & GARDEN', image: '/assets/Collection Tiles Images/Lawn and Garden Tile.jpg', category: 'Garden Products'},
    { id: 4, name: 'HYDRO & AQUATIC', image: '/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg', category: 'Hydrophonic and Aquatic'},
    { id: 5, name: 'SPECIALTY SUPPLEMENTS', image: '/assets/Collection Tiles Images/Specialty Supplements Title.jpg', category: 'Plant Supplements'},
    { id: 6, name: 'CURATED BUNDLES', image: '/assets/menu/Bundle Builder Tile.jpg', category: ''}
  ];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Function to make API calls to Shopify Storefront API
  const fetchFromStorefrontAPI = async (query) => {
    // API URL for Shopify Storefront API
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

      try {
        const result = await fetchFromStorefrontAPI(query);
        
        // Check if we got data back
        if (result.data && result.data.products && result.data.products.edges) {
          const newProducts = [...allProducts, ...result.data.products.edges.map(mapProductFromShopify)];
          
          // If there are more pages, fetch them
          if (result.data.products.pageInfo.hasNextPage) {
            return fetchAllProducts(result.data.products.pageInfo.endCursor, newProducts);
          } else {
            // If we've fetched them all, use what we have
            console.log("Fetched products:", newProducts);
            setProducts(newProducts);
            setLoading(false);
          }
        } else {
          // If API fails to return expected data structure, use fallback data
          console.warn("Invalid data structure returned from API, using fallback data");
          setProducts(getFallbackData());
          setLoading(false);
        }
      } catch (apiError) {
        console.error('Error with Shopify API request:', apiError);
        setProducts(getFallbackData());
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getFallbackData());
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
      sku: edge.node.sku || "",
      options: edge.node.selectedOptions || [],
      image: edge.node.image ? edge.node.image.transformedSrc : null
    }));
    
    // Get the default variant (first one)
    const defaultVariant = variants.length > 0 ? variants[0] : null;
    
    // Check if this product is a house plant product from our list
    const isHouseplantProduct = houseplantProducts.some(name => 
      node.title.toLowerCase().includes(name.toLowerCase())
    );
    
    // Check if this product is a lawn & garden product from our list
    const isLawnGardenProduct = lawnGardenProducts.some(name => 
      node.title.toLowerCase().includes(name.toLowerCase())
    );
    
    // Check if this product is a hydroponic/aquatic product from our list
    const isHydroAquaticProduct = hydroAquaticProducts.some(name => 
      node.title.toLowerCase().includes(name.toLowerCase())
    );
    
    // Check if this product is a specialty supplement from our list
    const isSpecialtySupplementProduct = specialtySupplements.some(name => 
      node.title.toLowerCase().includes(name.toLowerCase())
    );
    
    // Set the category based on our detection or use the productType from Shopify
    let category = node.productType;
    if (isHouseplantProduct) {
      category = "Houseplant Products";
    } else if (isLawnGardenProduct) {
      category = "Garden Products";
    } else if (isHydroAquaticProduct) {
      category = "Hydrophonic and Aquatic";
    } else if (isSpecialtySupplementProduct) {
      category = "Plant Supplements";
    }
    
    // Format the price properly
    const price = defaultVariant 
      ? defaultVariant.price 
      : (node.priceRange && node.priceRange.minVariantPrice 
          ? parseFloat(node.priceRange.minVariantPrice.amount) 
          : 0);
    
    // Format the title
    const title = node.title.toUpperCase();
    
    // Generate a product color (using the primary brand color with some variation)
    let hue;
    if (isHouseplantProduct) hue = '160';
    else if (isLawnGardenProduct) hue = '100';
    else if (isHydroAquaticProduct) hue = '200';
    else if (isSpecialtySupplementProduct) hue = '300';
    else hue = '20';
    
    const backgroundColorLight = `hsla(${hue}, 60%, 95%, 0.6)`;
    
    return {
      id: node.id,
      name: node.title,
      displayName: title,
      description: node.description || "PLANT FOOD",
      image: images.length > 0 ? images[0].src : "/assets/products/placeholder.png",
      images: images,
      price: price,
      priceFormatted: `$${price.toFixed(2)}`,
      reviews: Math.floor(Math.random() * 800) + 200, // Simulate review count
      bestSeller: node.tags && node.tags.includes("best-seller"),
      category: category,
      variants,
      size: defaultVariant ? defaultVariant.title : "8 Ounces",
      backgroundColorLight
    };
  };

  // Get fallback data in case API fails
  const getFallbackData = () => {
    return [
      {
        id: 'product-1',
        name: "INDOOR PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 1203,
        bestSeller: true,
        category: "Houseplant Products",
        size: "8 Ounces",
        variants: [{ id: 'variant1', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)"
      },
      {
        id: 'product-2',
        name: "MONSTERA PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_Monstera_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 1203,
        category: "Houseplant Products",
        size: "8 Ounces",
        variants: [{ id: 'variant2', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)"
      },
      {
        id: 'product-3',
        name: "HERBS & LEAFY GREENS PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_Herb_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 299,
        category: "Garden Products",
        size: "8 Ounces",
        variants: [{ id: 'variant3', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)"
      },
      {
        id: 'product-4',
        name: "FIDDLE LEAF FIG PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_Fiddle_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 1203,
        category: "Houseplant Products",
        size: "8 Ounces",
        variants: [{ id: 'variant4', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)"
      },
      {
        id: 'product-5',
        name: "SUCCULENT PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_Succulent_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 882,
        category: "Houseplant Products",
        size: "8 Ounces",
        variants: [{ id: 'variant5', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)"
      },
      {
        id: 'product-6',
        name: "ROSE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png",
        price: 15.99,
        priceFormatted: "$15.99",
        reviews: 567,
        category: "Garden Products",
        size: "8 Ounces",
        variants: [{ id: 'variant6', title: '8 oz', price: 15.99, available: true }],
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)"
      },
      {
        id: 'product-7',
        name: "TOMATO PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 763,
        category: "Garden Products",
        size: "8 Ounces",
        variants: [{ id: 'variant7', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)"
      },
      {
        id: 'product-8',
        name: "FLOWERING PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png",
        price: 14.99,
        priceFormatted: "$14.99",
        reviews: 612,
        category: "Garden Products",
        size: "8 Ounces",
        variants: [{ id: 'variant8', title: '8 oz', price: 14.99, available: true }],
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)"
      },
      {
        id: 'product-9',
        name: "FRUIT TREE FERTILIZER",
        description: "PLANT FOOD",
        image: "/assets/products/TPS_8oz_Wrap_PNG/TPS_IPF_8oz_Wrap.png",
        price: 16.99,
        priceFormatted: "$16.99",
        reviews: 412,
        category: "Garden Products",
        size: "8 Ounces",
        variants: [{ id: 'variant9', title: '8 oz', price: 16.99, available: true }],
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)"
      }
    ];
  };

  // Function to add an item to the bundle
  const addToBundle = (product) => {
    if (bundleCount >= 3) return;
    
    // Check if product is already in the bundle
    const existingItemIndex = selectedItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Product exists, increment quantity if stock allows
      const existingItem = selectedItems[existingItemIndex];
      
      // Check if we have enough stock
      const availableStock = getAvailableStock(product);
      if (existingItem.quantity >= availableStock) {
        // Can't add more than what's in stock
        return;
      }
      
      // Update quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };
      
      setSelectedItems(updatedItems);
      setBundleCount(bundleCount + 1);
    } else {
      // Product doesn't exist in bundle yet, add it with quantity 1
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
      setBundleCount(bundleCount + 1);
    }
  };

  // Function to remove an item from the bundle
  const removeFromBundle = (productId) => {
    const itemIndex = selectedItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex === -1) return;
    
    const currentItem = selectedItems[itemIndex];
    
    if (currentItem.quantity > 1) {
      // Just reduce quantity if more than 1
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex] = {
        ...currentItem,
        quantity: currentItem.quantity - 1
      };
      setSelectedItems(updatedItems);
    } else {
      // Remove completely if quantity is 1
      setSelectedItems(selectedItems.filter(item => item.product.id !== productId));
    }
    
    setBundleCount(bundleCount - 1);
  };

  // Function to get available stock for a product
  const getAvailableStock = (product) => {
    // In a real implementation, this would get data from Shopify
    // For now, we'll use a simplified approach
    const variant = product.variants.find(v => v.title.includes('8 oz') || v.title.includes('8 Ounces'));
    return variant && variant.available ? 10 : 0; // Default stock limit for available products
  };

  // Filter the variants to only include 8 ounce options
  const getEightOunceVariant = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    
    return product.variants.find(v => 
      v.title.toLowerCase().includes('8 oz') || 
      v.title.toLowerCase().includes('8 ounce')
    ) || product.variants[0]; // Fallback to first variant if no 8oz option
  };

  const renderStars = () => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 text-[#ff6b57] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
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
  
  // Filter products based on selected category
  const filteredProducts = products
    .filter(product => selectedCategory ? product.category === selectedCategory : true)
    .filter(product => {
      if (!searchTerm) return true;
      // Check if product name matches search term
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // Handler for category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Toggle category options visibility
  const toggleCategoryOptions = () => {
    setShowCategoryOptions(!showCategoryOptions);
  };

  // Handle category selection from the overlay
  const handleOverlayCategorySelect = (category) => {
    setSelectedCategory(category);
    scrollToTop();
    setShowCategoryOptions(false);
  };

  return (
    <div className="min-h-screen bg-[#fffbef]" ref={pageTopRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row">
          {/* Bundle Section - Will be first on mobile and right on desktop */}
          <div className="w-full lg:w-[30%] pt-6 pl-0 lg:pl-6 order-first lg:order-last mb-8 lg:mb-0">
            <div className="bg-[#fffbef] rounded-2xl p-6 shadow-sm border border-gray-200 lg:sticky lg:top-[140px]">
              <h2 className="text-2xl font-bold text-center mb-1">Your Bundle</h2>
              <p className="text-center text-gray-600 mb-6">Make a bundle of 3 or 5!</p>
              
              {/* Bundle Items */}
              {selectedItems.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {selectedItems.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="border border-gray-300 rounded-lg p-2 bg-white flex flex-col sm:flex-row items-center">
                      <div className="w-20 h-20 sm:w-16 sm:h-16 relative overflow-hidden flex-shrink-0 mb-2 sm:mb-0">
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="ml-0 sm:ml-3 flex-grow text-center sm:text-left">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <div className="flex items-center justify-center sm:justify-start mt-1">
                          <button 
                            onClick={() => removeFromBundle(item.product.id)}
                            className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => addToBundle(item.product)}
                            className={`w-6 h-6 rounded-full ${bundleCount < 3 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} flex items-center justify-center text-sm`}
                            disabled={bundleCount >= 3}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {[0, 1, 2].map((_, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg h-[80px] flex items-center justify-center relative overflow-hidden bg-white">
                      <div className="h-[70%] w-[20px] bg-gray-200 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Selected count */}
              <div className="border border-gray-300 rounded-full py-3 text-center mb-4 bg-white">
                <p className="font-medium text-gray-700">{bundleCount}/3 SELECTED</p>
              </div>
              
              <p className="text-center text-gray-600">Add 3 bottles to save $10!</p>
              
              {bundleCount === 3 && (
                <button className="w-full bg-[#ff6b57] hover:bg-[#ff5a5a] text-white font-bold py-3 px-4 rounded-full transition-colors mt-4">
                  CHECKOUT BUNDLE
                </button>
              )}
            </div>
          </div>

          {/* Products Section - Will be second on mobile and left on desktop */}
          <div className="w-full lg:w-[70%] pt-6 pr-0 lg:pr-6 order-last lg:order-first">
            {/* Choose Collection */}
            <h2 className="text-gray-500 font-medium mb-4">CHOOSE A COLLECTION</h2>
            
            {/* Categories */}
            <div className="flex overflow-x-auto mb-6 pb-2 hide-scrollbar gap-4">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="flex-shrink-0 text-center w-[85px] cursor-pointer"
                  onClick={() => handleCategoryClick(category.category)}
                >
                  <div className={`overflow-hidden rounded-lg mb-2 mx-auto w-16 h-16 sm:w-20 sm:h-20 ${selectedCategory === category.category ? 'ring-2 ring-[#ff6b57]' : ''}`}>
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <p className={`text-xs leading-tight ${selectedCategory === category.category ? 'font-bold' : ''}`}>{category.name}</p>
                </div>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-transparent"
                  placeholder="SEARCH"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </div>
            </div>

            {/* Products Section */}
            <h3 className="text-xl font-bold mb-4">
              {selectedCategory ? selectedCategory.replace("Products", "").trim().toUpperCase() : "ALL PRODUCTS"}
            </h3>
            
            {loading ? (
              <div className="text-center py-12">
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 mb-8">
                {filteredProducts.map(product => {
                  const eightOzVariant = getEightOunceVariant(product);
                  const inStock = eightOzVariant && eightOzVariant.available;
                  const itemInBundle = selectedItems.find(item => item.product.id === product.id);
                  const currentQuantity = itemInBundle ? itemInBundle.quantity : 0;
                  const availableStock = getAvailableStock(product);
                  const canAddMore = bundleCount < 3 && (currentQuantity < availableStock);
                  
                  return (
                    <div 
                      key={product.id} 
                      className="rounded-lg overflow-hidden shadow-sm relative"
                      style={{ backgroundColor: product.backgroundColorLight }}
                    >
                      {product.bestSeller && (
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#ff6b57] text-white font-bold py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm">
                          BEST SELLER!
                        </div>
                      )}
                      {!inStock && (
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
                          {renderStars()}
                          <span className="text-gray-600 text-xs sm:text-sm">{product.reviews} reviews</span>
                        </div>
                        
                        <div className="mb-2 sm:mb-4">
                          {formatProductName(product.name)}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                          <div className="flex-1 border border-gray-300 rounded-l-full p-1 sm:p-2 pl-2 sm:pl-4 bg-white">
                            <span className="font-medium text-xs sm:text-base">8 Ounces</span>
                          </div>
                          <div className="flex-1 border border-gray-300 rounded-r-full p-1 sm:p-2 pr-2 sm:pr-4 bg-white text-right">
                            <span className="font-medium text-xs sm:text-base">${eightOzVariant ? eightOzVariant.price.toFixed(2) : product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {currentQuantity > 0 && (
                          <div className="flex items-center justify-between mb-2 sm:mb-4 bg-[#fff3e0] rounded-full p-1 sm:p-2">
                            <button 
                              onClick={() => removeFromBundle(product.id)}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#ff6b57] flex items-center justify-center font-bold shadow hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="font-bold text-xs sm:text-base">{currentQuantity} in bundle</span>
                            <button 
                              onClick={() => addToBundle(product)}
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${canAddMore ? 'bg-white text-[#ff6b57]' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold shadow ${canAddMore ? 'hover:bg-gray-100' : ''}`}
                              disabled={!canAddMore}
                            >
                              +
                            </button>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => addToBundle(product)}
                          className={`w-full font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-colors text-xs sm:text-base ${inStock && bundleCount < 3 ? 'bg-[#ff6b57] hover:bg-[#ff5a5a] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                          disabled={!inStock || bundleCount >= 3}
                        >
                          {currentQuantity > 0 ? 'ADD ANOTHER' : 'ADD TO BUNDLE'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right Overlay */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        {showCategoryOptions && (
          <div className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-2">
              {categories.map(category => (
                <div 
                  key={category.id}
                  onClick={() => handleOverlayCategorySelect(category.category)}
                  className={`flex items-center p-2 rounded cursor-pointer ${selectedCategory === category.category ? 'bg-[#fff3e0] font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden mr-2">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button 
            onClick={toggleCategoryOptions}
            className="bg-[#ff6b57] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff5a5a] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <button 
            onClick={scrollToTop}
            className="bg-[#ff6b57] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff5a5a] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildABundlePage; 