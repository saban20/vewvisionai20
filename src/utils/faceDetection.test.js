import { describe, it, expect, vi } from 'vitest';
import { calculateDistance } from './faceDetection';

describe('Face Detection Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      const point1 = { x: 0, y: 0 };
      const point2 = { x: 3, y: 4 };
      
      // Expected distance using Pythagorean theorem: sqrt(3² + 4²) = sqrt(25) = 5
      const distance = calculateDistance(point1, point2);
      expect(distance).toBe(5);
    });
    
    it('should return 0 for identical points', () => {
      const point = { x: 10, y: 20 };
      const distance = calculateDistance(point, point);
      expect(distance).toBe(0);
    });
  });
  
  // Skip face shape tests for now since they require more complex mocking
  describe.skip('determineFaceShape', () => {
    it('should determine round face shape based on ratio', () => {
      // This test is skipped until we can properly mock the landmarks data
      // according to the actual implementation
    });
  });
}); 