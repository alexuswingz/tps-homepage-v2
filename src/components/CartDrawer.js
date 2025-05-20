import React, { useEffect, useState } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from './CartContext';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    cartTotal, 
    cartCount,
    removeFromCart,
    updateQuantity,
    addToCart,
    checkout
  } = useCart();
  
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      if (suggestedProducts.length === 0) {
        fetchSuggestedProducts();
      }
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
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
    const defaultVariant = node.variants.edges[0].node;
    const defaultImage = node.images.edges[0]?.node.transformedSrc || '';
    
    return {
      id: node.id,
      name: node.title,
      description: node.description,
      price: parseFloat(defaultVariant.price.amount),
      image: defaultImage,
      variant: {
        id: defaultVariant.id,
        title: defaultVariant.title,
        price: parseFloat(defaultVariant.price.amount),
        available: defaultVariant.availableForSale
      }
    };
  };

  // Function to fetch suggested products
  const fetchSuggestedProducts = async () => {
    setLoadingSuggestions(true);
    
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
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    availableForSale
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
        setSuggestedProducts(selected);
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
      // Fallback data
      setSuggestedProducts([
        {
          id: 'gid://shopify/Product/123456789',
          name: 'SILICA FOR PLANTS',
          description: 'Stengthen cell walls for stronger stems and leaves.',
          price: 14.99,
          image: 'https://via.placeholder.com/300x300?text=SILICA',
          variant: {
            id: 'gid://shopify/ProductVariant/123456789',
            title: '8 Ounces',
            price: 14.99,
            available: true
          }
        },
        {
          id: 'gid://shopify/Product/987654321',
          name: 'SEAWEED FERTILIZER',
          description: 'Boost growth and resilience with natural plant hormones and micronutrients.',
          price: 14.99,
          image: 'https://via.placeholder.com/300x300?text=SEAWEED',
          variant: {
            id: 'gid://shopify/ProductVariant/987654321',
            title: '8 Ounces',
            price: 14.99,
            available: true
          }
        }
      ]);
    }
    
    setLoadingSuggestions(false);
  };

  // Handle add to cart for suggested product
  const handleAddSuggestion = (product) => {
    addToCart(product, product.variant);
  };

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
        className={`fixed right-0 top-0 w-full md:w-[420px] h-screen bg-[#fffbef] z-[100] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-5 w-5 text-gray-700 mr-3" />
            <h2 className="text-lg font-medium">Your Bag <span className="text-gray-500">({cartCount})</span></h2>
          </div>
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        {cartItems.length > 0 && (
          <div className="px-5 py-3 bg-[#fffbef] border-b border-gray-200">
            <div className="mb-2 flex items-center">
              <span className="text-sm text-gray-800 font-medium">{message}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
          <div className="flex-grow overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300" />
                </div>
                <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
                <p className="text-gray-500 mb-6 text-sm max-w-xs">Looks like you haven't added any products to your cart yet.</p>
                <button 
                  onClick={toggleCart} 
                  className="inline-flex items-center text-[#ff6b57] hover:text-[#ff5a43] font-medium transition-colors duration-200"
                >
                  <span className="mr-2">Continue Shopping</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.variantId}`} className="py-5">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#e0f5ed] p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{item.variantTitle}</p>
                        
                        {/* Show subscription details if it's a subscription item */}
                        {item.subscription && (
                          <div className="mb-1 bg-[#FFF2E6] rounded-md p-1 px-2 inline-flex items-center">
                            <svg className="w-3 h-3 text-[#FF6B57] mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                            </svg>
                            <span className="text-xs font-medium text-[#FF6B57]">
                              SUBSCRIBE • SAVE {item.subscription.discount}% • Every {item.subscription.interval} {item.subscription.intervalUnit}{item.subscription.interval > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm font-medium text-gray-900">
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
                              className="p-1 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm font-medium min-w-[24px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1, item.subscription)} 
                              className="p-1 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFromCart(item.id, item.variantId, item.subscription)} 
                            className="text-sm text-gray-400 hover:text-[#ff6b57] transition-colors"
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M10 12.3033L6.46447 15.8388L4.34315 13.7175L7.87868 10.182L4.34315 6.64649L6.46447 4.52517L10 8.06069L13.5355 4.52517L15.6569 6.64649L12.1213 10.182L15.6569 13.7175L13.5355 15.8388L10 12.3033Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Essential Add-Ons Section */}
          {cartItems.length > 0 && suggestedProducts.length > 0 && (
            <div className="px-4 py-4 bg-[#F4F0E2] border-t border-gray-200">
              <h3 className="text-xl font-semibold text-center mb-3 text-[#4A4A46]">ESSENTIAL ADD-ONS</h3>
              <div className="space-y-5">
                {suggestedProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="flex flex-col">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-[#e0f5ed] rounded-md p-1">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold uppercase text-sm mb-0.5 text-[#4A4A46]">{product.name.split(' ')[0]} <span className="font-normal normal-case">FOR PLANTS</span></h4>
                        <p className="text-xs text-gray-700 leading-tight">
                          {product.description || (product.name.includes('SILICA') ? 
                            'Stengthen cell walls for stronger stems and leaves.' :
                            'Boost growth and resilience with natural plant hormones and micronutrients.')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="relative w-full">
                          <div className="flex items-center">
                            <div className="rounded-l-full bg-white border border-gray-300 p-1.5 pl-3 pr-6 text-xs flex-1">
                              <span className="font-medium">8 Ounces</span>
                            </div>
                            <div className="bg-white border-y border-r border-gray-300 rounded-r-full p-1.5 pr-3 flex items-center">
                              <span className="text-xs font-medium">${product.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute right-14 top-1/2 transform -translate-y-1/2 flex items-center">
                            <svg className="w-3 h-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddSuggestion(product)}
                        className="bg-[#FF6B57] text-white font-bold text-sm px-4 py-1.5 rounded-full"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-5 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{cartCount >= BUNDLE_6_THRESHOLD ? 'Bundle of 6 Discount' : 'Bundle of 3 Discount'}</span>
                    <span>-${bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold">${finalTotal}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={checkout}
                  className="w-full bg-[#ff6b57] hover:bg-[#ff5a43] text-white py-3 px-4 rounded-full transition-colors font-medium shadow-sm flex items-center justify-center uppercase"
                >
                  <span>CHECKOUT</span>
                </button>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">Shipping and Taxes Calculated at checkout</p>
                  {cartItems.some(item => item.subscription) && (
                    <p className="text-xs font-medium text-[#FF6B57] mt-1">
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