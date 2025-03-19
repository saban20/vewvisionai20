from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
import time
from datetime import datetime

from models import Measurement, FaceAnalysis
from config.database import db
from utils.face_detection import detect_face, extract_measurements
from utils.face_analysis import analyze_face

measurements = Blueprint('measurements', __name__, url_prefix='/api/measurements')

@measurements.route('', methods=['GET'])
@jwt_required()
def get_all_measurements():
    """Get all measurements for the current user."""
    current_user_id = get_jwt_identity()
    
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Apply pagination
    paginated_measurements = Measurement.query.filter_by(user_id=current_user_id) \
        .order_by(Measurement.created_at.desc()) \
        .paginate(page=page, per_page=per_page, error_out=False)
    
    result = []
    for measurement in paginated_measurements.items:
        measurement_data = measurement.to_dict()
        if measurement.face_analysis:
            measurement_data['face_analysis'] = {
                'face_shape': measurement.face_analysis.face_shape,
                'face_symmetry': measurement.face_analysis.face_symmetry,
                'recommended_styles': measurement.face_analysis.recommended_styles_list,
                'recommended_colors': measurement.face_analysis.recommended_colors_list
            }
        result.append(measurement_data)
    
    return jsonify({
        'measurements': result,
        'total': paginated_measurements.total,
        'pages': paginated_measurements.pages,
        'page': page,
        'per_page': per_page
    }), 200

@measurements.route('/<int:measurement_id>', methods=['GET'])
@jwt_required()
def get_measurement(measurement_id):
    """Get a specific measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    result = measurement.to_dict()
    if measurement.face_analysis:
        result['face_analysis'] = {
            'id': measurement.face_analysis.id,
            'face_shape': measurement.face_analysis.face_shape,
            'face_symmetry': measurement.face_analysis.face_symmetry,
            'skin_tone': measurement.face_analysis.skin_tone,
            'recommended_styles': measurement.face_analysis.recommended_styles_list,
            'recommended_colors': measurement.face_analysis.recommended_colors_list,
            'confidence_score': measurement.face_analysis.confidence_score
        }
    
    return jsonify(result), 200

@measurements.route('', methods=['POST'])
@jwt_required()
def create_measurement():
    """Create a new measurement manually."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Create new measurement
    new_measurement = Measurement(
        user_id=current_user_id,
        pupillary_distance=data.get('pupillary_distance'),
        temple_length=data.get('temple_length'),
        bridge_width=data.get('bridge_width'),
        lens_width=data.get('lens_width'),
        lens_height=data.get('lens_height'),
        frame_width=data.get('frame_width'),
        face_width=data.get('face_width'),
        face_height=data.get('face_height'),
        notes=data.get('notes', 'Manually entered measurement')
    )
    
    db.session.add(new_measurement)
    db.session.commit()
    
    return jsonify({
        'message': 'Measurement created successfully',
        'measurement': new_measurement.to_dict()
    }), 201

@measurements.route('/<int:measurement_id>', methods=['PUT'])
@jwt_required()
def update_measurement(measurement_id):
    """Update an existing measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    data = request.get_json()
    
    # Update fields
    measurement.pupillary_distance = data.get('pupillary_distance', measurement.pupillary_distance)
    measurement.temple_length = data.get('temple_length', measurement.temple_length)
    measurement.bridge_width = data.get('bridge_width', measurement.bridge_width)
    measurement.lens_width = data.get('lens_width', measurement.lens_width)
    measurement.lens_height = data.get('lens_height', measurement.lens_height)
    measurement.frame_width = data.get('frame_width', measurement.frame_width)
    measurement.face_width = data.get('face_width', measurement.face_width)
    measurement.face_height = data.get('face_height', measurement.face_height)
    measurement.notes = data.get('notes', measurement.notes)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Measurement updated successfully',
        'measurement': measurement.to_dict()
    }), 200

@measurements.route('/<int:measurement_id>', methods=['DELETE'])
@jwt_required()
def delete_measurement(measurement_id):
    """Delete a measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    # Delete associated face analysis
    if measurement.face_analysis:
        db.session.delete(measurement.face_analysis)
    
    # Delete measurement
    db.session.delete(measurement)
    db.session.commit()
    
    return jsonify({'message': 'Measurement deleted successfully'}), 200

@measurements.route('/<int:measurement_id>/analysis', methods=['GET'])
@jwt_required()
def get_face_analysis(measurement_id):
    """Get face analysis for a measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    # Check if face analysis exists
    if not measurement.face_analysis:
        return jsonify({'error': 'No face analysis for this measurement'}), 404
    
    return jsonify({
        'face_shape': measurement.face_analysis.face_shape,
        'face_symmetry': measurement.face_analysis.face_symmetry,
        'skin_tone': measurement.face_analysis.skin_tone,
        'recommended_styles': measurement.face_analysis.recommended_styles_list,
        'recommended_colors': measurement.face_analysis.recommended_colors_list,
        'confidence_score': measurement.face_analysis.confidence_score,
        'analysis_version': measurement.face_analysis.analysis_version
    }), 200

@measurements.route('/<int:measurement_id>/analysis', methods=['POST'])
@jwt_required()
def create_face_analysis(measurement_id):
    """Create face analysis for a measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    # Check if face analysis already exists
    if measurement.face_analysis:
        return jsonify({'error': 'Face analysis already exists for this measurement'}), 409
    
    data = request.get_json()
    
    # Create face analysis
    face_analysis = FaceAnalysis(
        measurement_id=measurement.id,
        face_shape=data.get('face_shape'),
        face_symmetry=data.get('face_symmetry'),
        skin_tone=data.get('skin_tone'),
        confidence_score=data.get('confidence_score', 0.8),
        analysis_version='manual'
    )
    
    # Set recommended styles if provided
    if 'recommended_styles' in data:
        face_analysis.recommended_styles_list = data['recommended_styles']
    
    # Set recommended colors if provided
    if 'recommended_colors' in data:
        face_analysis.recommended_colors_list = data['recommended_colors']
    
    # Set facial features if provided
    if 'facial_features' in data:
        face_analysis.facial_features_dict = data['facial_features']
    
    db.session.add(face_analysis)
    db.session.commit()
    
    return jsonify({
        'message': 'Face analysis created successfully',
        'face_analysis': {
            'id': face_analysis.id,
            'face_shape': face_analysis.face_shape,
            'face_symmetry': face_analysis.face_symmetry,
            'recommended_styles': face_analysis.recommended_styles_list,
            'recommended_colors': face_analysis.recommended_colors_list
        }
    }), 201

