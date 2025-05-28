import React, { useState, useEffect } from 'react';

const DebugVariants = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);

  // Function to fetch products from Shopify Storefront API
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const query = `
        {
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
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
          const mappedProducts = result.data.products.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            variants: edge.node.variants.edges.map(variantEdge => ({
              id: variantEdge.node.id,
              title: variantEdge.node.title,
              price: parseFloat(variantEdge.node.price.amount),
              available: variantEdge.node.availableForSale,
              sku: variantEdge.node.sku,
              numericId: variantEdge.node.id.replace('gid://shopify/ProductVariant/', '')
            }))
          }));
          
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const testVariantInCart = async (variantId, productTitle, variantTitle) => {
    try {
      // Test adding to Shopify cart directly
      const checkoutDomain = 'https://checkout.tpsplantfoods.com';
      
      const formData = new FormData();
      formData.append('items[0][id]', variantId);
      formData.append('items[0][quantity]', '1');
      
      const response = await fetch(`${checkoutDomain}/cart/add.js`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        variantId,
        productTitle,
        variantTitle,
        success: response.ok,
        result: result,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        variantId,
        productTitle,
        variantTitle,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b57]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Variant IDs</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Products and Variants from Shopify</h2>
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-3">Product ID: {product.id}</p>
              <p className="text-sm text-gray-600 mb-3">Handle: {product.handle}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Variants:</h4>
                {product.variants.map(variant => (
                  <div key={variant.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{variant.title}</p>
                      <p className="text-sm text-gray-600">Full ID: {variant.id}</p>
                      <p className="text-sm text-gray-600">Numeric ID: {variant.numericId}</p>
                      <p className="text-sm text-gray-600">SKU: {variant.sku || 'No SKU'}</p>
                      <p className="text-sm text-gray-600">Price: ${variant.price}</p>
                      <p className={`text-sm ${variant.available ? 'text-green-600' : 'text-red-600'}`}>
                        {variant.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <button
                      onClick={() => testVariantInCart(variant.numericId, product.title, variant.title)}
                      className="bg-[#ff6b57] text-white px-4 py-2 rounded hover:bg-[#ff5a43] transition-colors"
                      disabled={!variant.available}
                    >
                      Test Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={clearTestResults}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{result.productTitle} - {result.variantTitle}</p>
                    <p className="text-sm text-gray-600">Variant ID: {result.variantId}</p>
                    <p className="text-sm text-gray-600">Time: {result.timestamp}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
                
                {result.error && (
                  <p className="text-sm text-red-600 mt-2">Error: {result.error}</p>
                )}
                
                {result.result && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">View Response</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. This page shows all products and variants from your Shopify store</li>
          <li>2. Click "Test Add to Cart" for any variant to test if it works with your checkout</li>
          <li>3. Green results mean the variant ID is valid and can be added to cart</li>
          <li>4. Red results indicate the variant ID doesn't work or doesn't exist</li>
          <li>5. Use the working variant IDs in your app to ensure checkout works</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugVariants; 