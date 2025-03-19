import os
import numpy as np
import json
import math
from flask import current_app
import tensorflow as tf
import cv2

# Define face shapes
FACE_SHAPES = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond', 'triangle', 'pear']

# Define recommended frame shapes for each face shape
FRAME_RECOMMENDATIONS = {
    'oval': ['rectangle', 'square', 'aviator', 'wayfarer', 'round', 'cat_eye', 'geometric'],  # Most versatile
    'round': ['rectangle', 'square', 'wayfarer', 'geometric', 'cat_eye'],  # Angular frames to add definition
    'square': ['round', 'oval', 'cat_eye', 'aviator', 'rimless'],  # Curved frames to soften features
    'heart': ['round', 'oval', 'wayfarer', 'rimless', 'aviator'],  # Frames wider at bottom to balance
    'oblong': ['round', 'square', 'oversized', 'geometric', 'aviator'],  # Frames to make face appear shorter
    'diamond': ['cat_eye', 'oval', 'rimless', 'rectangle', 'geometric'],  # Frames to highlight cheekbones
    'triangle': ['cat_eye', 'aviator', 'oversized', 'geometric', 'square'],  # Frames to balance wider jawline
    'pear': ['rectangle', 'cat_eye', 'square', 'geometric', 'aviator']  # Frames to balance wider lower face
}

# Define recommended frame colors for skin tones
COLOR_RECOMMENDATIONS = {
    'fair': ['black', 'navy', 'burgundy', 'forest green', 'brown', 'gold', 'silver', 'rose gold'],
    'medium': ['black', 'brown', 'navy', 'burgundy', 'olive green', 'gold', 'tortoise', 'amber'],
    'olive': ['brown', 'gold', 'olive green', 'tortoise', 'amber', 'copper', 'burgundy', 'navy'],
    'tan': ['tortoise', 'brown', 'gold', 'copper', 'amber', 'navy', 'burgundy', 'forest green'],
    'dark': ['gold', 'copper', 'brown', 'burgundy', 'olive green', 'purple', 'tortoise', 'clear']
}

def analyze_face(measurements, additional_data=None):
    """
    Analyze face measurements to determine face shape and recommend eyewear.
    
    Args:
        measurements: Dictionary with face measurements
        additional_data: Additional data such as user preferences
        
    Returns:
        Dictionary with face shape, recommendations, and confidence score
    """
    if not measurements:
        return {
            'face_shape': None,
            'face_symmetry': None,
            'recommended_styles': [],
            'recommended_colors': [],
            'confidence_score': 0
        }
    
    # Extract measurements
    face_width = measurements.get('face_width')
    face_height = measurements.get('face_height')
    
    # Default to oval if measurements are missing
    if not face_width or not face_height:
        return {
            'face_shape': 'oval',
            'face_symmetry': 0.9,  # Default high symmetry
            'recommended_styles': FRAME_RECOMMENDATIONS['oval'],
            'recommended_colors': COLOR_RECOMMENDATIONS['medium'],
            'confidence_score': 0.6
        }
    
    # Calculate face shape based on measurements
    face_shape, confidence = determine_face_shape(measurements)
    
    # Determine skin tone from additional data
    skin_tone = 'medium'  # Default
    if additional_data and 'skin_tone' in additional_data:
        skin_tone = additional_data['skin_tone']
    
    # Calculate face symmetry
    face_symmetry = calculate_face_symmetry(measurements)
    
    # Get recommended frame styles based on face shape
    recommended_styles = FRAME_RECOMMENDATIONS.get(face_shape, FRAME_RECOMMENDATIONS['oval'])
    
    # Get recommended colors based on skin tone
    recommended_colors = COLOR_RECOMMENDATIONS.get(skin_tone, COLOR_RECOMMENDATIONS['medium'])
    
    # Adjust recommendations based on user preferences
    if additional_data and 'preferred_styles' in additional_data:
        # Prioritize preferred styles if they're in the recommendations
        preferred = [style for style in additional_data['preferred_styles'] if style in recommended_styles]
        other_recs = [style for style in recommended_styles if style not in preferred]
        recommended_styles = preferred + other_recs
    
    if additional_data and 'preferred_colors' in additional_data:
        # Prioritize preferred colors if they're in the recommendations
        preferred = [color for color in additional_data['preferred_colors'] if color in recommended_colors]
        other_recs = [color for color in recommended_colors if color not in preferred]
        recommended_colors = preferred + other_recs
    
    return {
        'face_shape': face_shape,
        'face_symmetry': face_symmetry,
        'skin_tone': skin_tone,
        'recommended_styles': recommended_styles,
        'recommended_colors': recommended_colors,
        'confidence_score': confidence
    }

