import React from 'react';
import ShopifyProductsLister from '../utils/shopifyProductsLister';

const AllProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ShopifyProductsLister />
    </div>
  );
};

export default AllProductsPage; 