import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const ShopByPlant = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Houseplant Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);
  
  // Background gradient styles for each product card
  const cardBackgrounds = [
    'bg-gradient-to-br from-[#e6f4fa] to-[#d9eef8]', // Light blue gradient
    'bg-gradient-to-br from-[#f2f9e7] to-[#e8f4d9]', // Light green gradient
    'bg-gradient-to-br from-[#fef5e7] to-[#fbecd3]', // Light yellow/cream gradient
    'bg-gradient-to-br from-[#f8effc] to-[#f1e3fa]'  // Light lavender gradient
  ];
  
  // Helper function to get a random background
  const getRandomBackground = (index) => {
    const backgroundIndex = index % cardBackgrounds.length;
    return cardBackgrounds[backgroundIndex];
  };
  
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
    "Plant Food",
    "Plant Fertilizer",
    "All Purpose Fertilizer",
    "All Purpose NPK Fertilizer",
    "Starter Fertilizer",
    "10-10-10 for General Use",
    "10-10-10 for Vegetables",
    "10-10-10 for Plants",
    "Fall Fertilizer",
    "Winter Fertilizer",
    "Ivy Plant Food",
    "Lawn Fertilizer",
    "Mycorrhizal Fungi for Trees",
    "Mycorrhizal Fungi for Palm Trees",
    "Mycorrhizal Fungi for Gardens",
    "Mycorrhizal Fungi for Citrus Trees",
    "Mycorrhizal Fungi",
    "Root Booster for Plants",
    "Soil Microbes for Gardening",
    "Trichoderma for Plants",
    "Peach Tree Fertilizer",
    "Olive Tree Fertilizer",
    "Mango Tree Fertilizer",
    "Lime Tree Fertilizer",
    "Evergreen Fertilizer",
    "Arborvitae Fertilizer",
    "Palm Fertilizer",
    "Apple Tree Fertilizer",
    "Citrus Fertilizer",
    "Tree Fertilizer",
    "Fruit Tree Fertilizer",
    "Lemon Tree Fertilizer",
    "Avocado Tree Fertilizer",
    "10-10-10 for Trees",
    "Aspen Tree Fertilizer",
    "Boxwood Fertilizer",
    "Crepe Myrtle Fertilizer",
    "Dogwood Tree Fertilizer",
    "Japanese Maple Fertilizer",
    "Magnolia Tree Fertilizer",
    "Maple Tree Fertilizer",
    "Oak Tree Fertilizer",
    "Orange Tree Fertilizer",
    "Pine Tree Fertilizer",
    "Root Stimulator for Trees",
    "Sago Palm Fertilizer",
    "Shrub Fertilizer",
    "Tree And Shrub Fertilizer",
    "Jasmine Fertilizer"
  ];
  
  // List of hydro and aquatic product names from the image
  const hydroAquaticProducts = [
    "Liquid Plant Food",
    "Lotus Fertilizer",
    "Aquarium Plant Fertilizer",
    "Aquatic Plant Fertilizer",
    "Water Garden Fertilizer",
    "Water Lily Fertilizer",
    "Hydroponic Nutrients",
    "Hydroponic Plant Food"
  ];
  
  // List of specialty supplements product names from the image
  const specialtySupplements = [
    "Fish Emulsion Fertilizer",
    "Fish Fertilizer",
    "Silica for Plants",
    "Cal-Mag Fertilizer",
    "Seaweed Fertilizer",
    "Calcium for Plants",
    "Calcium Nitrate",
    "Worm Castings Concentrate",
    "Compost Starter and Accelerator",
    "Compost Tea",
    "Sulfur for Plants",
    "Phosphorus Fertilizer",
    "Potassium Fertilizer",
    "Ferrous Sulfate For Plants",
    "Urea Fertilizer",
    "Magnesium for Plants",
    "Potassium Nitrate Fertilizer",
    "Ammonium Nitrate Fertilizer",
    "Potassium Sulfate Fertilizer",
    "Sulfate Of Potash",
    "Potash Fertilizer",
    "Muriate Of Potash",
    "Phosphorus and Potassium Fertilizer",
    "Compost Tea for Plants",
    "Kelp Meal Fertilizer",
    "Nitrogen Fertilizer",
    "Seaweed Extract for Plants",
    "pH Down",
    "pH Up"
  ];
  
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
      category: ""
    }
  ];

  useEffect(() => {
    fetchAllProducts();
    
    // Function to handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to make API calls to Shopify Storefront API using CORS proxy
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
        // Fall back to direct API call without proxy as a last resort
        try {
          const directApiUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
          const response = await fetch(directApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': 'd5720278d38b25e4bc1118b31ff0f045'
            },
            body: JSON.stringify({ query })
          });
          
          const result = await response.json();
          if (result.data && result.data.products && result.data.products.edges) {
            const directProducts = [...allProducts, ...result.data.products.edges.map(mapProductFromShopify)];
            console.log("Fetched products via direct API:", directProducts);
            setProducts(directProducts);
          } else {
            console.warn("Invalid data structure returned from direct API, using fallback data");
            setProducts(getFallbackData());
          }
        } catch (directError) {
          console.error('Error with direct API request:', directError);
          setProducts(getFallbackData());
        }
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
    
    // Assign an alternating background class instead of random
    const hashCode = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const backgroundClass = getRandomBackground(Math.abs(hashCode) % cardBackgrounds.length);
    
    // Generate a product color (using the primary brand color with some variation)
    let hue;
    if (isHouseplantProduct) hue = '160';
    else if (isLawnGardenProduct) hue = '100';
    else if (isHydroAquaticProduct) hue = '200';
    else if (isSpecialtySupplementProduct) hue = '300';
    else hue = '20';
    
    const productColor = `hsla(${hue}, 80%, 50%, 1)`;
    const backgroundColorLight = `hsla(${hue}, 60%, 95%, 0.6)`; // 60% opacity
    const dropdownColor = `hsla(${hue}, 60%, 95%, 0.4)`; // 40% opacity
    
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
      tags: node.tags || [],
      vendor: node.vendor || "",
      productColor,
      backgroundColorLight,
      dropdownColor,
      backgroundClass
    };
  };

  // Function to format the product name with product type on separate lines
  const formatProductName = (name) => {
    // Convert to uppercase for consistency
    const upperName = name.toUpperCase();
    
    // Find where to split the name (before "PLANT", "FERTILIZER", "FOOD", "SUPPLEMENT")
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
          <p className="text-xl font-bold text-gray-800 mb-1 truncate overflow-hidden hover:text-[#ff6b57] transition-colors duration-200">{firstPart}</p>
          <p className="text-lg text-gray-700 truncate overflow-hidden hover:text-[#ff6b57] transition-colors duration-200">{secondPart}</p>
        </div>
      );
    }
    
    // Fallback if no split is possible
    return (
      <div className="product-name-container h-20 flex flex-col justify-start">
        <p className="text-xl font-bold text-gray-800 truncate overflow-hidden hover:text-[#ff6b57] transition-colors duration-200">{upperName}</p>
        <div className="h-6"></div>
      </div>
    );
  };

  // Get fallback data in case API fails
  const getFallbackData = () => {
    return [
      {
        id: 'product-1',
        name: "INDOOR PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png",
        price: 14.99,
        reviews: 1203,
        bestSeller: true,
        category: "Houseplant Products",
        variants: [{ id: 'variant1', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-2',
        name: "MONSTERA PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/monstera-plant-food.png",
        price: 14.99,
        reviews: 1203,
        category: "Houseplant Products",
        variants: [{ id: 'variant2', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-3',
        name: "HERBS & LEAFY GREENS PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/herbs-plant-food.png",
        price: 14.99,
        reviews: 299,
        category: "Garden Products",
        variants: [{ id: 'variant3', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-4',
        name: "FIDDLE LEAF FIG PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/fiddle-leaf-fig-plant-food.png",
        price: 14.99,
        reviews: 1203,
        category: "Houseplant Products",
        variants: [{ id: 'variant4', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-5',
        name: "TOMATO PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/indoor-plant-food.png", 
        price: 14.99,
        reviews: 876,
        category: "Garden Products",
        variants: [{ id: 'variant5', title: '8 oz', price: 14.99, available: true }]
      },
      {
        id: 'product-6',
        name: "AQUATIC PLANT FOOD",
        description: "PLANT FOOD",
        image: "/assets/products/herbs-plant-food.png", 
        price: 16.99,
        reviews: 542,
        category: "Hydrophonic and Aquatic",
        variants: [{ id: 'variant6', title: '8 oz', price: 16.99, available: true }]
      },
      {
        id: 'product-7',
        name: "PLANT GROWTH SUPPLEMENT",
        description: "PLANT FOOD",
        image: "/assets/products/fiddle-leaf-fig-plant-food.png", 
        price: 12.99,
        reviews: 789,
        category: "Plant Supplements",
        variants: [{ id: 'variant7', title: '8 oz', price: 12.99, available: true }]
      }
    ];
  };

  // Apply filters for category and search term and limit to top 5 for mobile
  const filteredProducts = products
    .filter(product => selectedCategory ? product.category === selectedCategory : true)
    .filter(product => {
      if (!searchTerm) return true;
      // Check if product name matches search term
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
  // Products to display - limit to 5 on mobile only
  const displayProducts = isMobile ? filteredProducts.slice(0, 5) : filteredProducts;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSeeAllClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  // Function to generate a unique key based on filtered products
  const getCarouselKey = () => {
    return `carousel-${selectedCategory}-${searchTerm}-${filteredProducts.length}`;
  };

  // Check if the product name matches any of our house plant product names
  const isNameInHouseplantList = (productName) => {
    return houseplantProducts.some(name => 
      productName.toLowerCase().includes(name.toLowerCase())
    );
  };

  // Find the current category object based on selectedCategory
  const getCurrentCategoryObject = () => {
    return categories.find(cat => cat.category === selectedCategory) || categories[0];
  };

  return (
    <section className="py-8 bg-[#fffbef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-medium text-[#ff6b57] mb-1">Shop by Plant</h2>
          <p className="text-gray-500 tracking-wide text-sm">CHOOSE A COLLECTION</p>
        </div>

        <div className="flex justify-center space-x-3 sm:space-x-6 mb-8">
          {categories.map((category, index) => (
            <button 
              key={index}
              onClick={() => handleCategoryClick(category.category)}
              className={`flex flex-col items-center group w-20 sm:w-24 focus:outline-none ${
                selectedCategory === category.category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`overflow-hidden rounded-md mb-2 w-16 h-16 sm:w-20 sm:h-20 ${
                selectedCategory === category.category ? 'ring-2 ring-[#ff6b57]' : ''
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

        {loading ? (
          <div className="text-center py-12">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mb-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{getCurrentCategoryObject().name}</h3>
              
              {/* See All button */}
              {selectedCategory && (
                <button 
                  onClick={() => handleSeeAllClick(selectedCategory)}
                  className="text-[#ff6b57] hover:text-[#ff5a43] font-medium flex items-center"
                >
                  See All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            <div key={getCarouselKey()} className="relative px-4">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ 
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  bulletClass: 'swiper-pagination-bullet',
                  el: '.swiper-pagination'
                }}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                }}
                speed={600}
                grabCursor={true}
                touchRatio={1.5}
                longSwipes={false}
                resistanceRatio={0.85}
                threshold={5}
                followFinger={true}
                cssMode={false}
                loop={false}
                watchSlidesProgress={true}
                className="swiper-container"
              >
                {displayProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <div 
                      className={`rounded-lg overflow-hidden shadow-sm relative h-full cursor-pointer hover:shadow-lg transition-all duration-200 ${product.backgroundClass || getRandomBackground(index % cardBackgrounds.length)}`}
                      onClick={() => {
                        // Extract the numeric ID from the Shopify product ID
                        const productId = product.id.split('/').pop();
                        navigate(`/product/${productId}`);
                      }}
                    >
                      {product.bestSeller && (
                        <div className="absolute top-4 left-4 bg-[#ff6b57] text-white font-bold py-1 px-4 rounded-full text-sm">
                          BEST SELLER!
                        </div>
                      )}
                      
                      <div className="p-6">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-48 mx-auto mb-4 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200"
                        />
                        
                        <div className="flex items-center justify-between mb-3">
                          {renderStars()}
                          <span className="text-gray-600 text-sm">{product.reviews} reviews</span>
                        </div>
                        
                        <div className="mb-2">
                          {formatProductName(product.name)}
                        </div>
                        
                        {product.variants && product.variants.length > 0 ? (
                          <div className="mb-4">
                            <select 
                              className="w-full py-3 px-4 rounded-full border border-gray-300 focus:outline-none appearance-none cursor-pointer text-gray-800 font-medium flex justify-between"
                              defaultValue={product.variants[0].id}
                              style={{ backgroundColor: product.backgroundColorLight }}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                // Update the default selected variant for this product
                                const selectedVariantId = e.target.value;
                                product.selectedVariantId = selectedVariantId;
                              }}
                            >
                              {product.variants.map(variant => (
                                <option 
                                  key={variant.id} 
                                  value={variant.id}
                                  className="py-2"
                                  disabled={!variant.available}
                                >
                                  {variant.title.padEnd(20, ' ')}${variant.price.toFixed(2)} {!variant.available ? ' (Out of stock)' : ''}
                                </option>
                              ))}
                            </select>
                            <style jsx>{`
                              select {
                                background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
                                background-position: right 1rem center;
                                background-repeat: no-repeat;
                                background-size: 1.5em 1.5em;
                                padding-right: 2.5rem;
                              }
                              
                              select option {
                                background-color: white;
                              }
                            `}</style>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div 
                              className="w-full py-3 px-4 rounded-full border border-gray-300 text-center"
                              style={{ backgroundColor: product.backgroundColorLight }}
                            >
                              <span className="font-medium">No variants available</span>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent div's onClick
                            let selectedVariant;
                            
                            if (product.selectedVariantId) {
                              // Use the selected variant if one was chosen from dropdown
                              selectedVariant = product.variants.find(v => v.id === product.selectedVariantId);
                            } else if (product.variants && product.variants.length > 0) {
                              // Otherwise use the first variant
                              selectedVariant = product.variants[0];
                            }
                            
                            if (selectedVariant && selectedVariant.available) {
                              addToCart(product, selectedVariant);
                            }
                          }}
                          className={`w-full font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm ${
                            // Check if the currently selected variant is available
                            (product.selectedVariantId 
                              ? product.variants.find(v => v.id === product.selectedVariantId)?.available
                              : product.variants && product.variants.length > 0 && product.variants[0].available)
                              ? 'bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={
                            // Disable if no variants or the selected variant is unavailable
                            !product.variants || 
                            product.variants.length === 0 || 
                            (product.selectedVariantId 
                              ? !product.variants.find(v => v.id === product.selectedVariantId)?.available
                              : !product.variants[0].available)
                          }
                        >
                          {(product.selectedVariantId 
                            ? product.variants.find(v => v.id === product.selectedVariantId)?.available
                            : product.variants && product.variants.length > 0 && product.variants[0].available)
                            ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                ADD TO CART
                              </>
                            )
                            : 'OUT OF STOCK'
                          }
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                
                {/* Add "See All" card only on mobile */}
                {isMobile && filteredProducts.length > 5 && (
                  <SwiperSlide key="see-all">
                    <div className="rounded-lg overflow-hidden shadow-sm relative h-full bg-white border border-gray-200 flex flex-col justify-center items-center p-6" style={{ minHeight: '500px' }}>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">View All {getCurrentCategoryObject().name}</h3>
                      <p className="text-gray-600 mb-6 text-center">
                        Browse our complete collection of {getCurrentCategoryObject().name.toLowerCase()} plant foods.
                      </p>
                      <button 
                        onClick={() => handleSeeAllClick(selectedCategory)}
                        className="bg-[#ff6b57] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#ff5a43] transition-colors duration-200"
                      >
                        See All {filteredProducts.length} Products
                      </button>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              
              <div className="swiper-pagination mt-6"></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found in this category.</p>
            <button 
              onClick={() => setSelectedCategory("Houseplant Products")}
              className="bg-[#ff6b57] text-white px-4 py-2 rounded-full font-medium"
            >
              View House Plants
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByPlant;
