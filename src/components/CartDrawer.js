import React, { useEffect, useState } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    cartTotal, 
    cartCount,
    removeFromCart,
    updateQuantity,
    addToCart,
    checkout,
    forceCleanCart
  } = useCart();
  
  // Comment out Popular Add-Ons state variables for now
  // const [suggestedProducts, setSuggestedProducts] = useState([]);
  // const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  // const [selectedVariants, setSelectedVariants] = useState({});

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      // Set a CSS variable for the viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Comment out fetching suggested products for now
      // if (suggestedProducts.length === 0) {
      //   fetchSuggestedProducts();
      // }
    } else {
      document.body.style.overflow = '';
    }
    
    // Update the height variable on resize
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isCartOpen]);

  // Constants for thresholds
  const FREE_SHIPPING_THRESHOLD = 15;
  const BUNDLE_3_THRESHOLD = 3;
  const BUNDLE_3_DISCOUNT = 10;
  const BUNDLE_6_THRESHOLD = 6;
  const BUNDLE_6_DISCOUNT = 15;
  
  // Calculate potential shipping cost
  const getShippingCost = () => {
    return cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5;
  };
  
  // Calculate bundle discount
  const getBundleDiscount = () => {
    if (cartCount >= BUNDLE_6_THRESHOLD) {
      return BUNDLE_6_DISCOUNT;
    } else if (cartCount >= BUNDLE_3_THRESHOLD) {
      return BUNDLE_3_DISCOUNT;
    }
    return 0;
  };
  
  // Calculate final total
  const calculateTotal = () => {
    const subtotal = cartTotal;
    const shipping = getShippingCost();
    const discount = getBundleDiscount();
    return (subtotal + shipping - discount).toFixed(2);
  };

  // Calculate progress message and width based on cart total and count
  const getProgressInfo = () => {
    // Calculate amounts remaining
    const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
    const itemsToBundle3 = BUNDLE_3_THRESHOLD - cartCount;
    const itemsToBundle6 = BUNDLE_6_THRESHOLD - cartCount;

    let message = '';
    let progressWidth = '0%';
    
    if (cartTotal < FREE_SHIPPING_THRESHOLD) {
      // Stage 1: Working towards free shipping
      message = `Add $${amountToFreeShipping.toFixed(2)} more to get FREE SHIPPING!`;
      progressWidth = `${(cartTotal / FREE_SHIPPING_THRESHOLD) * 100}%`;
    } else if (cartCount < BUNDLE_3_THRESHOLD) {
      // Stage 2: Free shipping achieved, working towards 3-item bundle
      message = `Add ${itemsToBundle3} more product${itemsToBundle3 !== 1 ? 's' : ''} to receive $10 off!`;
      progressWidth = `${33 + ((cartCount / BUNDLE_3_THRESHOLD) * 33)}%`;
    } else if (cartCount < BUNDLE_6_THRESHOLD) {
      // Stage 3: 3-item bundle achieved, working towards 6-item bundle
      message = `Add ${itemsToBundle6} more item${itemsToBundle6 !== 1 ? 's' : ''} to get $15 off!`;
      progressWidth = `${66 + ((cartCount - BUNDLE_3_THRESHOLD) / (BUNDLE_6_THRESHOLD - BUNDLE_3_THRESHOLD) * 34)}%`;
    } else {
      // All thresholds achieved
      message = "You've unlocked all discounts!";
      progressWidth = "100%";
    }

    return { message, progressWidth };
  };

  // Function to fetch products from Shopify Storefront API
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
      console.error('Error fetching from Storefront API:', error);
      return null;
    }
  };

  // Map Shopify product to our format
  const mapProductFromShopify = (productEdge) => {
    const { node } = productEdge;
    const defaultImage = node.images.edges[0]?.node.transformedSrc || '';
    
    // Map all variants
    const variants = node.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      available: edge.node.availableForSale,
      inventory: edge.node.quantityAvailable || 0
    }));

    // Ensure we have at least one variant
    const defaultVariant = variants[0] || {
      id: `${node.id}-default`,
      title: 'Default',
      price: 0,
      available: false,
      inventory: 0
    };
    
    return {
      id: node.id,
      name: node.title,
      description: node.description,
      price: defaultVariant.price,
      image: defaultImage,
      variants: variants,
      selectedVariant: defaultVariant
    };
  };

  // Function to fetch suggested products - commented out for now
  /*
  const fetchSuggestedProducts = async () => {
    // setLoadingSuggestions(true);
    
    const query = `
      {
        products(first: 10, sortKey: BEST_SELLING) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    transformedSrc
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
                    }
                    availableForSale
                    quantityAvailable
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
      
      if (result?.data?.products?.edges) {
        const allProducts = result.data.products.edges.map(mapProductFromShopify);
        // Get random products for suggestions
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        // setSuggestedProducts(selected);
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
      // Fallback data
      // setSuggestedProducts([
      //   {
      //     id: 'gid://shopify/Product/123456789',
      //     name: 'SILICA FOR PLANTS',
      //     description: 'Strengthen cell walls for stronger stems and leaves.',
      //     price: 14.99,
      //     image: 'https://via.placeholder.com/300x300?text=SILICA',
      //     variants: [
      //       {
      //         id: 'gid://shopify/ProductVariant/123456789',
      //         title: '8 Ounces',
      //         price: 14.99,
      //         available: true,
      //         inventory: 10
      //       },
      //       {
      //         id: 'gid://shopify/ProductVariant/123456790',
      //         title: '16 Ounces',
      //         price: 24.99,
      //         available: true,
      //         inventory: 5
      //       }
      //     ],
      //     selectedVariant: {
      //       id: 'gid://shopify/ProductVariant/123456789',
      //       title: '8 Ounces',
      //       price: 14.99,
      //       available: true,
      //       inventory: 10
      //     }
      //   },
      //   {
      //     id: 'gid://shopify/Product/987654321',
      //     name: 'SEAWEED FERTILIZER',
      //     description: 'Boost growth and resilience with natural plant hormones and micronutrients.',
      //     price: 14.99,
      //     image: 'https://via.placeholder.com/300x300?text=SEAWEED',
      //     variants: [
      //       {
      //         id: 'gid://shopify/ProductVariant/987654321',
      //         title: '8 Ounces',
      //         price: 14.99,
      //         available: true,
      //         inventory: 8
      //       }
      //     ],
      //     selectedVariant: {
      //       id: 'gid://shopify/ProductVariant/987654321',
      //       title: '8 Ounces',
      //       price: 14.99,
      //       available: true,
      //       inventory: 8
      //     }
      //   }
      // ]);
    }
    
    // setLoadingSuggestions(false);
  };
  */

  // Handle variant selection for suggested products - commented out for now
  /*
  const handleVariantSelect = (productId, variant) => {
    // setSuggestedProducts(prev => 
    //   prev.map(product => 
    //     product.id === productId 
    //       ? { ...product, selectedVariant: variant }
    //       : product
    //   )
    // );
  };
  */

  // Handle add to cart for suggested product - commented out for now
  /*
  const handleAddSuggestion = (product) => {
    // addToCart(product, product.selectedVariant);
  };
  */

  const { message, progressWidth } = getProgressInfo();
  const shippingCost = getShippingCost();
  const bundleDiscount = getBundleDiscount();
  const finalTotal = calculateTotal();

  return (
    <>
      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[100] transition-opacity duration-300" 
          onClick={toggleCart}
        />
      )}
      
      {/* Cart Drawer */}
      <div 
        className={`fixed right-0 top-0 w-full md:w-[420px] h-[100vh] md:h-screen bg-[#fffbef] z-[100] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-5 w-5 min-[390px]:h-6 min-[390px]:w-6 text-gray-700 mr-3" />
            <h2 className="text-lg min-[390px]:text-xl font-medium">Cart <span className="text-gray-500">({cartCount})</span></h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Clear Cart Button - only show when cart has items */}
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    forceCleanCart();
                  }
                }}
                className="text-xs min-[390px]:text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button 
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 min-[390px]:h-7 min-[390px]:w-7" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {cartItems.length > 0 && (
          <div className="px-5 py-3 min-[390px]:py-4 bg-[#fffbef] border-b border-gray-200">
            <div className="mb-2 flex items-center">
              <span className="text-sm min-[390px]:text-base text-gray-800 font-medium">{message}</span>
            </div>
            <div className="h-2 min-[390px]:h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ff6b57] to-[#ffaa57] rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Cart Content */}
        <div className="flex flex-col flex-grow overflow-auto">
          {/* Cart Items - Scrollable */}
          <div className="flex-grow overflow-y-auto p-5 min-[390px]:p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 min-[390px]:w-28 min-[390px]:h-28 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <ShoppingBagIcon className="h-12 w-12 min-[390px]:h-14 min-[390px]:w-14 text-gray-300" />
                </div>
                <p className="text-gray-600 mb-4 text-lg min-[390px]:text-xl">Your cart is empty</p>
                <p className="text-gray-500 mb-6 text-sm min-[390px]:text-base max-w-xs">Looks like you haven't added any products to your cart yet.</p>
                <button 
                  onClick={toggleCart} 
                  className="inline-flex items-center text-[#ff6b57] hover:text-[#ff5a43] font-medium transition-colors duration-200"
                >
                  <span className="mr-2 text-sm min-[390px]:text-base">Continue Shopping</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 min-[390px]:h-5 min-[390px]:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <li key={`${item.id}-${item.variantId}`} className="py-5 min-[390px]:py-6">
                      <div className="flex gap-4 min-[390px]:gap-5">
                        {/* Product Image */}
                        <div className="h-20 w-20 min-[390px]:h-24 min-[390px]:w-24 flex-shrink-0 overflow-hidden rounded-md bg-[#e0f5ed] p-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex flex-col flex-1 min-w-0">
                          <h3 className="text-sm min-[390px]:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm min-[390px]:text-base text-gray-500 mb-1">{item.variantTitle}</p>
                          
                          {/* Show subscription details if it's a subscription item */}
                          {item.subscription && (
                            <div className="mb-1 bg-[#FFF2E6] rounded-md p-1 px-2 inline-flex items-center">
                              <svg className="w-3 h-3 min-[390px]:w-4 min-[390px]:h-4 text-[#FF6B57] mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                              </svg>
                              <span className="text-xs min-[390px]:text-sm font-medium text-[#FF6B57]">
                                SUBSCRIBE • SAVE {item.subscription.discount}% • Every {item.subscription.interval} {item.subscription.intervalUnit}{item.subscription.interval > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-sm min-[390px]:text-base font-medium text-gray-900">
                            {item.subscription 
                              ? <span className="flex items-center">
                                  <span className="line-through text-gray-400 mr-2">${item.price.toFixed(2)}</span>
                                  <span>${(item.price * (1 - item.subscription.discount/100)).toFixed(2)}</span>
                                </span>
                              : `$${item.price.toFixed(2)}`
                            }
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-full bg-white overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1, item.subscription)} 
                                className="p-1 w-7 h-7 min-[390px]:w-8 min-[390px]:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-3 w-3 min-[390px]:h-4 min-[390px]:w-4" />
                              </button>
                              <span className="px-2 min-[390px]:px-3 text-sm min-[390px]:text-base font-medium min-w-[24px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1, item.subscription)} 
                                className="p-1 w-7 h-7 min-[390px]:w-8 min-[390px]:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                              >
                                <PlusIcon className="h-3 w-3 min-[390px]:h-4 min-[390px]:w-4" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button 
                              onClick={() => removeFromCart(item.id, item.variantId, item.subscription)} 
                              className="text-sm min-[390px]:text-base text-gray-400 hover:text-[#ff6b57] transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.variantId)}
                          className="self-start text-gray-400 hover:text-gray-600"
                          aria-label="Remove item"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-[390px]:w-6 min-[390px]:h-6">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10 12.3033L6.46447 15.8388L4.34315 13.7175L7.87868 10.182L4.34315 6.64649L6.46447 4.52517L10 8.06069L13.5355 4.52517L15.6569 6.64649L12.1213 10.182L15.6569 13.7175L13.5355 15.8388L10 12.3033Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Add Additional Products Text */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <button 
                    onClick={() => {
                      navigate('/products');
                      toggleCart();
                    }}
                    className="text-[#ff6b57] text-sm min-[390px]:text-base font-medium hover:text-[#ff5a43] transition-colors cursor-pointer"
                  >
                    Add Additional Products
                  </button>
                </div>
                
                {/* Popular Add-Ons Section - Completely commented out for now, might need it later
                {false && (suggestedProducts.length > 0 || loadingSuggestions) && (
                  <div className="mt-6 sm:mt-8 bg-gradient-to-br from-[#f8f5e4] to-[#f1ede0] rounded-lg sm:rounded-xl px-3 sm:px-5 py-4 sm:py-6 border border-[#e8e3d3] shadow-sm">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent"></div>
                      <h3 className="text-xs sm:text-sm font-bold text-center mx-3 sm:mx-4 text-[#6b5b37] tracking-wide uppercase">
                        ✨ Popular Add-Ons
                      </h3>
                      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent"></div>
                    </div>
                    
                    {loadingSuggestions ? (
                      <div className="flex items-center justify-center py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-[#ff6b57] border-t-transparent"></div>
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-[#6b5b37]">Finding perfect add-ons...</span>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {suggestedProducts.map((product, index) => {
                          // Safety checks to ensure we have valid data
                          const selectedVariant = product.selectedVariant || product.variants?.[0] || {
                            id: 'fallback',
                            title: 'Default',
                            price: 0,
                            available: false,
                            inventory: 0
                          };
                          const variants = product.variants || [selectedVariant];
                          
                          return (
                            <div 
                              key={product.id} 
                              className="bg-white rounded-lg border border-[#e8e3d3] p-3 sm:p-4 hover:shadow-md transition-all duration-200 hover:border-[#ff6b57]/20 group"
                            >
                              <div className="flex gap-3">
                                <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#e0f5ed] to-[#d1f0e4] rounded-lg p-2 group-hover:shadow-sm transition-shadow flex items-center justify-center">
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                  />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="mb-2">
                                    <h4 className="font-bold text-xs sm:text-sm text-[#2d3748] mb-1 leading-tight">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs text-[#6b5b37] leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2">
                                      {product.description || (product.name.includes('SILICA') ? 
                                        'Strengthen cell walls for stronger stems and leaves.' :
                                        'Boost growth and resilience with natural plant hormones and micronutrients.')}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      {variants.length > 1 ? (
                                        <div className="relative flex-1">
                                          <select
                                            value={selectedVariant.id}
                                            onChange={(e) => {
                                              const newSelectedVariant = variants.find(v => v.id === e.target.value);
                                              if (newSelectedVariant) {
                                                handleVariantSelect(product.id, newSelectedVariant);
                                              }
                                            }}
                                            className="w-full text-xs sm:text-sm bg-[#f7f3e9] border border-[#e8e3d3] rounded-md px-2 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#ff6b57]/20 focus:border-[#ff6b57] appearance-none"
                                          >
                                            {variants.map((variant) => (
                                              <option key={variant.id} value={variant.id} disabled={!variant.available || variant.inventory === 0}>
                                                {variant.title} - ${variant.price.toFixed(2)} 
                                                {variant.inventory <= 5 && variant.inventory > 0 ? ` (${variant.inventory} left)` : ''}
                                                {!variant.available || variant.inventory === 0 ? ' (Out of Stock)' : ''}
                                              </option>
                                            ))}
                                          </select>
                                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="w-3 h-3 text-[#6b5b37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-[#f7f3e9] border border-[#e8e3d3] rounded-md px-2 py-1.5 flex-1">
                                          <span className="text-xs sm:text-sm text-[#6b5b37] font-medium">
                                            {selectedVariant.title} - ${selectedVariant.price.toFixed(2)}
                                          </span>
                                          {selectedVariant.inventory <= 5 && selectedVariant.inventory > 0 && (
                                            <span className="text-xs text-orange-600 ml-2">
                                              ({selectedVariant.inventory} left)
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      
                                      <button 
                                        onClick={() => handleAddSuggestion({...product, selectedVariant})}
                                        disabled={!selectedVariant.available || selectedVariant.inventory === 0}
                                        className="bg-gradient-to-r from-[#ff6b57] to-[#ff5a43] hover:from-[#ff5a43] hover:to-[#e8533e] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 disabled:transform-none flex items-center justify-center space-x-1 flex-shrink-0"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="hidden sm:inline">
                                          {!selectedVariant.available || selectedVariant.inventory === 0 
                                            ? 'OUT OF STOCK' 
                                            : 'ADD TO CART'
                                          }
                                        </span>
                                        <span className="sm:hidden">
                                          {!selectedVariant.available || selectedVariant.inventory === 0 
                                            ? 'OUT' 
                                            : 'ADD'
                                          }
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {!loadingSuggestions && suggestedProducts.length > 0 && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#e8e3d3]/50">
                        <p className="text-center text-xs text-[#6b5b37] font-medium">
                          💡 Complete your plant care routine with these essentials
                        </p>
                      </div>
                    )}
                  </div>
                )}
                */}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-3 min-[390px]:p-4 bg-white">
              <div className="space-y-1 min-[390px]:space-y-2 mb-3">
                <div className="flex justify-between text-xs min-[390px]:text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xs min-[390px]:text-sm text-gray-500">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-xs min-[390px]:text-sm text-green-600">
                    <span>{cartCount >= BUNDLE_6_THRESHOLD ? 'Bundle of 6 Discount' : 'Bundle of 3 Discount'}</span>
                    <span>-${bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <span className="text-sm min-[390px]:text-base font-semibold">Total</span>
                  <span className="text-sm min-[390px]:text-base font-semibold">${finalTotal}</span>
                </div>
              </div>
              
              <div className="mt-3 min-[390px]:mt-4">
                <button 
                  onClick={checkout}
                  className="w-full bg-[#ff6b57] hover:bg-[#ff5a43] text-white py-2.5 min-[390px]:py-3.5 px-4 min-[390px]:px-6 rounded-full transition-colors font-medium shadow-sm flex items-center justify-center uppercase text-sm min-[390px]:text-base"
                >
                  <span>CHECKOUT</span>
                </button>
                
                <div className="mt-3 min-[390px]:mt-4 text-center">
                  <p className="text-xs min-[390px]:text-sm text-gray-500">Taxes Calculated at checkout</p>
                  {cartItems.some(item => item.subscription) && (
                    <p className="text-xs min-[390px]:text-sm font-medium text-[#FF6B57] mt-0.5">
                      Your cart contains subscription items
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer; 