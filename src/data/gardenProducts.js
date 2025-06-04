// Lawn and Garden product names for fetching from Shopify API
// Ordered by ranking based on user's product inventory

export const gardenProductNames = [
  // Top performers (Rank 1-10)
  "Hydrangea Fertilizer",
  "Lemon Tree Fertilizer", 
  "Gardenia Fertilizer",
  "Hibiscus Fertilizer",
  "Arborvitae Tree Fertilizer",
  "Plumeria Fertilizer",
  "Blueberry Fertilizer",
  "Bougainvillea Fertilizer",
  "Japanese Maple Fertilizer",
  "Strawberry Fertilizer",
  
  // High performers (Rank 11-20)
  "Lilac Bush Fertilizer",
  "Citrus Fertilizer",
  "Lime Tree Fertilizer",
  "Palm Tree Fertilizer",
  "Magnolia Tree Fertilizer",
  "Olive Tree Fertilizer",
  "Herb & Leafy Greens Plant Food",
  "Geranium Fertilizer",
  "Berry Fertilizer",
  "Crepe Myrtle Fertilizer",
  
  // Mid-tier performers (Rank 21-40)
  "Peach Tree Fertilizer",
  "Sago Palm Fertilizer",
  "Azalea Fertilizer",
  "Potato Fertilizer",
  "Jasmine Fertilizer",
  "Boxwood Fertilizer",
  "Tree Fertilizer",
  "Apple Tree Fertilizer",
  "Pepper Fertilizer",
  "Dogwood Tree Fertilizer",
  "Mango Tree Fertilizer",
  "Pine Tree Fertilizer",
  "Petunia Fertilizer",
  "desert rose fertilizer",
  "Rose Bush Fertilizer",
  "Oak Tree Fertilizer",
  "10-10-10 Fertilizer For Plants",
  "10-10-10 Fertilizer",
  "Avocado Tree Fertilizer",
  "Rhododendron Fertilizer",
  
  // Standard performers (Rank 41-60)
  "Bulb Fertilizer",
  "Fruit Tree Fertilizer",
  "Cut Flower Food",
  "Orange Tree Fertilizer",
  "Garlic Fertilizer",
  "10-10-10 Fertilizer For Vegetables",
  "Tomato Fertilizer",
  "Aspen Tree Fertilizer",
  "Rose Fertilizer",
  "Maple Tree Fertilizer",
  "Starter Fertilizer",
  "Ivy Plant Fertilizer",
  "Camellia Fertilizer",
  "10-10-10 Fertilizer For Trees",
  "Ixora Fertilizer",
  "Hanging Basket Plant Food",
  "Shrub Fertilizer",
  "Pumpkin Fertilizer",
  "Tulip Bulb Fertilizer",
  "Daffodil Bulb Fertilizer",
  
  // Core products (Rank 61-77)
  "All Purpose NPK Fertilizer",
  "Water Soluble Fertilizer",
  "Vegetable Fertilizer",
  "Mum Fertilizer",
  "Garden Fertilizer",
  "Bloom Fertilizer",
  "Flowering Plant Food",
  "Flower Fertilizer",
  "Plant Tomato",
  "Tree And Shrub Fertilizer",
  "Plant Fertilizer",
  "All Purpose Outdoor",
  "All Purpose Fertilizer",
  "Fall Fertilizer",
  "Lawn Fertilizer",
  "Winter Fertilizer",
  "Organic Tree Fertilizer"
];

// Helper function to get all garden products from Shopify
export const fetchAllGardenProducts = async () => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  return await fetchProductsByNames(gardenProductNames);
};

// Helper function to search for specific garden products
export const fetchGardenProductsByPattern = async (pattern) => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = gardenProductNames.filter(name => 
    name.toLowerCase().includes(pattern.toLowerCase())
  );
  return await fetchProductsByNames(matchingProducts);
};

// Helper functions for specific garden product categories
export const fetchTreeFertilizers = async () => {
  return await fetchGardenProductsByPattern('tree');
};

export const fetchFlowerFertilizers = async () => {
  const flowerPatterns = ['flower', 'rose', 'bloom', 'bulb'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = gardenProductNames.filter(name => 
    flowerPatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchVegetableFertilizers = async () => {
  const vegetablePatterns = ['vegetable', 'tomato', 'pepper', 'potato', 'garlic', 'herb'];
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = gardenProductNames.filter(name => 
    vegetablePatterns.some(pattern => name.toLowerCase().includes(pattern))
  );
  return await fetchProductsByNames(matchingProducts);
};

export const fetchAllPurposeFertilizers = async () => {
  return await fetchGardenProductsByPattern('all purpose');
};

export default gardenProductNames; 