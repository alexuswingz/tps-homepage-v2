import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, ChevronDownIcon, XMarkIcon, Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import AnnouncementBar from './announcement-bar';

// Search results component for reuse
const MobileSearchResults = ({ closeMenus }) => (
  <div className="px-4 py-4">
    <h3 className="text-base font-medium text-gray-700 mb-5 text-center">POPULAR SEARCHES</h3>
    
    <div className="grid grid-cols-2 gap-4">
      {/* House Plants */}
      <Link 
        to={{
          pathname: "/products",
          state: { scrollToCategory: "House Plants" }
        }}
        className="flex flex-col items-center"
        onClick={closeMenus}
      >
        <div className="w-full aspect-square mb-2 overflow-hidden rounded">
          <img 
            src="/assets/Collection Tiles Images/Houseplants Tile.jpg" 
            alt="House Plants" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-medium text-gray-700 text-center">HOUSE PLANTS</span>
      </Link>
      
      {/* Lawn & Garden */}
      <Link 
        to={{
          pathname: "/products",
          state: { scrollToCategory: "Garden Products" }
        }} 
        className="flex flex-col items-center"
        onClick={closeMenus}
      >
        <div className="w-full aspect-square mb-2 overflow-hidden rounded">
          <img 
            src="/assets/Collection Tiles Images/Lawn and Garden Tile.jpg" 
            alt="Lawn & Garden" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-medium text-gray-700 text-center">LAWN & GARDEN</span>
      </Link>
      
      {/* Hydro & Aquatic */}
      <Link 
        to={{
          pathname: "/products",
          state: { scrollToCategory: "Hydro & Aquatic" }
        }}
        className="flex flex-col items-center"
        onClick={closeMenus}
      >
        <div className="w-full aspect-square mb-2 overflow-hidden rounded">
          <img 
            src="/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg" 
            alt="Hydro & Aquatic" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-medium text-gray-700 text-center">HYDRO & AQUATIC</span>
      </Link>
      
      {/* Specialty Supplements */}
      <Link 
        to={{
          pathname: "/products",
          state: { scrollToCategory: "Specialty Supplements" }
        }}
        className="flex flex-col items-center"
        onClick={closeMenus}
      >
        <div className="w-full aspect-square mb-2 overflow-hidden rounded">
          <img 
            src="/assets/Collection Tiles Images/Specialty Supplements Title.jpg" 
            alt="Specialty Supplements" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-medium text-gray-700 text-center">SPECIALTY SUPPLIES</span>
      </Link>
    </div>
    
    {/* All Products */}
    <div className="mt-10 py-4 border-t border-gray-200">
      <Link to="/products" className="flex items-center p-3" onClick={closeMenus}>
        <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-400">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </div>
        <span className="text-lg font-medium text-gray-700">BROWSE ALL PRODUCTS</span>
      </Link>
    </div>
    
    {/* Build a Bundle */}
    <div className="py-4 border-t border-gray-200">
      <Link to="/build-bundle" className="flex items-center p-3" onClick={closeMenus}>
        <div className="w-16 h-16 rounded overflow-hidden mr-4">
          <img 
            src="/assets/menu/Bundle Builder Tile.jpg" 
            alt="Build a Bundle" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-lg font-medium text-gray-700">BUILD A BUNDLE & SAVE $10</span>
      </Link>
    </div>
    
    {/* Blog */}
    <div className="py-4 border-t border-gray-200">
      <a href="#" className="flex items-center p-3" onClick={closeMenus}>
        <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-400">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
          </svg>
        </div>
        <span className="text-lg font-medium text-gray-700">BLOG: Learn to Grow</span>
      </a>
    </div>
    
    {/* Shop All Button */}
    <div className="py-6 pb-24">
      <Link 
        to="/products" 
        className="bg-[#ff6b57] hover:bg-[#ff5a43] text-white text-center py-3 px-6 rounded-full w-full block transition-colors font-medium text-lg"
        onClick={closeMenus}
      >
        BROWSE ALL PRODUCTS
      </Link>
    </div>
  </div>
);

