import os
import uuid
import json
import numpy as np
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import socketio

from models import User, Measurement, FaceAnalysis
from config.database import db
from utils.face_detection import detect_face, extract_measurements
from utils.face_analysis import analyze_face

face_scanner = Blueprint('face_scanner', __name__, url_prefix='/api/face-scanner')

def allowed_file(filename):
    """Check if file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def validate_file_type(file):
    """
    Validate file content type for security.
    
    Args:
        file: The uploaded file object
        
    Returns:
        bool: True if file type is valid, False otherwise
    """
    # List of allowed content types
    allowed_content_types = [
        'image/jpeg', 
        'image/jpg', 
        'image/png',
        'image/webp'
    ]
    
    # Check MIME type
    if file.content_type not in allowed_content_types:
        return False
    
    # Additional validation - read first few bytes and check file signature
    # This helps prevent content-type spoofing
    file_signature = file.read(12)  # Read first 12 bytes for signature check
    file.seek(0)  # Reset file pointer
    
    # JPEG signature check: starts with bytes FF D8 FF
    jpeg_signature = b'\xFF\xD8\xFF'
    
    # PNG signature check: starts with bytes 89 50 4E 47 0D 0A 1A 0A
    png_signature = b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A'
    
    # WebP signature check: starts with RIFF and contains WEBP
    webp_signature_start = b'RIFF'
    webp_signature_content = b'WEBP'
    
    if file.content_type.startswith('image/jp') and not file_signature.startswith(jpeg_signature):
        return False
    elif file.content_type == 'image/png' and not file_signature.startswith(png_signature):
        return False
    elif file.content_type == 'image/webp' and (not file_signature.startswith(webp_signature_start) or webp_signature_content not in file.read(20)):
        file.seek(0)  # Reset file pointer again
        return False
    
    return True

@face_scanner.route('/upload', methods=['POST'])
@jwt_required()
def upload_face_scan():
    """Upload a face scan image for processing."""
    current_user_id = get_jwt_identity()
    
    # Check if face scan file is provided
    if 'face_scan' not in request.files:
        return jsonify({'error': 'No face scan file provided'}), 400
    
    file = request.files['face_scan']
    
    # Check if file is not empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check if file has valid content type
    if not validate_file_type(file):
        return jsonify({'error': 'Invalid file type. Only JPEG, PNG and WebP images are allowed.'}), 400
    
    # Check if file has allowed extension
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Only JPEG, PNG and WebP extensions are permitted.'}), 400
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
    
    # Set file size limit (5MB)
    file_size_limit = 5 * 1024 * 1024  # 5MB in bytes
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > file_size_limit:
        return jsonify({'error': f'File too large. Maximum size is 5MB.'}), 400
    
    # Save file to uploads directory
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(os.path.join(upload_folder, 'face_scans'), exist_ok=True)
    file_path = os.path.join(upload_folder, 'face_scans', unique_filename)
    
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({'error': f'Error saving file: {str(e)}'}), 500
    
    # Emit status update to the client
    socketio.emit('processing_update', 
                  {'status': 'upload_complete', 'scan_id': unique_filename},
                  room=f"user_{current_user_id}")
    
    # Process the face scan in the background
    # In a real application, this would be a Celery task
    try:
        # Return immediate response with processing status
        return jsonify({
            'message': 'Face scan uploaded successfully',
            'scan_id': unique_filename,
            'status': 'processing'
        }), 202
    except Exception as e:
        # Log the error
        print(f"Error uploading face scan: {str(e)}")
        # Emit error event to the client
        socketio.emit('processing_error', 
                     {'error': 'Error uploading face scan'},
                     room=f"user_{current_user_id}")
        return jsonify({'error': 'Error processing face scan'}), 500

@face_scanner.route('/process/<scan_id>', methods=['GET'])
@jwt_required()
def process_face_scan(scan_id):
    """Process a previously uploaded face scan."""
    current_user_id = get_jwt_identity()
    
    # Validate scan_id to prevent path traversal
    if not scan_id.isalnum() or '..' in scan_id:
        return jsonify({'error': 'Invalid scan ID format'}), 400
    
    # Check if scan exists
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'face_scans', scan_id)
    if not os.path.exists(file_path):
        return jsonify({'error': 'Face scan not found'}), 404
    
    try:
        # Emit status update to the client
        socketio.emit('processing_update', 
                     {'status': 'processing_started', 'scan_id': scan_id},
                     room=f"user_{current_user_id}")
        
        # Detect face and extract measurements
        face_detected, face_data = detect_face(file_path)
        
        if not face_detected:
            # Emit face detection failure to the client
            socketio.emit('processing_update', 
                         {'status': 'face_detection_failed', 'scan_id': scan_id},
                         room=f"user_{current_user_id}")
            return jsonify({
                'error': 'No face detected in the image',
                'status': 'failed'
            }), 400
        
        # Emit status update to the client
        socketio.emit('processing_update', 
                     {'status': 'face_detected', 'scan_id': scan_id},
                     room=f"user_{current_user_id}")
        
        # Extract measurements from face data
        measurements = extract_measurements(face_data)
        
        # Emit measurements to the client
        socketio.emit('processing_update', 
                     {
                         'status': 'measurements_extracted', 
                         'scan_id': scan_id,
                         'measurements': measurements
                     },
                     room=f"user_{current_user_id}")
        
        # Create a new measurement record
        new_measurement = Measurement(
            user_id=current_user_id,
            pupillary_distance=measurements.get('pupillary_distance'),
            temple_length=measurements.get('temple_length'),
            bridge_width=measurements.get('bridge_width'),
            lens_width=measurements.get('lens_width'),
            lens_height=measurements.get('lens_height'),
            frame_width=measurements.get('frame_width'),
            face_width=measurements.get('face_width'),
            face_height=measurements.get('face_height'),
            scan_data_url=scan_id,
            notes='Processed from face scan'
        )
        
        db.session.add(new_measurement)
        db.session.commit()
        
        # Emit processing complete to the client
        socketio.emit('processing_update', 
                     {
                         'status': 'processing_complete', 
                         'scan_id': scan_id,
                         'measurement_id': new_measurement.id
                     },
                     room=f"user_{current_user_id}")
        
        # Return measurements
        return jsonify({
            'message': 'Face scan processed successfully',
            'measurement_id': new_measurement.id,
            'measurements': measurements,
            'status': 'completed'
        }), 200
    except Exception as e:
        # Log the error
        print(f"Error processing face scan: {str(e)}")
        # Emit error event to the client
        socketio.emit('processing_error', 
                     {'error': 'Error processing face scan', 'scan_id': scan_id},
                     room=f"user_{current_user_id}")
        return jsonify({'error': 'Error processing face scan'}), 500

@face_scanner.route('/analyze/<int:measurement_id>', methods=['POST'])
@jwt_required()
def analyze_measurement(measurement_id):
    """Analyze measurements to provide face shape and recommendations."""
    current_user_id = get_jwt_identity()
    
    # Get measurement
    measurement = Measurement.query.get(measurement_id)
    
    if not measurement:
        return jsonify({'error': 'Measurement not found'}), 404
    
    # Check if user owns the measurement
    if measurement.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to measurement'}), 403
    
    try:
        # Get additional analysis parameters from request
        data = request.get_json() or {}
        
        # Convert measurement to dictionary for analysis
        measurement_dict = {
            'pupillary_distance': measurement.pupillary_distance,
            'temple_length': measurement.temple_length,
            'bridge_width': measurement.bridge_width,
            'lens_width': measurement.lens_width,
            'lens_height': measurement.lens_height,
            'frame_width': measurement.frame_width,
            'face_width': measurement.face_width,
            'face_height': measurement.face_height
        }
        
        # Analyze face to get face shape and recommendations
        analysis_results = analyze_face(measurement_dict, data)
        
        # Create or update face analysis record
        face_analysis = measurement.face_analysis or FaceAnalysis(measurement_id=measurement.id)
        
        face_analysis.face_shape = analysis_results.get('face_shape')
        face_analysis.face_symmetry = analysis_results.get('face_symmetry')
        face_analysis.skin_tone = analysis_results.get('skin_tone', data.get('skin_tone'))
        face_analysis.recommended_styles = json.dumps(analysis_results.get('recommended_styles', []))
        face_analysis.recommended_colors = json.dumps(analysis_results.get('recommended_colors', []))
        face_analysis.confidence_score = analysis_results.get('confidence_score')
        face_analysis.analysis_version = '1.0'  # Example version
        
        if not measurement.face_analysis:
            db.session.add(face_analysis)
        
        db.session.commit()
        
        # Return analysis results
        return jsonify({
            'message': 'Face analysis completed successfully',
            'analysis_id': face_analysis.id,
            'face_shape': face_analysis.face_shape,
            'face_symmetry': face_analysis.face_symmetry,
            'skin_tone': face_analysis.skin_tone,
            'recommended_styles': face_analysis.recommended_styles_list,
            'recommended_colors': face_analysis.recommended_colors_list,
            'confidence_score': face_analysis.confidence_score
        }), 200
    except Exception as e:
        # Log the error
        print(f"Error analyzing face: {str(e)}")
        return jsonify({'error': 'Error analyzing face measurements'}), 500

@face_scanner.route('/measurements', methods=['GET'])
@jwt_required()
def get_measurements():
    """Get all measurements for the current user."""
    current_user_id = get_jwt_identity()
    
    measurements = Measurement.query.filter_by(user_id=current_user_id).all()
    
    result = []
    for measurement in measurements:
        measurement_data = measurement.to_dict()
        if measurement.face_analysis:
            measurement_data['face_analysis'] = {
                'face_shape': measurement.face_analysis.face_shape,
                'recommended_styles': measurement.face_analysis.recommended_styles_list,
                'recommended_colors': measurement.face_analysis.recommended_colors_list
            }
        result.append(measurement_data)
    
    return jsonify(result), 200

@face_scanner.route('/measurements/<int:measurement_id>', methods=['GET'])
@jwt_required()
def get_measurement(measurement_id):
    """Get a specific measurement for the current user."""
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

@face_scanner.route('/measurements/<int:measurement_id>', methods=['DELETE'])
@jwt_required()
def delete_measurement(measurement_id):
    """Delete a specific measurement."""
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

@face_scanner.route('/face-shapes', methods=['GET'])
def get_face_shapes():
    """Get list of possible face shapes and their descriptions."""
    face_shapes = {
        'oval': 'Balanced proportions with a slightly narrower forehead and jawline.',
        'round': 'Similar width and length with full cheeks and a rounded jawline.',
        'square': 'Strong, angular jawline with a broad forehead and minimal tapering.',
        'heart': 'Wider forehead tapering to a narrower jawline and pointed chin.',
        'oblong': 'Longer face with straight sides and less width.',
        'diamond': 'Narrow forehead and jawline with wider cheekbones.',
        'triangle': 'Wider jawline with a narrower forehead.',
        'pear': 'Narrow forehead with a wider jawline.'
    }
    
    return jsonify(face_shapes), 200 