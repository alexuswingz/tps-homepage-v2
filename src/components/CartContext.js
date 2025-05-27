import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '', product: null });
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
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
  };

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
        cartItems.forEach((item, index) => {
          // Get variant ID without GraphQL prefix
          const variantId = item.variantId.replace('gid://shopify/ProductVariant/', '');
          
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
          
          // If item is a subscription, add ReCharge-specific properties
          if (item.subscription) {
            // Add selling plan
            const sellingPlanInput = document.createElement('input');
            sellingPlanInput.type = 'hidden';
            sellingPlanInput.name = `items[${index}][selling_plan]`;
            sellingPlanInput.value = item.subscription.selling_plan;
            addForm.appendChild(sellingPlanInput);
            
            // Add subscription properties
            const subscriptionInput = document.createElement('input');
            subscriptionInput.type = 'hidden';
            subscriptionInput.name = `items[${index}][properties][subscription_id]`;
            subscriptionInput.value = item.subscription.subscription_id;
            addForm.appendChild(subscriptionInput);
            
            // Add shipping interval frequency
            const freqInput = document.createElement('input');
            freqInput.type = 'hidden';
            freqInput.name = `items[${index}][properties][shipping_interval_frequency]`;
            freqInput.value = item.subscription.charge_interval_frequency;
            addForm.appendChild(freqInput);
            
            // Add shipping interval unit type
            const unitInput = document.createElement('input');
            unitInput.type = 'hidden';
            unitInput.name = `items[${index}][properties][shipping_interval_unit_type]`;
            unitInput.value = item.subscription.order_interval_unit;
            addForm.appendChild(unitInput);
            
            // Add ReCharge widget identifier
            const widgetInput = document.createElement('input');
            widgetInput.type = 'hidden';
            widgetInput.name = `items[${index}][properties][_rc_widget]`;
            widgetInput.value = '1';
            addForm.appendChild(widgetInput);

            // Add selling plan group ID
            const groupInput = document.createElement('input');
            groupInput.type = 'hidden';
            groupInput.name = `items[${index}][properties][selling_plan_group_id]`;
            groupInput.value = item.subscription.selling_plan_group_id;
            addForm.appendChild(groupInput);

            // Add discount percentage
            const discountInput = document.createElement('input');
            discountInput.type = 'hidden';
            discountInput.name = `items[${index}][properties][discount_percentage]`;
            discountInput.value = '15';
            addForm.appendChild(discountInput);
          }
        });
        
        // Add redirect to checkout
        const returnToInput = document.createElement('input');
        returnToInput.type = 'hidden';
        returnToInput.name = 'return_to';
        returnToInput.value = '/checkout';
        addForm.appendChild(returnToInput);

        // Add checkout type for subscriptions
        if (hasSubscription) {
          const checkoutTypeInput = document.createElement('input');
          checkoutTypeInput.type = 'hidden';
          checkoutTypeInput.name = 'checkout_type';
          checkoutTypeInput.value = 'subscription';
          addForm.appendChild(checkoutTypeInput);
        }
        
        // If bundle discount exists, add it to the checkout URL
        if (bundleDiscount) {
          const discountInput = document.createElement('input');
          discountInput.type = 'hidden';
          discountInput.name = 'discount';
          discountInput.value = bundleDiscount;
          addForm.appendChild(discountInput);
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
        removeFromCart, 
        updateQuantity, 
        clearCart,
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