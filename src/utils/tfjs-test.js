import { describe, it, expect, vi, beforeAll } from 'vitest';
import { loadFaceDetectionModules } from './faceDetection';

// Mock TensorFlow and other dependencies
vi.mock('@mediapipe/face_mesh', () => ({
  default: {}
}));

vi.mock('@tensorflow/tfjs', () => ({
  default: {
    ready: vi.fn().mockResolvedValue(true),
    setBackend: vi.fn()
  }
}));

vi.mock('@tensorflow-models/face-detection', () => ({
  default: {
    SupportedModels: {
      MediaPipeFaceDetector: 'MediaPipeFaceDetector'
    },
    createDetector: vi.fn().mockResolvedValue({
      estimateFaces: vi.fn().mockResolvedValue([
        {
          box: { xMin: 100, yMin: 50, width: 200, height: 250 },
          landmarks: [
            { x: 100, y: 100 }, // Example landmarks
            { x: 120, y: 80 },
            { x: 140, y: 100 }
          ]
        }
      ])
    })
  }
}));

// Don't run in browser environments
if (typeof window === 'undefined') {
  describe('TensorFlow.js Face Detection', () => {
    it('should load face detection modules', async () => {
      const modules = await loadFaceDetectionModules();
      
      expect(modules).toBeDefined();
      expect(modules.mediapipe).toBeDefined();
      expect(modules.tf).toBeDefined();
      expect(modules.faceapi).toBeDefined();
    });
    
    it('should handle loading errors gracefully', async () => {
      // Override the mock to throw an error
      vi.mock('@tensorflow/tfjs', () => ({
        default: {
          ready: vi.fn().mockRejectedValue(new Error('TensorFlow failed to load'))
        }
      }));
      
      try {
        await loadFaceDetectionModules();
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Failed to load face detection modules');
      }
    });
  });
} 