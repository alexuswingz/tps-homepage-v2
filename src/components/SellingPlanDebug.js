import React, { useState, useEffect } from 'react';

const SellingPlanDebug = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products with selling plans from Shopify Storefront API
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
    const fetchSellingPlans = async () => {
      setLoading(true);
      setError(null);

      const query = `
        {
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                sellingPlanGroups(first: 10) {
                  edges {
                    node {
                      name
                      appName
                      sellingPlans(first: 10) {
                        edges {
                          node {
                            id
                            name
                            description
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
                              orderCount
                            }
                            recurringDeliveries
                          }
                        }
                      }
                    }
                  }
                }
                variants(first: 5) {
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
          }
        }
      `;

      try {
        const result = await fetchFromStorefrontAPI(query);
        
        if (result?.errors) {
          console.error('GraphQL Errors:', result.errors);
          setError(`GraphQL Error: ${result.errors.map(e => e.message).join(', ')}`);
          setLoading(false);
          return;
        }
        
        if (result?.data?.products?.edges) {
          const productsWithSellingPlans = result.data.products.edges
            .map(edge => edge.node)
            .filter(product => product.sellingPlanGroups.edges.length > 0);
          
          setProducts(productsWithSellingPlans);
        } else {
          setError('No products found or API error');
        }
      } catch (err) {
        setError(`Error fetching selling plans: ${err.message}`);
      }
      
      setLoading(false);
    };

    fetchSellingPlans();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbef] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b57]"></div>
              <span className="ml-4">Loading selling plans...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbef] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Selling Plans Debug
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">About Selling Plans</h3>
            <p className="text-sm text-blue-700">
              Selling plans are required for ReCharge subscriptions. They define the subscription intervals, 
              discounts, and billing policies. If no selling plans are found, you need to:
            </p>
            <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside">
              <li>Install and configure the ReCharge app in your Shopify admin</li>
              <li>Create selling plans for your products</li>
              <li>Associate selling plans with specific products/variants</li>
            </ol>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold mb-2 text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-800">No Selling Plans Found</h3>
              <p className="text-sm text-yellow-700 mb-4">
                No products with selling plans were found in your store. This means:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>ReCharge app may not be properly installed</li>
                <li>No selling plans have been created yet</li>
                <li>Selling plans are not associated with products</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-100 rounded">
                <p className="text-sm font-medium text-yellow-800">Next Steps:</p>
                <ol className="text-sm text-yellow-700 mt-1 list-decimal list-inside">
                  <li>Go to your Shopify admin</li>
                  <li>Navigate to Apps → ReCharge</li>
                  <li>Create selling plans for your products</li>
                  <li>Return here to see the selling plan IDs</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold mb-2 text-green-800">
                  Found {products.length} Product(s) with Selling Plans
                </h3>
                <p className="text-sm text-green-700">
                  Use these selling plan IDs in your ReCharge integration.
                </p>
              </div>

              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{product.title}</h2>
                    <p className="text-sm text-gray-600">Handle: {product.handle}</p>
                    <p className="text-xs text-gray-500">Product ID: {product.id}</p>
                  </div>

                  {/* Variants */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.variants.edges.map(({ node: variant }) => (
                        <div key={variant.id} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{variant.title}</div>
                          <div className="text-gray-600">${variant.price.amount}</div>
                          <div className="text-xs text-gray-500">ID: {variant.id.replace('gid://shopify/ProductVariant/', '')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selling Plan Groups */}
                  {product.sellingPlanGroups.edges.map(({ node: group }) => (
                    <div key={group.id} className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-blue-900">{group.name}</h3>
                          <p className="text-sm text-blue-700">App: {group.appName}</p>
                          <p className="text-xs text-blue-600">Group ID: {group.id}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(group.id.replace('gid://shopify/SellingPlanGroup/', ''))}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Copy Group ID
                        </button>
                      </div>

                      {/* Selling Plans */}
                      <div className="space-y-3">
                        {group.sellingPlans.edges.map(({ node: plan }) => (
                          <div key={plan.id} className="p-3 bg-white rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{plan.name}</h4>
                                {plan.description && (
                                  <p className="text-sm text-gray-600">{plan.description}</p>
                                )}
                              </div>
                              <button
                                onClick={() => copyToClipboard(plan.id.replace('gid://shopify/SellingPlan/', ''))}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                Copy Plan ID
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {/* Plan Details */}
                              <div>
                                <p className="font-medium text-gray-700">Plan ID (Numeric):</p>
                                <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                                  {plan.id.replace('gid://shopify/SellingPlan/', '')}
                                </p>
                              </div>

                              {/* Price Adjustments */}
                              {plan.priceAdjustments.length > 0 && (
                                <div>
                                  <p className="font-medium text-gray-700">Discount:</p>
                                  {plan.priceAdjustments.map((adjustment, idx) => (
                                    <p key={idx} className="text-xs">
                                      {adjustment.adjustmentValue.adjustmentPercentage 
                                        ? `${adjustment.adjustmentValue.adjustmentPercentage}% off`
                                        : `$${adjustment.adjustmentValue.price?.amount} off`
                                      }
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Options */}
                            {plan.options.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium text-gray-700 text-sm">Options:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {plan.options.map((option, idx) => (
                                    <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                      {option.name}: {option.value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">How to Use These Selling Plan IDs</h3>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Copy the numeric selling plan ID (without the GraphQL prefix)</li>
              <li>Update your test data in <code>/test-recharge</code> with real selling plan IDs</li>
              <li>Associate the correct selling plan with the delivery interval (1, 2, or 3 months)</li>
              <li>Test the subscription flow again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingPlanDebug; 