import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import LeafDivider from './LeafDivider';
import ShopByPlant from './shopy-by-plant';
import CustomerReviews from './customer-reviews';
import AnimatedLeafDivider from './AnimatedLeafDivider';
import ComparisonChart from './comparison-chart';

const ProductPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedBundle, setSelectedBundle] = useState('single'); // default to single
  const [variantImages, setVariantImages] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [silicaProduct, setSilicaProduct] = useState(null);
  const [isSubscription, setIsSubscription] = useState(false);
  const [deliveryInterval, setDeliveryInterval] = useState(2); // Default 2 months delivery interval

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Function to make API calls to Shopify Storefront API
  const fetchFromStorefrontAPI = async (query) => {
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
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching from Shopify API:', error);
      return null;
    }
  };

  // Update product images when variant changes
  useEffect(() => {
    if (product) {
      const defaultImage = product.image;
      
      // Create image set based on selected variant
      let images = [];
      
      // Lifestyle image (always the same regardless of variant)
      images.push({
        id: 1, 
        src: defaultImage,
        alt: `${product.name} Lifestyle`, 
        hasVideo: false
      });
      
      if (selectedVariant) {
        const is32Ounce = selectedVariant.title.toLowerCase().includes('32') || 
                         selectedVariant.title.toLowerCase().includes('quart');
        
        // Variant specific image
        if (is32Ounce) {
          // 32 ounce/quart variant
          const variantImage = variantImages[selectedVariant.id] || defaultImage;
          images.push({
            id: 2,
            src: variantImage,
            alt: `${product.name} Quart`,
            hasVideo: true
          });
          // Set to the variant image after it's available
          if (selectedImage === 1 && variantImage !== defaultImage) {
            setTimeout(() => setSelectedImage(2), 100);
          }
        } else {
          // 8 ounce variant (default)
          const variantImage = variantImages[selectedVariant.id] || defaultImage;
          images.push({
            id: 2,
            src: variantImage,
            alt: `${product.name} 8oz`,
            hasVideo: true
          });
          // Set to the variant image after it's available
          if (selectedImage === 1 && variantImage !== defaultImage) {
            setTimeout(() => setSelectedImage(2), 100);
          }
        }
      }
      
      setProductImages(images);
    }
  }, [product, selectedVariant, variantImages, selectedImage]);

  // Fetch variant images when product loads
  const fetchVariantImages = async (variants) => {
    const imageMap = {};
    
    // If we have variants, try to get their images
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (variant.id) {
          try {
            // Example query to fetch specific variant image - adjust as needed for your API
            const query = `
              {
                node(id: "${variant.id}") {
                  ... on ProductVariant {
                    id
                    image {
                      transformedSrc
                      altText
                    }
                  }
                }
              }
            `;
            
            const result = await fetchFromStorefrontAPI(query);
            
            if (result?.data?.node?.image?.transformedSrc) {
              imageMap[variant.id] = result.data.node.image.transformedSrc;
            }
          } catch (error) {
            console.error(`Error fetching image for variant ${variant.id}:`, error);
          }
        }
      }
    }
    
    setVariantImages(imageMap);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        // Check if productId is numeric or already a full Shopify ID
        let fullShopifyId = productId;
        
        // If it's just a numeric ID, format it as a full Shopify ID
        if (!productId.includes('gid://')) {
          fullShopifyId = `gid://shopify/Product/${productId}`;
        }
        
        // Try to fetch from API first
        const query = `
          {
            product(id: "${fullShopifyId}") {
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
        `;
        
        const result = await fetchFromStorefrontAPI(query);
        
        if (result?.data?.product) {
          const shopifyProduct = result.data.product;
          
          // Extract variant images if available
          const variants = shopifyProduct.variants.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            price: parseFloat(edge.node.price.amount),
            available: edge.node.availableForSale,
            image: edge.node.image?.transformedSrc || null
          }));
          
          // Initialize variant images map
          const imageMap = {};
          variants.forEach(variant => {
            if (variant.image) {
              imageMap[variant.id] = variant.image;
            }
          });
          
          setVariantImages(imageMap);
          
          // Map to our product format
          const mappedProduct = {
            id: shopifyProduct.id,
            name: shopifyProduct.title.toUpperCase(),
            description: "PLANT FOOD", // Default description
            fullDescription: shopifyProduct.description || "Our premium plant food specially formulated for your plants.",
            image: shopifyProduct.images.edges.length > 0 
              ? shopifyProduct.images.edges[0].node.transformedSrc 
              : "/assets/products/placeholder.png",
            price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
            reviews: Math.floor(Math.random() * 500) + 200, // Simulated reviews
            rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Random rating between 4.5-5.0
            bestSeller: shopifyProduct.tags && shopifyProduct.tags.includes("best-seller"),
            features: [
              "Premium plant food formula",
              "Easy to use",
              "Promotes healthy growth",
              "Strengthens root systems"
            ],
            directions: "Mix 1/4 teaspoon with 2 cups of water and apply according to plant needs.",
            variants: variants
          };
          
          setProduct(mappedProduct);
          
          // Set the first available variant as default
          const availableVariant = mappedProduct.variants.find(v => v.available);
          setSelectedVariant(availableVariant || mappedProduct.variants[0]);
          
          // Fetch images for variants that don't have them yet
          const variantsNeedingImages = mappedProduct.variants.filter(v => !imageMap[v.id]);
          if (variantsNeedingImages.length > 0) {
            fetchVariantImages(variantsNeedingImages);
          }
        } else {
          // If API fails, fall back to mock data
          const foundProduct = products.find(p => p.id === productId);
          
          if (foundProduct) {
            setProduct(foundProduct);
            // Set the first available variant as default
            const availableVariant = foundProduct.variants.find(v => v.available);
            setSelectedVariant(availableVariant || foundProduct.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fall back to mock data if API fails
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Set the first available variant as default
          const availableVariant = foundProduct.variants.find(v => v.available);
          setSelectedVariant(availableVariant || foundProduct.variants[0]);
        }
      }
      
      setLoading(false);
    };

    fetchProduct();
    fetchSilicaProduct();
  }, [productId]);

  // Function to fetch Silica For Plants product
  const fetchSilicaProduct = async () => {
    try {
      // Query for silica product using handle
      const query = `
        {
          productByHandle(handle: "silica-for-plants") {
            id
            title
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  transformedSrc
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      `;
      
      const result = await fetchFromStorefrontAPI(query);
      
      if (result?.data?.productByHandle) {
        const silicaData = result.data.productByHandle;
        
        // Map to our product format
        const mappedSilicaProduct = {
          id: silicaData.id,
          name: silicaData.title.toUpperCase(),
          description: "PLANT SUPPLEMENT",
          fullDescription: silicaData.description || "Our premium silica supplement for stronger plant growth.",
          image: silicaData.images.edges.length > 0 
            ? silicaData.images.edges[0].node.transformedSrc 
            : "/assets/products/silica-plant-food.png", // Fallback to local image if no API image
          price: parseFloat(silicaData.priceRange.minVariantPrice.amount),
          variant: silicaData.variants.edges.length > 0 
            ? {
                id: silicaData.variants.edges[0].node.id,
                title: silicaData.variants.edges[0].node.title,
                price: parseFloat(silicaData.variants.edges[0].node.price.amount),
                available: silicaData.variants.edges[0].node.availableForSale
              }
            : null
        };
        
        setSilicaProduct(mappedSilicaProduct);
      } else {
        // If API fails, use fallback data
        setSilicaProduct({
          id: "silica-fallback",
          name: "SILICA FOR PLANTS",
          description: "PLANT SUPPLEMENT",
          fullDescription: "Our premium silica supplement strengthens cell walls for stronger, more resilient plants.",
          image: "/assets/products/silica-plant-food.png",
          price: 14.99,
          variant: {
            id: 'silica-variant1',
            title: '8 Ounces',
            price: 14.99,
            available: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching silica product:', error);
      // Fallback to static data if API fails
      setSilicaProduct({
        id: "silica-fallback",
        name: "SILICA FOR PLANTS",
        description: "PLANT SUPPLEMENT",
        fullDescription: "Our premium silica supplement strengthens cell walls for stronger, more resilient plants.",
        image: "/assets/products/silica-plant-food.png",
        price: 14.99,
        variant: {
          id: 'silica-variant1',
          title: '8 Ounces',
          price: 14.99,
          available: true
        }
      });
    }
  };

  // Mock products data - in a real app, this would come from an API
  const products = [
    {
      id: "1",
      name: "INDOOR",
      description: "PLANT FOOD",
      fullDescription: "Our premium Indoor Plant Food is specially formulated to provide essential nutrients for all your indoor plants. Perfect for houseplants of all varieties, this balanced fertilizer promotes healthy growth, vibrant foliage, and stronger roots.",
      image: "/assets/products/indoor-plant-food.png",
      price: 14.99,
      reviews: 1203,
      rating: 4.8,
      bestSeller: true,
      features: [
        "Balanced NPK formula ideal for all indoor plants",
        "Easy to use liquid formula",
        "Promotes lush foliage and healthy growth",
        "No unpleasant odor - safe for indoor use"
      ],
      directions: "Mix 1/4 teaspoon with 2 cups of water and apply once every 2 weeks. For best results, use when soil is moist.",
      variants: [
        { id: 'variant1', title: '8 Ounces', price: 14.99, available: true },
        { id: 'variant2', title: '16 Ounces', price: 24.99, available: true },
        { id: 'variant3', title: '32 Ounces', price: 39.99, available: false }
      ]
    },
    {
      id: "2",
      name: "MONSTERA",
      description: "PLANT FOOD",
      fullDescription: "Our specialized Monstera Plant Food is precisely formulated to meet the unique nutritional needs of Monstera and other tropical plants. This premium fertilizer promotes dramatic leaf development, vibrant color, and healthy new growth.",
      image: "/assets/products/monstera-plant-food.png",
      price: 14.99,
      reviews: 854,
      rating: 4.9,
      bestSeller: false,
      features: [
        "Specialized formula for Monstera and tropical plants",
        "Promotes larger, more dramatic leaf development",
        "Enhances the natural fenestration process",
        "Strengthens root system for healthier plants"
      ],
      directions: "Mix 1/4 teaspoon with 2 cups of water and apply once every 2-4 weeks. For best results, use when soil is moist.",
      variants: [
        { id: 'variant1', title: '8 Ounces', price: 14.99, available: true },
        { id: 'variant2', title: '16 Ounces', price: 24.99, available: true }
      ]
    },
    {
      id: "3",
      name: "HERBS & LEAFY GREENS",
      description: "PLANT FOOD",
      fullDescription: "Grow delicious, nutrient-dense herbs and leafy greens with our specialized plant food. This formula is designed specifically for edible plants, promoting robust growth, enhanced flavor, and higher yields without harsh chemicals.",
      image: "/assets/products/herbs-plant-food.png",
      price: 14.99,
      reviews: 299,
      rating: 4.7,
      bestSeller: false,
      features: [
        "Organic-based formula safe for edible plants",
        "Promotes rich flavor and aroma in herbs",
        "Enhances nutritional content of leafy greens",
        "Perfect for both indoor and outdoor herb gardens"
      ],
      directions: "Mix 1/4 teaspoon with 2 cups of water and apply once every week. For best results, use when soil is moist.",
      variants: [
        { id: 'variant1', title: '8 Ounces', price: 14.99, available: true },
        { id: 'variant2', title: '16 Ounces', price: 24.99, available: true }
      ]
    },
    {
      id: "4",
      name: "FIDDLE LEAF FIG",
      description: "PLANT FOOD",
      fullDescription: "Give your finicky Fiddle Leaf Fig the precise nutrition it needs with our specialized plant food. Formulated specifically for Fiddle Leaf Figs, this premium fertilizer promotes healthy new growth, prevents leaf drop, and helps maintain those characteristic large, violin-shaped leaves.",
      image: "/assets/products/fiddle-leaf-fig-plant-food.png",
      price: 14.99,
      reviews: 723,
      rating: 4.8,
      bestSeller: false,
      features: [
        "Specially formulated for Fiddle Leaf Fig plants",
        "Prevents common issues like leaf drop and brown spots",
        "Promotes development of large, healthy leaves",
        "Strengthens plant against environmental stress"
      ],
      directions: "Mix 1/4 teaspoon with 2 cups of water and apply once every 3-4 weeks. For best results, use when soil is moist.",
      variants: [
        { id: 'variant1', title: '8 Ounces', price: 14.99, available: true },
        { id: 'variant2', title: '16 Ounces', price: 24.99, available: true }
      ]
    }
  ];

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      // Build subscription properties if selected
      const subscriptionProps = isSubscription ? {
        isSubscription: true,
        interval: deliveryInterval,
        intervalUnit: 'month',
        discount: 15, // 15% discount for subscriptions (matches 0.85 pricing)
      } : null;
      
      if (selectedBundle === 'single') {
        // Add just the main product
        addToCart(product, selectedVariant, quantity, subscriptionProps);
      } else {
        // Add both main product and silica as a bundle
        addToCart(product, selectedVariant, quantity, subscriptionProps);
        
        // Only add silica if it was successfully fetched
        if (silicaProduct && silicaProduct.variant) {
          // Create a simplified product object for silica
          const silicaProductForCart = {
            id: silicaProduct.id,
            name: silicaProduct.name,
            description: silicaProduct.description,
            image: silicaProduct.image,
            price: silicaProduct.price
          };
          // Add silica with the same subscription settings as the main product
          addToCart(silicaProductForCart, silicaProduct.variant, quantity, subscriptionProps);
        }
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-[#ff6b57]' : 'text-gray-300'} fill-current`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b57]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products" className="bg-[#F97462] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Product Hero Section */}
      <div className="bg-[#fffbef]">
        {/* Breadcrumbs - desktop only */}
        <div className="max-w-7xl mx-auto px-6 pt-4 hidden md:block">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-[#F97462]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-[#F97462]">Products</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">{product.name}</span>
          </div>
        </div>

        {/* Main Section */}
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10 px-4">
          {/* Product Image & Best Seller */}
          <section aria-labelledby="product-images-heading">
            <h2 id="product-images-heading" className="sr-only">Product Images</h2>
            <div className="flex flex-col">
              {/* Main Image Container */}
              <div 
                className={`relative mb-6 rounded-2xl overflow-hidden bg-white shadow-sm`}
                style={{ aspectRatio: '3/4' }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
                  const y = ((e.clientY - bounds.top) / bounds.height) * 100;
                  setMousePosition({ x, y });
                }}
              >
                {/* Background video - only show for slides that have hasVideo true */}
                {productImages[selectedImage - 1]?.hasVideo && (
                  <div className="absolute inset-0 z-0">
                    <video 
                      src="/assets/productbg.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-100"
                    />
                  </div>
                )}
                
                {/* Main product image */}
                <div className={`relative h-full ${productImages[selectedImage - 1]?.hasVideo ? 'z-10' : ''}`}>
                  <img 
                    src={productImages[selectedImage - 1]?.src || product.image}
                    alt={productImages[selectedImage - 1]?.alt || product.name}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-125' : 'scale-100'
                    }`}
                    style={isZoomed ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                    } : undefined}
                  />
                  
                  {/* Best seller badge */}
                  {product.bestSeller && (
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 animate-fade-in">
                      <span className="bg-[#FF6B6B] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        BEST SELLER
                      </span>
                    </div>
                  )}

                  {/* Image navigation arrows - only show if there's more than one image */}
                  {productImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(prev => prev === 1 ? productImages.length : prev - 1);
                        }}
                        className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(prev => prev === productImages.length ? 1 : prev + 1);
                        }}
                        className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Zoom instruction */}
                  <div className="absolute top-4 right-4 bg-white/80 text-gray-600 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
                    Hover to zoom
                  </div>
                </div>
              </div>

              {/* Thumbnails - only show if there's more than one image */}
              {productImages.length > 1 && (
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
                    {productImages.map((image) => (
                      <button 
                        key={image.id}
                        onClick={() => setSelectedImage(image.id)}
                        className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden bg-white transition-all duration-300 ${
                          selectedImage === image.id 
                            ? 'ring-2 ring-[#FF6B6B] scale-95' 
                            : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                      >
                        <div className="absolute inset-0 bg-black/5"></div>
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            selectedImage === image.id ? 'scale-110' : 'scale-100'
                          }`}
                        />
                        {selectedImage === image.id && (
                          <div className="absolute inset-0 bg-[#FF6B6B]/10"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-2 flex justify-center gap-1.5">
                    {productImages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          selectedImage === index + 1
                            ? 'w-4 bg-[#FF6B6B]'
                            : 'w-1.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Product Details */}
          <section aria-labelledby="product-details-heading">
            <h2 id="product-details-heading" className="sr-only">Product Details</h2>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-1">
              {(() => {
                // Comprehensive list of product type keywords to check
                const productTypeKeywords = [
                  "Fertilizer", "Plant Food", "Food", "NPK", "Fungus", "Formula",
                  "Root Supplement", "All Purpose", "Tonic", "Concentrate", 
                  "Extract", "Feed", "Nutrients", "Bloom", "Liquid Plant Food"
                ];
                
                // For special numbered formulas like 10-10-10
                const formulaPattern = /\d+-\d+-\d+/;

                // Original values as fallback
                let plantName = product.name;
                let productType = product.description;
                
                // Function to clean up the plant name
                const cleanName = (name) => name.trim().replace(/\s+$/, '');
                
                // Special case handling for formulas like "10-10-10 Vegetables"
                const formulaMatch = product.name.match(formulaPattern);
                if (formulaMatch) {
                  const formulaPosition = product.name.indexOf(formulaMatch[0]);
                  if (formulaPosition >= 0) {
                    plantName = cleanName(product.name.substring(formulaPosition + formulaMatch[0].length));
                    productType = formulaMatch[0];
                    return `${plantName} | ${productType}`;
                  }
                }
                
                // Check each keyword
                for (const type of productTypeKeywords) {
                  const typeRegex = new RegExp(`\\s${type}\\b|\\s${type}s\\b`, 'i');
                  const match = product.name.match(typeRegex);
                  
                  if (match) {
                    const typePosition = match.index;
                    plantName = cleanName(product.name.substring(0, typePosition));
                    
                    // Extract the actual type as used in the name (preserving case)
                    const actualType = product.name.substring(typePosition).trim();
                    productType = actualType;
                    break;
                  }
                }
                
                // Edge case: If plantName is still the full name and contains the description term
                if (plantName === product.name && product.name.includes(product.description)) {
                  plantName = product.name.replace(product.description, '').trim();
                  productType = product.description;
                }
                
                return `${plantName} | ${productType}`;
              })()}
            </h1>
            
            {/* Reviews */}
            <div className="flex items-center gap-2 mb-1">
              {/* Stars */}
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i <= Math.floor(product.rating) ? 'text-[#FF6B6B]' : (
                        i === Math.ceil(product.rating) && i > Math.floor(product.rating) ? 'text-[#FF6B6B]' : 'text-gray-300'
                      )
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[#FF6B6B] font-semibold ml-1">{product.rating} out of 5</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">{product.rating} out of 5 stars</div>
            <a
              href="#"
              className="text-xs text-[#FF6B6B] hover:underline mb-2 inline-block"
            >
              {product.reviews} global ratings
            </a>
            
            {/* Price */}
            <div className="text-2xl font-bold mb-2">
              ${selectedBundle === 'single' 
                ? (selectedVariant ? selectedVariant.price.toFixed(2) : product.price.toFixed(2))
                : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)).toFixed(2) : product.price.toFixed(2))
              }
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-6">
              {product.fullDescription}
            </p>

            {/* Select Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold">SELECT SIZE</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      // If the variant has a specific image, select it
                      if (variant.title.toLowerCase().includes('32') || variant.title.toLowerCase().includes('quart')) {
                        // For 32oz/quart variant, we'll use image id 2 if available
                        const imageIndex = productImages.findIndex(img => img.alt.includes('Quart'));
                        if (imageIndex >= 0) {
                          setSelectedImage(productImages[imageIndex].id);
                        }
                      } else {
                        // For other variants (8oz), use image id 2 if available 
                        const imageIndex = productImages.findIndex(img => img.alt.includes('8oz'));
                        if (imageIndex >= 0) {
                          setSelectedImage(productImages[imageIndex].id);
                        }
                      }
                    }}
                    disabled={!variant.available}
                    className={`relative p-4 rounded-xl transition-all duration-300 ${
                      selectedVariant?.id === variant.id
                        ? 'bg-[#E94F37] text-white shadow-lg scale-[1.02]'
                        : 'bg-white border-2 border-gray-200 hover:border-[#E94F37] text-gray-900'
                    }`}
                  >
                    {/* Add the Most Popular badge only for first variant */}
                    {index === 0 && (
                      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-[#FFE5E5] text-[#E94F37] rounded-full font-medium whitespace-nowrap">
                        MOST POPULAR!
                      </span>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-sm mb-1">{variant.title}</span>
                      <span className={`text-xs ${
                        selectedVariant?.id === variant.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        ${variant.price.toFixed(2)}
                      </span>
                    </div>
                    {selectedVariant?.id === variant.id && (
                      <div className="absolute -top-2 -right-2 bg-[#27AE60] text-white p-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedVariant && (
                <>
                  <button 
                    onClick={() => setSelectedBundle('single')}
                    className={`relative overflow-hidden group border rounded-xl p-4 flex flex-col items-center transition-all duration-300 ${
                      selectedBundle === 'single'
                        ? 'border-2 border-[#E94F37] bg-[#FFF9F9] scale-[1.02]'
                        : 'border-gray-200 bg-white opacity-60'
                    }`}
                  >
                    <div className="h-24 w-full mb-2 relative z-10 bg-white rounded-lg flex items-center justify-center">
                      <img 
                        src={
                          variantImages[selectedVariant.id] || 
                          (productImages.length > 1 ? productImages[1].src : product.image)
                        }
                        alt={product.name} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-xs text-center font-medium relative z-10">{product.name} Only</span>
                    <span className="font-bold mt-2 text-[#E94F37] relative z-10">
                      ${selectedVariant.price.toFixed(2)}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedBundle('bundle')}
                    className={`relative overflow-hidden group rounded-xl p-4 flex flex-col items-center transition-all duration-300 border-2 ${
                      selectedBundle === 'bundle'
                        ? 'border-[#E94F37] bg-[#FFF3E6] scale-[1.02]'
                        : 'border-gray-200 bg-white opacity-60'
                    }`}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] bg-[#E94F37] text-white px-3 py-1 rounded-full font-medium z-20">
                      BETTER TOGETHER
                    </div>
                    <div className="flex justify-center items-center gap-2 h-24 mb-2 relative z-10">
                      <div className="h-full w-1/2 bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src={
                            variantImages[selectedVariant.id] || 
                            (productImages.length > 1 ? productImages[1].src : product.image)
                          }
                          alt={product.name} 
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-[#E94F37] font-bold">+</div>
                      <div className="h-full w-1/2 bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src={silicaProduct ? silicaProduct.image : "/assets/products/silica-plant-food.png"}
                          alt={silicaProduct ? silicaProduct.name : "Silica For Plants"}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-center font-medium">{product.name} + {silicaProduct ? silicaProduct.name : "Silica For Plants"}</span>
                    <span className="font-bold mt-2 text-[#E94F37]">
                      ${(selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)).toFixed(2)}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#E94F37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </>
              )}
            </div>

            {/* Buy Now Button */}
            <button 
              onClick={handleAddToCart}
              className={`w-full bg-[#FFC600] hover:bg-[#FFD700] text-black font-bold py-3 rounded-lg text-lg mb-3 ${
                !selectedVariant ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedVariant}
            >
              {selectedVariant ? 'BUY NOW' : 'SELECT SIZE'}
            </button>

            {/* Purchase Options */}
            <div className="border rounded-lg p-5 bg-[#FFFBF5]">
              <div className="mb-3 text-center">
                <span className="text-sm font-medium text-gray-600">CHOOSE PURCHASE OPTION</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {/* One-time purchase option */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    !isSubscription 
                      ? 'border-[#E94F37] bg-white shadow-sm'
                      : 'border-gray-200 hover:border-[#E94F37] bg-white/70'
                  }`}
                  onClick={() => setIsSubscription(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-5 h-5 flex-shrink-0">
                      <input 
                        type="radio" 
                        id="one-time"
                        name="purchase-type"
                        checked={!isSubscription}
                        onChange={() => setIsSubscription(false)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
                        !isSubscription ? 'border-[#E94F37]' : 'border-gray-300'
                      }`}>
                        {!isSubscription && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#E94F37]"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="one-time" className="font-semibold text-gray-800 block mb-0.5">ONE-TIME PURCHASE</label>
                      <span className="text-xs text-gray-500">
                        Pay once and receive a single delivery
                      </span>
                    </div>
                    <div className="font-bold text-lg">
                      ${selectedBundle === 'single' 
                        ? (selectedVariant ? selectedVariant.price.toFixed(2) : '14.99')
                        : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)).toFixed(2) : '24.99')
                      }
                    </div>
                  </div>
                </div>
                
                {/* Subscribe option */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    isSubscription 
                      ? 'border-[#E94F37] bg-white shadow-sm'
                      : 'border-gray-200 hover:border-[#E94F37] bg-white/70'
                  }`}
                  onClick={() => setIsSubscription(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-5 h-5 flex-shrink-0">
                      <input 
                        type="radio" 
                        id="subscribe"
                        name="purchase-type"
                        checked={isSubscription}
                        onChange={() => setIsSubscription(true)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
                        isSubscription ? 'border-[#E94F37]' : 'border-gray-300'
                      }`}>
                        {isSubscription && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#E94F37]"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <label htmlFor="subscribe" className="font-semibold text-gray-800">SUBSCRIBE & SAVE</label>
                        <span className="text-xs font-bold bg-[#E94F37] text-white px-1.5 py-0.5 rounded">15% OFF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Delivery every</span>
                        <select 
                          value={deliveryInterval}
                          onChange={(e) => setDeliveryInterval(parseInt(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium bg-transparent border border-gray-200 rounded px-1 py-0.5 cursor-pointer"
                        >
                          <option value="1">1 month</option>
                          <option value="2">2 months</option>
                          <option value="3">3 months</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 line-through">
                        ${selectedBundle === 'single'
                          ? (selectedVariant ? selectedVariant.price.toFixed(2) : '14.99')
                          : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)).toFixed(2) : '24.99')
                        }
                      </div>
                      <div className="font-bold text-lg text-[#E94F37]">
                        ${selectedBundle === 'single'
                          ? (selectedVariant ? (selectedVariant.price * 0.85).toFixed(2) : '12.74')
                          : (selectedVariant ? ((selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)) * 0.85).toFixed(2) : '21.24')
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* Trust Badges Section */}
      <div className="max-w-6xl mx-auto py-8 md:py-12">
        <div className="grid grid-cols-3 gap-3 md:gap-6 text-center px-4">
          {/* Customer Favorite Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-Badges5-Star-Reviews-Icon.png" alt="5-Star Reviews" className="w-16 h-16 md:w-24 md:h-24 mb-2 md:mb-3" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">CUSTOMER FAVORITE</h3>
          </div>
          
          {/* Made in USA Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-BadgesMade-in-US-Icon.png" alt="Made in USA" className="w-16 h-16 md:w-24 md:h-24 mb-2 md:mb-3" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">MADE IN THE USA</h3>
          </div>
          
          {/* Free Shipping Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-BadgesFree-Shipping-Icon.png" alt="Free Shipping" className="w-16 h-16 md:w-24 md:h-24 mb-2 md:mb-3" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">FREE SHIPPING</h3>
          </div>
        </div>
      </div>
      
      <LeafDivider />
      <ShopByPlant />
      <LeafDivider />
      <CustomerReviews />
      <AnimatedLeafDivider />
      <ComparisonChart />
    </>
  );
};

export default ProductPage; 