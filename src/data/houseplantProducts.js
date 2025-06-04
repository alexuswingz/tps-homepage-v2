// Houseplant product names for fetching from Shopify API
// Ordered by ranking based on user's product inventory

export const houseplantProductNames = [
  // Rank 1-10
  "Monstera Plant Food",
  "Indoor Plant Food", 
  "Fiddle Leaf Fig Plant Food",
  "Christmas Cactus Fertilizer",
  "Bird of Paradise Fertilizer",
  "Fern Fertilizer",
  "Orchid Fertilizer", 
  "Banana Tree Fertilizer",
  "Bonsai Fertilizer",
  "Money Tree Fertilizer",
  
  // Rank 11-20
  "Succulent Plant Food",
  "Ficus Tree Fertilizer",
  "Snake Plant Fertilizer",
  "Tropical Plant Fertilizer",
  "peace lily fertilizer",
  "African Violet Fertilizer",
  "Air Plant Fertilizer",
  "Pothos Fertilizer",
  "Cactus Fertilizer",
  "Philodendron Fertilizer",
  
  // Rank 21-30
  "curry leaf plant fertilizer",
  "Elephant Ear Fertilizer",
  "hoya fertilizer",
  "House Plant Food",
  "ZZ Plant Fertilizer",
  "Jade Fertilizer",
  "Lucky Bamboo Fertilizer",
  "Root Supplement Orchids",
  "Aloe Vera Plant Food",
  "Brazilian Wood Plant Food",
  
  // Rank 31-42
  "Dracaena Fertilizer",
  "Alocasia Fertilizer",
  "Pitcher Plant Food",
  "Bromeliad Fertilizer",
  "Root Supplement Succulents",
  "anthurium fertilizer",
  "Root Supplement Fiddle Leaf Figs",
  "Carnivorous Plant Food",
  "Bamboo Plant Food",
  "Root Supplement Monsteras",
  "Instant plant food",
  "Root Supplement Houseplants"
];

// Helper function to get all houseplant products from Shopify
export const fetchAllHouseplantProducts = async () => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  return await fetchProductsByNames(houseplantProductNames);
};

// Helper function to search for specific houseplant products
export const fetchHouseplantProductsByPattern = async (pattern) => {
  const { fetchProductsByNames } = await import('../utils/shopifyApi');
  const matchingProducts = houseplantProductNames.filter(name => 
    name.toLowerCase().includes(pattern.toLowerCase())
  );
  return await fetchProductsByNames(matchingProducts);
};

export default houseplantProductNames; 