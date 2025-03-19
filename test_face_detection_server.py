#!/usr/bin/env python3
"""
Test Server for Face Detection API
----------------------------------

This is a simple Flask server that provides endpoints to test face detection
and facial measurement capabilities of the VisionAI system.

Features:
- Upload test images for face detection
- Test both MediaPipe and dlib backends
- Get facial measurements from uploaded images
- Verify API response formats

Usage:
python test_face_detection_server.py
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
import base64
import time
import logging
import sys

# Add the parent directory to the path to import the main modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import face detection modules
try:
    from face_scanner import process_frame, process_frame_mediapipe, process_frame_dlib
    
    # Set flag that modules were successfully imported
    FACE_MODULES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Face detection modules not available: {e}")
    print("Some endpoints will return mock data instead.")
    FACE_MODULES_AVAILABLE = False

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("face-detection-test-server")

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Mock data for when face modules aren't available
MOCK_FACE_DATA = {
    "pupillaryDistance": 63.5,
    "noseBridgeWidth": 17.2,
    "faceWidth": 142.8,
    "faceHeight": 165.3,
    "symmetryScore": 0.92,
    "confidenceMetrics": {
        "stabilityScore": 0.95,
        "detectionConfidence": 0.98,
        "landmarkQuality": 0.94
    }
}

@app.route('/')
def index():
    """Root endpoint with API information"""
    return jsonify({
        "name": "Face Detection Test API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            {"path": "/", "method": "GET", "description": "API information"},
            {"path": "/health", "method": "GET", "description": "Health check"},
            {"path": "/detect-face", "method": "POST", "description": "Detect faces in an image"},
            {"path": "/uploads/<filename>", "method": "GET", "description": "Get uploaded image"}
        ],
        "faceModulesAvailable": FACE_MODULES_AVAILABLE
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "timestamp": time.time()
    })

@app.route('/detect-face', methods=['POST'])
def detect_face():
    """Detect faces in uploaded image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    # Get detection method from request or use default
    detection_method = request.form.get('method', 'mediapipe')
    
    # Get file and save it
    file = request.files['image']
    filename = f"face_{int(time.time())}.jpg"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    logger.info(f"Image saved to {file_path}")
    logger.info(f"Using detection method: {detection_method}")
    
    # Process the image if face modules are available
    if FACE_MODULES_AVAILABLE:
        try:
            # Read the image with OpenCV
            img = cv2.imread(file_path)
            if img is None:
                return jsonify({"error": "Failed to read image"}), 400
            
            # Process the image with the selected method
            measurements = process_frame(img, method=detection_method)
            
            if measurements is None:
                return jsonify({"error": "No face detected"}), 404
            
            # Add the image URL to the response
            measurements['imageUrl'] = f"/uploads/{filename}"
            
            return jsonify({
                "status": "success",
                "measurements": measurements,
                "method": detection_method
            })
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return jsonify({
                "error": f"Error processing image: {str(e)}",
                "imageUrl": f"/uploads/{filename}"
            }), 500
    else:
        # Return mock data if face modules are not available
        logger.warning("Face modules not available, returning mock data")
        return jsonify({
            "status": "success",
            "measurements": MOCK_FACE_DATA,
            "method": detection_method,
            "note": "Using mock data (face detection modules not available)",
            "imageUrl": f"/uploads/{filename}"
        })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/compare-methods', methods=['POST'])
def compare_methods():
    """Compare different face detection methods on the same image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    # Get file and save it
    file = request.files['image']
    filename = f"comparison_{int(time.time())}.jpg"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    logger.info(f"Comparison image saved to {file_path}")
    
    # Process the image if face modules are available
    if FACE_MODULES_AVAILABLE:
        try:
            # Read the image with OpenCV
            img = cv2.imread(file_path)
            if img is None:
                return jsonify({"error": "Failed to read image"}), 400
            
            # Process with both methods
            mediapipe_results = process_frame_mediapipe(img)
            dlib_results = process_frame_dlib(img)
            
            # Return comparison results
            return jsonify({
                "status": "success",
                "imageUrl": f"/uploads/{filename}",
                "mediapipe": mediapipe_results,
                "dlib": dlib_results,
                "comparison": {
                    "pupillaryDistanceDifference": abs((mediapipe_results.get('pupillaryDistance', 0) or 0) - 
                                                    (dlib_results.get('pupillaryDistance', 0) or 0))
                    if mediapipe_results and dlib_results else None
                }
            })
            
        except Exception as e:
            logger.error(f"Error comparing methods: {str(e)}")
            return jsonify({
                "error": f"Error comparing methods: {str(e)}",
                "imageUrl": f"/uploads/{filename}"
            }), 500
    else:
        # Return mock comparison data
        logger.warning("Face modules not available, returning mock comparison data")
        return jsonify({
            "status": "success",
            "imageUrl": f"/uploads/{filename}",
            "mediapipe": MOCK_FACE_DATA,
            "dlib": {**MOCK_FACE_DATA, "pupillaryDistance": 62.8},
            "comparison": {
                "pupillaryDistanceDifference": 0.7
            },
            "note": "Using mock data (face detection modules not available)"
        })

if __name__ == '__main__':
    logger.info(f"Starting Face Detection Test Server")
    logger.info(f"Face detection modules available: {FACE_MODULES_AVAILABLE}")
    logger.info(f"Upload folder: {UPLOAD_FOLDER}")
    
    # Run the app on port 5050 to avoid conflicts with the main app
    app.run(host='0.0.0.0', port=5050, debug=True) 