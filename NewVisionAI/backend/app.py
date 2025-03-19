import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit, join_room

# Load environment variables
load_dotenv()

# Import API routes
from api.auth import auth_bp
from api.measurements import measurements_bp
from api.user import user_bp
from api.products import products_bp
from api.face_scanner import face_scanner_bp

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

if __name__ == '__main__':
    # Only for development
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 