import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
      name: "HOUSE\nPLANT",
      image: "/assets/Collection Tiles Images/Houseplants Tile.jpg",
      category: "Houseplant Products"
    },
    {
      name: "LAWN &\nGARDEN",
      image: "/assets/Collection Tiles Images/Lawn and Garden Tile.jpg",
      category: "Garden Products"
    },
    {
      name: "HYDRO &\nAQUATIC",
      image: "/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg",
      category: "Hydrophonic and Aquatic"
    },
    {
      name: "SPECIALTY\nSUPPLEMENTS",
      image: "/assets/Collection Tiles Images/Specialty Supplements Title.jpg",
      category: "Plant Supplements"
    },
    {
      name: "CURATED\nBUNDLES",
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

  const renderStars = (rating = 4.6, reviewCount) => {
    return (
      <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
        <span className="text-base font-medium text-[#FF6B6B] flex-shrink-0">{rating.toFixed(1)}</span>
        {/* Stars */}
        <div className="flex flex-shrink-0">
          {[1,2,3,4,5].map(i => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i <= Math.floor(rating) ? 'text-[#FF6B6B]' : (
                  i === Math.ceil(rating) && i > Math.floor(rating) ? 'text-[#FF6B6B]' : 'text-gray-300'
                )
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600 flex-shrink-0">({reviewCount})</span>
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
        <div className="mb-4 sm:mb-6">
          <h2 className="text-4xl font-bold text-[#f86659] mb-1">Plant Categories</h2>
          <p className="text-gray-500 tracking-wide text-sm"></p>
        </div>

        <div className="bg-[#ebe6d4] -mx-4 sm:mx-0 sm:rounded-lg mb-8">
          <div className="py-6 sm:py-8 px-2 sm:px-4 max-w-7xl mx-auto">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={8}
              slidesPerView="auto"
              breakpoints={{
                480: { slidesPerView: "auto", spaceBetween: 10 },
                640: { slidesPerView: "auto", spaceBetween: 12 },
                768: { slidesPerView: "auto", spaceBetween: 16 },
                1024: { 
                  slidesPerView: 5,
                  spaceBetween: 24,
                  allowTouchMove: false,
                  centeredSlides: false,
                  slidesOffsetBefore: 0,
                  slidesOffsetAfter: 0
                },
              }}
              speed={600}
              grabCursor={true}
              className="categories-swiper !px-1 lg:!px-4"
              style={{
                '--swiper-wrapper-transition-timing-function': 'linear'
              }}
            >
              {categories.map((category, index) => (
                <SwiperSlide 
                  key={index} 
                  className={`!w-auto ${index === categories.length - 1 ? 'last-slide' : ''}`}
                  style={{ width: 'auto' }}
                >
                  <button 
                    onClick={() => handleCategoryClick(category.category)}
                    className={`flex flex-col items-center group focus:outline-none w-full pt-3 pb-2 ${
                      selectedCategory === category.category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="p-1.5 w-full">
                      <div className={`overflow-hidden rounded-md mb-1.5 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto relative ${
                        selectedCategory === category.category 
                          ? 'ring-[3px] ring-[#ff6b57] ring-offset-2 shadow-lg scale-105' 
                          : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-1'
                      } transition-all duration-200`}>
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            selectedCategory === category.category 
                              ? 'scale-100' 
                              : 'group-hover:scale-105'
                          }`}
                        />
                      </div>
                    </div>
                    <span className={`font-medium text-center text-[11px] sm:text-xs md:text-sm lg:text-base leading-tight min-h-[2.5em] w-20 sm:w-28 md:w-32 lg:w-40 flex items-center justify-center whitespace-pre-line transition-colors duration-200 ${
                      selectedCategory === category.category 
                        ? 'text-[#ff6b57]' 
                        : 'text-gray-800 group-hover:text-gray-900'
                    }`}>{category.name}</span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mb-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">{getCurrentCategoryObject().name}</h3>
              
              {/* See All button */}
              {selectedCategory && (
                <button 
                  onClick={() => handleSeeAllClick(selectedCategory)}
                  className="text-[#ff6b57] hover:text-[#ff5a43] font-medium flex items-center text-sm"
                >
                  See All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            <div className="relative px-4">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, A11y]}
                spaceBetween={24}
                slidesPerView={1}
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
                        
                        <div className="flex items-center mb-3">
                          {renderStars(4.6, product.reviews)}
                        </div>
                        
                        <div className="mb-2">
                          {formatProductName(product.name)}
                        </div>
                        
                        {product.variants && product.variants.length > 0 ? (
                          <div className="relative mb-4">
                            <div 
                              className="flex justify-between items-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                const select = e.currentTarget.querySelector('select');
                                if (select) select.click();
                              }}
                            >
                              <div className="flex items-center border border-gray-300 rounded-full bg-white relative overflow-hidden w-full">
                                <div className="w-[55%] sm:w-[65%] p-2 pl-4 text-xs sm:text-sm truncate">
                                  <span className="font-medium">
                                    {product.selectedVariantId 
                                      ? product.variants.find(v => v.id === product.selectedVariantId)?.title 
                                      : product.variants[0].title}
                                  </span>
                                </div>
                                
                                <div className="h-5 border-l border-gray-300"></div>
                                
                                <div className="w-[45%] sm:w-[35%] p-2 pr-8 sm:pr-10 text-center text-xs sm:text-sm">
                                  <span className="font-medium">
                                    ${(product.selectedVariantId 
                                      ? product.variants.find(v => v.id === product.selectedVariantId)?.price 
                                      : product.variants[0].price).toFixed(2)}
                                  </span>
                                </div>
                                
                                <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                
                                <div className="absolute inset-0 bg-gray-100 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200"></div>
                              </div>
                              
                              <select 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                value={product.selectedVariantId || product.variants[0].id}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  product.selectedVariantId = e.target.value;
                                  // Force a re-render
                                  const event = new Event('change');
                                  e.target.dispatchEvent(event);
                                }}
                              >
                                {product.variants.map(variant => (
                                  <option 
                                    key={variant.id} 
                                    value={variant.id}
                                    disabled={!variant.available}
                                  >
                                    {variant.title} - ${variant.price.toFixed(2)} {!variant.available ? ' (Out of stock)' : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
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
              
              <style>
                {`
                  .swiper-container {
                    padding: 0 !important;
                  }
                  .categories-swiper .swiper-wrapper {
                    display: flex;
                    width: auto;
                    padding: 4px 0;
                  }
                  
                  .categories-swiper .swiper-slide {
                    flex-shrink: 0;
                    width: auto;
                  }
                  
                  .categories-swiper .last-slide {
                    margin-right: 0 !important;
                    padding-right: 1rem;
                  }
                  
                  @media (min-width: 1024px) {
                    .categories-swiper {
                      max-width: 1280px;
                      margin: 0 auto;
                      padding: 4px;
                    }
                    .categories-swiper .swiper-wrapper {
                      justify-content: space-between;
                      width: 100% !important;
                      transform: none !important;
                      gap: 24px;
                      padding: 4px 0;
                    }
                    .categories-swiper .swiper-slide {
                      width: calc((100% - 96px) / 5) !important;
                      margin-right: 0 !important;
                      flex: 1;
                    }
                    .categories-swiper .last-slide {
                      padding-right: 0;
                    }
                    .categories-swiper button {
                      width: 100%;
                    }
                  }
                `}
              </style>
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
