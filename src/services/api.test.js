import { describe, it, expect } from 'vitest';
import { MeasurementsApi, ShopApi } from './api';

describe('API Services', () => {
  describe('MeasurementsApi', () => {
    it('should get all measurements', async () => {
      const measurements = await MeasurementsApi.getAll();
      expect(measurements).toBeDefined();
      expect(Array.isArray(measurements)).toBe(true);
      expect(measurements.length).toBeGreaterThan(0);
    });

    it('should get measurement by id', async () => {
      const measurement = await MeasurementsApi.getById('1');
      expect(measurement).toBeDefined();
      expect(measurement.id).toBe('1');
      expect(measurement.pupillaryDistance).toBeDefined();
    });

    it('should analyze measurements', async () => {
      const analysis = await MeasurementsApi.analyze();
      expect(analysis).toBeDefined();
      expect(analysis.populationComparison).toBeDefined();
    });

    it('should get recommended products', async () => {
      const products = await MeasurementsApi.getRecommendedProducts();
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].name).toBeDefined();
    });
  });

  describe('ShopApi', () => {
    it('should get recommendations', async () => {
      const recommendations = await ShopApi.getRecommendations();
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
}); 