import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit, join_room
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

# Load environment variables
load_dotenv()

# Import API routes
from api.auth import auth_bp
from api.measurements import measurements_bp
from api.user import user_bp
from api.products import products_bp
from api.face_scanner import face_scanner_bp
from api.ai_routes import ai_routes

# Import utilities
from utils.error_handlers import setup_error_handlers

# Import database configuration
from config.database import db, migrate

# Initialize Socket.IO
socketio = SocketIO(cors_allowed_origins="*")

def create_app(test_config=None):
    """Application factory pattern for Flask"""
    
    # Create and configure app
    app = Flask(__name__, 
                static_folder='../web/build', 
                static_url_path='/')
    
    # Load configuration
    if test_config is None:
        # Load the instance config if it exists
        app.config.from_pyfile('config/config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.update(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Set up CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Set up security headers with Talisman
    # Disabling temporarily for development, enable in production
    # Talisman(app, content_security_policy=None, force_https=False)
    
    # Set up rate limiting
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://",
    )
    
    # Set up JWT
    jwt = JWTManager(app)
    
    # Set up database
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Initialize Socket.IO with the app
    socketio.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(measurements_bp, url_prefix='/api/measurements')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(face_scanner_bp, url_prefix='/api/face-scanner')
    app.register_blueprint(ai_routes)
    
    # Apply rate limits to specific routes
    # Authentication endpoints - more permissive
    limiter.limit("30 per minute")(auth_bp)
    
    # API endpoints that may be subject to abuse
    limiter.limit("10 per minute")(face_scanner_bp)
    limiter.limit("20 per minute")(measurements_bp)
    
    # Home route
    @app.route('/')
    def index():
        return app.send_static_file('index.html')
    
    # Catch-all for React Router
    @app.route('/<path:path>')
    def catch_all(path):
        return app.send_static_file('index.html')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500
    
    @app.errorhandler(429)
    def ratelimit_error(e):
        return jsonify({"error": "Rate limit exceeded", "message": str(e)}), 429
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "ok"})
    
    return app

# Create application instance
app = create_app()

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('join')
def handle_join(data):
    """Handle client joining a room based on user ID"""
    user_id = data.get('user_id')
    if user_id:
        join_room(f"user_{user_id}")
        emit('join_confirm', {'message': f'Joined room for user {user_id}'})

@socketio.on('face_analysis_request')
def handle_face_analysis_request(data):
    """Handle real-time face analysis request"""
    # This would typically call your AI processing functions
    # For now, we'll just echo back the data with a mock result
    analysis_result = {
        'request_id': data.get('request_id'),
        'face_shape': 'oval',  # This would come from actual AI analysis
        'confidence': 0.95,
        'recommended_styles': ['rectangular', 'aviator', 'wayfarer'],
        'status': 'complete'
    }
    
    # Emit result back to the client
    emit('face_analysis_result', analysis_result)

@socketio.on('scan_face')
def handle_scan_face(data):
    """Process face scan from webcam or uploaded image frame"""
    try:
        # Import process_frame here to avoid circular imports
        from face_scanner import process_frame
        import numpy as np
        import base64
        import cv2
        
        # Check if frame data is provided
        if 'frame' not in data:
            emit('error', {'message': 'No frame data provided'})
            return
            
        # Validate input
        frame = data['frame']
        
        # Input validation for base64 image
        if isinstance(frame, str) and frame.startswith('data:image'):
            # Extract MIME type
            mime_type = frame.split(',')[0].split(':')[1].split(';')[0]
            
            # Check if it's an allowed image type
            if mime_type not in ['image/jpeg', 'image/png', 'image/webp']:
                emit('error', {'message': 'Invalid image format. Only JPEG, PNG and WebP are allowed'})
                return
                
            # Convert base64 image to numpy array
            try:
                encoded_data = frame.split(',')[1]
                nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                # Verify the image was properly decoded
                if frame is None or frame.size == 0:
                    emit('error', {'message': 'Invalid image data'})
                    return
                    
                # Check if image size is reasonable
                if frame.shape[0] > 4000 or frame.shape[1] > 4000:
                    emit('error', {'message': 'Image dimensions too large'})
                    return
            except Exception as e:
                emit('error', {'message': f'Error processing image: {str(e)}'})
                return
        elif isinstance(frame, list):
            # Validate array data
            try:
                frame = np.array(frame, dtype=np.uint8)
                if frame.size == 0 or frame.ndim != 3:
                    emit('error', {'message': 'Invalid image array format'})
                    return
            except Exception as e:
                emit('error', {'message': f'Error processing image array: {str(e)}'})
                return
        else:
            emit('error', {'message': 'Unsupported image format'})
            return
            
        # Process the frame using specified method (default: mediapipe)
        method = data.get('method', 'mediapipe')
        if method not in ['mediapipe', 'dlib']:
            emit('error', {'message': 'Invalid detection method'})
            return
            
        measurements = process_frame(frame, method)
        
        if measurements:
            emit('measurements', measurements)
        else:
            emit('error', {'message': 'No face detected in the image'})
    except Exception as e:
        print(f"Error processing face scan: {str(e)}")
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    # Only for development
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 