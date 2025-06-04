#!/usr/bin/env node

// Simple test script to check Shopify Storefront API connection
const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

const testConnection = async () => {
  console.log("🧪 Testing Shopify Storefront API Connection...");
  console.log(`🏪 Store: n3mpgz-ny.myshopify.com`);
  console.log(`🔑 Token: ${STOREFRONT_ACCESS_TOKEN.substring(0, 8)}...`);
  
  // Simple shop query
  const shopQuery = `
    {
      shop {
        name
        description
        primaryDomain {
          host
        }
        paymentSettings {
          currencyCode
        }
      }
    }
  `;
  
  // Simple products count query
  const productsQuery = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;
  
  try {
    // Test shop information
    console.log("\n🔍 Testing shop information query...");
    let fetch;
    try {
      fetch = globalThis.fetch;
    } catch {
      const { default: nodeFetch } = await import('node-fetch');
      fetch = nodeFetch;
    }
    
    const shopResponse = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: shopQuery })
    });
    
    console.log(`Shop query status: ${shopResponse.status}`);
    const shopData = await shopResponse.json();
    console.log("Shop data:", JSON.stringify(shopData, null, 2));
    
    // Test products query
    console.log("\n🔍 Testing products query...");
    const productsResponse = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: productsQuery })
    });
    
    console.log(`Products query status: ${productsResponse.status}`);
    const productsData = await productsResponse.json();
    console.log("Products data:", JSON.stringify(productsData, null, 2));
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

testConnection(); 