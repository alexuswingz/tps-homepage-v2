import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '', product: null });

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Update cart total and count whenever cartItems changes
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);
    
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    // Ensure quantity is at least 1
    const qty = Math.max(1, parseInt(quantity) || 1);
    
    // Check variant has available quantity
    const maxAvailable = variant.quantity || 999; // Fallback to large number if not specified
    const safeQty = Math.min(qty, maxAvailable);
    
    setCartItems(prevItems => {
      // Check if this item is already in the cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.variantId === variant.id
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
        showNotification(`${product.name} added to your cart!`, product);
        
        return [...prevItems, {
          id: product.id,
          name: product.name,
          image: product.image,
          price: variant.price,
          variantId: variant.id,
          variantTitle: variant.title,
          quantity: safeQty,
          maxQuantity: maxAvailable // Store max available for later reference
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

  const removeFromCart = (itemId, variantId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === itemId && item.variantId === variantId))
    );
  };

  const updateQuantity = (itemId, variantId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId && item.variantId === variantId) {
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
        notification
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
    </CartContext.Provider>
  );
};

export default CartContext; 