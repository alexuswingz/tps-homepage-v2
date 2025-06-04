// Standalone script to fetch and list all products from Shopify Storefront
// Configuration
const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

// Function to make API calls to Shopify Storefront API
const fetchFromStorefrontAPI = async (query) => {
  try {
    console.log("🔄 Making API request to Shopify Storefront...");
    
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      console.error(`❌ API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Received API response");
    return data;
  } catch (error) {
    console.error('❌ Error fetching from Shopify API:', error.message);
    return null;
  }
};

// Function to map and simplify product data
const mapProductFromShopify = (productEdge) => {
  const { node } = productEdge;
  
  // Extract image URLs
  const images = node.images.edges.map(edge => edge.node.transformedSrc);
  
  // Extract variants with key information
  const variants = node.variants.edges.map(edge => ({
    id: edge.node.id.replace('gid://shopify/ProductVariant/', ''),
    title: edge.node.title,
    price: parseFloat(edge.node.price.amount),
    available: edge.node.availableForSale,
    inventory: edge.node.quantityAvailable || 0,
    sku: edge.node.sku
  }));
  
  return {
    id: node.id.replace('gid://shopify/Product/', ''),
    fullId: node.id,
    title: node.title,
    description: node.description,
    tags: node.tags,
    productType: node.productType,
    vendor: node.vendor,
    handle: node.handle,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    images: images,
    variants: variants,
    availableVariants: variants.filter(v => v.available),
    totalInventory: variants.reduce((sum, v) => sum + v.inventory, 0),
    url: `https://n3mpgz-ny.myshopify.com/products/${node.handle}`
  };
};

// Function to fetch all products with pagination
const fetchAllProducts = async (cursor = null, allProducts = []) => {
  const query = `
    {
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
            tags
            productType
            vendor
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  transformedSrc
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
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
    
    if (result && result.data && result.data.products && result.data.products.edges) {
      const newProducts = [...allProducts, ...result.data.products.edges.map(mapProductFromShopify)];
      
      // If there are more pages, fetch them recursively
      if (result.data.products.pageInfo.hasNextPage) {
        console.log(`📦 Fetched ${newProducts.length} products so far, continuing...`);
        return fetchAllProducts(result.data.products.pageInfo.endCursor, newProducts);
      } else {
        console.log(`🎉 Finished fetching all products. Total: ${newProducts.length}`);
        return newProducts;
      }
    } else {
      console.error("❌ Invalid data structure returned from API");
      return allProducts;
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return allProducts;
  }
};

// Function to format and display product information
const displayProductSummary = (products) => {
  console.log("\n" + "=".repeat(80));
  console.log(`📊 PRODUCT SUMMARY FOR n3mpgz-ny.myshopify.com`);
  console.log("=".repeat(80));
  
  console.log(`\n📈 OVERVIEW:`);
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Available Products: ${products.filter(p => p.availableVariants.length > 0).length}`);
  console.log(`   Out of Stock: ${products.filter(p => p.availableVariants.length === 0).length}`);
  console.log(`   Total Inventory: ${products.reduce((sum, p) => sum + p.totalInventory, 0)} units`);
  
  // Group by product type
  const byType = products.reduce((acc, product) => {
    const type = product.productType || 'Uncategorized';
    if (!acc[type]) acc[type] = [];
    acc[type].push(product);
    return acc;
  }, {});
  
  console.log(`\n📋 BY PRODUCT TYPE:`);
  Object.entries(byType).forEach(([type, prods]) => {
    console.log(`   ${type}: ${prods.length} products`);
  });
  
  // Group by vendor
  const byVendor = products.reduce((acc, product) => {
    const vendor = product.vendor || 'Unknown';
    if (!acc[vendor]) acc[vendor] = [];
    acc[vendor].push(product);
    return acc;
  }, {});
  
  console.log(`\n🏭 BY VENDOR:`);
  Object.entries(byVendor).forEach(([vendor, prods]) => {
    console.log(`   ${vendor}: ${prods.length} products`);
  });
  
  // Price analysis
  const prices = products.map(p => p.price).filter(p => p > 0);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  console.log(`\n💰 PRICING ANALYSIS:`);
  console.log(`   Average Price: $${avgPrice.toFixed(2)}`);
  console.log(`   Lowest Price: $${minPrice.toFixed(2)}`);
  console.log(`   Highest Price: $${maxPrice.toFixed(2)}`);
};

// Function to display detailed product list
const displayDetailedProductList = (products) => {
  console.log("\n" + "=".repeat(120));
  console.log(`📝 DETAILED PRODUCT LIST`);
  console.log("=".repeat(120));
  
  products.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.title}`);
    console.log(`   ID: ${product.id} | Handle: ${product.handle}`);
    console.log(`   Price: $${product.price.toFixed(2)} ${product.currency} | Type: ${product.productType || 'N/A'} | Vendor: ${product.vendor || 'N/A'}`);
    console.log(`   Variants: ${product.variants.length} (${product.availableVariants.length} available)`);
    console.log(`   Inventory: ${product.totalInventory} units | Images: ${product.images.length}`);
    console.log(`   URL: ${product.url}`);
    
    if (product.tags.length > 0) {
      console.log(`   Tags: ${product.tags.join(', ')}`);
    }
    
    if (product.description) {
      const shortDesc = product.description.substring(0, 100);
      console.log(`   Description: ${shortDesc}${product.description.length > 100 ? '...' : ''}`);
    }
  });
};

// Function to export products to JSON format
const exportProductsToJSON = (products) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    store: 'n3mpgz-ny.myshopify.com',
    totalProducts: products.length,
    products: products
  };
  
  console.log("\n" + "=".repeat(80));
  console.log(`📄 JSON EXPORT (Copy and save to a .json file)`);
  console.log("=".repeat(80));
  console.log(JSON.stringify(exportData, null, 2));
};

// Main execution function
const main = async () => {
  console.log("🚀 Starting Shopify Product Fetch...");
  console.log(`🏪 Store: n3mpgz-ny.myshopify.com`);
  console.log(`🔑 Using Storefront Access Token: ${STOREFRONT_ACCESS_TOKEN.substring(0, 8)}...`);
  
  try {
    const products = await fetchAllProducts();
    
    if (products.length === 0) {
      console.log("❌ No products found or API error occurred.");
      return;
    }
    
    // Display summary
    displayProductSummary(products);
    
    // Ask user what they want to see (simulate choice - you can modify this)
    const showDetailed = true; // Set to true to see detailed list
    const showJSON = false;     // Set to true to see JSON export
    
    if (showDetailed) {
      displayDetailedProductList(products);
    }
    
    if (showJSON) {
      exportProductsToJSON(products);
    }
    
    console.log("\n🎯 QUICK ACCESS FUNCTIONS:");
    console.log("   To run this script in browser console:");
    console.log("   1. Open your website");
    console.log("   2. Open Developer Tools (F12)");
    console.log("   3. Go to Console tab");
    console.log("   4. Copy and paste this entire script");
    console.log("   5. Press Enter to execute");
    
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
  }
};

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchAllProducts,
    fetchFromStorefrontAPI,
    mapProductFromShopify,
    main
  };
} else {
  // If running in browser, auto-execute
  main();
} 