// Hydroponic and Aquatic product names for fetching from Shopify API
// Ordered by ranking based on user's product inventory

export const hydroponicAquaticProductNames = [
  // Rank 1-7 (all hydroponic and aquatic products)
  "Liquid Plant Food",
  "Lotus Fertilizer",
  "Hydroponic Nutrients",
  "Aquatic Plant Fertilizer",
  "Water Plant Fertilizer",
  "Hydroponic Plant Food",
  "Water Garden Fertilizer"
];

// Helper function to get all hydroponic and aquatic products from Shopify
export const fetchAllHydroponicAquaticProducts = async () => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  return await fetchProductsByNames(hydroponicAquaticProductNames);
};

// Helper function to search for specific hydroponic and aquatic products
export const fetchHydroponicAquaticProductsByPattern = async (pattern) => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = hydroponicAquaticProductNames.filter(name => 
    name.toLowerCase().includes(pattern.toLowerCase())
  );
  return await fetchProductsByNames(matchingProducts);
};

export default hydroponicAquaticProductNames; 