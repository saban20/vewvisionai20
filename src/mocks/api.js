/**
 * Mock API Service
 * This file provides mock API responses for development and testing.
 */

// Mock eyewear products data
const mockProducts = [
  {
    id: 1,
    name: "Modern Square Glasses",
    brand: "VisionElite",
    price: 129.99,
    frameShape: "Square",
    frameMaterial: "Acetate",
    lensType: "Blue Light Filter",
    color: "Black",
    imageUrl: "https://picsum.photos/id/1/300/300",
    rating: 4.5,
    gender: "Unisex",
    faceShapes: ["Round", "Oval", "Heart"]
  },
  {
    id: 2,
    name: "Classic Round Eyewear",
    brand: "OpticalPrime",
    price: 149.99,
    frameShape: "Round",
    frameMaterial: "Metal",
    lensType: "Photochromic",
    color: "Gold",
    imageUrl: "https://picsum.photos/id/20/300/300",
    rating: 4.8,
    gender: "Unisex",
    faceShapes: ["Square", "Rectangle", "Diamond"]
  },
  {
    id: 3,
    name: "Cat Eye Designer Frames",
    brand: "LuxVision",
    price: 189.99,
    frameShape: "Cat Eye",
    frameMaterial: "Acetate",
    lensType: "Polarized",
    color: "Tortoise",
    imageUrl: "https://picsum.photos/id/26/300/300",
    rating: 4.6,
    gender: "Women",
    faceShapes: ["Round", "Square", "Diamond"]
  },
  {
    id: 4,
    name: "Aviator Sunglasses",
    brand: "SunPro",
    price: 159.99,
    frameShape: "Aviator",
    frameMaterial: "Metal",
    lensType: "Polarized",
    color: "Silver",
    imageUrl: "https://picsum.photos/id/21/300/300",
    rating: 4.7,
    gender: "Men",
    faceShapes: ["Oval", "Heart", "Diamond"]
  },
  {
    id: 5,
    name: "Rectangular Titanium Frames",
    brand: "VisionElite",
    price: 199.99,
    frameShape: "Rectangle",
    frameMaterial: "Titanium",
    lensType: "Progressive",
    color: "Gray",
    imageUrl: "https://picsum.photos/id/22/300/300",
    rating: 4.9,
    gender: "Men",
    faceShapes: ["Round", "Oval", "Heart"]
  },
  {
    id: 6,
    name: "Oval Designer Frames",
    brand: "LuxVision",
    price: 179.99,
    frameShape: "Oval",
    frameMaterial: "Acetate",
    lensType: "Single Vision",
    color: "Burgundy",
    imageUrl: "https://picsum.photos/id/24/300/300",
    rating: 4.4,
    gender: "Women",
    faceShapes: ["Square", "Rectangle", "Diamond"]
  }
];

// Mock filter options
const mockFilterOptions = {
  brands: ["VisionElite", "OpticalPrime", "LuxVision", "SunPro"],
  frameShapes: ["Square", "Round", "Cat Eye", "Aviator", "Rectangle", "Oval"],
  frameMaterials: ["Acetate", "Metal", "Titanium", "Plastic"],
  lensTypes: ["Single Vision", "Progressive", "Bifocal", "Blue Light Filter", "Polarized", "Photochromic"],
  colors: ["Black", "Gold", "Silver", "Tortoise", "Gray", "Burgundy", "Blue"],
  genders: ["Men", "Women", "Unisex"]
};

/**
 * Mock function to fetch products based on filters
 * @param {Object} filters - Filter criteria for products
 * @returns {Promise<Array>} Filtered products
 */
export const fetchProducts = async (filters = {}) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Apply filters if they exist
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(product => 
          product.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      
      if (filters.frameShape) {
        filteredProducts = filteredProducts.filter(product => 
          product.frameShape.toLowerCase() === filters.frameShape.toLowerCase());
      }
      
      if (filters.frameMaterial) {
        filteredProducts = filteredProducts.filter(product => 
          product.frameMaterial.toLowerCase() === filters.frameMaterial.toLowerCase());
      }
      
      if (filters.lensType) {
        filteredProducts = filteredProducts.filter(product => 
          product.lensType.toLowerCase() === filters.lensType.toLowerCase());
      }
      
      if (filters.gender) {
        filteredProducts = filteredProducts.filter(product => 
          product.gender.toLowerCase() === filters.gender.toLowerCase());
      }
      
      if (filters.faceShape) {
        filteredProducts = filteredProducts.filter(product => 
          product.faceShapes.some(shape => shape.toLowerCase() === filters.faceShape.toLowerCase()));
      }
      
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= filters.maxPrice);
      }
      
      resolve(filteredProducts);
    }, 300); // 300ms delay
  });
};

/**
 * Get filter options for the product filter UI
 * @returns {Promise<Object>} Filter options
 */
export const getFilterOptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFilterOptions);
    }, 200);
  });
};

/**
 * Get recommended products based on face shape and measurements
 * @param {Object} measurements - Face measurements
 * @param {Object} recommendations - AI recommendations
 * @returns {Promise<Array>} Recommended products
 */
export const getRecommendedProducts = async (measurements, recommendations) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { frameShapes, frameStyles, colors } = recommendations;
      
      // Filter products that match recommended frame shapes
      let recommendedProducts = mockProducts.filter(product => 
        frameShapes.some(shape => 
          product.frameShape.toLowerCase() === shape.toLowerCase()));
      
      // If no matches based on frame shape, return all products
      if (recommendedProducts.length === 0) {
        recommendedProducts = [...mockProducts];
      }
      
      resolve(recommendedProducts);
    }, 500);
  });
}; 