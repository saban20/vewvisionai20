"""
AI Processing Utility

This module centralizes all AI model loading and inference operations
to ensure consistent processing, proper resource management, and better error handling.
"""

import os
import numpy as np
import cv2
import json
import tensorflow as tf
import logging
from functools import lru_cache
from flask import current_app

# Configure logging
logger = logging.getLogger(__name__)

# Global model registry
_models = {}

def get_model_path(model_name):
    """
    Get the path to an AI model based on configuration.
    
    Args:
        model_name: Name of the model
        
    Returns:
        Path to the model directory/file
    """
    if not current_app:
        # Fallback for testing or non-Flask environments
        base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'ai')
    else:
        base_path = current_app.config.get('AI_MODELS_PATH')
    
    model_paths = {
        'face_detection': os.path.join(base_path, 'face_detection'),
        'face_mesh': os.path.join(base_path, 'face_mesh'),
        'eyewear_recommender': os.path.join(base_path, 'eyewear_recommendation'),
        'face_shape_classifier': os.path.join(base_path, 'face_shape_classifier')
    }
    
    return model_paths.get(model_name)

@lru_cache(maxsize=4)
def load_model(model_name):
    """
    Load a TensorFlow model with caching to prevent repeated loading.
    
    Args:
        model_name: Name of the model to load
        
    Returns:
        Loaded TensorFlow model
    
    Raises:
        FileNotFoundError: If the model file doesn't exist
        RuntimeError: If model loading fails
    """
    if model_name in _models:
        return _models[model_name]
    
    model_path = get_model_path(model_name)
    
    if not model_path or not os.path.exists(model_path):
        raise FileNotFoundError(f"Model '{model_name}' not found at {model_path}")
    
    try:
        logger.info(f"Loading AI model: {model_name}")
        model = tf.keras.models.load_model(model_path)
        _models[model_name] = model
        return model
    except Exception as e:
        logger.error(f"Failed to load model '{model_name}': {str(e)}")
        raise RuntimeError(f"Failed to load model '{model_name}': {str(e)}")

def unload_model(model_name=None):
    """
    Unload models to free up resources.
    
    Args:
        model_name: Name of the model to unload, or None to unload all models
    """
    global _models
    
    if model_name:
        if model_name in _models:
            del _models[model_name]
            logger.info(f"Unloaded AI model: {model_name}")
    else:
        _models = {}
        logger.info("Unloaded all AI models")
    
    # Clear TF memory
    tf.keras.backend.clear_session()

def predict_face_shape(image_data):
    """
    Predict face shape from an image.
    
    Args:
        image_data: Image as numpy array or path to image
        
    Returns:
        Dictionary with face shape prediction and confidence scores
        
    Raises:
        ValueError: If the image cannot be processed
        RuntimeError: If prediction fails
    """
    try:
        # Load the model
        model = load_model('face_shape_classifier')
        
        # Preprocess the image
        if isinstance(image_data, str):
            # Load from path
            image = cv2.imread(image_data)
            if image is None:
                raise ValueError(f"Could not read image from {image_data}")
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            # Use provided image array
            image = image_data
        
        # Resize to model input size
        preprocessed_image = cv2.resize(image, (224, 224))
        preprocessed_image = preprocessed_image / 255.0  # Normalize
        preprocessed_image = np.expand_dims(preprocessed_image, axis=0)  # Add batch dimension
        
        # Make prediction
        predictions = model.predict(preprocessed_image)
        
        # Process results
        face_shapes = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond']
        prediction_dict = {
            face_shapes[i]: float(predictions[0][i]) 
            for i in range(len(face_shapes))
        }
        
        # Get the top prediction
        top_shape = max(prediction_dict, key=prediction_dict.get)
        confidence = prediction_dict[top_shape]
        
        return {
            'face_shape': top_shape,
            'confidence': confidence,
            'all_predictions': prediction_dict
        }
        
    except Exception as e:
        logger.error(f"Face shape prediction failed: {str(e)}")
        raise RuntimeError(f"Face shape prediction failed: {str(e)}")

def recommend_eyewear(measurements, preferences=None):
    """
    Generate eyewear recommendations based on face measurements.
    
    Args:
        measurements: Dictionary of face measurements
        preferences: Optional user style preferences
        
    Returns:
        Dictionary with eyewear recommendations
        
    Raises:
        ValueError: If measurements are invalid
        RuntimeError: If recommendation fails
    """
    try:
        # Load the model
        model = load_model('eyewear_recommender')
        
        # Prepare input data
        input_features = [
            measurements.get('pupillary_distance', 0),
            measurements.get('bridge_width', 0),
            measurements.get('lens_height', 0),
            measurements.get('face_width', 0),
            measurements.get('face_height', 0),
            measurements.get('temple_length', 0)
        ]
        
        # Check if we have enough valid measurements
        if sum(1 for x in input_features if x > 0) < 3:
            raise ValueError("Insufficient valid measurements for recommendation")
        
        # Replace any zeros with defaults
        for i, val in enumerate(input_features):
            if val == 0:
                input_features[i] = [63, 15, 45, 140, 180, 140][i]  # Default values
        
        # Make prediction
        input_tensor = tf.convert_to_tensor([input_features], dtype=tf.float32)
        predictions = model.predict(input_tensor)
        
        # Process results
        frame_types = ['rectangular', 'round', 'oval', 'aviator', 'wayfarer', 'cat-eye']
        scores = {
            frame_types[i]: float(predictions[0][i]) 
            for i in range(len(frame_types))
        }
        
        # Sort by score
        recommended_styles = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Apply user preferences if provided
        if preferences and 'preferred_styles' in preferences:
            preferred = preferences['preferred_styles']
            # Boost scores for preferred styles
            recommended_styles = sorted(
                [(style, score * 1.2 if style in preferred else score) 
                 for style, score in recommended_styles],
                key=lambda x: x[1], 
                reverse=True
            )
        
        return {
            'recommended_styles': [style for style, _ in recommended_styles[:3]],
            'style_scores': scores,
            'face_shape': measurements.get('face_shape', 'oval')
        }
        
    except Exception as e:
        logger.error(f"Eyewear recommendation failed: {str(e)}")
        raise RuntimeError(f"Eyewear recommendation failed: {str(e)}")

def virtual_try_on(image_data, frame_id):
    """
    Perform virtual try-on of eyewear frames.
    This would typically use a more complex model.
    
    Args:
        image_data: Face image data
        frame_id: ID of the frame to try on
        
    Returns:
        Dictionary with result URL and metadata
        
    Raises:
        ValueError: If input parameters are invalid
        RuntimeError: If processing fails
    """
    # Note: In a real implementation, this would use a dedicated
    # deep learning model for virtual try-on. This is a placeholder.
    try:
        # Process the image and generate virtual try-on
        # This is a placeholder for actual implementation
        return {
            'status': 'success',
            'message': 'Virtual try-on processed',
            'result_url': f'/static/results/try_on_{frame_id}.jpg'
        }
    except Exception as e:
        logger.error(f"Virtual try-on failed: {str(e)}")
        raise RuntimeError(f"Virtual try-on failed: {str(e)}") 