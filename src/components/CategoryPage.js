import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import ProductCard from './ProductCard';

// Import data files for categorization
import { houseplantProductNames, fetchAllHouseplantProducts } from '../data/houseplantProducts';
import { gardenProductNames, fetchAllGardenProducts } from '../data/gardenProducts';
import { hydroponicAquaticProductNames, fetchAllHydroponicAquaticProducts } from '../data/hydroponicAquaticProducts';
import { specialtySupplementNames, fetchAllSpecialtySupplements } from '../data/specialtySupplements';

// Category definitions matching the ShopByPlant component
const categories = [
  {
    name: "HOUSE PLANTS",
    image: "/assets/Collection Tiles Images/Houseplants Tile.jpg",
    category: "Houseplant Products"
  },
  {
    name: "LAWN & GARDEN",
    image: "/assets/Collection Tiles Images/Lawn and Garden Tile.jpg",
    category: "Garden Products"
  },
  {
    name: "HYDRO & AQUATIC",
    image: "/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg",
    category: "Hydrophonic and Aquatic"
  },
  {
    name: "SPECIALTY SUPPLEMENTS",
    image: "/assets/Collection Tiles Images/Specialty Supplements Title.jpg",
    category: "Plant Supplements"
  },
  {
    name: "CURATED BUNDLES",
    image: "/assets/menu/Bundle Builder Tile.jpg",
    category: "Curated Bundles"
  }
];

// Top 8 houseplant products in priority order
const TOP_HOUSEPLANT_PRODUCTS = [
  { name: "Monstera Plant Food", upc: "857611006538", priority: 1 },
  { name: "Indoor Plant Food", upc: "857611006521", priority: 2 },
  { name: "Fiddle Leaf Fig Plant Food", upc: "857611006583", priority: 3 },
  { name: "Christmas Cactus Fertilizer", upc: "810151950099", priority: 4 },
  { name: "Bird of Paradise Fertilizer", upc: "810151950365", priority: 5 },
  { name: "Fern Fertilizer", upc: "810151950334", priority: 6 },
  { name: "Orchid Fertilizer", upc: "857611006590", priority: 7 },
  { name: "Banana Tree Fertilizer", upc: "810151950006", priority: 8 }
];

// Get product names from data files by category
const getProductNamesByCategory = (category) => {
  const categoryProductNames = {
    "Houseplant Products": houseplantProductNames,
    "Garden Products": gardenProductNames,
    "Hydrophonic and Aquatic": hydroponicAquaticProductNames,
    "Plant Supplements": specialtySupplementNames
  };

  return categoryProductNames[category] || [];
};