def determine_face_shape(measurements):
    """
    Determine face shape based on measurements.
    
    Args:
        measurements: Dictionary with face measurements
        
    Returns:
        Tuple (face_shape, confidence)
    """
    face_width = measurements.get('face_width', 0)
    face_height = measurements.get('face_height', 0)
    
    if face_width == 0 or face_height == 0:
        return 'oval', 0.6  # Default
    
    # Calculate face width to height ratio
    ratio = face_width / face_height
    
    # Calculate forehead, cheekbone, and jawline widths if available
    # Here we're approximating these based on the frame measurements
    
    # Determine face shape based on ratio
    confidence = 0.75  # Base confidence
    
    if 0.75 <= ratio <= 0.8:
        # Oval face: width is about 3/4 of height
        face_shape = 'oval'
        confidence = 0.85
    elif ratio >= 0.8 and ratio <= 0.95:
        # Round face: width and height are similar
        face_shape = 'round'
        confidence = 0.82
    elif ratio > 0.95:
        # Square or round face
        # Check jawline vs forehead if we have that data
        if 'jawline_width' in measurements and 'forehead_width' in measurements:
            jaw_forehead_ratio = measurements['jawline_width'] / measurements['forehead_width']
            if jaw_forehead_ratio > 0.9:
                face_shape = 'square'
                confidence = 0.8
            else:
                face_shape = 'round'
                confidence = 0.78
        else:
            # Default to square for very wide faces
            face_shape = 'square'
            confidence = 0.7
    elif ratio < 0.75 and ratio >= 0.65:
        # Oblong/rectangular face: more elongated
        face_shape = 'oblong'
        confidence = 0.75
    elif ratio < 0.65:
        # Diamond, heart, or oblong
        # We need more measurements to differentiate these accurately
        # For now, default to heart since it's common
        face_shape = 'heart'
        confidence = 0.65
    else:
        # Default fallback
        face_shape = 'oval'
        confidence = 0.6
    
    # Adjust confidence based on measurement quality
    if measurements.get('pupillary_distance') is None or measurements.get('temple_length') is None:
        confidence *= 0.9  # Reduce confidence if key measurements are missing
    
    return face_shape, confidence

def calculate_face_symmetry(measurements):
    """
    Calculate face symmetry based on measurements.
    
    Args:
        measurements: Dictionary with face measurements
        
    Returns:
        Symmetry score between 0 and 1
    """
    # In a real application, this would compare left/right side measurements
    # For this example, we'll return a high symmetry score
    return 0.92  # Most faces are fairly symmetrical

def load_face_shape_model():
    """
    Load the face shape classification model.
    
    Returns:
        The loaded model, or None if the model can't be loaded
    """
    try:
        model_path = current_app.config['FACE_MESH_MODEL']
        if os.path.exists(model_path):
            # Load the model
            model = tf.keras.models.load_model(model_path)
            return model
        else:
            print(f"Model not found at {model_path}")
            return None
    except Exception as e:
        print(f"Error loading face shape model: {str(e)}")
        return None

def predict_face_shape_from_image(image_path):
    """
    Predict face shape directly from an image using a CNN model.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Tuple (face_shape, confidence)
    """
    # Load model
    model = load_face_shape_model()
    
    if not model:
        # Fall back to rule-based prediction
        return 'oval', 0.6
    
    try:
        # Load and preprocess image
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))  # Resize to model input size
        img = img / 255.0  # Normalize
        img = np.expand_dims(img, axis=0)  # Add batch dimension
        
        # Predict
        predictions = model.predict(img)
        face_shape_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][face_shape_idx])
        
        # Map index to face shape
        face_shape = FACE_SHAPES[face_shape_idx]
        
        return face_shape, confidence
    except Exception as e:
        print(f"Error predicting face shape: {str(e)}")
        return 'oval', 0.6 