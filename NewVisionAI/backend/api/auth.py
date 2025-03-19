import os
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required, 
    get_jwt_identity,
    get_jwt
)
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import validators

from models import User
from config.database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'message': 'User registered successfully',
            'user_id': new_user.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token with expiration
    expires = timedelta(hours=24)
    access_token = create_access_token(
        identity=user.id,
        expires_delta=expires,
        additional_claims={
            'username': user.username,
            'email': user.email
        }
    )
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """Get current user profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Create new access token
    new_token = create_access_token(
        identity=current_user_id,
        additional_claims={
            'username': user.username,
            'email': user.email
        }
    )
    
    return jsonify({'token': new_token}), 200

def validate_token(token):
    """
    Validate JWT token and check for expiration.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or error response
    """
    try:
        # Verify and decode the token
        decoded = jwt.decode(
            token, 
            current_app.config['JWT_SECRET_KEY'], 
            algorithms=['HS256'],
            options={"verify_exp": True}  # Explicitly verify expiration
        )
        return decoded
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': f'Token validation failed: {str(e)}'}), 401

# Register a callback function that takes whatever exception is raised by the JWT extension
# and returns a response
@auth_bp.errorhandler(401)
def handle_auth_error(e):
    """Handle JWT authentication errors."""
    return jsonify({
        'error': 'Authentication failed',
        'message': str(e)
    }), 401

# Custom middleware to check token expiration
@auth_bp.before_app_request
def verify_jwt():
    """Verify JWT token expiration before processing requests."""
    # Skip for non-protected routes
    if request.endpoint in ['auth.login', 'auth.register'] or not request.endpoint:
        return
    
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        result = validate_token(token)
        
        # If result is a tuple, it's an error response
        if isinstance(result, tuple):
            return result 