// Filter products to ensure they belong to the correct category
const filterProductsByCategory = (products, category, targetNames = []) => {
  return products.filter(product => {
    const productName = product.name.toLowerCase();
    
    // First check if the product name matches any of our target names exactly
    if (targetNames.length > 0) {
      const isTargetProduct = targetNames.some(targetName => {
        const targetLower = targetName.toLowerCase();
        return productName.includes(targetLower) || 
               targetLower.includes(productName) ||
               productName === targetLower;
      });
      if (isTargetProduct) return true;
    }
    
    // Category-specific filtering with more precise rules
    switch (category) {
      case "Houseplant Products":
        return (
          productName.includes('indoor') ||
          productName.includes('houseplant') ||
          productName.includes('monstera') ||
          productName.includes('fiddle') ||
          productName.includes('christmas cactus') ||
          productName.includes('bird of paradise') ||
          productName.includes('succulent') ||
          productName.includes('snake plant') ||
          productName.includes('orchid') ||
          productName.includes('fern') ||
          productName.includes('bonsai') ||
          productName.includes('money tree') ||
          productName.includes('pothos') ||
          productName.includes('philodendron') ||
          productName.includes('african violet') ||
          productName.includes('air plant') ||
          productName.includes('peace lily')
        ) && !productName.includes('garden') && !productName.includes('lawn') && !productName.includes('outdoor');
        
      case "Garden Products":
        return (
          productName.includes('hydrangea') ||
          productName.includes('lemon tree') ||
          productName.includes('gardenia') ||
          productName.includes('hibiscus') ||
          productName.includes('arborvitae') ||
          productName.includes('citrus') ||
          productName.includes('tomato') ||
          productName.includes('rose') ||
          productName.includes('lawn') ||
          productName.includes('garden') ||
          productName.includes('tree') ||
          productName.includes('fruit') ||
          productName.includes('vegetable') ||
          productName.includes('outdoor')
        ) && !productName.includes('indoor') && !productName.includes('houseplant') && !productName.includes('hydroponic');
        
      case "Hydrophonic and Aquatic":
        return (
          productName.includes('liquid plant') ||
          productName.includes('lotus') ||
          productName.includes('hydroponic') ||
          productName.includes('aquatic') ||
          productName.includes('water plant') ||
          productName.includes('water garden')
        );
        
      case "Plant Supplements":
        return (
          productName.includes('ferrous sulfate') ||
          productName.includes('silica for plants') ||
          productName.includes('fish emulsion') ||
          productName.includes('calcium for plants') ||
          productName.includes('potassium fertilizer') ||
          productName.includes('supplement') ||
          productName.includes('nitrogen') ||
          productName.includes('phosphorus') ||
          productName.includes('root supplement') ||
          productName.includes('compost') ||
          productName.includes('seaweed')
        ) && !productName.includes('tree') && !productName.includes('garden');
        
      default:
        return false;
    }
  });
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to determine product priority for houseplant products
  const getProductPriority = (product) => {
    if (!product || !product.name) return 999; // Default priority for non-houseplant products

    const productName = product.name.toLowerCase();
    const productSku = product.sku?.toLowerCase() || '';
    
    // Check if this product matches any of the top 8 priority products
    const topProduct = TOP_HOUSEPLANT_PRODUCTS.find(topProd => {
      const nameMatch = productName.includes(topProd.name.toLowerCase()) || 
                       topProd.name.toLowerCase().includes(productName);
      const upcMatch = productSku.includes(topProd.upc) || 
                      product.variants?.some(variant => 
                        variant.sku?.includes(topProd.upc) || 
                        variant.upc?.includes(topProd.upc)
                      );
      return nameMatch || upcMatch;
    });

    return topProduct ? topProduct.priority : 999; // Return priority number or 999 for non-priority items
  };

  // Function to sort houseplant products with custom priority
  const sortHouseplantProducts = (products) => {
    return products.sort((a, b) => {
      const aPriority = getProductPriority(a);
      const bPriority = getProductPriority(b);
      
      // If both products have the same priority (both in top 8 or both not in top 8)
      if (aPriority === bPriority) {
        // If both are in top 8, maintain their priority order
        if (aPriority <= 8 && bPriority <= 8) {
          return aPriority - bPriority;
        }
        // If both are not in top 8, sort alphabetically
        return a.name.localeCompare(b.name);
      }
      
      // If one is priority and one is not, prioritize the one with lower priority number
      return aPriority - bPriority;
    });
  };

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const upcMatch = product.variants?.some(variant => 
          variant.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          variant.upc?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return nameMatch || upcMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  // Function to determine product category based on title and tags (reused from ProductsPage.js)
  const determineProductCategory = (title, tags) => {
    const titleLower = title.toLowerCase();
    const tagsLower = tags ? tags.map(tag => tag.toLowerCase()) : [];
    
    // Garden products from the provided list
    const gardenSpecificKeywords = [
      "bougainvillea", "camellia", "cut flower", "desert rose", "flowering", 
      "rose bush", "rose", "plumeria", "hydrangea", "hibiscus", 
      "azalea", "gardenia", "rhododendron", "petunia", "geranium", 
      "hanging basket", "daffodil", "tulip", "mum", "ixora", "bulb", 
      "lilac", "bloom", "berry", "pepper", "tomato", "strawberry", 
      "blueberry", "herbs", "leafy greens", "vegetable", "pumpkin", 
      "potato", "garlic", "water soluble", "garden", "outdoor",
      "all purpose", "npk", "starter", "10-10-10", "fall fertilizer", 
      "winter fertilizer", "lawn", "mycorrhizal fungi for trees",
      "mycorrhizal fungi for palm trees", "mycorrhizal fungi for gardens",
      "mycorrhizal fungi for citrus trees", "mycorrhizal fungi for palm", 
      "root booster", "soil microbes", "trichoderma",
      "peach tree", "olive tree", "mango tree", "lime tree", "evergreen",
      "arborvitae", "palm", "apple tree", "citrus", "fruit tree",
      "lemon tree", "avocado tree", "aspen tree", "boxwood",
      "crepe myrtle", "dogwood", "japanese maple", "magnolia",
      "maple tree", "oak tree", "orange tree", "pine tree", 
      "root stimulator for trees", "sago palm", "shrub"
    ];
    
    // Enhanced check for houseplant products
    const houseplantKeywords = [
      'money tree', 'jade', 'christmas cactus', 'cactus', 'succulent', 'bonsai', 
      'air plant', 'snake plant', 'house plant', 'houseplant', 
      'indoor plant', 'monstera', 'fiddle leaf', 'ficus', 'banana tree',
      'philodendron', 'dracaena', 'bird of paradise', 'aloe vera', 'zz plant',
      'tropical plant', 'pothos', 'bromeliad', 'african violet', 'alocasia',
      'anthurium', 'bamboo', 'brazilian wood', 'carnivorous plant', 'curry leaf',
      'elephant ear', 'hoya', 'lucky bamboo', 'orchid', 'peace lily', 'pitcher plant'
    ];
    
    // New keywords for hydro and aquatic products
    const hydroAquaticKeywords = [
      'hydro', 'aquatic', 'aquarium', 'pond', 'water garden', 'water plant', 
      'lotus', 'hydroponic', 'liquid plant food', 'water lily', 'aqua', 
      'fish tank', 'fish safe', 'water feature'
    ];
    
    // New keywords for specialty supplements
    const specialtyKeywords = [
      'supplement', 'booster', 'enhancer', 'stimulator', 'root supplement', 
      'mycorrhizal fungi', 'microbes', 'trichoderma', 'nutrient', 'bio stimulant',
      'probiotics', 'vitamins', 'kelp extract', 'worm castings', 'humic acid',
      'fulvic acid', 'silica'
    ];
    
    // New keywords for curated bundles
    const bundleKeywords = [
      'bundle', 'kit', 'collection', 'pack', 'set', 'combo', 'gift set',
      'starter kit', 'essentials', 'complete', 'package'
    ];

    // First check for bundles since they might contain other keywords
    if (
      bundleKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => bundleKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Curated Bundles";
    }
    
    // Check for hydro and aquatic products
    if (
      hydroAquaticKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => hydroAquaticKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Hydrophonic and Aquatic";
    }
    
    // Check for specialty supplements
    if (
      specialtyKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => specialtyKeywords.some(keyword => tag.includes(keyword)))
    ) {
      return "Plant Supplements";
    }
    
    // Check for garden products
    if (
      gardenSpecificKeywords.some(keyword => titleLower.includes(keyword)) ||
      titleLower.includes('garden') ||
      titleLower.includes('lawn') ||
      titleLower.includes('outdoor') ||
      titleLower.includes('tree fertilizer') ||
      titleLower.includes('rose') ||
      titleLower.includes('flower') ||
      tagsLower.some(tag => tag.includes('garden')) ||
      tagsLower.some(tag => tag.includes('outdoor')) ||
      tagsLower.some(tag => tag.includes('tree')) ||
      tagsLower.some(tag => tag.includes('lawn'))
    ) {
      return "Garden Products";
    }
    
    // Check for houseplant products
    if (
      houseplantKeywords.some(keyword => titleLower.includes(keyword)) ||
      tagsLower.some(tag => tag.includes('indoor')) ||
      tagsLower.some(tag => tag.includes('houseplant'))
    ) {
      return "Houseplant Products";
    }
    
    // General fertilizer check - if it includes fertilizer but hasn't been categorized yet
    if (titleLower.includes('fertilizer') || titleLower.includes('plant food')) {
      // Check typical garden vs indoor keywords
      if (
        titleLower.includes('outdoor') || 
        titleLower.includes('garden') ||
        titleLower.includes('tree') ||
        titleLower.includes('lawn') ||
        titleLower.includes('rose') ||
        titleLower.includes('vegetable') ||
        titleLower.includes('fruit')
      ) {
        return "Garden Products";
      } else if (
        titleLower.includes('indoor') || 
        titleLower.includes('house') ||
        titleLower.includes('houseplant')
      ) {
        return "Houseplant Products";
      }
      
      // Default fertilizer to Garden Products if no other match
      return "Garden Products";
    }
    
    // General default
    return "Houseplant Products";
  };

  // Function to map Shopify product data to our format (reused from ProductsPage.js)
  const mapProductFromShopify = ({ node }) => {
    // Extract all images (not just the first one)
    const images = node.images.edges.map(edge => ({
      src: edge.node.transformedSrc,
      alt: edge.node.altText || node.title,
      width: edge.node.width,
      height: edge.node.height
    }));
    
    // Extract the variants with their details
    const variants = node.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
      available: edge.node.availableForSale,
      quantity: edge.node.quantityAvailable || 0,
      sku: edge.node.sku || "",
      upc: edge.node.sku || "", // Assuming SKU contains UPC for now
      options: edge.node.selectedOptions || [],
      image: edge.node.image ? edge.node.image.transformedSrc : null
    }));
    
    // Find first available variant
    const availableVariants = variants.filter(variant => variant.available);
    const defaultVariant = availableVariants.length > 0 ? availableVariants[0] : (variants.length > 0 ? variants[0] : null);
    
    // Determine which category this product belongs to based on its title/tags
    let category = determineProductCategory(node.title, node.tags);
    
    // Map background colors for different product categories
    const backgroundColors = {
      "Houseplant Products": { light: "#e0f5ed", dark: "#d0f0e5" },
      "Garden Products": { light: "#e4f2d7", dark: "#d8ebc4" },
      "Hydrophonic and Aquatic": { light: "#d6eaf8", dark: "#c5ddf0" },
      "Plant Supplements": { light: "#f9e6d2", dark: "#f7d9b9" },
      "Curated Bundles": { light: "#f0e6f5", dark: "#e6d4f0" },
    };
    
    // Default background colors
    const defaultBackground = { light: "#e0f5ed", dark: "#d0f0e5" };
    const background = backgroundColors[category] || defaultBackground;
    
    const bestSeller = node.tags.some(tag => 
      tag.toLowerCase().includes('best') && tag.toLowerCase().includes('seller')
    );
    
    const reviewCount = Math.floor(Math.random() * 1500) + 50; // Random review count for demonstration
    
    return {
      id: node.id,
      name: node.title,
      description: "PLANT FOOD",
      image: images.length > 0 ? images[0].src : "/assets/products/indoor-plant-food.png",
      price: defaultVariant ? defaultVariant.price : (parseFloat(node.priceRange.minVariantPrice.amount) || 14.99),
      reviews: reviewCount,
      bestSeller: bestSeller,
      category: category,
      backgroundColorLight: background.light,
      variants: variants,
      sku: defaultVariant?.sku || ""
    };
  };

  // Function to make API calls to Shopify Storefront API using CORS proxy
  const fetchFromStorefrontAPI = async (query) => {
    // API URL for Shopify Storefront API
    const shopifyStorefrontUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
    
    try {
      console.log("Making API request to Shopify Storefront...");
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

  // Function to fetch products by category using data files
  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoading(true);
      console.log(`Fetching products for category: ${categoryName}`);

      let categoryProducts = [];
      
      // Use the data files to fetch products by category
      try {
        switch (categoryName) {
          case "Houseplant Products":
            categoryProducts = await fetchAllHouseplantProducts();
            break;
          case "Garden Products":
            categoryProducts = await fetchAllGardenProducts();
            break;
          case "Hydrophonic and Aquatic":
            categoryProducts = await fetchAllHydroponicAquaticProducts();
            break;
          case "Plant Supplements":
            categoryProducts = await fetchAllSpecialtySupplements();
            break;
          default:
            console.log(`No data file available for category: ${categoryName}`);
            categoryProducts = [];
        }
        
        // Get all product names for the category from data files
        const allProductNames = getProductNamesByCategory(categoryName);
        
        // Filter products to ensure they belong to the correct category
        if (categoryProducts.length > 0) {
          categoryProducts = filterProductsByCategory(categoryProducts, categoryName, allProductNames);
        }
        
        // Apply custom sorting for houseplant products
        if (categoryName === "Houseplant Products") {
          categoryProducts = sortHouseplantProducts(categoryProducts);
        }
        
        console.log(`Found ${categoryProducts.length} products for category ${categoryName}`);
        
        // If no products found with data files, try API fallback
        if (categoryProducts.length === 0) {
          console.log(`No products found with data files, trying API fallback for ${categoryName}`);
          await fetchProductsByLegacyAPI(categoryName);
        } else {
          setProducts(categoryProducts);
        }
        
      } catch (dataError) {
        console.error(`Error with data file fetch for ${categoryName}:`, dataError);
        // Fallback to legacy API method
        await fetchProductsByLegacyAPI(categoryName);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setLoading(false);
      setProducts([]);
    }
  };

  // Legacy API method as fallback
  const fetchProductsByLegacyAPI = async (categoryName) => {
    // Updated GraphQL query to fetch products
    const query = `
      {
        products(first: 100) {
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

    const result = await fetchFromStorefrontAPI(query);
    
    if (!result || !result.data) {
      console.error("API returned no data or invalid response");
      setProducts([]);
      return;
    }
    
    if (result.data.products && result.data.products.edges.length > 0) {
      // Map products to our format
      const allProducts = result.data.products.edges.map(mapProductFromShopify);
      
      // Filter products by the specified category
      let categoryProducts = allProducts.filter(product => 
        product.category === categoryName
      );
      
      // Apply custom sorting for houseplant products
      if (categoryName === "Houseplant Products") {
        categoryProducts = sortHouseplantProducts(categoryProducts);
      }
      
      console.log(`Found ${categoryProducts.length} products for category ${categoryName} via API fallback`);
      setProducts(categoryProducts);
    } else {
      console.log(`No products found for category ${categoryName}`);
      setProducts([]);
    }
  };

  // Get category info when component mounts
  useEffect(() => {
    if (categoryId) {
      const decodedCategoryId = decodeURIComponent(categoryId);
      
      // Find the category in our categories array
      const category = categories.find(cat => cat.category === decodedCategoryId);
      
      if (category) {
        setCategoryInfo(category);
        fetchProductsByCategory(decodedCategoryId);
      } else {
        console.error(`Category not found: ${decodedCategoryId}`);
        // Redirect to the main products page if category not found
        navigate('/products');
      }
    }
  }, [categoryId, navigate]);

  return (
    <section className="bg-[#fffbef]">
      {/* Category Banner */}
      {categoryInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-8">
          <Link 
            to="/products" 
            className="block relative rounded-lg overflow-hidden w-full h-48 sm:h-72 md:h-96 cursor-pointer"
          >
            <img 
              src={categoryInfo.image} 
              alt={categoryInfo.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${categoryInfo.image}`);
                e.target.src = "/assets/Collection Tiles Images/default-category.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                {categoryInfo.name}
              </h1>
              <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl drop-shadow-md">
                All Products
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Back to main products link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button 
          onClick={() => navigate('/products')} 
          className="inline-flex items-center text-[#ff6b57] hover:text-[#ff5a43] font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Collections
        </button>
      </div>

      {/* Search/Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by product name or UPC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff6b57] focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-center text-sm text-gray-600 mt-2">
            Showing {filteredProducts.length} results for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                isMobile={window.innerWidth < 640}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {searchTerm ? `No products found for "${searchTerm}"` : "No products available in this category"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#ff6b57] hover:text-[#ff5a43] font-medium"
              >
                Clear search
              </button>
            )}
            <button 
              onClick={() => navigate('/products')} 
              className="mt-4 ml-4 bg-[#ff6b57] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#ff5a43] transition-colors duration-200"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>

      {/* Add some bottom padding */}
      <div className="h-16 sm:h-20"></div>
    </section>
  );
};

export default CategoryPage; 