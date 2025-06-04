import React, { useState, useEffect } from 'react';

// Configuration - matching your existing setup
const SHOPIFY_STOREFRONT_URL = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
const STOREFRONT_ACCESS_TOKEN = 'd5720278d38b25e4bc1118b31ff0f045';

// Function to make API calls to Shopify Storefront API
const fetchFromStorefrontAPI = async (query) => {
  try {
    console.log("Making API request to Shopify Storefront...");
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Origin': window.location.origin,
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received API response");
    return data;
  } catch (error) {
    console.error('Error fetching from Shopify API:', error.message);
    return null;
  }
};

// Function to map Shopify product data to a simplified format
const mapProductFromShopify = (productEdge) => {
  const { node } = productEdge;
  
  // Extract images
  const images = node.images.edges.map(edge => ({
    src: edge.node.transformedSrc,
    alt: edge.node.altText,
    width: edge.node.width,
    height: edge.node.height
  }));
  
  // Extract variants
  const variants = node.variants.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: parseFloat(edge.node.price.amount),
    available: edge.node.availableForSale,
    quantityAvailable: edge.node.quantityAvailable,
    sku: edge.node.sku,
    compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
    selectedOptions: edge.node.selectedOptions,
    image: edge.node.image ? {
      src: edge.node.image.transformedSrc,
      alt: edge.node.image.altText
    } : null
  }));
  
  return {
    id: node.id,
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
    totalInventory: variants.reduce((sum, v) => sum + (v.quantityAvailable || 0), 0)
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
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  sku
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    transformedSrc
                    altText
                  }
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
        console.log(`Fetched ${newProducts.length} products so far, continuing...`);
        return fetchAllProducts(result.data.products.pageInfo.endCursor, newProducts);
      } else {
        console.log(`Finished fetching all products. Total: ${newProducts.length}`);
        return newProducts;
      }
    } else {
      console.error("Invalid data structure returned from API");
      return allProducts;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return allProducts;
  }
};

// React component to display all products
const ShopifyProductsLister = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allProducts = await fetchAllProducts();
        setProducts(allProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'available') return matchesSearch && product.availableVariants.length > 0;
      if (filterBy === 'out-of-stock') return matchesSearch && product.availableVariants.length === 0;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'inventory':
          return b.totalInventory - a.totalInventory;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading all products from your Shopify store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg">Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">All Products from Your Shopify Store</h1>
        <p className="text-lg text-gray-600 mb-6">
          Found {products.length} total products from n3mpgz-ny.myshopify.com
        </p>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="title">Sort by Name</option>
            <option value="price">Sort by Price (Low to High)</option>
            <option value="price-desc">Sort by Price (High to Low)</option>
            <option value="inventory">Sort by Inventory</option>
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Products</option>
            <option value="available">Available Only</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
        
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedProducts.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price.toFixed(2)} {product.currency}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  product.availableVariants.length > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.availableVariants.length > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <p><strong>Vendor:</strong> {product.vendor}</p>
                <p><strong>Type:</strong> {product.productType}</p>
                <p><strong>Variants:</strong> {product.variants.length}</p>
                <p><strong>Available:</strong> {product.availableVariants.length}</p>
                <p><strong>Total Inventory:</strong> {product.totalInventory}</p>
              </div>
              
              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{product.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              {/* Product Handle/URL */}
              <p className="text-xs text-gray-500 truncate">
                Handle: {product.handle}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// Export the component and utility functions
export default ShopifyProductsLister;
export { fetchAllProducts, fetchFromStorefrontAPI, mapProductFromShopify }; 