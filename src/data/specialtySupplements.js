// Specialty Supplement product names for fetching from Shopify API
// Ordered by ranking based on user's product inventory

export const specialtySupplementNames = [
  // Top tier supplements (Rank 1-10)
  "Ferrous Sulfate For Plants",
  "Silica for Plants",
  "Fish Emulsion Fertilizer",
  "Calcium for Plants",
  "Potassium Fertilizer",
  "Calcium Nitrate Fertilizer",
  "Phosphorus and Potassium Fertilizer",
  "Nitrogen Fertilizer",
  "Cal-Mag Fertilizer",
  "Potassium Nitrate Fertilizer",
  
  // High performing supplements (Rank 11-20)
  "Fish Fertilizer",
  "Sulfur for Plants",
  "Seaweed Fertilizer",
  "Compost Starter",
  "Urea Fertilizer",
  "Compost Tea",
  "Potassium Sulfate Fertilizer",
  "Phosphorus Fertilizer",
  "Muriate Of Potash",
  "Sulfate Of Potash",
  
  // Core supplements (Rank 21-26)
  "Worm Casting Concentrate",
  "Magnesium for Plants",
  "Potash Fertilizer",
  "Kelp Meal",
  "Ammonium Nitrate Fertilizer",
  "pH Up - TPS"
];

// Helper function to get all specialty supplement products from Shopify
export const fetchAllSpecialtySupplements = async () => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  return await fetchProductsByNames(specialtySupplementNames);
};

// Helper function to search for specific specialty supplement products
export const fetchSpecialtySupplementsByPattern = async (pattern) => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    name.toLowerCase().includes(pattern.toLowerCase())
  );
  return await fetchProductsByNames(matchingProducts);
};

// Helper functions for specific nutrient categories
export const fetchNitrogenSupplements = async () => {
  const nitrogenPatterns = ['nitrogen', 'nitrate', 'ammonium', 'urea'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    nitrogenPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchPhosphorusSupplements = async () => {
  return await fetchSpecialtySupplementsByPattern('phosphorus');
};

export const fetchPotassiumSupplements = async () => {
  const potassiumPatterns = ['potassium', 'potash'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    potassiumPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchCalciumMagnesiumSupplements = async () => {
  const calMagPatterns = ['calcium', 'magnesium', 'cal-mag'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    calMagPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchOrganicSupplements = async () => {
  const organicPatterns = ['fish', 'seaweed', 'compost', 'worm', 'kelp'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    organicPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchMicronutrients = async () => {
  const microPatterns = ['silica', 'sulfur', 'ferrous'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = specialtySupplementNames.filter(name => 
    microPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchpHAdjusters = async () => {
  return await fetchSpecialtySupplementsByPattern('pH');
};

export default specialtySupplementNames; 