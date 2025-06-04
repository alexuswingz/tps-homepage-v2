import React, { useState, useEffect, useRef } from 'react';
import { useCart } from './CartContext';
import { useNav } from './NavContext';

const BuildABundlePage = () => {
  const { addToCart, setDiscount } = useCart();
  const { mobileMenuOpen } = useNav();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bundleCount, setBundleCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  // Add mobile category states
  const [showMobileCategorySticky, setShowMobileCategorySticky] = useState(false);
  const [mobileCategoryExpanded, setMobileCategoryExpanded] = useState(false);
  const [currentVisibleCategory, setCurrentVisibleCategory] = useState("");
  const pageTopRef = useRef(null);
  const bundleSectionRef = useRef(null);
  const mobileCategoryStickyRef = useRef(null);
  
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
    { id: 2, name: 'HOUSE\nPLANT', image: '/assets/Collection Tiles Images/Houseplants Tile.jpg', category: 'Houseplant Products'},
    { id: 3, name: 'LAWN & GARDEN', image: '/assets/Collection Tiles Images/Lawn and Garden Tile.jpg', category: 'Garden Products'},
    { id: 4, name: 'HYDRO & AQUATIC', image: '/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg', category: 'Hydrophonic and Aquatic'},
    { id: 5, name: 'SPECIALTY SUPPLEMENTS', image: '/assets/Collection Tiles Images/Specialty Supplements Title.jpg', category: 'Plant Supplements'},
    { id: 6, name: 'CURATED BUNDLES', image: '/assets/menu/Bundle Builder Tile.jpg', category: ''}
  ];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Separate effect to handle mobile menu state changes immediately
  useEffect(() => {
    // Immediately hide sticky when mobile menu opens
    if (mobileMenuOpen && window.innerWidth < 768) {
      setShowMobileCategorySticky(false);
    } else if (!mobileMenuOpen && window.innerWidth < 768) {
      // Re-evaluate if sticky should be shown when menu closes
      const scrollPosition = window.scrollY;
      const shouldShowMobileSticky = scrollPosition > 200;
      setShowMobileCategorySticky(shouldShowMobileSticky);
    }
  }, [mobileMenuOpen]);

  // Use IntersectionObserver to detect when bundle section is out of view
  useEffect(() => {
    // Wait a bit after component mount to allow correct positioning
    const initialTimeout = setTimeout(() => {
      // Check if device is mobile
      const isMobile = window.innerWidth < 1024; // Using 1024px as breakpoint for lg
      
      const options = {
        root: null, // use viewport as root
        rootMargin: isMobile ? '-45px 0px 0px 0px' : '-20px 0px 0px 0px', // Show 10% sooner on mobile
        threshold: 0.1 // Element is considered visible when 20% is in view
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Add a small delay for smoother transitions
          if (!entry.isIntersecting && !isScrolled) {
            // Only trigger state change if not already scrolled
            setTimeout(() => setIsScrolled(true), 50);
          } else if (entry.isIntersecting && isScrolled) {
            // Only trigger state change if already scrolled
            setTimeout(() => setIsScrolled(false), 50);
          }
        });
      }, options);
      
      if (bundleSectionRef.current) {
        observer.observe(bundleSectionRef.current);
      }
      
      // Also add scroll listener as fallback and to handle resize
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        // Force hide when at the top of the page
        if (scrollPosition < 180) {
          setIsScrolled(false);
        }
        
        // Mobile sticky category logic
        if (window.innerWidth < 768) { // Mobile breakpoint
          // Show sticky when scrolled past the mobile category list (around 200px)
          // but hide when mobile menu is open
          const shouldShowMobileSticky = scrollPosition > 200 && !mobileMenuOpen;
          setShowMobileCategorySticky(shouldShowMobileSticky);
        } else {
          // Hide mobile sticky on desktop
          setShowMobileCategorySticky(false);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Add resize listener to update rootMargin when screen size changes
      const handleResize = () => {
        if (bundleSectionRef.current) {
          observer.unobserve(bundleSectionRef.current);
          
          const isMobile = window.innerWidth < 1024;
          options.rootMargin = isMobile ? '-45px 0px 0px 0px' : '-50px 0px 0px 0px';
          
          const newObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting && !isScrolled) {
                setTimeout(() => setIsScrolled(true), 50);
              } else if (entry.isIntersecting && isScrolled) {
                setTimeout(() => setIsScrolled(false), 50);
              }
            });
          }, options);
          
          newObserver.observe(bundleSectionRef.current);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        if (bundleSectionRef.current) {
          observer.unobserve(bundleSectionRef.current);
        }
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }, 300); // Wait 300ms after mount
    
    return () => clearTimeout(initialTimeout);
  }, [isScrolled, mobileMenuOpen]);

  // Handle clicks outside mobile category dropdown
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
      quantity: edge.node.quantityAvailable || 0,
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
    
    // Assign a random background class instead of category-based
    const backgroundClass = getRandomBackground();
    
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
      backgroundColorLight,
      backgroundClass: getRandomBackground(0),
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
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(0),
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
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(1),
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
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(2),
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
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(3),
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
        backgroundColorLight: "hsla(160, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(4),
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
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(5),
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
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(6),
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
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(7),
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
        backgroundColorLight: "hsla(100, 60%, 95%, 0.6)",
        backgroundClass: getRandomBackground(8),
      }
    ];
  };

  // Function to add an item to the bundle
  const addToBundle = (product, variant) => {
    if (bundleCount >= 3) return;
    
    // Check if product with this specific variant is already in the bundle
    const existingItemIndex = selectedItems.findIndex(item => 
      item.product.id === product.id && item.variant.id === variant.id
    );
    
    if (existingItemIndex >= 0) {
      // Product exists, increment quantity if stock allows
      const existingItem = selectedItems[existingItemIndex];
      
      // Check if we have enough stock
      const availableStock = variant.quantity > 0 ? variant.quantity : 10;
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
      setSelectedItems([...selectedItems, { product, variant, quantity: 1 }]);
      setBundleCount(bundleCount + 1);
    }
  };

  // Function to remove an item from the bundle
  const removeFromBundle = (productId, variantId) => {
    const itemIndex = selectedItems.findIndex(item => 
      item.product.id === productId && item.variant.id === variantId
    );
    
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
      setSelectedItems(selectedItems.filter(item => 
        !(item.product.id === productId && item.variant.id === variantId)
      ));
    }
    
    setBundleCount(bundleCount - 1);
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
  
  // Handle bundle checkout - add all items to cart with discount
  const handleCheckoutBundle = () => {
    if (bundleCount !== 3) return; // Ensure we have exactly 3 items
    
    // Add each selected item to the cart
    selectedItems.forEach(item => {
      // Add to cart with the selected variant and quantity
      addToCart(item.product, item.variant, item.quantity);
    });
    
    // Apply the BUY3SAVE5 discount code
    localStorage.setItem('bundleDiscount', 'BUY3SAVE5');
    setDiscount('BUY3SAVE5');
    
    // Show notification that discount is applied
    window.alert('Bundle added to cart! Your BUY3SAVE5 discount ($5 off) will be automatically applied at checkout.');
  };
  
  // Filter products based on selected category
  const filteredProducts = products
    // First filter by category if one is selected
    .filter(product => selectedCategory ? product.category === selectedCategory : true)
    // Then filter by search term within the selected category
    .filter(product => {
      if (!searchTerm) return true;
      // Check if product name matches search term
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    // Hide products when bundle is filled with specific quantities
    .filter(product => {
      // Only apply this filter on mobile devices
      if (window.innerWidth >= 1024) return true;
      
      // If we don't have 3 items yet, show all products
      if (bundleCount < 3) return true;

      // When bundle is full (3/3)
      if (bundleCount === 3) {
        // Get all items with quantity 2
        const itemsWithQuantityTwo = selectedItems.filter(item => item.quantity === 2);
        
        // If we have one item with quantity 2
        if (itemsWithQuantityTwo.length === 1) {
          // Only show products that are already in the bundle
          const isInBundle = selectedItems.some(item => item.product.id === product.id);
          return isInBundle;
        }
      }
      
      return true;
    })
    // Sort products by popularity (review count) when showing all products
    .sort((a, b) => {
      if (!selectedCategory) {
        // Sort by best seller status first, then by review count
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return b.reviews - a.reviews; // Higher review count first
      }
      return 0; // Don't change order when category is selected
    });

  // Handler for category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMobileCategoryExpanded(false); // Close mobile dropdown when category is selected
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
            {renderStars()}
            <span className="text-gray-600 text-xs sm:text-sm">{product.reviews} reviews</span>
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
          
          {selectedItems.find(item => item.product.id === product.id && item.variant.id === activeVariant.id) && (
            <div className="flex items-center justify-between mb-2 sm:mb-4 bg-[#fff3e0] rounded-full p-1 sm:p-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromBundle(product.id, activeVariant.id);
                }}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#ff6b57] flex items-center justify-center font-bold shadow hover:bg-gray-100"
              >
                -
              </button>
              <span className="font-bold text-xs sm:text-base">
                {selectedItems.find(item => item.product.id === product.id && item.variant.id === activeVariant.id).quantity} in bundle
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToBundle(product, activeVariant);
                }}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${bundleCount < 3 ? 'bg-white text-[#ff6b57]' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold shadow ${bundleCount < 3 ? 'hover:bg-gray-100' : ''}`}
                disabled={bundleCount >= 3}
              >
                +
              </button>
            </div>
          )}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToBundle(product, activeVariant);
            }}
            className={`w-full font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-full transition-colors text-xs sm:text-base ${available && bundleCount < 3 ? 'bg-[#ff6b57] hover:bg-[#ff5a5a] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!available || bundleCount >= 3}
          >
            {selectedItems.find(item => item.product.id === product.id && item.variant.id === activeVariant.id) ? 'ADD ANOTHER' : 'ADD TO BUNDLE'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffbef]" ref={pageTopRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row">
          {/* Bundle Section - Will be first on mobile and right on desktop */}
          <div className="w-full lg:w-[30%] pt-6 pl-0 lg:pl-6 order-first lg:order-last mb-8 lg:mb-0" ref={bundleSectionRef}>
            {/* Mobile Bundle Format - Only show on mobile */}
            <div className="lg:hidden bg-[#fffbef] rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-center mb-1">Your Bundle</h2>
              <p className="text-center text-gray-600 mb-6">Make a bundle of 3 or 5!</p>
              
              {/* Mobile Three Boxes Layout */}
              <div className="flex justify-center space-x-4 mb-6">
                {(() => {
                  // Create an array to represent the 3 bundle slots for mobile
                  const mobileBundleSlots = [];
                  let currentSlot = 0;
                  
                  // Fill slots based on selected items and their quantities
                  selectedItems.forEach(item => {
                    for (let i = 0; i < item.quantity; i++) {
                      if (currentSlot < 3) {
                        mobileBundleSlots[currentSlot] = {
                          ...item,
                          slotIndex: currentSlot,
                          isFirstOfProduct: i === 0 // Only show controls on first instance
                        };
                        currentSlot++;
                      }
                    }
                  });
                  
                  // Fill remaining slots with empty placeholders
                  while (mobileBundleSlots.length < 3) {
                    mobileBundleSlots.push(null);
                  }
                  
                  return mobileBundleSlots.map((slot, index) => (
                    <div 
                      key={`mobile-slot-${index}`} 
                      className="relative w-[90px] h-[90px] flex items-center justify-center bg-[#f5f0e6] border-2 border-dashed border-gray-400 rounded-lg"
                    >
                      {slot ? (
                        <>
                          <img src={slot.product.image} alt={slot.product.name} className="h-[80%] w-[80%] object-contain" />
                          {slot.isFirstOfProduct && (
                            <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                              <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200">
                                <button 
                                  onClick={() => removeFromBundle(slot.product.id, slot.variant.id)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-700 font-medium"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold mx-1">{slot.quantity}</span>
                                <button 
                                  onClick={() => addToBundle(slot.product, slot.variant)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${bundleCount < 3 ? 'text-gray-700' : 'text-gray-400'}`}
                                  disabled={bundleCount >= 3}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="h-[70%] w-[20px] bg-gray-300 rounded-sm opacity-50"></div>
                      )}
                    </div>
                  ));
                })()}
              </div>
              
              {/* Selected count */}
              <div className="border border-gray-300 rounded-full py-3 text-center mb-4 bg-white">
                <p className="font-medium text-gray-700">{bundleCount}/3 SELECTED</p>
              </div>
              
              <p className="text-center text-gray-600">Add 3 bottles to save $5!</p>
              
              {bundleCount === 3 && (
                <>
                  <div className="bg-[#f8f0ff] border border-[#e0c6ff] rounded-lg p-3 mt-4 mb-4">
                    <p className="text-center text-sm font-medium text-[#7b2cbf]">
                      BUY3SAVE5 discount will be applied at checkout!
                    </p>
                  </div>
                  <button className="w-full bg-[#ff6b57] hover:bg-[#ff5a5a] text-white font-bold py-3 px-4 rounded-full transition-colors" onClick={handleCheckoutBundle}>
                    CHECKOUT BUNDLE
                  </button>
                </>
              )}
            </div>

            {/* Desktop Bundle Format - Only show on desktop */}
            <div className="hidden lg:block bg-[#fffbef] rounded-2xl p-6 shadow-sm border border-gray-200 lg:sticky lg:top-[140px]">
              <h2 className="text-2xl font-bold text-center mb-1">Your Bundle</h2>
              <p className="text-center text-gray-600 mb-6">Make a bundle of 3 or 5!</p>
              
              {/* Bundle Items */}
              {(() => {
                // Create an array to represent the 3 bundle slots
                const bundleSlots = [];
                let currentSlot = 0;
                
                // Fill slots based on selected items and their quantities
                selectedItems.forEach(item => {
                  for (let i = 0; i < item.quantity; i++) {
                    if (currentSlot < 3) {
                      bundleSlots[currentSlot] = {
                        ...item,
                        slotIndex: currentSlot,
                        isFirstOfProduct: i === 0 // Only show controls on first instance
                      };
                      currentSlot++;
                    }
                  }
                });
                
                // Fill remaining slots with empty placeholders
                while (bundleSlots.length < 3) {
                  bundleSlots.push(null);
                }
                
                return (
                  <div className="space-y-4 mb-4">
                    {bundleSlots.map((slot, index) => (
                      <div key={`slot-${index}`} className="border border-gray-300 rounded-lg p-2 bg-white flex flex-col sm:flex-row items-center min-h-[84px]">
                        {slot ? (
                          <>
                            <div className="w-20 h-20 sm:w-16 sm:h-16 relative overflow-hidden flex-shrink-0 mb-2 sm:mb-0">
                              <img src={slot.product.image} alt={slot.product.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="ml-0 sm:ml-3 flex-grow text-center sm:text-left">
                              <p className="font-medium text-sm truncate">{slot.product.name}</p>
                              <p className="text-xs text-gray-500">{slot.variant.title} - ${slot.variant.price.toFixed(2)}</p>
                              {slot.isFirstOfProduct && (
                                <div className="flex items-center justify-center sm:justify-start mt-1">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromBundle(slot.product.id, slot.variant.id);
                                    }}
                                    className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm hover:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <span className="mx-2 text-sm font-bold">{slot.quantity}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToBundle(slot.product, slot.variant);
                                    }}
                                    className={`w-6 h-6 rounded-full ${bundleCount < 3 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} flex items-center justify-center text-sm`}
                                    disabled={bundleCount >= 3}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="h-[70%] w-[20px] bg-gray-200 rounded-sm"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
              
              {/* Selected count */}
              <div className="border border-gray-300 rounded-full py-3 text-center mb-4 bg-white">
                <p className="font-medium text-gray-700">{bundleCount}/3 SELECTED</p>
              </div>
              
              <p className="text-center text-gray-600">Add 3 bottles to save $5!</p>
              
              {bundleCount === 3 && (
                <>
                  <div className="bg-[#f8f0ff] border border-[#e0c6ff] rounded-lg p-3 mt-4 mb-4">
                    <p className="text-center text-sm font-medium text-[#7b2cbf]">
                      BUY3SAVE5 discount will be applied at checkout!
                    </p>
                  </div>
                  <button className="w-full bg-[#ff6b57] hover:bg-[#ff5a5a] text-white font-bold py-3 px-4 rounded-full transition-colors" onClick={handleCheckoutBundle}>
                    CHECKOUT BUNDLE
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Products Section - Will be second on mobile and left on desktop */}
          <div className="w-full lg:w-[70%] pt-6 pr-0 lg:pr-6 order-last lg:order-first">
            {/* Choose Collection - Desktop Only */}
            <h2 className="text-gray-500 font-medium mb-4 hidden sm:block">CHOOSE A COLLECTION</h2>
            
            {/* Mobile Bundle Categories Header */}
            <div className="block sm:hidden px-4 mb-2">
              <h1 className="text-4xl font-bold text-[#ff6b6b]">Bundle Categories</h1>
            </div>

            {/* Category Selection */}
            <div className="relative mb-2 sm:mb-8">
              {/* Mobile List Layout */}
              <div className="block sm:hidden">
                <div className="px-4">
                  <div className="space-y-0.5 pb-1 mb-8">
                    {categories.map((cat, index) => (
                      <div key={cat.id} className="block">
                        <button
                          onClick={() => handleCategoryClick(cat.category)}
                          className="text-left transition-all duration-200"
                        >
                          <div className={`inline-block ${
                            (selectedCategory === '' && cat.category === '') || selectedCategory === cat.category
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
              <div className="hidden sm:block bg-[#ebe6d4] -mx-4 sm:mx-0 sm:rounded-lg mt-2">
                <div className="py-6 sm:py-8 px-2 sm:px-4 max-w-7xl mx-auto">
                  {/* Categories */}
                  <div className="flex overflow-x-auto hide-scrollbar gap-4 lg:flex-wrap lg:justify-between lg:overflow-visible">
                    {categories.map(category => (
                      <div 
                        key={category.id} 
                        className="flex-shrink-0 text-center w-[85px] lg:w-[calc(16.666%-1rem)] cursor-pointer"
                        onClick={() => handleCategoryClick(category.category)}
                      >
                        <div className={`overflow-hidden rounded-lg mb-2 mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-24 ${
                          (selectedCategory === '' && category.category === '') || selectedCategory === category.category
                            ? 'ring-2 ring-[#ff6b57]' 
                            : ''
                        }`}>
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                        <p className={`text-xs leading-tight whitespace-pre-line lg:text-sm ${
                          (selectedCategory === '' && category.category === '') || selectedCategory === category.category
                            ? 'font-bold text-[#ff6b57]' 
                            : ''
                        }`}>{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={(product, variant) => addToBundle(product, variant)} 
                    index={index} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combined Mobile Sticky Component - Category + Bundle */}
      <div 
        ref={mobileCategoryStickyRef}
        className={`fixed left-0 right-0 z-50 bg-[#fffbef] shadow-lg transition-all duration-300 transform md:hidden ${
          showMobileCategorySticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ top: '107px' }} // Position below navbar (42px announcement + 65px navbar)
      >
        <div className="px-4 py-3">
          {/* Category Selector Section */}
          <div className="relative mb-3">
            {/* Bundle Categories Header with Caret */}
            <button
              onClick={() => setMobileCategoryExpanded(!mobileCategoryExpanded)}
              className="w-full flex items-center justify-between bg-white border-2 border-[#ff6b6b] rounded-full px-4 py-2 text-left"
            >
              <span className="text-base font-medium text-black">
                {selectedCategory ? categories.find(cat => cat.category === selectedCategory)?.name.replace('\n', ' ') : 'Bundle Categories'}
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
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#fffbef] shadow-lg max-h-60 overflow-y-auto z-10 rounded-lg border border-gray-200">
                {categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.category)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                      ((selectedCategory === '' && cat.category === '') || selectedCategory === cat.category) ? 'bg-[#ff6b6b] text-white' : 'text-black'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === categories.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <span className="text-base font-medium">
                      {cat.name.replace('\n', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bundle Summary Section - Show when bundle has items or when scrolled past bundle section */}
          {(bundleCount > 0 || isScrolled) && (
            <div className="bg-[#fffbef] rounded-lg p-3 border border-gray-300">
              <div className="flex flex-col items-center">
                <div className="flex justify-center space-x-3 mb-3 w-full">
                  {(() => {
                    // Create an array to represent the 3 bundle slots for mobile
                    const mobileBundleSlots = [];
                    let currentSlot = 0;
                    
                    // Fill slots based on selected items and their quantities
                    selectedItems.forEach(item => {
                      for (let i = 0; i < item.quantity; i++) {
                        if (currentSlot < 3) {
                          mobileBundleSlots[currentSlot] = {
                            ...item,
                            slotIndex: currentSlot,
                            isFirstOfProduct: i === 0 // Only show controls on first instance
                          };
                          currentSlot++;
                        }
                      }
                    });
                    
                    // Fill remaining slots with empty placeholders
                    while (mobileBundleSlots.length < 3) {
                      mobileBundleSlots.push(null);
                    }
                    
                    return mobileBundleSlots.map((slot, index) => (
                      <div 
                        key={`sticky-slot-${index}`} 
                        className="relative w-[60px] h-[60px] flex items-center justify-center bg-[#f5f0e6] border-2 border-dashed border-gray-400 rounded-lg"
                      >
                        {slot ? (
                          <>
                            <img src={slot.product.image} alt={slot.product.name} className="h-[80%] w-[80%] object-contain" />
                            {slot.isFirstOfProduct && (
                              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                                <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 text-xs">
                                  <button 
                                    onClick={() => removeFromBundle(slot.product.id, slot.variant.id)}
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-700 font-medium"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-bold mx-1">{slot.quantity}</span>
                                  <button 
                                    onClick={() => addToBundle(slot.product, slot.variant)}
                                    className={`w-5 h-5 rounded-full flex items-center justify-center font-medium ${bundleCount < 3 ? 'text-gray-700' : 'text-gray-400'}`}
                                    disabled={bundleCount >= 3}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="h-[70%] w-[20px] bg-gray-300 rounded-sm opacity-50"></div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
                
                <div className="flex flex-col w-full space-y-2">
                  <div className="border border-gray-300 rounded-full py-2 px-6 bg-white text-center">
                    <p className="font-medium text-gray-800 text-sm">{bundleCount}/3 SELECTED</p>
                  </div>
                  
                  {bundleCount === 3 && (
                    <button 
                      onClick={handleCheckoutBundle}
                      className="w-full bg-[#ff6b57] hover:bg-[#ff5a5a] text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
                    >
                      CHECKOUT BUNDLE
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Right Overlay */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <div className="flex space-x-2">
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

// Add a CSS rule for hiding scrollbars to the component export
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default BuildABundlePage;