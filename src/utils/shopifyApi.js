// Shopify Storefront API utility functions

const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

// Function to escape GraphQL query strings
const escapeGraphQLString = (str) => {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
};

// Base function to make requests to Shopify Storefront API
const fetchFromStorefrontAPI = async (query) => {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        'Origin': window.location.origin,
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('GraphQL query failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Shopify Storefront API:', error);
    throw error;
  }
};

// Function to map Shopify product node to our format
const mapShopifyProductNode = (productNode) => {
  // Extract all images with proper URL handling
  const images = productNode.images.edges.map(edge => {
    let imageUrl = edge.node.transformedSrc;
    
    // Ensure the image URL is properly formatted
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https:${imageUrl}`;
    }
    
    return {
      id: edge.node.id,
      url: imageUrl,
      alt: edge.node.altText || productNode.title,
      width: edge.node.width,
      height: edge.node.height
    };
  });
  
  // Extract variants with proper availability and quantity mapping
  const variants = productNode.variants.edges.map(edge => {
    const variant = edge.node;
    return {
      id: variant.id,
      title: variant.title,
      price: parseFloat(variant.price.amount),
      compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
      available: variant.availableForSale && variant.quantityAvailable > 0,
      quantity: variant.quantityAvailable || 0,
      sku: variant.sku || "",
      options: variant.selectedOptions || [],
      weight: variant.weight || 0,
      weightUnit: variant.weightUnit || "POUNDS"
    };
  });
  
  // Check if any variant is available
  const hasAvailableVariants = variants.some(variant => variant.available);
  
  // Find the first available variant or fallback to first variant
  const defaultVariant = variants.find(variant => variant.available) || variants[0];
  
  // Check for best seller tag
  const bestSeller = productNode.tags.some(tag => 
    tag.toLowerCase().includes('best') && tag.toLowerCase().includes('seller')
  );
  
  // Generate random review count for demo
  const reviewCount = Math.floor(Math.random() * 1500) + 50;
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
  
  // Get the primary image URL
  const primaryImageUrl = images.length > 0 ? images[0].url : "/assets/products/placeholder.png";
  
  return {
    id: productNode.id,
    name: productNode.title,
    description: productNode.description || "PLANT FOOD",
    image: primaryImageUrl,
    images: images,
    price: defaultVariant ? defaultVariant.price : parseFloat(productNode.priceRange.minVariantPrice.amount),
    reviews: reviewCount,
    rating: parseFloat(rating),
    bestSeller: bestSeller,
    variants: variants,
    handle: productNode.handle,
    vendor: productNode.vendor,
    tags: productNode.tags,
    createdAt: productNode.createdAt,
    updatedAt: productNode.updatedAt,
    hasAvailableVariants: hasAvailableVariants
  };
};

// Simple search query that's less likely to fail
const getSimpleSearchQuery = (searchTerm, limit = 50) => {
  return `
    query SimpleSearch {
      products(first: ${limit}, query: "${searchTerm}") {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            tags
            createdAt
            updatedAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  transformedSrc
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  weight
                  weightUnit
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};

// Fetch products with a simple, safe approach
export const fetchProductsByCategory = async (category) => {
  console.log(`Fetching products for category: ${category}`);
  
  // Define search terms for each category
  const categorySearchTerms = {
    "Houseplant Products": ["plant", "indoor", "houseplant"],
    "Garden Products": ["fertilizer", "garden", "outdoor"],
    "Hydrophonic and Aquatic": ["hydroponic", "aquatic", "water"],
    "Plant Supplements": ["supplement", "nutrient", "booster"]
  };
  
  const searchTerms = categorySearchTerms[category] || ["plant"];
  let allProducts = [];
  
  // Try each search term
  for (const searchTerm of searchTerms) {
    try {
      console.log(`Searching with term: "${searchTerm}"`);
      const query = getSimpleSearchQuery(searchTerm, 25);
      const result = await fetchFromStorefrontAPI(query);
      
      if (result.data?.products?.edges) {
        const products = result.data.products.edges
          .map(edge => mapShopifyProductNode(edge.node))
          .filter(product => product.hasAvailableVariants);
        
        allProducts.push(...products);
        console.log(`Found ${products.length} products for term "${searchTerm}"`);
      }
      
      // Small delay between searches
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error searching for "${searchTerm}":`, error);
      // Continue with next search term
    }
  }
  
  // Remove duplicates based on product ID
  const uniqueProducts = allProducts.filter((product, index, array) => 
    array.findIndex(p => p.id === product.id) === index
  );
  
  console.log(`Total unique products found: ${uniqueProducts.length}`);
  
  // If we didn't get enough products, return fallback data
  if (uniqueProducts.length < 5) {
    console.log('Using fallback data due to insufficient API results');
    return getFallbackProductsForCategory(category);
  }
  
  return uniqueProducts.slice(0, 20); // Limit to 20 products
};

// Comprehensive fallback data for each category
const getFallbackProductsForCategory = (category) => {
  const baseProducts = {
    "Houseplant Products": [
      {
        id: 'fallback-monstera',
        name: 'Monstera Plant Food',
        description: 'Premium nutrition for Monstera plants',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Monstera_8oz_Wrap.png',
        price: 14.99,
        reviews: 1458,
        rating: 4.9,
        bestSeller: true,
        variants: [
          { id: 'var-1', title: '8 Ounce', price: 14.99, available: true, quantity: 100 },
          { id: 'var-2', title: '32 Ounce', price: 24.99, available: true, quantity: 50 },
          { id: 'var-3', title: '128 Ounce', price: 59.99, available: true, quantity: 25 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-indoor',
        name: 'Indoor Plant Food',
        description: 'All-purpose indoor plant nutrition',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Indoor_8oz_Wrap.png',
        price: 14.99,
        reviews: 1203,
        rating: 4.8,
        bestSeller: true,
        variants: [
          { id: 'var-4', title: '8 Ounce', price: 14.99, available: true, quantity: 200 },
          { id: 'var-5', title: '32 Ounce', price: 24.99, available: true, quantity: 75 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-fiddle',
        name: 'Fiddle Leaf Fig Plant Food',
        description: 'Specialized nutrition for fiddle leaf figs',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Fiddle Leaf Fig_8oz_Wrap.png',
        price: 14.99,
        reviews: 987,
        rating: 4.8,
        bestSeller: false,
        variants: [
          { id: 'var-6', title: '8 Ounce', price: 14.99, available: true, quantity: 150 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-cactus',
        name: 'Christmas Cactus Fertilizer',
        description: 'Perfect for holiday cacti',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Christmas Cactus_8oz_Wrap.png',
        price: 14.99,
        reviews: 742,
        rating: 4.7,
        bestSeller: false,
        variants: [
          { id: 'var-7', title: '8 Ounce', price: 14.99, available: true, quantity: 120 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-bird',
        name: 'Bird of Paradise Fertilizer',
        description: 'Tropical plant nutrition',
        image: '/assets/products/TPS_8oz_Wrap_PNG/TPS_Bird of Paradise_8oz_Wrap.png',
        price: 14.99,
        reviews: 623,
        rating: 4.6,
        bestSeller: false,
        variants: [
          { id: 'var-8', title: '8 Ounce', price: 14.99, available: true, quantity: 90 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-succulent',
        name: 'Succulent Plant Food',
        description: 'Specialized for succulents and cacti',
        image: '/assets/products/indoor-plant-food.png',
        price: 14.99,
        reviews: 854,
        rating: 4.7,
        bestSeller: false,
        variants: [
          { id: 'var-9', title: '8 Ounce', price: 14.99, available: true, quantity: 110 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-snake',
        name: 'Snake Plant Fertilizer',
        description: 'Perfect for snake plants',
        image: '/assets/products/indoor-plant-food.png',
        price: 14.99,
        reviews: 567,
        rating: 4.6,
        bestSeller: false,
        variants: [
          { id: 'var-10', title: '8 Ounce', price: 14.99, available: true, quantity: 85 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-orchid',
        name: 'Orchid Fertilizer',
        description: 'Premium orchid nutrition',
        image: '/assets/products/indoor-plant-food.png',
        price: 16.99,
        reviews: 432,
        rating: 4.8,
        bestSeller: false,
        variants: [
          { id: 'var-11', title: '8 Ounce', price: 16.99, available: true, quantity: 70 }
        ],
        hasAvailableVariants: true
      }
    ],
    "Garden Products": [
      {
        id: 'fallback-rose',
        name: 'Rose Fertilizer',
        description: 'Premium nutrition for roses',
        image: '/assets/products/indoor-plant-food.png',
        price: 15.99,
        reviews: 892,
        rating: 4.8,
        bestSeller: true,
        variants: [
          { id: 'var-12', title: '8 Ounce', price: 15.99, available: true, quantity: 120 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-tomato',
        name: 'Tomato Fertilizer',
        description: 'Boost your tomato harvest',
        image: '/assets/products/indoor-plant-food.png',
        price: 14.99,
        reviews: 756,
        rating: 4.7,
        bestSeller: true,
        variants: [
          { id: 'var-13', title: '8 Ounce', price: 14.99, available: true, quantity: 150 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-citrus',
        name: 'Citrus Fertilizer',
        description: 'Perfect for citrus trees',
        image: '/assets/products/indoor-plant-food.png',
        price: 17.99,
        reviews: 634,
        rating: 4.6,
        bestSeller: false,
        variants: [
          { id: 'var-14', title: '8 Ounce', price: 17.99, available: true, quantity: 90 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-lawn',
        name: 'Lawn Fertilizer',
        description: 'Keep your grass green',
        image: '/assets/products/indoor-plant-food.png',
        price: 19.99,
        reviews: 523,
        rating: 4.5,
        bestSeller: false,
        variants: [
          { id: 'var-15', title: '32 Ounce', price: 19.99, available: true, quantity: 80 }
        ],
        hasAvailableVariants: true
      }
    ],
    "Hydrophonic and Aquatic": [
      {
        id: 'fallback-hydroponic',
        name: 'Hydroponic Plant Food',
        description: 'Complete hydroponic nutrition',
        image: '/assets/products/indoor-plant-food.png',
        price: 19.99,
        reviews: 345,
        rating: 4.7,
        bestSeller: true,
        variants: [
          { id: 'var-16', title: '8 Ounce', price: 19.99, available: true, quantity: 60 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-aquatic',
        name: 'Aquatic Plant Fertilizer',
        description: 'Safe for fish and plants',
        image: '/assets/products/indoor-plant-food.png',
        price: 16.99,
        reviews: 287,
        rating: 4.6,
        bestSeller: false,
        variants: [
          { id: 'var-17', title: '8 Ounce', price: 16.99, available: true, quantity: 45 }
        ],
        hasAvailableVariants: true
      }
    ],
    "Plant Supplements": [
      {
        id: 'fallback-root',
        name: 'Root Supplement',
        description: 'Strengthen root systems',
        image: '/assets/products/indoor-plant-food.png',
        price: 21.99,
        reviews: 234,
        rating: 4.8,
        bestSeller: true,
        variants: [
          { id: 'var-18', title: '8 Ounce', price: 21.99, available: true, quantity: 40 }
        ],
        hasAvailableVariants: true
      },
      {
        id: 'fallback-bloom',
        name: 'Bloom Booster',
        description: 'Enhance flowering',
        image: '/assets/products/indoor-plant-food.png',
        price: 18.99,
        reviews: 189,
        rating: 4.7,
        bestSeller: false,
        variants: [
          { id: 'var-19', title: '8 Ounce', price: 18.99, available: true, quantity: 35 }
        ],
        hasAvailableVariants: true
      }
    ]
  };
  
  return baseProducts[category] || baseProducts["Houseplant Products"];
};

// Legacy functions for compatibility
export const fetchProductByName = async (productName) => {
  try {
    const query = getSimpleSearchQuery(productName, 1);
    const result = await fetchFromStorefrontAPI(query);
    
    if (result.data?.products?.edges?.length > 0) {
      const productNode = result.data.products.edges[0].node;
      return mapShopifyProductNode(productNode);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product "${productName}":`, error);
    return null;
  }
};

export const fetchProductsByNames = async (productNames, batchSize = 10) => {
  if (!productNames || productNames.length === 0) {
    return [];
  }

  console.log(`Fetching ${productNames.length} products by name...`);
  let allProducts = [];
  
  // Process products in batches to avoid query size limits
  for (let i = 0; i < productNames.length; i += batchSize) {
    const batch = productNames.slice(i, i + batchSize);
    
    try {
      // Create a query that searches for exact product titles
      const titleQueries = batch.map(name => `title:"${escapeGraphQLString(name)}"`).join(' OR ');
      
      const query = `
        query FetchProductsByNames {
          products(first: ${batchSize}, query: "${titleQueries}") {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                description
                handle
                productType
                vendor
                tags
                createdAt
                updatedAt
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      id
                      transformedSrc
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      sku
                      availableForSale
                      quantityAvailable
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      weight
                      weightUnit
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      
      const result = await fetchFromStorefrontAPI(query);
      
      if (result.data?.products?.edges) {
        const batchProducts = result.data.products.edges
          .map(edge => mapShopifyProductNode(edge.node))
          .filter(product => product.hasAvailableVariants);
        
        allProducts.push(...batchProducts);
        console.log(`Batch ${Math.floor(i/batchSize) + 1}: Found ${batchProducts.length} products`);
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < productNames.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
    } catch (error) {
      console.error(`Error fetching batch starting at index ${i}:`, error);
      // Continue with next batch even if one fails
    }
  }
  
  // Sort products based on the original order in productNames
  const sortedProducts = allProducts.sort((a, b) => {
    const aIndex = productNames.findIndex(name => 
      a.name.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(a.name.toLowerCase())
    );
    const bIndex = productNames.findIndex(name => 
      b.name.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  
  console.log(`Successfully fetched ${sortedProducts.length} products total`);
  return sortedProducts;
};

export const searchProductsByName = async (searchTerm, limit = 50) => {
  try {
    const query = getSimpleSearchQuery(searchTerm, limit);
    const result = await fetchFromStorefrontAPI(query);
    
    if (result.data?.products?.edges) {
      return result.data.products.edges
        .map(edge => mapShopifyProductNode(edge.node))
        .filter(product => product.hasAvailableVariants);
    }
    
    return [];
  } catch (error) {
    console.error(`Error searching for products with term "${searchTerm}":`, error);
    return [];
  }
};

export const fetchAllProducts = async (cursor = null, allProducts = []) => {
  try {
    const query = `
      query GetAllProducts {
        products(first: 50${cursor ? `, after: "${cursor}"` : ''}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
              handle
              productType
              vendor
              tags
              createdAt
              updatedAt
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    transformedSrc
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    sku
                    availableForSale
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    weight
                    weightUnit
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    const result = await fetchFromStorefrontAPI(query);
    
    if (result.data?.products?.edges) {
      const newProducts = result.data.products.edges
        .map(edge => mapShopifyProductNode(edge.node))
        .filter(product => product.hasAvailableVariants);
      
      const combinedProducts = [...allProducts, ...newProducts];
      
      if (result.data.products.pageInfo.hasNextPage && combinedProducts.length < 100) {
        return fetchAllProducts(result.data.products.pageInfo.endCursor, combinedProducts);
      }
      
      return combinedProducts;
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return allProducts;
  }
};

// Utility functions
export const checkProductAvailability = (product) => {
  if (!product || !product.variants || product.variants.length === 0) {
    return { available: false, inStock: false, totalQuantity: 0 };
  }
  
  const availableVariants = product.variants.filter(variant => variant.available);
  const totalQuantity = product.variants.reduce((sum, variant) => sum + variant.quantity, 0);
  
  return {
    available: availableVariants.length > 0,
    inStock: totalQuantity > 0,
    totalQuantity: totalQuantity,
    availableVariants: availableVariants.length,
    totalVariants: product.variants.length
  };
};

export const getBestAvailableVariant = (product) => {
  if (!product || !product.variants || product.variants.length === 0) {
    return null;
  }
  
  const availableVariants = product.variants.filter(variant => variant.available);
  
  if (availableVariants.length === 0) {
    return product.variants[0];
  }
  
  const eightOzVariant = availableVariants.find(variant => 
    variant.title.toLowerCase().includes('8 oz') || 
    variant.title.toLowerCase().includes('8 ounce')
  );
  
  if (eightOzVariant) {
    return eightOzVariant;
  }
  
  return availableVariants.reduce((cheapest, current) => 
    current.price < cheapest.price ? current : cheapest
  );
}; 