const NavBar = () => {
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [hamburgerSearchActive, setHamburgerSearchActive] = useState(false);
  const [categoriesSearchActive, setCategoriesSearchActive] = useState(false);
  
  // Function to close all menus
  const closeAllMenus = () => {
    setShopMenuOpen(false);
    setMobileMenuOpen(false);
    setCategoriesMenuOpen(false);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setHamburgerSearchActive(false);
    setCategoriesSearchActive(false);
  };
  
  // Close other menus when search is opened in mobile
  const handleMobileSearchOpen = () => {
    setMobileSearchOpen(true);
    setMobileMenuOpen(false);
    setCategoriesMenuOpen(false);
    setHamburgerSearchActive(false);
  };

  // Close mobile search
  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
  };
  
  // Handle hamburger search focus
  const handleHamburgerSearchFocus = () => {
    setHamburgerSearchActive(true);
  };
  
  // Handle hamburger search close
  const handleHamburgerSearchClose = () => {
    setHamburgerSearchActive(false);
  };
  
  // Handle categories search focus
  const handleCategoriesSearchFocus = () => {
    setCategoriesSearchActive(true);
  };
  
  // Handle categories search close
  const handleCategoriesSearchClose = () => {
    setCategoriesSearchActive(false);
  };
  
  return (
    <>
      {/* Announcement Bar - Always visible */}
      <div className="fixed top-0 left-0 w-full z-50">
        <AnnouncementBar />
      </div>
      
      {/* Navbar - fixed position with top adjusted to position below announcement */}
      <nav className="bg-[#fffbef] w-full border-b border-gray-200 fixed top-[42px] z-40">
        {/* Desktop Navigation */}
        <div className="max-w-7xl mx-auto px-6 w-full hidden md:flex items-center justify-between py-5">
          <div className="flex items-center space-x-12">
            <div>
              <button 
                className="flex items-center text-olive-700 font-normal tracking-wide hover:text-olive-900 focus:outline-none"
                onClick={() => setShopMenuOpen(!shopMenuOpen)}
                onMouseEnter={() => setShopMenuOpen(true)}
              >
                SHOP <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <Link 
              to="/build-bundle" 
              className="text-olive-700 font-normal tracking-wide hover:text-olive-900 focus:outline-none"
              onClick={closeAllMenus}
            >
              BUILD A BUNDLE
            </Link>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" onClick={closeAllMenus}>
              <img 
                src="/assets/logo/TPS Basic TPS Leaf Light Tan.png" 
                alt="TPS Plant Foods" 
                className="h-[3.2rem]"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {searchOpen ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8 pr-4 py-1 border border-gray-300 rounded-full bg-[#fffbef] focus:outline-none focus:ring-1 focus:ring-olive-700 focus:border-olive-700 transition-all text-sm w-48"
                  autoFocus
                />
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 text-gray-500" />
                <button 
                  className="ml-2 text-gray-500 hover:text-olive-900"
                  onClick={() => setSearchOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                className="text-olive-700 hover:text-olive-900 focus:outline-none"
                onClick={() => setSearchOpen(true)}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            )}
            
            <button className="text-olive-700 hover:text-olive-900 focus:outline-none">
              <UserIcon className="h-6 w-6" />
            </button>
            
            <button className="text-olive-700 hover:text-olive-900 focus:outline-none relative">
              <ShoppingBagIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="w-full md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-5">
            {/* Hamburger/X Menu Toggle */}
            <button 
              className="text-olive-700 hover:text-olive-900 focus:outline-none"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setCategoriesMenuOpen(false);
                setMobileSearchOpen(false);
              }}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            
            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" onClick={closeAllMenus}>
                <img 
                  src="/assets/logo/TPS Basic TPS Leaf Light Tan.png" 
                  alt="TPS Plant Foods" 
                  className="h-[2.5rem]"
                />
              </Link>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-5">
              <button 
                className="text-olive-700 hover:text-olive-900 focus:outline-none"
                onClick={handleMobileSearchOpen}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              
              <button className="text-olive-700 hover:text-olive-900 focus:outline-none relative">
                <ShoppingBagIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop Dropdown menu - positioned below navbar */}
        <div 
          className="absolute z-40 left-0 right-0 w-full bg-[#fffbef] border-b border-gray-200 shadow-lg transition-all duration-300 hidden md:block"
          style={{ 
            top: '100%',
            opacity: shopMenuOpen ? 1 : 0,
            visibility: shopMenuOpen ? 'visible' : 'hidden'
          }}
          onMouseLeave={() => setShopMenuOpen(false)}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="py-6 grid grid-cols-10 gap-4">
              {/* Left Section - 30% */}
              <div className="col-span-3 flex flex-col space-y-4">
                {/* BROWSE ALL PRODUCTS */}
                <Link to="/products" className="flex items-center space-x-4 p-2 rounded-md transition" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/shop-all.PNG" 
                      alt="Browse All Products" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">BROWSE ALL PRODUCTS</span>
                </Link>
                
                {/* BUILD A BUNDLE */}
                <Link to="/build-bundle" className="flex items-center space-x-4 p-2 rounded-md transition" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/Bundle Builder Tile.jpg" 
                      alt="Build a Bundle" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">BUILD A BUNDLE & SAVE $10</span>
                </Link>
                
                {/* Divider */}
                <div className="border-t border-gray-300 my-2"></div>
                
                {/* BLOG */}
                <a href="#" className="flex items-center space-x-4 p-2 rounded-md transition" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/learn-to-grow.PNG" 
                      alt="Blog" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">BLOG: Learn to Grow</span>
                </a>
              </div>
              
              {/* Middle Section - 20% */}
              <div className="col-span-2 flex flex-col space-y-4">
                {/* LOGIN */}
                <a href="#" className="flex items-center space-x-4 p-2 rounded-md transition" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/login.PNG" 
                      alt="Login" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">LOGIN</span>
                </a>
                
                {/* SUPPORT */}
                <a href="#" className="flex items-center space-x-4 p-2 rounded-md transition" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/support.PNG" 
                      alt="Support" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">SUPPORT</span>
                </a>
              </div>
              
              {/* Right Section - 40% - Hero Banner */}
              <div className="col-span-4 col-start-7 relative overflow-hidden rounded-md h-auto" style={{ height: 'calc(100% - 1rem)' }}>
                <img 
                  src="/assets/menu/hero/Hero_Aquatic.jpg" 
                  alt="Summer Collection" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center p-4">
                  <h2 className="text-white text-2xl font-bold tracking-wider">GROW</h2>
                  <h2 className="text-white text-2xl font-bold tracking-wider">SOMETHING</h2>
                  <h2 className="text-white text-2xl font-bold tracking-wider mb-1">BEAUTIFUL</h2>
                  <p className="text-white text-xs font-medium mb-2">SHOP SUMMER COLLECTION</p>
                  <Link 
                    to="/products" 
                    className="bg-[#ff6b57] hover:bg-[#ff5a43] text-white text-center py-1.5 px-4 rounded-full w-auto text-sm transition-colors font-medium"
                    onClick={closeAllMenus}
                  >
                    BROWSE ALL
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below fixed header */}
      <div className="h-[107px] md:h-[120px]"></div>

      {/* Overlay to cover main content when mobile menu or search is active */}
      {(mobileMenuOpen || mobileSearchOpen) && (
        <div className="fixed inset-0 bg-[#fffbef] z-30 md:hidden" style={{ top: "107px" }}></div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-[#fffbef] overflow-y-auto z-40 md:hidden" style={{ top: "107px" }}>
          {/* Search Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button 
              onClick={handleMobileSearchClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="px-4 py-2 relative">
            <div className="relative">
              <input
                type="search"
                placeholder=""
                className="w-full bg-[#fffbef] py-2 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-base"
                autoFocus
              />
            </div>
          </div>
          
          <MobileSearchResults closeMenus={closeAllMenus} />
        </div>
      )}

      {/* Mobile Menu - Completely separate from the navbar */}
      {mobileMenuOpen && !categoriesMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-[#fffbef] overflow-y-auto z-40 md:hidden" style={{ top: "107px" }}>
          {/* Search Bar */}
          <div className="px-4 py-2 relative border-b border-gray-200">
            <div className="relative">
              <input
                type="search"
                placeholder=""
                className="w-full bg-[#fffbef] py-2 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-base"
                onFocus={handleHamburgerSearchFocus}
              />
            </div>
          </div>
          
          {/* When search is active, show search suggestions */}
          {hamburgerSearchActive ? (
            <div>
              {/* Close button */}
              <div className="flex justify-end px-4 py-2">
                <button 
                  onClick={handleHamburgerSearchClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <MobileSearchResults closeMenus={closeAllMenus} />
            </div>
          ) : (
            /* Menu Items */
            <div className="px-4 pb-24">
              {/* BROWSE ALL PRODUCTS */}
              <button 
                onClick={() => setCategoriesMenuOpen(true)}
                className="flex items-center justify-between w-full py-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/shop-all.PNG" 
                      alt="Browse All Products" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">BROWSE ALL PRODUCTS</span>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </button>
              
              {/* BUILD A BUNDLE */}
              <Link to="/build-bundle" className="flex items-center space-x-4 py-4" onClick={closeAllMenus}>
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="/assets/menu/Bundle Builder Tile.jpg" 
                    alt="Build a Bundle" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span className="font-medium text-gray-700 text-lg">BUILD A BUNDLE & SAVE $10</span>
              </Link>
              
              {/* First Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* BLOG */}
              <a href="#" className="flex items-center space-x-4 py-4" onClick={closeAllMenus}>
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="/assets/menu/learn-to-grow.PNG" 
                    alt="Blog" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span className="font-medium text-gray-700 text-lg">BLOG: Learn to Grow</span>
              </a>
              
              {/* Second Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* LOGIN */}
              <a href="#" className="flex items-center space-x-4 py-4" onClick={closeAllMenus}>
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="/assets/menu/login.PNG" 
                    alt="Login" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span className="font-medium text-gray-700 text-lg">LOGIN</span>
              </a>
              
              {/* SUPPORT */}
              <a href="#" className="flex items-center space-x-4 py-4" onClick={closeAllMenus}>
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="/assets/menu/support.PNG" 
                    alt="Support" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span className="font-medium text-gray-700 text-lg">SUPPORT</span>
              </a>
            </div>
          )}
          
          {/* Sticky Shop All Button - only show when regular menu is visible */}
          {!hamburgerSearchActive && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#fffbef] p-4 border-t border-gray-200">
              <Link 
                to="/products" 
                className="bg-[#ff6b57] hover:bg-[#ff5a43] text-white text-center py-3 px-6 rounded-full w-full block transition-colors font-medium text-lg"
                onClick={closeAllMenus}
              >
                BROWSE ALL PRODUCTS
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile Categories Submenu */}
      {mobileMenuOpen && categoriesMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-[#fffbef] overflow-y-auto z-40 md:hidden" style={{ top: "107px" }}>
          {/* Search Bar */}
          <div className="px-4 py-2 relative border-b border-gray-200">
            <div className="relative">
              <input
                type="search"
                placeholder=""
                className="w-full bg-[#fffbef] py-2 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-base"
                onFocus={handleCategoriesSearchFocus}
              />
            </div>
          </div>
          
          {/* When search is active, show search suggestions */}
          {categoriesSearchActive ? (
            <div>
              {/* Close button */}
              <div className="flex justify-end px-4 py-2">
                <button 
                  onClick={handleCategoriesSearchClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <MobileSearchResults closeMenus={closeAllMenus} />
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button 
                onClick={() => setCategoriesMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-4 text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              
              {/* Categories */}
              <div className="px-4 pb-24">
                {/* HOUSEPLANT */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "House Plants" }
                  }}
                  className="flex items-center space-x-4 py-4"
                  onClick={closeAllMenus}
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/Collection Tiles Images/Houseplants Tile.jpg" 
                      alt="Houseplant" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">HOUSEPLANT</span>
                </Link>
                
                {/* GARDEN PLANTS */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Garden Products" }
                  }} 
                  className="flex items-center space-x-4 py-4"
                  onClick={closeAllMenus}
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/Collection Tiles Images/Lawn and Garden Tile.jpg" 
                      alt="Garden Plants" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">GARDEN PLANTS</span>
                </Link>
                
                {/* HYDRO & AQUATIC */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Hydro & Aquatic" }
                  }}
                  className="flex items-center space-x-4 py-4"
                  onClick={closeAllMenus}
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/Collection Tiles Images/Hydro and Aquatic Collection Tile.jpg" 
                      alt="Hydro & Aquatic" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">HYDRO & AQUATIC</span>
                </Link>
                
                {/* PLANT SUPPLEMENTS */}
                <Link 
                  to={{
                    pathname: "/products",
                    state: { scrollToCategory: "Specialty Supplements" }
                  }}
                  className="flex items-center space-x-4 py-4"
                  onClick={closeAllMenus}
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/Collection Tiles Images/Specialty Supplements Title.jpg" 
                      alt="Plant Supplements" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">PLANT SUPPLEMENTS</span>
                </Link>
                
                {/* BUILD A BUNDLE */}
                <Link to="/build-bundle" className="flex items-center space-x-4 py-4" onClick={closeAllMenus}>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src="/assets/menu/Bundle Builder Tile.jpg" 
                      alt="Build A Bundle" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">BUILD A BUNDLE & SAVE $10</span>
                </Link>
              </div>
            </>
          )}
          
          {/* Sticky Shop All Button - only show when regular menu is visible */}
          {!categoriesSearchActive && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#fffbef] p-4 border-t border-gray-200">
              <Link 
                to="/products" 
                className="bg-[#ff6b57] hover:bg-[#ff5a43] text-white text-center py-3 px-6 rounded-full w-full block transition-colors font-medium text-lg"
                onClick={closeAllMenus}
              >
                BROWSE ALL PRODUCTS
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavBar;
