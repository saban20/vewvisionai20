"""
AI Processing Routes

This module contains routes for AI model processing operations.
It centralizes all AI inference to the backend, removing the need for
client-side model loading and inference.
"""

import os
import base64
import numpy as np
import cv2
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from utils.ai_processor import (
    predict_face_shape, 
    recommend_eyewear, 
    virtual_try_on, 
    unload_model
)
from utils.error_handlers import (
    api_route, 
    ValidationError, 
    NotFoundError, 
    AIProcessingError
)

# Configure blueprint
ai_routes = Blueprint('ai_routes', __name__, url_prefix='/api/ai')

@ai_routes.route('/process-face', methods=['POST'])
@jwt_required()
@api_route
def process_face():
    """
    Process a face image to extract landmarks and measurements.
    This replaces client-side face detection.
    """
    current_user_id = get_jwt_identity()
    
    # Check if image data is provided
    if 'image' not in request.json:
        raise ValidationError('No image data provided')
    
    image_data = request.json['image']
    
    # Handle base64 image
    if isinstance(image_data, str) and image_data.startswith('data:image'):
        try:
            # Extract the base64 data
            encoded_data = image_data.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None or image.size == 0:
                raise ValidationError('Invalid image data')
            
            # Convert to RGB (from BGR)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        except Exception as e:
            raise ValidationError(f'Failed to decode image: {str(e)}')
    else:
        raise ValidationError('Invalid image format. Must be a base64 encoded image.')
    
    # Call backend processing functions
    from utils.face_detection import detect_face_from_array, extract_measurements
    
    # Detect the face
    face_detected, face_data = detect_face_from_array(image)
    
    if not face_detected:
        raise ValidationError('No face detected in the image')
    
    # Extract measurements from face data
    measurements = extract_measurements(face_data)
    
    # Predict face shape if not provided in measurements
    if not measurements.get('face_shape'):
        try:
            face_shape_result = predict_face_shape(image)
            measurements['face_shape'] = face_shape_result['face_shape']
            measurements['face_shape_confidence'] = face_shape_result['confidence']
        except Exception as e:
            # If face shape prediction fails, use a default
            measurements['face_shape'] = 'oval'
            measurements['face_shape_confidence'] = 0.6
    
    return jsonify({
        'success': True,
        'measurements': measurements
    })

@ai_routes.route('/recommend-eyewear', methods=['POST'])
@jwt_required(optional=True)
@api_route
def recommend_eyewear_route():
    """
    Generate eyewear recommendations based on face measurements.
    This replaces client-side TensorFlow inference.
    """
    if not request.is_json:
        raise ValidationError('Missing JSON data')
    
    data = request.json
    
    if 'measurements' not in data:
        raise ValidationError('No measurements provided')
    
    measurements = data['measurements']
    preferences = data.get('preferences', {})
    
    # Get recommendations using backend AI
    try:
        recommendations = recommend_eyewear(measurements, preferences)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except ValueError as e:
        raise ValidationError(str(e))
    except Exception as e:
        raise AIProcessingError(f'Failed to generate recommendations: {str(e)}')

@ai_routes.route('/face-shape', methods=['POST'])
@api_route
def face_shape_detection():
    """
    Detect face shape from an image.
    This replaces client-side face shape detection.
    """
    if not request.is_json:
        raise ValidationError('Missing JSON data')
    
    data = request.json
    
    if 'image' not in data:
        raise ValidationError('No image provided')
    
    image_data = data['image']
    
    # Handle base64 image
    if isinstance(image_data, str) and image_data.startswith('data:image'):
        try:
            # Extract the base64 data
            encoded_data = image_data.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None or image.size == 0:
                raise ValidationError('Invalid image data')
            
            # Convert to RGB (from BGR)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        except Exception as e:
            raise ValidationError(f'Failed to decode image: {str(e)}')
    else:
        raise ValidationError('Invalid image format. Must be a base64 encoded image.')
    
    # Use backend AI to predict face shape
    try:
        result = predict_face_shape(image)
        return jsonify({
            'success': True,
            'face_shape': result['face_shape'],
            'confidence': result['confidence']
        })
    except Exception as e:
        raise AIProcessingError(f'Failed to detect face shape: {str(e)}')

@ai_routes.route('/virtual-try-on', methods=['POST'])
@api_route
def virtual_try_on_route():
    """
    Process virtual try-on of eyewear frames.
    This replaces client-side virtual try-on.
    """
    if not request.is_json:
        raise ValidationError('Missing JSON data')
    
    data = request.json
    
    if 'image' not in data:
        raise ValidationError('No image provided')
    
    if 'frame_id' not in data:
        raise ValidationError('No frame ID provided')
    
    image_data = data['image']
    frame_id = data['frame_id']
    
    # Validate frame_id
    try:
        frame_id = int(frame_id)
    except ValueError:
        raise ValidationError('Invalid frame ID, must be an integer')
    
    # Handle base64 image
    if isinstance(image_data, str) and image_data.startswith('data:image'):
        try:
            # Extract the base64 data
            encoded_data = image_data.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None or image.size == 0:
                raise ValidationError('Invalid image data')
        except Exception as e:
            raise ValidationError(f'Failed to decode image: {str(e)}')
    else:
        raise ValidationError('Invalid image format. Must be a base64 encoded image.')
    
    # Use backend AI to process virtual try-on
    try:
        result = virtual_try_on(image, frame_id)
        return jsonify({
            'success': True,
            **result
        })
    except Exception as e:
        raise AIProcessingError(f'Failed to process virtual try-on: {str(e)}')

@ai_routes.route('/models/cleanup', methods=['POST'])
@api_route
def cleanup_models():
    """
    Clean up AI models to free resources.
    This is useful for server maintenance.
    """
    # Require admin authentication in a real app
    try:
        model_name = request.json.get('model_name') if request.is_json else None
        unload_model(model_name)
        return jsonify({
            'success': True,
            'message': f'AI models {"all" if model_name is None else model_name} unloaded successfully'
        })
    except Exception as e:
        raise AIProcessingError(f'Failed to unload AI models: {str(e)}') 