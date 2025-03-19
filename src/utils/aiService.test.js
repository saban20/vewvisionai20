import { describe, it, expect, vi } from 'vitest';
import aiService from './aiService';

describe('AIService', () => {
  describe('getMockRecommendations', () => {
    it('should return recommendations based on face shape', () => {
      // Test Round face shape
      const roundFaceRecommendations = aiService.getMockRecommendations({ faceShape: 'Round' });
      expect(roundFaceRecommendations).toBeDefined();
      expect(roundFaceRecommendations.frameShapes).toContain('Rectangle');
      expect(roundFaceRecommendations.frameStyles).toContain('Bold');
      expect(roundFaceRecommendations.colors).toContain('Black');
      
      // Test Square face shape
      const squareFaceRecommendations = aiService.getMockRecommendations({ faceShape: 'Square' });
      expect(squareFaceRecommendations).toBeDefined();
      expect(squareFaceRecommendations.frameShapes).toContain('Round');
      expect(squareFaceRecommendations.frameStyles).toContain('Thin frame');
      expect(squareFaceRecommendations.colors).toContain('Gold');
      
      // Test unknown face shape should return default recommendations
      const unknownFaceRecommendations = aiService.getMockRecommendations({ faceShape: 'Unknown' });
      expect(unknownFaceRecommendations).toBeDefined();
      expect(unknownFaceRecommendations.frameShapes).toContain('Rectangle');
      expect(unknownFaceRecommendations.frameStyles).toContain('Classic');
      expect(unknownFaceRecommendations.colors).toContain('Black');
    });
  });
  
  describe('getEyewearRecommendations', () => {
    it('should return mock recommendations in development', async () => {
      // Mock environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // Mock the getMockRecommendations method
      const mockGetRecommendations = vi.spyOn(aiService, 'getMockRecommendations');
      mockGetRecommendations.mockReturnValue({
        frameShapes: ['Test Frame'],
        frameStyles: ['Test Style'],
        colors: ['Test Color'],
        confidence: 0.9
      });
      
      const measurements = { faceShape: 'Round' };
      const result = await aiService.getEyewearRecommendations(measurements);
      
      expect(mockGetRecommendations).toHaveBeenCalledWith(measurements);
      expect(result.frameShapes).toContain('Test Frame');
      
      // Restore
      mockGetRecommendations.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
}); 