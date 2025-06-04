#!/usr/bin/env node

// Node.js script to fetch all products from Shopify Storefront
// Usage: node scripts/fetchProducts.js [--format=json|csv|table] [--output=filename]

const fs = require('fs');
const path = require('path');

// Configuration
const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

// Parse command line arguments
const args = process.argv.slice(2);
const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'table';
const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

// Function to make API calls to Shopify Storefront API (Node.js compatible)
const fetchFromStorefrontAPI = async (query) => {
  try {
    console.log("🔄 Making API request to Shopify Storefront...");
    
    // Use node-fetch or fetch (Node 18+)
    let fetch;
    try {
      fetch = globalThis.fetch;
    } catch {
      // Fallback for older Node versions
      const { default: nodeFetch } = await import('node-fetch');
      fetch = nodeFetch;
    }
    
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

// Function to map product data
const mapProductFromShopify = (productEdge) => {
  const { node } = productEdge;
  
  const images = node.images.edges.map(edge => edge.node.transformedSrc);
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

// Format products as table
const formatAsTable = (products) => {
  console.log("\n" + "=".repeat(120));
  console.log(`📝 ALL PRODUCTS FROM n3mpgz-ny.myshopify.com`);
  console.log("=".repeat(120));
  
  console.log(`${'#'.padEnd(4)} ${'Title'.padEnd(40)} ${'Price'.padEnd(10)} ${'Type'.padEnd(20)} ${'Vendor'.padEnd(15)} ${'Stock'.padEnd(8)} ${'Variants'.padEnd(8)}`);
  console.log("-".repeat(120));
  
  products.forEach((product, index) => {
    const title = product.title.length > 37 ? product.title.substring(0, 37) + '...' : product.title;
    const type = (product.productType || 'N/A').length > 17 ? (product.productType || 'N/A').substring(0, 17) + '...' : (product.productType || 'N/A');
    const vendor = (product.vendor || 'N/A').length > 12 ? (product.vendor || 'N/A').substring(0, 12) + '...' : (product.vendor || 'N/A');
    
    console.log(
      `${String(index + 1).padEnd(4)} ${title.padEnd(40)} $${product.price.toFixed(2).padEnd(9)} ${type.padEnd(20)} ${vendor.padEnd(15)} ${String(product.totalInventory).padEnd(8)} ${String(product.variants.length).padEnd(8)}`
    );
  });
  
  console.log("-".repeat(120));
  console.log(`Total: ${products.length} products`);
};

// Format products as CSV
const formatAsCSV = (products) => {
  const headers = ['ID', 'Title', 'Price', 'Currency', 'Type', 'Vendor', 'Handle', 'Total_Inventory', 'Available_Variants', 'Total_Variants', 'Tags', 'URL'];
  
  let csv = headers.join(',') + '\n';
  
  products.forEach(product => {
    const row = [
      product.id,
      `"${product.title.replace(/"/g, '""')}"`, // Escape quotes in title
      product.price,
      product.currency,
      `"${(product.productType || '').replace(/"/g, '""')}"`,
      `"${(product.vendor || '').replace(/"/g, '""')}"`,
      product.handle,
      product.totalInventory,
      product.availableVariants.length,
      product.variants.length,
      `"${product.tags.join('; ').replace(/"/g, '""')}"`,
      product.url
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// Format products as JSON
const formatAsJSON = (products) => {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    store: 'n3mpgz-ny.myshopify.com',
    totalProducts: products.length,
    products: products
  }, null, 2);
};

// Main execution
const main = async () => {
  console.log("🚀 Shopify Product Fetcher");
  console.log(`🏪 Store: n3mpgz-ny.myshopify.com`);
  console.log(`📋 Format: ${format}`);
  if (outputFile) console.log(`📁 Output: ${outputFile}`);
  
  try {
    const products = await fetchAllProducts();
    
    if (products.length === 0) {
      console.log("❌ No products found or API error occurred.");
      return;
    }
    
    let output;
    
    switch (format.toLowerCase()) {
      case 'json':
        output = formatAsJSON(products);
        if (!outputFile) console.log(output);
        break;
      case 'csv':
        output = formatAsCSV(products);
        if (!outputFile) console.log(output);
        break;
      case 'table':
      default:
        formatAsTable(products);
        break;
    }
    
    // Save to file if specified
    if (outputFile && output) {
      const outputPath = path.resolve(outputFile);
      fs.writeFileSync(outputPath, output);
      console.log(`\n💾 Output saved to: ${outputPath}`);
    }
    
    // Summary
    console.log("\n📊 SUMMARY:");
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Available: ${products.filter(p => p.availableVariants.length > 0).length}`);
    console.log(`   Out of Stock: ${products.filter(p => p.availableVariants.length === 0).length}`);
    console.log(`   Total Inventory: ${products.reduce((sum, p) => sum + p.totalInventory, 0)} units`);
    
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    process.exit(1);
  }
};

// Show usage if help is requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 Shopify Product Fetcher

Usage: node scripts/fetchProducts.js [options]

Options:
  --format=FORMAT    Output format: table, json, csv (default: table)
  --output=FILE      Save output to file
  --help, -h         Show this help message

Examples:
  node scripts/fetchProducts.js
  node scripts/fetchProducts.js --format=json
  node scripts/fetchProducts.js --format=csv --output=products.csv
  node scripts/fetchProducts.js --format=json --output=products.json
`);
  process.exit(0);
}

// Run the script
main(); 