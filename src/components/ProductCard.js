import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const ProductCard = ({ product, index, isMobile = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // State to prevent double-clicks
  const [isAdding, setIsAdding] = useState(false);
  // State for image loading
  const [imageError, setImageError] = useState(false);
  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

  // Background gradient styles for each product card
  const cardBackgrounds = [
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]', // Default light blue color
    'bg-[#def0f9]'  // Default light blue color
  ];

  // Helper function to get alternating background
  const getCategoryBackground = (index) => {
    const backgroundIndex = index % cardBackgrounds.length;
    return cardBackgrounds[backgroundIndex];
  };

  // Function to abbreviate variant titles for mobile to avoid truncation
  const abbreviateVariantTitle = (title, isMobile = false) => {
    if (!isMobile) return title;
    
    // Common abbreviations for mobile
    const abbreviations = {
      'ounces': 'oz',
      'ounce': 'oz', 
      'Ounces': 'oz',
      'Ounce': 'oz',
      'pounds': 'lbs',
      'pound': 'lb',
      'Pounds': 'lbs', 
      'Pound': 'lb',
      'gallon': 'gal',
      'gallons': 'gal',
      'Gallon': 'gal',
      'Gallons': 'gal',
      'bottle': 'btl',
      'Bottle': 'btl',
      'container': 'cont',
      'Container': 'cont',
      'package': 'pkg',
      'Package': 'pkg',
      'fertilizer': 'fert',
      'Fertilizer': 'fert',
      'liquid': 'liq',
      'Liquid': 'liq',
      'granular': 'gran',
      'Granular': 'gran',
      'concentrated': 'conc',
      'Concentrated': 'conc',
      'premium': 'prem',
      'Premium': 'prem',
      'standard': 'std',
      'Standard': 'std'
    };
    
    let abbreviated = title;
    
    // Apply abbreviations
    Object.entries(abbreviations).forEach(([full, abbrev]) => {
      const regex = new RegExp(`\\b${full}\\b`, 'g');
      abbreviated = abbreviated.replace(regex, abbrev);
    });
    
    // Remove common filler words on mobile
    const fillerWords = ['for', 'and', 'the', 'with', 'plus'];
    fillerWords.forEach(word => {
      const regex = new RegExp(`\\s+${word}\\s+`, 'gi');
      abbreviated = abbreviated.replace(regex, ' ');
    });
    
    // Clean up extra spaces
    abbreviated = abbreviated.replace(/\s+/g, ' ').trim();
    
    // If still too long, truncate to reasonable length
    if (abbreviated.length > 15) {
      abbreviated = abbreviated.substring(0, 15) + '...';
    }
    
    return abbreviated;
  };

  // Function to format product name as single line
  const formatProductName = (name) => {
    const upperName = name.toUpperCase();
    
    return (
      <div className="product-name-container h-8 flex items-center mb-3">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight tracking-tight w-full truncate">
          {upperName}
        </h3>
      </div>
    );
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

  // Generate random rating for demo purposes
  const generateRandomRating = () => {
    return (Math.random() * (5 - 4) + 4).toFixed(1);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    
    // Prevent double-clicks
    if (isAdding) {
      return;
    }
    
    const variantToAdd = selectedVariant || product.variants?.[0] || { price: product.price, available: true };
    
    if (variantToAdd && (variantToAdd.available || variantToAdd.availableForSale)) {
      setIsAdding(true);
      
      try {
        addToCart(product, variantToAdd, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
      
      // Reset the adding state after a delay
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };
  
  const handleCardClick = () => {
    // Extract the numeric ID portion from the Shopify ID format
    let id = product.id;
    
    // Check if the ID is in Shopify's gid format and extract just the numeric part
    if (typeof id === 'string' && id.includes('gid://shopify/Product/')) {
      id = id.split('/').pop();
    }
    
    navigate(`/product/${id}`);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get image source with fallback
  const getImageSrc = () => {
    if (imageError) {
      return "/assets/products/placeholder.png";
    }
    
    // Ensure the image URL is properly formatted
    let imageSrc = product.image;
    if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
      imageSrc = `https:${imageSrc}`;
    }
    
    return imageSrc || "/assets/products/placeholder.png";
  };

  // Handle variant selection
  const handleVariantChange = (e) => {
    e.stopPropagation(); // Prevent card click
    const variantId = e.target.value;
    const variant = product.variants?.find(v => v.id === variantId);
    setSelectedVariant(variant);
  };

  // Format price for display
  const formatPrice = (price) => {
    if (typeof price === 'object' && price.amount) {
      return `$${parseFloat(price.amount).toFixed(2)}`;
    }
    return `$${parseFloat(price || 0).toFixed(2)}`;
  };

  // Get current price based on selected variant
  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return formatPrice(selectedVariant.price);
    }
    if (product.variants && product.variants.length > 0) {
      return formatPrice(product.variants[0].price);
    }
    return formatPrice(product.price);
  };
  
  return (
    <>
      {/* Product Card Styles */}
      <style>
        {`
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

          @media (max-width: 640px) {
            .product-card {
              padding: 8px;
              min-height: 320px;
              max-height: 320px;
              max-width: none;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
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
            .product-card {
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
            .product-card {
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
            .product-card {
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
        `}
      </style>

      <div 
        className={`product-card ${getCategoryBackground(index)} rounded-lg shadow-sm relative cursor-pointer`}
        onClick={handleCardClick}
        style={{ overflow: 'visible' }}
      >
        {product.bestSeller && (
          <div className="best-seller-badge absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#ff6b57] text-white font-bold py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm z-10">
            BEST SELLER!
          </div>
        )}
        
        <div className="p-1 sm:p-2" style={{ overflow: 'visible' }}>
          <div className="product-image-container relative h-32 sm:h-48 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
            <img 
              src={getImageSrc()}
              alt={product.name} 
              className="product-image h-full w-auto object-contain"
              style={{ backgroundColor: 'transparent' }}
              onError={handleImageError}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">Image not available</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-1 sm:mb-1 w-full reviews-mobile">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800 text-xs sm:text-sm font-medium">{product.rating || generateRandomRating()}</span>
              {renderStars()}
              <span className="text-gray-600 text-xs sm:text-sm">({product.reviews})</span>
            </div>
          </div>
          
          {formatProductName(product.name)}

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-1 sm:mb-2 w-full variant-selector-mobile" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <select
                  value={selectedVariant?.id || ''}
                  onChange={handleVariantChange}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b57] focus:border-[#ff6b57] appearance-none cursor-pointer font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 opacity-0 absolute inset-0 z-10"
                  data-no-drag="true"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title} | {formatPrice(variant.price)}
                    </option>
                  ))}
                </select>
                
                {/* Custom Dropdown Display */}
                <div className="flex items-center justify-between p-1.5 sm:p-2 border border-gray-200 rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 pointer-events-none custom-dropdown">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 truncate">
                    {abbreviateVariantTitle(selectedVariant?.title || product.variants[0]?.title, isMobile)}
                  </span>
                  
                  {/* Right corner group: Divider + Price + Caret */}
                  <div className="flex items-center ml-1">
                    {/* Full Height Divider */}
                    <div className="h-4 sm:h-6 w-px bg-gray-300 mr-1 sm:mr-2"></div>
                    
                    {/* Price */}
                    <span className="text-xs sm:text-sm font-bold text-[#ff6b57] mr-1 sm:mr-2 whitespace-nowrap">
                      {formatPrice(selectedVariant?.price || product.variants[0]?.price)}
                    </span>
                    
                    {/* Custom Caret */}
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleAddToCart}
            className={`w-full font-bold text-xs sm:text-base py-2 sm:py-2.5 px-2 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center add-to-cart-btn
              ${selectedVariant && (selectedVariant.available || selectedVariant.availableForSale)
                ? 'bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white shadow-sm cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!selectedVariant || !(selectedVariant.available || selectedVariant.availableForSale)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs sm:text-base">{isAdding ? 'ADDING...' : 'ADD TO CART'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard; 