import React, { useState } from 'react';
import { useCart } from './CartContext';

const TestReCharge = () => {
  const { addToCart, cartItems, checkout, forceCleanCart } = useCart();
  const [testStatus, setTestStatus] = useState('');

  // Real product data from your Shopify store
  const testProducts = [
    {
      id: 'gid://shopify/Product/9150573969637',
      name: 'CALCIUM NITRATE',
      description: 'PLANT FERTILIZER',
      image: '/assets/products/calcium-nitrate.png',
      price: 11.99,
      variants: [
        {
          id: 'gid://shopify/ProductVariant/46733511295205',
          title: '8 Ounce',
          price: 11.99,
          available: true,
          sku: 'TPS-CALCIUMNITRATE-8OZ'
        },
        {
          id: 'gid://shopify/ProductVariant/46733511327973',
          title: '32 Ounce',
          price: 19.99,
          available: true,
          sku: 'TPS-CALCIUMNITRATE-QUART'
        }
      ]
    },
    {
      id: 'gid://shopify/Product/9150574297317',
      name: 'WINTER FERTILIZER',
      description: 'PLANT FERTILIZER',
      image: '/assets/products/winter-fertilizer.png',
      price: 11.99,
      variants: [
        {
          id: 'gid://shopify/ProductVariant/46733511688421',
          title: '8 Ounce',
          price: 11.99,
          available: true,
          sku: 'TPS-WINTERFERTILIZER-8OZ'
        },
        {
          id: 'gid://shopify/ProductVariant/46733511721189',
          title: '32 Ounce',
          price: 24.99,
          available: true,
          sku: 'TPS-WINTERFERTILIZER-QUART'
        }
      ]
    },
    {
      id: 'gid://shopify/Product/9150574559461',
      name: 'WATER SOLUBLE FERTILIZER',
      description: 'PLANT FERTILIZER',
      image: '/assets/products/water-soluble-fertilizer.png',
      price: 11.99,
      variants: [
        {
          id: 'gid://shopify/ProductVariant/46733512081637',
          title: '8 Ounce',
          price: 11.99,
          available: true,
          sku: 'TPS-WATERSOLUBLE-8OZ'
        },
        {
          id: 'gid://shopify/ProductVariant/46733512114405',
          title: '32 Ounce',
          price: 24.99,
          available: true,
          sku: 'TPS-WATERSOLUBLE-QUART'
        }
      ]
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(testProducts[0]);
  const [selectedVariant, setSelectedVariant] = useState(testProducts[0].variants[0]);

  const handleAddSubscriptionToCart = () => {
    // Test subscription properties - removing selling_plan for now since we don't have valid IDs
    const subscriptionProps = {
      isSubscription: true,
      // selling_plan: '123456789', // Commented out - need real selling plan IDs from ReCharge
      // selling_plan_group_id: '987654321', // Commented out - need real selling plan group IDs
      charge_interval_frequency: 2,
      order_interval_frequency: 2,
      order_interval_unit: 'month',
      interval: 2,
      intervalUnit: 'month',
      discount: 15,
      subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      properties: {
        shipping_interval_frequency: 2,
        shipping_interval_unit_type: 'month',
        order_interval_frequency: 2,
        order_interval_unit: 'month',
        charge_interval_frequency: 2,
        discount_percentage: '15',
        subscription_id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        _rc_widget: '1'
      }
    };

    addToCart(selectedProduct, selectedVariant, 1, subscriptionProps);
    setTestStatus(`✅ Added ${selectedProduct.name} (${selectedVariant.title}) as SUBSCRIPTION to cart (without selling plan)`);
  };

  const handleAddOneTimeToCart = () => {
    addToCart(selectedProduct, selectedVariant, 1, null);
    setTestStatus(`✅ Added ${selectedProduct.name} (${selectedVariant.title}) as ONE-TIME purchase to cart`);
  };

  const handleTestCheckout = () => {
    if (cartItems.length === 0) {
      setTestStatus('❌ Cart is empty. Add some items first.');
      return;
    }
    
    setTestStatus('🔄 Testing checkout process...');
    
    // Log cart items for debugging
    console.log('Testing checkout with items:', cartItems);
    
    checkout();
  };

  const clearStatus = () => {
    setTestStatus('');
  };

  const clearCart = () => {
    // Use the improved cart clearing function from CartContext
    forceCleanCart();
    setTestStatus('✅ Cart cleared successfully');
  };

  const simulateCheckoutCompletion = () => {
    // Simulate checkout completion by setting localStorage flag
    localStorage.setItem('checkoutCompleted', 'true');
    setTestStatus('🔄 Simulating checkout completion...');
    
    // Trigger storage event to test cross-tab clearing
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'checkoutCompleted',
      newValue: 'true',
      oldValue: null
    }));
    
    setTimeout(() => {
      setTestStatus('✅ Checkout completion simulated - cart should be cleared');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#fffbef] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            ReCharge Integration Test
          </h1>
          
          {/* Product Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Test Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedVariant(product.variants[0]);
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedProduct.id === product.id
                      ? 'border-[#FF6B57] bg-[#FFF2F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600">{product.description}</p>
                  <p className="text-sm font-bold text-[#FF6B57]">${product.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Variant</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedProduct.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedVariant.id === variant.id
                      ? 'border-[#FF6B57] bg-[#FFF2F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold">{variant.title}</h3>
                  <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                  <p className="text-lg font-bold text-[#FF6B57]">${variant.price}</p>
                  <p className="text-xs text-gray-500">ID: {variant.id.replace('gid://shopify/ProductVariant/', '')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleAddOneTimeToCart}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Add One-Time Purchase
            </button>
            
            <button
              onClick={handleAddSubscriptionToCart}
              className="bg-[#FF6B57] hover:bg-[#FF5A43] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Add Subscription (15% off)
            </button>
          </div>

          {/* Checkout Test */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Test Checkout Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <button
                onClick={handleTestCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Test Checkout
              </button>
              
              <button
                onClick={clearCart}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
              
              <button
                onClick={simulateCheckoutCompletion}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Simulate Checkout Complete
              </button>
            </div>
            
            {/* Cart Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Cart ({cartItems.length} items):</h3>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <ul className="space-y-2">
                  {cartItems.map((item, index) => (
                    <li key={index} className="text-sm">
                      <strong>{item.name}</strong> ({item.variantTitle}) - ${item.price} x {item.quantity}
                      {item.subscription && (
                        <span className="ml-2 text-[#FF6B57] font-medium">
                          [SUBSCRIPTION - {item.subscription.discount}% off]
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Status Display */}
          {testStatus && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-blue-800">{testStatus}</p>
                <button
                  onClick={clearStatus}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Debug Information */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <div className="text-sm space-y-1">
              <p><strong>Selected Product ID:</strong> {selectedProduct.id}</p>
              <p><strong>Selected Variant ID:</strong> {selectedVariant.id}</p>
              <p><strong>Numeric Variant ID:</strong> {selectedVariant.id.replace('gid://shopify/ProductVariant/', '')}</p>
              <p><strong>SKU:</strong> {selectedVariant.sku}</p>
              <p><strong>Checkout Domain:</strong> https://checkout.tpsplantfoods.com</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">Testing Instructions</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Select a product and variant above</li>
              <li>Add items to cart (try both one-time and subscription)</li>
              <li>Click "Test Checkout" to test the checkout process (cart will be cleared automatically)</li>
              <li>Use "Clear Cart" to manually clear the cart at any time</li>
              <li>Use "Simulate Checkout Complete" to test the checkout completion detection</li>
              <li>Check browser console for detailed logs</li>
              <li>Verify that the checkout redirects properly to your Shopify checkout</li>
              <li>After real checkout completion, cart should remain empty when returning to the site</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReCharge; 