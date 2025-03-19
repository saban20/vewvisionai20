import unittest
import os
import sys
import cv2
import numpy as np

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_scanner import process_frame, process_frame_mediapipe, process_frame_dlib

class FaceScannerTest(unittest.TestCase):
    def setUp(self):
        """Set up test data - load a test image"""
        # Path to a test image with a face - create or add a test image to your tests folder
        self.test_image_path = os.path.join(os.path.dirname(__file__), 'test-face.jpg')
        
        # If test image doesn't exist, this test will be skipped
        if not os.path.exists(self.test_image_path):
            self.skipTest("Test image not found. Please add 'test-face.jpg' to the tests directory.")
        
        # Load test image
        self.test_image = cv2.imread(self.test_image_path)
        
        # Check if image was loaded successfully
        if self.test_image is None:
            self.skipTest("Failed to load test image.")

    def test_process_frame_mediapipe(self):
        """Test the MediaPipe face detection"""
        # Process the test image with MediaPipe
        try:
            measurements = process_frame_mediapipe(self.test_image)
            
            # Check if measurements are returned
            self.assertIsNotNone(measurements, "MediaPipe didn't detect any face or return measurements")
            
            # Check if key measurements are present
            self.assertIn('pupillary_distance', measurements, "Pupillary distance measurement is missing")
            
            # Check if measurements are within reasonable ranges
            self.assertTrue(40 <= measurements['pupillary_distance'] <= 80, 
                           f"Pupillary distance {measurements['pupillary_distance']} outside normal range (40-80mm)")
            
        except Exception as e:
            self.fail(f"MediaPipe face processing failed with error: {str(e)}")

    def test_process_frame_dlib(self):
        """Test the dlib face detection"""
        try:
            measurements = process_frame_dlib(self.test_image)
            
            # Check if measurements are returned
            self.assertIsNotNone(measurements, "dlib didn't detect any face or return measurements")
            
            # Check if key measurements are present
            self.assertIn('pupillary_distance', measurements, "Pupillary distance measurement is missing")
            
            # Check if measurements are within reasonable ranges
            self.assertTrue(40 <= measurements['pupillary_distance'] <= 80, 
                           f"Pupillary distance {measurements['pupillary_distance']} outside normal range (40-80mm)")
            
        except Exception as e:
            self.fail(f"dlib face processing failed with error: {str(e)}")

    def test_process_frame_default(self):
        """Test the default process_frame function"""
        try:
            # Test with default method (should be mediapipe)
            measurements = process_frame(self.test_image)
            
            self.assertIsNotNone(measurements, "Default method didn't detect any face")
            self.assertIn('pupillary_distance', measurements, "Pupillary distance measurement is missing")
            
        except Exception as e:
            self.fail(f"Default face processing failed with error: {str(e)}")

    def test_process_frame_with_no_face(self):
        """Test processing an image with no face"""
        # Create a blank image
        blank_image = np.zeros((300, 300, 3), dtype=np.uint8)
        
        # Process the blank image
        measurements = process_frame(blank_image)
        
        # Should return None when no face is detected
        self.assertIsNone(measurements, "Should return None when no face is detected")

if __name__ == '__main__':
    unittest.main() 