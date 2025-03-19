from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone

from models import User
from config.database import db

auth = Blueprint('auth', __name__, url_prefix='/api/auth')

# Token blacklist (in-memory for simplicity, use Redis in production)
token_blacklist = set()

@auth.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Check if required fields are provided
    required_fields = ['email', 'username', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create new user
    new_user = User(
        email=data['email'],
        username=data['username'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone_number=data.get('phone_number', '')
    )
    new_user.password = data['password']  # This will hash the password
    
    # Save user to database
    db.session.add(new_user)
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=new_user.id)
    refresh_token = create_refresh_token(identity=new_user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': new_user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth.route('/login', methods=['POST'])
def login():
    """Login user and return tokens."""
    data = request.get_json()
    
    # Check if required fields are provided
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.verify_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user by blacklisting current token."""
    jti = get_jwt()['jti']
    token_blacklist.add(jti)
    return jsonify({'message': 'Successfully logged out'}), 200

@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'access_token': new_access_token
    }), 200

@auth.route('/me', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get current user profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@auth.route('/me', methods=['PUT'])
@jwt_required()
def update_user_profile():
    """Update current user profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update user fields
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone_number = data.get('phone_number', user.phone_number)
    
    # Update password if provided
    if data.get('password'):
        user.password = data['password']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@auth.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Check if required fields are provided
    if not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    # Verify current password
    if not user.verify_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Update password
    user.password = data['new_password']
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200

@auth.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    """Request password reset (sends email with reset link)."""
    data = request.get_json()
    
    if not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        # Don't reveal that email doesn't exist for security reasons
        return jsonify({'message': 'If this email exists, a reset link has been sent'}), 200
    
    # In a real application, generate token and send email
    # For now, just return success message
    return jsonify({'message': 'If this email exists, a reset link has been sent'}), 200

@auth.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token from email."""
    data = request.get_json()
    
    if not data.get('token') or not data.get('new_password'):
        return jsonify({'error': 'Token and new password are required'}), 400
    
    # In a real application, validate token and get user
    # For now, just return success message
    return jsonify({'message': 'Password has been reset successfully'}), 200 