@measurements.route('/<int:measurement_id>/analysis', methods=['PUT'])
@jwt_required()
def update_face_analysis(measurement_id):
    """Update face analysis for a measurement."""
    current_user_id = get_jwt_identity()
    
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    # Check if face analysis exists
    if not measurement.face_analysis:
        return jsonify({'error': 'No face analysis for this measurement'}), 404
    
    data = request.get_json()
    face_analysis = measurement.face_analysis
    
    # Update fields
    if 'face_shape' in data:
        face_analysis.face_shape = data['face_shape']
    
    if 'face_symmetry' in data:
        face_analysis.face_symmetry = data['face_symmetry']
    
    if 'skin_tone' in data:
        face_analysis.skin_tone = data['skin_tone']
    
    if 'recommended_styles' in data:
        face_analysis.recommended_styles_list = data['recommended_styles']
    
    if 'recommended_colors' in data:
        face_analysis.recommended_colors_list = data['recommended_colors']
    
    if 'facial_features' in data:
        face_analysis.facial_features_dict = data['facial_features']
    
    if 'confidence_score' in data:
        face_analysis.confidence_score = data['confidence_score']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Face analysis updated successfully',
        'face_analysis': {
            'id': face_analysis.id,
            'face_shape': face_analysis.face_shape,
            'face_symmetry': face_analysis.face_symmetry,
            'recommended_styles': face_analysis.recommended_styles_list,
            'recommended_colors': face_analysis.recommended_colors_list
        }
    }), 200

@measurements.route('/api/measurements', methods=['POST'])
def save_measurements():
    """Save face measurements from the AI Eyewear Engine."""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get user ID from request or session
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        # Get measurements from request
        measurements = data.get('measurements', {})
        face_shape = data.get('faceShape', {})
        recommended_style = data.get('recommendedStyle', '')
        frame_recommendations = data.get('frameRecommendations', [])
        
        # Create measurement data
        measurement_data = {
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'measurements': measurements,
            'face_shape': face_shape.get('shape') if isinstance(face_shape, dict) else face_shape,
            'face_shape_confidence': face_shape.get('confidence', 0.7) if isinstance(face_shape, dict) else 0.7,
            'recommended_style': recommended_style,
            'frame_recommendations': frame_recommendations
        }
        
        # Save measurements to database or file
        # In a real application, this would save to a database
        # For simplicity, we'll save to a JSON file
        measurements_dir = os.path.join(current_app.instance_path, 'measurements')
        os.makedirs(measurements_dir, exist_ok=True)
        
        filename = f"{user_id}_{int(time.time())}.json"
        filepath = os.path.join(measurements_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(measurement_data, f, indent=2)
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'Measurements saved successfully',
            'measurement_id': filename.split('.')[0]
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error saving measurements: {str(e)}")
        return jsonify({'error': str(e)}), 500

@measurements.route('/api/measurements/<user_id>', methods=['GET'])
def get_user_measurements(user_id):
    """Get all measurements for a specific user."""
    try:
        measurements_dir = os.path.join(current_app.instance_path, 'measurements')
        
        if not os.path.exists(measurements_dir):
            return jsonify({'measurements': []}), 200
        
        # Filter files by user ID
        user_files = [f for f in os.listdir(measurements_dir) if f.startswith(f"{user_id}_") and f.endswith('.json')]
        
        if not user_files:
            return jsonify({'measurements': []}), 200
        
        # Load all measurement files for the user
        measurements = []
        for file in user_files:
            with open(os.path.join(measurements_dir, file), 'r') as f:
                measurement_data = json.load(f)
                measurements.append(measurement_data)
        
        # Sort measurements by timestamp (newest first)
        measurements.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return jsonify({'measurements': measurements}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting measurements: {str(e)}")
        return jsonify({'error': str(e)}), 500

@measurements.route('/api/measurements/analyze', methods=['POST'])
def analyze_measurements():
    """Analyze measurements to determine face shape and recommend eyewear."""
    try:
        data = request.json
        
        if not data or 'measurements' not in data:
            return jsonify({'error': 'No measurements provided'}), 400
        
        measurements = data['measurements']
        additional_data = data.get('additionalData', {})
        
        # Analyze face based on measurements
        analysis_result = analyze_face(measurements, additional_data)
        
        return jsonify(analysis_result), 200
        
    except Exception as e:
        current_app.logger.error(f"Error analyzing measurements: {str(e)}")
        return jsonify({'error': str(e)}), 500 