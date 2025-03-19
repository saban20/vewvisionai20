import { describe, it, expect } from 'vitest';
import { fetchProducts, getRecommendedProducts } from './api';

describe('Mock API Functions', () => {
  describe('fetchProducts', () => {
    it('should return all products when no filters are applied', async () => {
      const products = await fetchProducts({});
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should filter products by frame shape', async () => {
      const frameShape = 'Square';
      const products = await fetchProducts({ frameShape });
      
      expect(Array.isArray(products)).toBe(true);
      
      // Check that all returned products have the specified frame shape
      products.forEach(product => {
        expect(product.frameShape).toBe(frameShape);
      });
    });

    it('should filter products by price range', async () => {
      const minPrice = 100;
      const maxPrice = 200;
      
      const products = await fetchProducts({ minPrice, maxPrice });
      
      expect(Array.isArray(products)).toBe(true);
      
      // Check that all returned products are within the price range
      products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });
  });

  describe('getRecommendedProducts', () => {
    it('should return recommended products based on measurements', async () => {
      const measurements = {
        pupillaryDistance: 62,
        faceWidth: 140,
        faceShape: 'Oval'
      };
      
      const recommendations = {
        frameShapes: ['Rectangle', 'Square'],
        frameStyles: ['Bold', 'Modern'],
        colors: ['Black', 'Tortoise']
      };
      
      const products = await getRecommendedProducts(measurements, recommendations);
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      
      // Check that products match at least one of the recommended criteria
      products.forEach(product => {
        const matchesFrameShape = recommendations.frameShapes.includes(product.frameShape);
        const matchesColor = recommendations.colors.includes(product.color);
        
        // Product should match at least one recommendation criteria
        expect(matchesFrameShape || matchesColor).toBe(true);
      });
    });
  });
}); 