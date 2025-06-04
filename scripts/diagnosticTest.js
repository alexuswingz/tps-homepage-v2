#!/usr/bin/env node

// Comprehensive diagnostic script for Shopify Storefront API
const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

const runDiagnostics = async () => {
  console.log("🔍 COMPREHENSIVE SHOPIFY STOREFRONT API DIAGNOSTICS");
  console.log("=" .repeat(60));
  console.log(`🏪 Store: n3mpgz-ny.myshopify.com`);
  console.log(`🔑 Token: ${STOREFRONT_ACCESS_TOKEN.substring(0, 8)}...`);
  
  let fetch;
  try {
    fetch = globalThis.fetch;
  } catch {
    const { default: nodeFetch } = await import('node-fetch');
    fetch = nodeFetch;
  }

  const makeQuery = async (query, description) => {
    console.log(`\n🧪 ${description}...`);
    try {
      const response = await fetch(SHOPIFY_STOREFRONT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      
      if (data.errors) {
        console.log(`   ❌ Errors:`, JSON.stringify(data.errors, null, 4));
      }
      
      if (data.data) {
        console.log(`   ✅ Data:`, JSON.stringify(data.data, null, 4));
      }
      
      return data;
    } catch (error) {
      console.log(`   ❌ Request failed:`, error.message);
      return null;
    }
  };

  // Test 1: Basic shop info
  await makeQuery(`
    {
      shop {
        name
        description
        primaryDomain { host }
        paymentSettings { currencyCode }
      }
    }
  `, "Testing basic shop information");

  // Test 2: Simple products query
  await makeQuery(`
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            availableForSale
          }
        }
      }
    }
  `, "Testing simple products query (first 5)");

  // Test 3: Products with different parameters
  await makeQuery(`
    {
      products(first: 10, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            createdAt
            publishedAt
            availableForSale
            status
          }
        }
      }
    }
  `, "Testing products sorted by creation date");

  // Test 4: Search for products with query
  await makeQuery(`
    {
      products(first: 10, query: "*") {
        edges {
          node {
            id
            title
            handle
            publishedAt
            availableForSale
          }
        }
      }
    }
  `, "Testing products with wildcard search query");

  // Test 5: Check collections
  await makeQuery(`
    {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            productsCount
          }
        }
      }
    }
  `, "Testing collections query");

  // Test 6: Check specific product by handle (if you know one)
  await makeQuery(`
    {
      productByHandle(handle: "plant-food") {
        id
        title
        publishedAt
        availableForSale
      }
    }
  `, "Testing specific product by handle 'plant-food'");

  // Test 7: Check for any product variants
  await makeQuery(`
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            variants(first: 3) {
              edges {
                node {
                  id
                  title
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `, "Testing products with variants");

  // Test 8: Query with different availability filter
  await makeQuery(`
    {
      products(first: 10, query: "available_for_sale:true") {
        edges {
          node {
            id
            title
            availableForSale
          }
        }
      }
    }
  `, "Testing products available for sale");

  console.log("\n" + "=".repeat(60));
  console.log("🎯 DIAGNOSTIC SUMMARY & NEXT STEPS:");
  console.log("=".repeat(60));
  console.log(`
📋 POSSIBLE CAUSES IF NO PRODUCTS FOUND:

1. 🔒 PRODUCTS NOT PUBLISHED TO ONLINE STORE:
   • Go to Shopify Admin → Products
   • Select a product → Scroll to "Product availability"
   • Make sure "Online Store" is checked ✅

2. 📝 PRODUCTS IN DRAFT STATUS:
   • Check if products are saved as "Draft"
   • Change status to "Active" for published products

3. 🔑 STOREFRONT ACCESS TOKEN PERMISSIONS:
   • Go to Shopify Admin → Apps → Private apps
   • Check your private app's Storefront API permissions
   • Ensure "Read products, variants and collections" is enabled

4. 🌐 SALES CHANNEL CONFIGURATION:
   • Go to Settings → Sales channels
   • Make sure "Online Store" is properly configured

5. 📅 PUBLISHING DATE:
   • Products might be scheduled for future publishing
   • Check publishedAt dates in the responses above

6. 🏷️ PRODUCT VISIBILITY:
   • Some products might be set to "Hidden"
   • Check individual product visibility settings

🔧 IMMEDIATE ACTIONS TO TRY:

1. Pick any 1-2 products from your 200+ products
2. Go to each product in Shopify Admin
3. Scroll to "Product availability" section
4. Make sure "Online Store" is checked
5. Save the product
6. Wait 1-2 minutes for changes to propagate
7. Run this diagnostic script again

If you're still not seeing products after publishing them to Online Store,
the issue might be with the private app permissions or API access token.
`);
};

runDiagnostics(); 