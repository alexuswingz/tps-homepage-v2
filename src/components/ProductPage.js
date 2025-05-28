import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import LeafDivider from './LeafDivider';
import ShopByPlant from './shopy-by-plant';
import CustomerReviews from './customer-reviews';
import AnimatedLeafDivider from './AnimatedLeafDivider';
import ComparisonChart from './comparison-chart';
import IngredientsSlider from './ingredients-slider';
import BuildBundleSection from './build-bundle-section';
import MobileNewsletter from './MobileNewsletter';
// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import ShopByPlantAlternative from './ShopByPlantAlternative';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.css';

// Custom styles for Swiper
const swiperStyles = `
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  
  .swiper-zoom-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .swiper-pagination {
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  
  .swiper-pagination-fraction {
    bottom: auto;
    top: 20px;
    background: rgba(255, 255, 255, 0.9);
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
  }
  
  .swiper-zoom-container > img {
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    .swiper-button-prev,
    .swiper-button-next {
      display: none;
    }
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = swiperStyles;
  document.head.appendChild(styleSheet);
}

// Custom hook to detect if on mobile
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// Image Modal Component
const ImageModal = ({ isOpen, onClose, image, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
         onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div 
          className="w-full h-full p-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={(e) => {
            const bounds = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - bounds.left) / bounds.width) * 100;
            const y = ((e.clientY - bounds.top) / bounds.height) * 100;
            setMousePosition({ x, y });
          }}
        >
          <img 
            src={image} 
            alt={alt}
            className={`max-h-[80vh] max-w-full object-contain mx-auto transition-transform duration-300 ${
              isZoomed ? 'scale-[1.8]' : 'scale-100'
            }`}
            style={isZoomed ? {
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
};

// Mobile Image Gallery Component (Swiper-based)
const MobileImageGallery = ({ isOpen, onClose, images, initialImage, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  useEffect(() => {
    // Find the index of the initial image
    const index = images.findIndex(img => img.src === initialImage) || 0;
    setCurrentIndex(index >= 0 ? index : 0);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [images, initialImage, isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Navigation header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        <span className="text-gray-800 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </span>
        <button 
          onClick={onClose}
          className="text-gray-800 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Swiper Gallery */}
      <div className="flex-1 bg-white">
        <Swiper
          initialSlide={currentIndex}
          modules={[Pagination, Zoom]}
          pagination={{
            type: 'fraction',
            renderFraction: (currentClass, totalClass) => `
              <span class="${currentClass} font-medium"></span>
              <span class="text-gray-400 mx-1">/</span>
              <span class="${totalClass} text-gray-400"></span>
            `
          }}
          zoom={{
            maxRatio: 3,
            minRatio: 1,
            toggle: true,
            containerClass: 'swiper-zoom-container'
          }}
          onZoomChange={(swiper, scale) => {
            setIsZoomed(scale !== 1);
          }}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.activeIndex);
            // Reset zoom when changing slides
            if (isZoomed) {
              swiper.zoom.out();
            }
          }}
          className="h-full w-full"
          style={{
            '--swiper-theme-color': '#FF6B6B',
            '--swiper-pagination-color': '#FF6B6B'
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <div className="swiper-zoom-container">
                <img
                  src={image.src}
                  alt={image.alt || productName}
                  className="max-h-full max-w-full object-contain select-none"
                  draggable="false"
                />
              </div>
              {/* Zoom indicator */}
              {isZoomed && index === currentIndex && (
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs py-1 px-3 rounded-full z-20">
                  Pinch to zoom out
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Thumbnails */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === index 
                  ? 'border-[#FF6B6B] scale-95 shadow-lg' 
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  currentIndex === index ? 'scale-110' : 'scale-100'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Product Carousel Component
const MobileProductCarousel = ({ images, onImageClick }) => {
  const glideRef = useRef(null);

  useEffect(() => {
    if (glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel',
        perView: 1,
        gap: 0,
        animationDuration: 600,
      });

      glide.mount();

      return () => {
        glide.destroy();
      };
    }
  }, [images]);

  return (
    <div className="relative w-[90%] mx-auto mb-6">
      <div ref={glideRef} className="glide">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {images.map((image, index) => (
              <li key={index} className="glide__slide">
                <div 
                  className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-sm"
                  onClick={() => onImageClick(index + 1)}
                >
                  {/* Background video - only show for slides that have hasVideo true */}
                  {image.hasVideo && (
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
                  
                  {/* Product image */}
                  <div className={`relative h-full ${image.hasVideo ? 'z-10' : ''}`}>
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(1);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState('single'); // default to single
  const [variantImages, setVariantImages] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [silicaProduct, setSilicaProduct] = useState(null);
  const [isSubscription, setIsSubscription] = useState(false);
  const [deliveryInterval, setDeliveryInterval] = useState(2); // Default 2 months delivery interval
  const [showStickyBar, setShowStickyBar] = useState(false);
  const productHeroRef = useRef(null);
  const [sellingPlans, setSellingPlans] = useState([]);
  
  // Detect if on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Monitor scroll position to show/hide sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (productHeroRef.current) {
        const heroBottom = productHeroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  useEffect(() => {
    const fetchSellingPlans = async () => {
      if (product) {
        const query = `
          {
            product(id: "${product.id}") {
              sellingPlanGroups(first: 5) {
                edges {
                  node {
                    name
                    sellingPlans(first: 5) {
                      edges {
                        node {
                          id
                          name
                          options {
                            name
                            value
                          }
                          priceAdjustments {
                            adjustmentValue {
                              ... on SellingPlanFixedPriceAdjustment {
                                price {
                                  amount
                                  currencyCode
                                }
                              }
                              ... on SellingPlanPercentagePriceAdjustment {
                                adjustmentPercentage
                              }
                            }
                          }
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
          
          if (result?.errors) {
            console.error('GraphQL Errors:', result.errors);
            return;
          }
          
          if (result?.data?.product?.sellingPlanGroups?.edges) {
            const plans = result.data.product.sellingPlanGroups.edges.flatMap(group => 
              group.node.sellingPlans.edges.map(plan => ({
                id: plan.node.id,
                name: plan.node.name,
                groupName: group.node.name,
                options: plan.node.options,
                priceAdjustments: plan.node.priceAdjustments
              }))
            );
            setSellingPlans(plans);
          }
        } catch (error) {
          console.error('Error fetching selling plans:', error);
        }
      }
    };

    fetchSellingPlans();
  }, [product]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      // Find the appropriate selling plan based on delivery interval (optional)
      const selectedPlan = isSubscription ? sellingPlans.find(plan => 
        plan.name.toLowerCase().includes(`${deliveryInterval} month`) ||
        plan.name.toLowerCase().includes(`deliver every ${deliveryInterval} month`)
      ) : null;

      // Build subscription properties for ReCharge (create even without selling plan)
      const subscriptionProps = isSubscription ? {
        isSubscription: true,
        // Only include selling plan if one was found
        ...(selectedPlan && { selling_plan: selectedPlan.id.replace('gid://shopify/SellingPlan/', '') }),
        charge_interval_frequency: deliveryInterval,
        order_interval_frequency: deliveryInterval,
        order_interval_unit: 'month',
        interval: deliveryInterval,
        intervalUnit: 'month',
        discount: 15, // 15% discount for subscriptions
        subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        properties: {
          shipping_interval_frequency: deliveryInterval,
          shipping_interval_unit_type: 'month',
          order_interval_frequency: deliveryInterval,
          order_interval_unit: 'month',
          charge_interval_frequency: deliveryInterval,
          discount_percentage: '15',
          subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          _rc_widget: '1' // ReCharge widget identifier
        }
      } : null;
      
      console.log('Adding to cart with subscription props:', subscriptionProps);
      
      if (selectedBundle === 'single') {
        // Add just the main product
        addToCart(product, selectedVariant, quantity, subscriptionProps);
      } else {
        // Add both main product and silica as a bundle
        addToCart(product, selectedVariant, quantity, subscriptionProps);
        
        // Only add silica if it was successfully fetched
        if (silicaProduct && silicaProduct.variant) {
          // Create subscription props for silica with same settings
          const silicaSubscriptionProps = subscriptionProps ? {
            ...subscriptionProps,
            subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
            properties: {
              ...subscriptionProps.properties,
              subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`
            }
          } : null;

          // Create a simplified product object for silica
          const silicaProductForCart = {
            id: silicaProduct.id,
            name: silicaProduct.name,
            description: silicaProduct.description,
            image: silicaProduct.image,
            price: silicaProduct.price
          };
          // Add silica with the same subscription settings as the main product
          addToCart(silicaProductForCart, silicaProduct.variant, quantity, silicaSubscriptionProps);
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

  // Add this function to calculate the discounted price
  const calculatePrice = (basePrice, isSubscriptionPrice = false) => {
    if (isSubscriptionPrice) {
      return (basePrice * 0.85).toFixed(2); // 15% discount
    }
    return basePrice.toFixed(2);
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
      <div className="bg-[#fffbef]" ref={productHeroRef}>
        {/* Breadcrumbs - desktop only */}
        <div className="max-w-7xl mx-auto px-6 pt-3 hidden md:block">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-[#F97462]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-[#F97462]">Products</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">{product.name}</span>
          </div>
        </div>

        {/* Main Section */}
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-4">
          {/* Product Image & Best Seller */}
          <section aria-labelledby="product-images-heading">
            <h2 id="product-images-heading" className="sr-only">Product Images</h2>
            <div className="flex flex-col">
              {/* Mobile Carousel */}
              <div className="md:hidden">
                <MobileProductCarousel 
                  images={productImages}
                  onImageClick={(index) => {
                    setSelectedImage(index);
                    setImageModalOpen(true);
                  }}
                />
              </div>

              {/* Desktop Image View */}
              <div className="hidden md:block">
                <div 
                  className="relative mb-6 rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer"
                  style={{ aspectRatio: '3/4' }}
                  onClick={() => setImageModalOpen(true)}
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
                      className="w-full h-full object-contain transition-transform duration-300"
                    />
                  </div>

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

                  {/* Click to view overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-white/80 text-gray-700 text-sm px-4 py-2 rounded-full backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Click to zoom
                    </div>
                  </div>
                </div>

                {/* Desktop Thumbnails */}
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
            <div className="flex items-center gap-1 mb-3 whitespace-nowrap overflow-hidden">
              <span className="text-base font-medium text-[#FF6B6B] flex-shrink-0">{product.rating}</span>
              {/* Stars */}
              <div className="flex flex-shrink-0">
                {[1,2,3,4,5].map(i => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
              <span className="text-sm text-gray-600 flex-shrink-0">({product.reviews})</span>
            </div>

            {/* Select Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
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
                      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1 bg-[#FFE5E5] text-[#E94F37] rounded-full font-semibold whitespace-nowrap">
                        MOST POPULAR!
                      </span>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg">{variant.title}</span>
                      <span className={`font-bold text-2xl ${
                        selectedVariant?.id === variant.id ? 'text-white' : 'text-gray-400'
                      }`}>
                        ${variant.price.toFixed(2)}
                      </span>
                    </div>
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
                    <span className="text-xs text-center font-medium relative z-10">{product.name}</span>
                    <span className="font-bold mt-2 text-[#E94F37] relative z-10">
                      ${selectedVariant.price.toFixed(2)}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedBundle('bundle')}
                    className={`relative overflow-visible group rounded-xl p-4 flex flex-col items-center transition-all duration-300 border-2 ${
                      selectedBundle === 'bundle'
                        ? 'border-[#E94F37] bg-[#FFF3E6] scale-[1.02]'
                        : 'border-gray-200 bg-white opacity-60'
                    }`}
                  >
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1 bg-[#E94F37] text-white rounded-full font-semibold whitespace-nowrap z-[100]">
                      BETTER TOGETHER
                    </span>
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
            <div className="mt-5 mb-4">
              {/* One-time purchase option */}
              <div 
                className={`rca-subscription border rounded-xl p-5 cursor-pointer transition-all duration-200 mb-3 hover:shadow-sm ${
                  !isSubscription 
                    ? 'border-black bg-white shadow-sm'
                    : 'border-gray-200 bg-white opacity-70 hover:opacity-90'
                }`}
                onClick={() => setIsSubscription(false)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <input 
                      type="radio" 
                      id="one-time"
                      name="purchase-type"
                      checked={!isSubscription}
                      onChange={() => setIsSubscription(false)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
                      !isSubscription ? 'border-black' : 'border-gray-300'
                    }`}>
                      {!isSubscription && (
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="one-time" className="font-bold text-gray-900 tracking-wide block">ONE-TIME PURCHASE</label>
                  </div>
                  <div className="font-bold text-xl">
                    ${calculatePrice(selectedBundle === 'single'
                      ? (selectedVariant ? selectedVariant.price : 14.99)
                      : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)) : 24.99))}
                  </div>
                </div>
              </div>
              
              {/* Subscribe & save option */}
              <div 
                className={`rca-subscription border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  isSubscription 
                    ? 'border-black bg-white shadow-sm'
                    : 'border-gray-200 bg-white opacity-70 hover:opacity-90'
                }`}
                onClick={() => setIsSubscription(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <input 
                      type="radio" 
                      id="subscribe"
                      name="purchase-type"
                      checked={isSubscription}
                      onChange={() => setIsSubscription(true)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
                      isSubscription ? 'border-black' : 'border-gray-300'
                    }`}>
                      {isSubscription && (
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor="subscribe" className="font-bold text-gray-900 tracking-wide">SUBSCRIBE</label>
                      <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">SAVE 15%</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm text-gray-600">Delivery every</span>
                      <select 
                        value={deliveryInterval}
                        onChange={(e) => setDeliveryInterval(parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium bg-transparent border-b border-gray-300 cursor-pointer focus:outline-none focus:border-black appearance-none"
                      >
                        <option value="1">1 month</option>
                        <option value="2">2 months</option>
                        <option value="3">3 months</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Edit, pause, or cancel anytime
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">
                      ${calculatePrice(selectedBundle === 'single'
                        ? (selectedVariant ? selectedVariant.price : 14.99)
                        : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)) : 24.99),
                        true)}
                    </div>
                    {isSubscription && (
                      <div className="text-sm text-gray-500 line-through">
                        ${calculatePrice(selectedBundle === 'single'
                          ? (selectedVariant ? selectedVariant.price : 14.99)
                          : (selectedVariant ? (selectedVariant.price + (silicaProduct ? silicaProduct.price : 10)) : 24.99))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* Trust Badges Section */}
      <div className="max-w-6xl mx-auto py-4 md:py-6">
        <div className="grid grid-cols-3 gap-3 md:gap-6 text-center px-4">
          {/* Customer Favorite Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-Badges5-Star-Reviews-Icon.png" alt="5-Star Reviews" className="w-16 h-16 md:w-24 md:h-24 mb-1 md:mb-2" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">CUSTOMER FAVORITE</h3>
          </div>
          
          {/* Made in USA Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-BadgesMade-in-US-Icon.png" alt="Made in USA" className="w-16 h-16 md:w-24 md:h-24 mb-1 md:mb-2" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">MADE IN THE USA</h3>
          </div>
          
          {/* Free Shipping Badge */}
          <div className="flex flex-col items-center">
            <img src="/assets/Icons/PDP-BadgesFree-Shipping-Icon.png" alt="Free Shipping" className="w-16 h-16 md:w-24 md:h-24 mb-1 md:mb-2" />
            <h3 className="text-sm md:text-xl font-bold text-gray-900">FREE SHIPPING</h3>
          </div>
        </div>
      </div>
      
      <LeafDivider />
      <IngredientsSlider />
      <LeafDivider />
      <BuildBundleSection />
      <LeafDivider />
      <ShopByPlantAlternative />
      <LeafDivider />
      <CustomerReviews />
      <AnimatedLeafDivider />
      <ComparisonChart />
      <MobileNewsletter />

      {/* Sticky Product Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 transform transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-full mx-auto px-3 py-3">
          {/* Mobile view */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Product minimal info */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img 
                    src={productImages[0]?.src || product?.image} 
                    alt={product?.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product?.name}</h3>
                  <span className="text-xs font-bold text-[#E94F37]">
                    ${isSubscription 
                      ? calculatePrice(selectedVariant ? selectedVariant.price : product?.price, true)
                      : (selectedVariant ? selectedVariant.price.toFixed(2) : product?.price.toFixed(2))
                    }
                  </span>
                </div>
              </div>
              
              {/* Buy button - simplified for mobile */}
              <button 
                onClick={handleAddToCart}
                className="bg-[#FFC600] hover:bg-[#FFD700] text-black font-bold py-2 px-4 rounded-lg text-xs whitespace-nowrap"
              >
                {isSubscription ? "Subscribe" : "Buy Now"}
              </button>
            </div>
            
            {/* Size selector - full width on mobile */}
            <div className="mt-2 relative">
              <select 
                value={selectedVariant?.id || ""}
                onChange={(e) => {
                  const variant = product?.variants.find(v => v.id === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="form-select appearance-none block w-full py-2 px-3 text-xs font-medium 
                  border border-gray-200 focus:border-[#E94F37] hover:border-gray-300
                  rounded-lg bg-white shadow-sm focus:outline-none focus:ring-0
                  transition-colors duration-200"
              >
                <option value="" disabled>Select Size</option>
                {product?.variants.map(variant => (
                  <option 
                    key={variant.id} 
                    value={variant.id}
                    disabled={!variant.available}
                  >
                    {variant.title} - ${variant.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="w-14 h-14 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                <img 
                  src={productImages[0]?.src || product?.image} 
                  alt={product?.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Product Name & Price */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product?.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#E94F37]">
                    ${isSubscription 
                      ? calculatePrice(selectedVariant ? selectedVariant.price : product?.price, true)
                      : (selectedVariant ? selectedVariant.price.toFixed(2) : product?.price.toFixed(2))
                    }
                  </span>
                  <span className="text-xs text-gray-600">|</span>
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-500 ml-1">{product?.rating || 4.5}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Variant Select & Buy Button */}
            <div className="flex items-center gap-3">
              {/* Variant Select with Improved Styling */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-[#E94F37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select 
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const variant = product?.variants.find(v => v.id === e.target.value);
                    if (variant) setSelectedVariant(variant);
                  }}
                  className="form-select appearance-none block w-full pl-10 pr-8 py-2 text-sm font-medium 
                    border-2 border-gray-200 focus:border-[#E94F37] hover:border-gray-300
                    rounded-lg bg-white shadow-sm focus:outline-none focus:ring-0
                    transition-colors duration-200 min-w-[160px]"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="" disabled>Select Size</option>
                  {product?.variants.map(variant => (
                    <option 
                      key={variant.id} 
                      value={variant.id}
                      disabled={!variant.available}
                      className={!variant.available ? "text-gray-400" : ""}
                    >
                      {variant.title} - ${variant.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Bundle Option Checkbox */}
              {silicaProduct && (
                <div className="hidden md:flex items-center mr-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={selectedBundle === 'bundle'}
                      onChange={() => setSelectedBundle(selectedBundle === 'single' ? 'bundle' : 'single')}
                    />
                    <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer
                      peer-checked:after:translate-x-full peer-checked:after:border-white
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-4 after:w-4 after:transition-all
                      peer-checked:bg-[#E94F37]"></div>
                    <span className="ml-2 text-xs font-medium text-gray-700">+ Bundle</span>
                  </label>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="bg-[#FFC600] hover:bg-[#FFD700] text-black font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap flex items-center gap-1"
              >
                <span>{isSubscription ? "Subscribe" : "Add to Cart"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal - Conditionally render based on device type */}
      {imageModalOpen && !isMobile && (
        <ImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          image={productImages[selectedImage - 1]?.src || product?.image}
          alt={productImages[selectedImage - 1]?.alt || product?.name}
        />
      )}
      
      {/* Mobile Image Gallery - Only on mobile */}
      {imageModalOpen && isMobile && (
        <MobileImageGallery
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          images={productImages}
          initialImage={productImages[selectedImage - 1]?.src || product?.image}
          productName={product?.name}
        />
      )}
    </>
  );
};

export default ProductPage; 