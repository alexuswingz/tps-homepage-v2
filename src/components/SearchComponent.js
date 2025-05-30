import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchComponent = ({   isDesktop = true,   isOpen,   setIsOpen,   onClose,   onCategoryClick, showMobileCloseButton = false}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showResults, setShowResults] = useState(false); // Track if results should be shown
  const [inputFocused, setInputFocused] = useState(false); // Track if input has been focused
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  // Focus input when search opens - now modified to prevent auto-focus
  useEffect(() => {
    // Removed auto-focus behavior
    // No longer auto-focusing when component opens
  }, [isOpen]);

  // Reset state when component unmounts or closes
  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setInputFocused(false); // Reset focus state when closed
    } else {
      setShowResults(true);
    }
  }, [isOpen]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        if (isOpen && onClose) {
          onClose();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Function to fetch search results from Shopify API
  const fetchSearchResults = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setLoading(true);
    setNoResults(false);
    
    try {
      // Shopify Storefront API details
      const shopifyStorefrontUrl = 'https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json';
      
      // GraphQL query to search for products based on title, tags, description
      const query = `
        query searchProducts($query: String!) {
          products(first: 10, query: $query) {
            edges {
              node {
                id
                title
                description
                tags
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      transformedSrc
                      altText
                    }
                  }
                }
                productType
                handle
              }
            }
          }
        }
      `;

      const response = await fetch(shopifyStorefrontUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'd5720278d38b25e4bc1118b31ff0f045',
        },
        body: JSON.stringify({
          query,
          variables: { query: searchTerm }
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const products = result.data?.products.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        description: node.description,
        image: node.images.edges[0]?.node.transformedSrc || '/assets/placeholder-image.jpg',
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        handle: node.handle,
        productType: node.productType,
        tags: node.tags
      })) || [];

      setSearchResults(products);
      setNoResults(products.length === 0);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
        setNoResults(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Group search results by type for better UI organization
  const groupedResults = searchResults.reduce((acc, product) => {
    const type = product.productType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (setIsOpen && !isOpen) {
      setIsOpen(true);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setInputFocused(true); // Set input as focused
    if (setIsOpen && !isOpen) {
      setIsOpen(true);
    }
    setShowResults(true);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setNoResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle search item click
  const handleSearchItemClick = () => {
    if (onClose) onClose();
    if (onCategoryClick) onCategoryClick(); // Close the entire menu structure
    setSearchTerm('');
    setShowResults(false);
  };

  // Get product ID without the Shopify prefix for routing
  const getProductId = (id) => {
    return id.replace('gid://shopify/Product/', '');
  };

  return (
    <div className={`${isDesktop ? 'relative' : 'w-full'}`}>
      {/* Search Input */}
      <div className="relative flex items-center">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          placeholder="Search products"
          className={`
            ${isDesktop 
              ? 'pl-8 pr-10 py-2 w-60 border border-gray-300 rounded-full bg-[#fffbef]' 
              : `w-full pl-6 ${showMobileCloseButton ? 'pr-10' : 'pr-4'} bg-[#fffbef] py-2 text-gray-700 text-lg`
            } 
            focus:outline-none focus:ring-1 focus:ring-olive-700 focus:border-olive-700 transition-all ${isDesktop ? 'text-sm' : ''}
          `}
          aria-label="Search products"
        />
        
        {isDesktop ? (
          <>
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 text-gray-500" />
            {searchTerm && (
              <button 
                className="absolute right-3 text-gray-500 hover:text-olive-900"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </>
        ) : (
          <>
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-0 text-gray-500" />
            {showMobileCloseButton ? (
              // Mobile search overlay close button
              <button 
                className="absolute right-2 text-gray-500 hover:text-gray-700 z-10"
                onClick={onClose}
                aria-label="Close search"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            ) : searchTerm ? (
              // Regular clear search button when there's text
              <button 
                className="absolute right-2 text-gray-500 hover:text-olive-900"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            ) : null}
          </>
        )}
      </div>

      {/* Search Results Dropdown - conditionally show when we have results or loading */}
      {isOpen && showResults && (
        <div 
          ref={searchResultsRef}
          className={`
            ${isDesktop 
              ? 'absolute mt-2 w-96 right-0 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg' 
              : 'w-full max-h-[calc(100vh-200px)] overflow-y-auto mt-4'
            }
            bg-[#fffbef] border border-gray-200 z-50
          `}
        >
          {/* Loading indicator */}
          {loading && (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#ff6b57]"></div>
              <p className="mt-2 text-gray-500">Searching products...</p>
            </div>
          )}

          {/* No results message */}
          {noResults && !loading && (
            <div className="p-6 text-center">
              <p className="text-gray-500">No products found for "{searchTerm}"</p>
              <Link 
                to="/products" 
                onClick={handleSearchItemClick}
                className="mt-4 inline-block bg-[#ff6b57] hover:bg-[#ff5a43] text-white py-2 px-4 rounded-full text-sm transition-colors"
              >
                Browse all products
              </Link>
            </div>
          )}

          {/* Display search results by group */}
          {!loading && searchResults.length > 0 && (
            <div className="p-4">
              {Object.entries(groupedResults).map(([type, products]) => (
                <div key={type} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase">{type}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {products.map(product => (
                      <Link 
                        key={product.id}
                        to={`/product/${getProductId(product.id)}`}
                        className="flex items-center p-2 hover:bg-gray-100 rounded-md transition"
                        onClick={handleSearchItemClick}
                      >
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-800 line-clamp-1">{product.title}</p>
                          <p className="text-[#ff6b57] font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Browse all link at bottom */}
              <div className="mt-4 text-center border-t border-gray-200 pt-4">
                <Link 
                  to="/products" 
                  className="inline-block bg-[#ff6b57] hover:bg-[#ff5a43] text-white py-2 px-4 rounded-full text-sm transition-colors"
                  onClick={handleSearchItemClick}
                >
                  View all products
                </Link>
              </div>
            </div>
          )}
          
          {/* Popular searches when no search term AND input has been focused */}
          {!searchTerm && !loading && inputFocused && (
            <div className="p-4">
              <h3 className="text-base font-medium text-gray-700 mb-3 text-center">POPULAR SEARCHES</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* House Plants */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "House Plants" }
                  }}
                  className="flex flex-col items-center"
                  onClick={handleSearchItemClick}
                >
                  <div className="w-full aspect-square mb-1 overflow-hidden rounded max-w-[100px] mx-auto">
                    <img 
                      src="/assets/Collection Tiles Images/Houseplants Tile.jpg" 
                      alt="House Plants" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">HOUSE PLANTS</span>
                </Link>
                
                {/* Lawn & Garden */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Garden Products" }
                  }} 
                  className="flex flex-col items-center"
                  onClick={handleSearchItemClick}
                >
                  <div className="w-full aspect-square mb-1 overflow-hidden rounded max-w-[100px] mx-auto">
                    <img 
                      src="/assets/Collection Tiles Images/Lawn and Garden Tile.jpg" 
                      alt="Lawn & Garden" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">LAWN & GARDEN</span>
                </Link>

                {/* Hydro & Aquatic */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Hydro & Aquatic" }
                  }}
                  className="flex flex-col items-center"
                  onClick={handleSearchItemClick}
                >
                  <div className="w-full aspect-square mb-1 overflow-hidden rounded max-w-[100px] mx-auto">
                    <img 
                      src="/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg" 
                      alt="Hydro & Aquatic" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">HYDRO & AQUATIC</span>
                </Link>
                
                {/* Specialty Supplements */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Specialty Supplements" }
                  }}
                  className="flex flex-col items-center"
                  onClick={handleSearchItemClick}
                >
                  <div className="w-full aspect-square mb-1 overflow-hidden rounded max-w-[100px] mx-auto">
                    <img 
                      src="/assets/Collection Tiles Images/Specialty Supplements Title.jpg" 
                      alt="Specialty Supplements" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">SPECIALTY SUPPLIES</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 