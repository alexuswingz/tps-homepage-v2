import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const ProductCards = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: "INDOOR",
      description: "PLANT FOOD",
      image: "/assets/products/indoor-plant-food.png",
      price: 14.99,
      reviews: 1203,
      bestSeller: true,
      variants: [{ id: 'variant1', title: '8 Ounces', price: 14.99, available: true }]
    },
    {
      id: 2,
      name: "MONSTERA",
      description: "PLANT FOOD",
      image: "/assets/products/monstera-plant-food.png",
      price: 14.99,
      reviews: 1203,
      bestSeller: false,
      variants: [{ id: 'variant2', title: '8 Ounces', price: 14.99, available: true }]
    },
    {
      id: 3,
      name: "HERBS & LEAFY GREENS",
      description: "PLANT FOOD",
      image: "/assets/products/herbs-plant-food.png",
      price: 14.99,
      reviews: 299,
      bestSeller: false,
      variants: [{ id: 'variant3', title: '8 Ounces', price: 14.99, available: true }]
    },
    {
      id: 4,
      name: "FIDDLE LEAF FIG",
      description: "PLANT FOOD",
      image: "/assets/products/fiddle-leaf-fig-plant-food.png",
      price: 14.99,
      reviews: 1203,
      bestSeller: false,
      variants: [{ id: 'variant4', title: '8 Ounces', price: 14.99, available: true }]
    }
  ];

  const renderStars = () => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 text-[#ff6b57] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleAddToCart = (product, e) => {
    // Stop event propagation to prevent navigating when adding to cart
    e.stopPropagation();
    const variant = product.variants[0];
    addToCart(product, variant);
  };

  return (
    <section className="py-12 bg-[#fffbef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* First 4 products for all screen sizes */}
          {products.slice(0, 4).map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="block bg-gradient-to-br from-[#e0f5ed] to-[#d0f0e5] rounded-lg overflow-hidden shadow-sm relative hover:shadow-md transition-shadow"
            >
              {product.bestSeller && (
                <div className="absolute top-4 left-4 bg-[#ff6b57] text-white font-bold py-1 px-4 rounded-full text-sm">
                  BEST SELLER!
                </div>
              )}
              
              <div className="p-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-48 mx-auto mb-4"
                />
                
                <div className="flex items-center justify-between mb-2">
                  {renderStars()}
                  <span className="text-gray-600 text-sm">{product.reviews} reviews</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-xl font-bold text-gray-800 mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 border border-gray-300 rounded-l-full p-2 pl-4 bg-white">
                    <span className="font-medium">{product.variants[0].title}</span>
                  </div>
                  <div className="flex-1 border border-gray-300 rounded-r-full p-2 pr-4 bg-white text-right">
                    <span className="font-medium">${product.price}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  ADD TO CART
                </button>
              </div>
            </Link>
          ))}
          
          {/* SEE ALL card - visible only on mobile */}
          <div 
            className="block md:hidden rounded-lg overflow-hidden shadow-sm relative min-h-[400px] flex flex-col items-center justify-center"
            style={{
              backgroundImage: 'url("/assets/Collection Tiles Images/Houseplants Tile.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="z-10 text-center p-6">
              <h3 className="text-3xl font-bold text-white mb-8">Houseplants</h3>
              <button 
                className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full transition-colors shadow-md"
              >
                SEE ALL
              </button>
            </div>
          </div>
          
          {/* Extra products - hidden on mobile */}
          {products.length > 4 && products.slice(4).map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="hidden md:block bg-gradient-to-br from-[#e0f5ed] to-[#d0f0e5] rounded-lg overflow-hidden shadow-sm relative hover:shadow-md transition-shadow"
            >
              {product.bestSeller && (
                <div className="absolute top-4 left-4 bg-[#ff6b57] text-white font-bold py-1 px-4 rounded-full text-sm">
                  BEST SELLER!
                </div>
              )}
              
              <div className="p-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-48 mx-auto mb-4"
                />
                
                <div className="flex items-center justify-between mb-2">
                  {renderStars()}
                  <span className="text-gray-600 text-sm">{product.reviews} reviews</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-xl font-bold text-gray-800 mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 border border-gray-300 rounded-l-full p-2 pl-4 bg-white">
                    <span className="font-medium">{product.variants[0].title}</span>
                  </div>
                  <div className="flex-1 border border-gray-300 rounded-r-full p-2 pr-4 bg-white text-right">
                    <span className="font-medium">${product.price}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full bg-[#ff6b57] hover:bg-[#ff5a43] hover:shadow-md active:scale-[0.98] text-white font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  ADD TO CART
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCards; 