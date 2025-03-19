import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from models import User
from config.database import db

user = Blueprint('user', __name__, url_prefix='/api/user')

def allowed_file(filename):
    """Check if file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@user.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile details."""
    current_user_id = get_jwt_identity()
    user_data = User.query.get(current_user_id)
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user_data.to_dict()), 200

@user.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile details."""
    current_user_id = get_jwt_identity()
    user_data = User.query.get(current_user_id)
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Fields that can be updated
    allowed_fields = ['first_name', 'last_name', 'phone_number', 'username']
    
    # Update fields
    for field in allowed_fields:
        if field in data:
            setattr(user_data, field, data[field])
    
    # Check if username is already taken
    if 'username' in data and data['username'] != user_data.username:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return jsonify({'error': 'Username already taken'}), 409
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user_data.to_dict()
    }), 200

@user.route('/profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """Upload user profile picture."""
    current_user_id = get_jwt_identity()
    user_data = User.query.get(current_user_id)
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    if 'profile_picture' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['profile_picture']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"user_{current_user_id}.{file_ext}"
    
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(os.path.join(upload_folder, 'profiles'), exist_ok=True)
    file_path = os.path.join(upload_folder, 'profiles', unique_filename)
    
    file.save(file_path)
    
    # Update user profile picture path
    user_data.profile_picture = f"profiles/{unique_filename}"
    db.session.commit()
    
    return jsonify({
        'message': 'Profile picture uploaded successfully',
        'profile_picture': user_data.profile_picture
    }), 200

@user.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    """Get user application settings."""
    current_user_id = get_jwt_identity()
    
    # In a real application, settings would be stored in a separate model
    # For now, just return example settings
    settings = {
        'notifications': {
            'email': True,
            'sms': False,
            'push': True
        },
        'privacy': {
            'share_data': False,
            'analytics': True
        },
        'theme': 'light',
        'language': 'en',
        'accessibility': {
            'high_contrast': False,
            'large_text': False,
            'screen_reader': False
        }
    }
    
    return jsonify(settings), 200

@user.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user application settings."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # In a real application, validate and save settings to database
    # For now, just return the received settings
    return jsonify({
        'message': 'Settings updated successfully',
        'settings': data
    }), 200

@user.route('/deactivate', methods=['POST'])
@jwt_required()
def deactivate_account():
    """Deactivate user account."""
    current_user_id = get_jwt_identity()
    user_data = User.query.get(current_user_id)
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    # Deactivate account instead of deleting
    user_data.is_active = False
    db.session.commit()
    
    return jsonify({
        'message': 'Account deactivated successfully'
    }), 200

@user.route('/reactivate', methods=['POST'])
def reactivate_account():
    """Reactivate user account."""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user_data = User.query.filter_by(email=data['email'], is_active=False).first()
    
    if not user_data:
        return jsonify({'error': 'User not found or account is already active'}), 404
    
    if not user_data.verify_password(data['password']):
        return jsonify({'error': 'Invalid password'}), 401
    
    # Reactivate account
    user_data.is_active = True
    db.session.commit()
    
    return jsonify({
        'message': 'Account reactivated successfully'
    }), 200 