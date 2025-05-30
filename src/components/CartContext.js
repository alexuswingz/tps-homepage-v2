import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Global debounce for addToCartSilent to prevent rapid successive calls
const addToCartSilentDebounce = new Map();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '', product: null });
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    // Check URL parameters for checkout completion
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutComplete = urlParams.get('checkout') === 'complete' || 
                            urlParams.get('order') || 
                            urlParams.get('thank_you') ||
                            window.location.pathname.includes('/thank') ||
                            window.location.pathname.includes('/order');
    
    // If checkout was completed, ensure cart is cleared
    if (checkoutComplete) {
      localStorage.removeItem('cart');
      localStorage.removeItem('bundleDiscount');
      setCartItems([]);
      setDiscount(null);
      console.log('Checkout completed - cart cleared');
      return;
    }
    
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Additional validation - ensure cart items are valid
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart'); // Clear corrupted cart data
      }
    }
    
    // Check for bundle discount
    const bundleDiscount = localStorage.getItem('bundleDiscount');
    if (bundleDiscount) {
      setDiscount(bundleDiscount);
    }
  }, []);

  useEffect(() => {
    // Update cart total and count whenever cartItems changes
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);
    
    const total = cartItems.reduce((total, item) => {
      // Calculate price based on whether item is subscription or not
      const itemPrice = item.subscription ? (item.price * (1 - item.subscription.discount/100)) : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
    
    setCartTotal(total);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1, subscriptionProps = null) => {
    // Ensure quantity is at least 1
    const qty = Math.max(1, parseInt(quantity) || 1);
    
    // Check variant has available quantity
    const maxAvailable = variant.quantity || 999; // Fallback to large number if not specified
    const safeQty = Math.min(qty, maxAvailable);
    
    setCartItems(prevItems => {
      // Check if this item is already in the cart with the same subscription settings
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && 
               item.variantId === variant.id && 
               ((!item.subscription && !subscriptionProps) || 
                (item.subscription && subscriptionProps && 
                 item.subscription.interval === subscriptionProps.interval))
      );

      if (existingItemIndex > -1) {
        // Item exists, increase quantity by specified amount
        const updatedItems = [...prevItems];
        
        // Make sure we don't exceed available quantity
        const currentQty = updatedItems[existingItemIndex].quantity;
        const newQty = Math.min(currentQty + safeQty, maxAvailable);
        
        updatedItems[existingItemIndex].quantity = newQty;
        
        // Show notification
        if (safeQty === 1) {
          showNotification(`Added another ${product.name} to your cart`, product);
        } else {
          showNotification(`Added ${safeQty} ${product.name} to your cart`, product);
        }
        
        return updatedItems;
      } else {
        // New item, add to cart with specified quantity
        const subscriptionType = subscriptionProps ? 
          (subscriptionProps.isSubscription ? 'Subscribe & Save' : 'One-time purchase') : 
          'One-time purchase';
          
        showNotification(`${product.name} (${subscriptionType}) added to your cart!`, product);
        
        return [...prevItems, {
          id: product.id,
          name: product.name,
          image: product.image,
          price: variant.price,
          variantId: variant.id,
          variantTitle: variant.title,
          quantity: safeQty,
          maxQuantity: maxAvailable, // Store max available for later reference
          subscription: subscriptionProps // Store subscription details if applicable
        }];
      }
    });
    
    // Open the cart when item is added
    setIsCartOpen(true);
  };

  // Silent version that doesn't auto-open the cart
  const addToCartSilent = (product, variant, quantity = 1, subscriptionProps = null) => {
    console.log('addToCartSilent called with:', {
      productName: product.name,
      productId: product.id,
      variantId: variant.id,
      quantity,
      subscriptionProps
    });
    
    // Create a unique key for this product/variant combination
    const debounceKey = `${product.id}-${variant.id}`;
    const now = Date.now();
    
    // Check if we've recently processed this exact same product/variant combination
    if (addToCartSilentDebounce.has(debounceKey)) {
      const lastCallTime = addToCartSilentDebounce.get(debounceKey);
      if (now - lastCallTime < 2000) { // 2 second debounce
        console.log('Blocked duplicate addToCartSilent call for:', debounceKey, 'Time since last:', now - lastCallTime, 'ms');
        return;
      }
    }
    
    // Set the debounce timestamp
    addToCartSilentDebounce.set(debounceKey, now);
    
    // Clean up old debounce entries after 5 seconds
    setTimeout(() => {
      addToCartSilentDebounce.delete(debounceKey);
    }, 5000);
    
    // Ensure quantity is at least 1
    const qty = Math.max(1, parseInt(quantity) || 1);
    console.log('Processed quantity:', qty);
    
    // Check variant has available quantity
    const maxAvailable = variant.quantity || 999; // Fallback to large number if not specified
    const safeQty = Math.min(qty, maxAvailable);
    console.log('Safe quantity after max check:', safeQty);
    
    setCartItems(prevItems => {
      console.log('Current cart items before update:', prevItems);
      
      // Check if this item is already in the cart with the same subscription settings
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && 
               item.variantId === variant.id && 
               ((!item.subscription && !subscriptionProps) || 
                (item.subscription && subscriptionProps && 
                 item.subscription.interval === subscriptionProps.interval))
      );

      console.log('Existing item index:', existingItemIndex);

      if (existingItemIndex > -1) {
        // Item exists, increase quantity by specified amount
        const updatedItems = [...prevItems];
        
        // Make sure we don't exceed available quantity
        const currentQty = updatedItems[existingItemIndex].quantity;
        console.log('Current quantity in cart:', currentQty);
        
        const newQty = Math.min(currentQty + safeQty, maxAvailable);
        console.log('New quantity will be:', newQty);
        
        updatedItems[existingItemIndex].quantity = newQty;
        
        // Show notification
        if (safeQty === 1) {
          showNotification(`Added another ${product.name} to your cart`, product);
        } else {
          showNotification(`Added ${safeQty} ${product.name} to your cart`, product);
        }
        
        console.log('Updated cart items:', updatedItems);
        return updatedItems;
      } else {
        // New item, add to cart with specified quantity
        const subscriptionType = subscriptionProps ? 
          (subscriptionProps.isSubscription ? 'Subscribe & Save' : 'One-time purchase') : 
          'One-time purchase';
          
        showNotification(`${product.name} (${subscriptionType}) added to your cart!`, product);
        
        const newItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: variant.price,
          variantId: variant.id,
          variantTitle: variant.title,
          quantity: safeQty,
          maxQuantity: maxAvailable, // Store max available for later reference
          subscription: subscriptionProps // Store subscription details if applicable
        };
        
        console.log('Adding new item to cart:', newItem);
        const newCartItems = [...prevItems, newItem];
        console.log('New cart items array:', newCartItems);
        return newCartItems;
      }
    });
    
    // Don't auto-open the cart
  };

  const showNotification = (message, product) => {
    setNotification({ visible: true, message, product });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ visible: false, message: '', product: null });
    }, 3000);
  };

  const removeFromCart = (itemId, variantId, subscriptionProps = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        if (item.id !== itemId || item.variantId !== variantId) return true;
        
        // For subscription items, check if subscription settings match
        if (subscriptionProps && item.subscription) {
          return item.subscription.interval !== subscriptionProps.interval ||
                 item.subscription.intervalUnit !== subscriptionProps.intervalUnit;
        } else if (!subscriptionProps && !item.subscription) {
          return false; // Remove one-time purchase items
        }
        
        return true; // Keep items that don't match the subscription criteria
      })
    );
  };

  const updateQuantity = (itemId, variantId, newQuantity, subscriptionProps = null) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        const subscriptionMatch = 
          (!subscriptionProps && !item.subscription) ||
          (subscriptionProps && item.subscription && 
           item.subscription.interval === subscriptionProps.interval);
          
        if (item.id === itemId && item.variantId === variantId && subscriptionMatch) {
          // Ensure we don't exceed maximum available quantity
          const maxQty = item.maxQuantity || 999;
          const safeQty = Math.min(newQuantity, maxQty);
          
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('bundleDiscount');
    setDiscount(null);
  };

  // Add a function to force clear cart (useful for debugging or manual clearing)
  const forceCleanCart = () => {
    clearCart();
    console.log('Cart forcefully cleared');
  };

  // Listen for page visibility changes to detect return from checkout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible again - check if we should clear cart
        const urlParams = new URLSearchParams(window.location.search);
        const checkoutComplete = urlParams.get('checkout') === 'complete' || 
                                urlParams.get('order') || 
                                urlParams.get('thank_you') ||
                                window.location.pathname.includes('/thank') ||
                                window.location.pathname.includes('/order');
        
        if (checkoutComplete) {
          clearCart();
          console.log('Returned from checkout - cart cleared');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Listen for storage events to sync cart clearing across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart' && e.newValue === null) {
        // Cart was cleared in another tab
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        console.log('Cart cleared in another tab');
      } else if (e.key === 'bundleDiscount' && e.newValue === null) {
        // Bundle discount was cleared in another tab
        setDiscount(null);
      } else if (e.key === 'checkoutCompleted' && e.newValue === 'true') {
        // Checkout was completed - clear cart
        clearCart();
        localStorage.removeItem('checkoutCompleted');
        console.log('Checkout completed - clearing cart');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Function to handle final checkout with ReCharge
  const checkout = async () => {
    try {
      // Determine if we have subscription items in the cart
      const hasSubscription = cartItems.some(item => item.subscription);
      
      // Use the custom checkout domain
      const checkoutDomain = 'https://checkout.tpsplantfoods.com';
      
      // Get bundle discount if available
      const bundleDiscount = localStorage.getItem('bundleDiscount');
      
      // Debug: Log cart items to console
      console.log('Cart items for checkout:', cartItems);
      
      // Store cart items temporarily in case we need to restore them
      const cartItemsForCheckout = [...cartItems];
      
      // Clear the cart immediately since we're redirecting to external checkout
      // This prevents items from staying in cart after successful purchase
      clearCart();
      
      // Also clear any bundle discount
      localStorage.removeItem('bundleDiscount');
      setDiscount(null);
      
      // Create a form to submit to cart
      const form = document.createElement('form');
      form.method = 'post';
      form.action = `${checkoutDomain}/cart/clear`;
      
      document.body.appendChild(form);
      form.submit();
      
      // After clearing cart, add items and redirect to checkout
      setTimeout(() => {
        const addForm = document.createElement('form');
        addForm.method = 'post';
        addForm.action = `${checkoutDomain}/cart/add`;
        
        // Process each cart item
        cartItemsForCheckout.forEach((item, index) => {
          // Handle variant ID more robustly
          let variantId = item.variantId;
          
          // Remove GraphQL prefix if present
          if (typeof variantId === 'string' && variantId.includes('gid://shopify/ProductVariant/')) {
            variantId = variantId.replace('gid://shopify/ProductVariant/', '');
          }
          
          // Ensure we have a valid variant ID (should be numeric)
          if (!variantId || (typeof variantId === 'string' && isNaN(variantId))) {
            console.error('Invalid variant ID for item:', item);
            console.error('Original variant ID:', item.variantId);
            console.error('Processed variant ID:', variantId);
            return; // Skip this item
          }
          
          // Convert to string if it's a number
          variantId = String(variantId);
          
          console.log(`Processing item ${index}: ${item.name}, Original ID: ${item.variantId}, Processed ID: ${variantId}`);
          
          // Create input for ID
          const idInput = document.createElement('input');
          idInput.type = 'hidden';
          idInput.name = `items[${index}][id]`;
          idInput.value = variantId;
          addForm.appendChild(idInput);
          
          // Create input for quantity
          const quantityInput = document.createElement('input');
          quantityInput.type = 'hidden';
          quantityInput.name = `items[${index}][quantity]`;
          quantityInput.value = item.quantity;
          addForm.appendChild(quantityInput);
          
          // For subscription items, we need to handle pricing differently
          if (item.subscription) {
            console.log('Adding subscription properties for item:', item.name);
            console.log('Subscription object:', item.subscription);
            
            // Calculate the discounted price
            const originalPrice = item.price;
            const discountPercentage = item.subscription.discount || 15;
            const discountedPrice = originalPrice * (1 - discountPercentage / 100);
            
            console.log(`Original price: $${originalPrice}, Discount: ${discountPercentage}%, Discounted price: $${discountedPrice.toFixed(2)}`);
            
            // Add the discounted price as a property for ReCharge to use
            const priceInput = document.createElement('input');
            priceInput.type = 'hidden';
            priceInput.name = `items[${index}][properties][subscription_price]`;
            priceInput.value = discountedPrice.toFixed(2);
            addForm.appendChild(priceInput);
            
            // Try to override the price using ReCharge's expected format
            const rechargeDiscountInput = document.createElement('input');
            rechargeDiscountInput.type = 'hidden';
            rechargeDiscountInput.name = `items[${index}][properties][discount_amount]`;
            rechargeDiscountInput.value = (originalPrice - discountedPrice).toFixed(2);
            addForm.appendChild(rechargeDiscountInput);
            
            // Add ReCharge subscription discount type
            const discountTypeInput = document.createElement('input');
            discountTypeInput.type = 'hidden';
            discountTypeInput.name = `items[${index}][properties][discount_type]`;
            discountTypeInput.value = 'percentage';
            addForm.appendChild(discountTypeInput);
            
            // Add selling plan only if it exists and is valid
            if (item.subscription.selling_plan && item.subscription.selling_plan !== 'undefined' && item.subscription.selling_plan !== '') {
              const sellingPlanInput = document.createElement('input');
              sellingPlanInput.type = 'hidden';
              sellingPlanInput.name = `items[${index}][selling_plan]`;
              sellingPlanInput.value = item.subscription.selling_plan;
              addForm.appendChild(sellingPlanInput);
              console.log('Added selling plan:', item.subscription.selling_plan);
            } else {
              console.warn('No valid selling plan ID found for subscription item:', item.name);
              console.warn('This item will be processed as a regular subscription without Shopify selling plan');
            }
            
            // Add ReCharge subscription properties
            // Shipping interval frequency
            const shipFreqInput = document.createElement('input');
            shipFreqInput.type = 'hidden';
            shipFreqInput.name = `items[${index}][properties][shipping_interval_frequency]`;
            shipFreqInput.value = item.subscription.charge_interval_frequency || item.subscription.interval || '2';
            addForm.appendChild(shipFreqInput);
            
            // Shipping interval unit type
            const shipUnitInput = document.createElement('input');
            shipUnitInput.type = 'hidden';
            shipUnitInput.name = `items[${index}][properties][shipping_interval_unit_type]`;
            shipUnitInput.value = item.subscription.intervalUnit || 'month';
            addForm.appendChild(shipUnitInput);
            
            // Order interval frequency (for ReCharge)
            const orderFreqInput = document.createElement('input');
            orderFreqInput.type = 'hidden';
            orderFreqInput.name = `items[${index}][properties][order_interval_frequency]`;
            orderFreqInput.value = item.subscription.order_interval_frequency || item.subscription.interval || '2';
            addForm.appendChild(orderFreqInput);
            
            // Order interval unit
            const orderUnitInput = document.createElement('input');
            orderUnitInput.type = 'hidden';
            orderUnitInput.name = `items[${index}][properties][order_interval_unit]`;
            orderUnitInput.value = item.subscription.order_interval_unit || 'month';
            addForm.appendChild(orderUnitInput);
            
            // Charge interval frequency
            const chargeFreqInput = document.createElement('input');
            chargeFreqInput.type = 'hidden';
            chargeFreqInput.name = `items[${index}][properties][charge_interval_frequency]`;
            chargeFreqInput.value = item.subscription.charge_interval_frequency || item.subscription.interval || '2';
            addForm.appendChild(chargeFreqInput);
            
            // Add discount percentage (for reference)
            const discountInput = document.createElement('input');
            discountInput.type = 'hidden';
            discountInput.name = `items[${index}][properties][discount_percentage]`;
            discountInput.value = item.subscription.discount || '15';
            addForm.appendChild(discountInput);
            
            // Add ReCharge widget identifier
            const widgetInput = document.createElement('input');
            widgetInput.type = 'hidden';
            widgetInput.name = `items[${index}][properties][_rc_widget]`;
            widgetInput.value = '1';
            addForm.appendChild(widgetInput);
            
            // Add subscription identifier
            const subscriptionInput = document.createElement('input');
            subscriptionInput.type = 'hidden';
            subscriptionInput.name = `items[${index}][properties][subscription_id]`;
            subscriptionInput.value = item.subscription.subscription_id || `sub_${Date.now()}_${index}`;
            addForm.appendChild(subscriptionInput);
            
            console.log('Added ReCharge subscription properties for:', item.name);
          }
        });
        
        // Add redirect to checkout
        const returnToInput = document.createElement('input');
        returnToInput.type = 'hidden';
        returnToInput.name = 'return_to';
        returnToInput.value = '/checkout';
        addForm.appendChild(returnToInput);
        
        // Check if we have subscription items and add discount code
        const hasSubscriptionItems = cartItemsForCheckout.some(item => item.subscription);
        // TEMPORARILY DISABLED: Uncomment after creating SUBSCRIBE15 discount code in Shopify Admin
        /*
        if (hasSubscriptionItems) {
          // Add subscription discount code
          const subscriptionDiscountInput = document.createElement('input');
          subscriptionDiscountInput.type = 'hidden';
          subscriptionDiscountInput.name = 'discount';
          subscriptionDiscountInput.value = 'SUBSCRIBE15'; // 15% discount code for subscriptions
          addForm.appendChild(subscriptionDiscountInput);
          console.log('Added subscription discount code: SUBSCRIBE15');
        }
        */
        
        // If bundle discount exists, add it to the checkout URL (this will override subscription discount if both exist)
        if (bundleDiscount && !hasSubscriptionItems) {
          const discountInput = document.createElement('input');
          discountInput.type = 'hidden';
          discountInput.name = 'discount';
          discountInput.value = bundleDiscount;
          addForm.appendChild(discountInput);
        }
        
        // Debug: Log form data before submission
        const formData = new FormData(addForm);
        console.log('Form data being submitted:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        // Submit the form
        document.body.appendChild(addForm);
        console.log('Submitting checkout form with subscription properties');
        addForm.submit();
      }, 500);
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        cartTotal, 
        isCartOpen, 
        addToCart, 
        addToCartSilent,
        removeFromCart, 
        updateQuantity, 
        clearCart,
        forceCleanCart,
        toggleCart,
        notification,
        checkout,
        discount,
        setDiscount
      }}
    >
      {children}
      
      {/* Toast Notification */}
      {notification.visible && (
        <div className="fixed bottom-5 right-5 bg-white rounded-lg shadow-lg p-4 max-w-xs z-50 transform transition-all duration-300 translate-y-0 opacity-100 flex items-center">
          {notification.product && notification.product.image && (
            <div className="w-10 h-10 bg-[#e0f5ed] rounded overflow-hidden mr-3 flex-shrink-0">
              <img src={notification.product.image} alt={notification.product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          )}
          <div className="flex-1 pr-2">
            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification({ visible: false, message: '', product: null })}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Discount Notification */}
      {discount && isCartOpen && (
        <div className="fixed top-[120px] left-0 right-0 flex justify-center z-50">
          <div className="bg-[#f8f0ff] border border-[#e0c6ff] rounded-lg p-3 mx-4 shadow-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7b2cbf] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-[#7b2cbf]">
                Discount code <span className="font-bold">{discount}</span> will be applied at checkout!
              </p>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export default CartContext; 