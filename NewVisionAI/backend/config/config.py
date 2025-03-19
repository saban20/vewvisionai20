import os
from datetime import timedelta

# Flask app configuration
DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
TESTING = False

# Database configuration
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///newvision.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False

# JWT configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

# File upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# AI model configuration
AI_MODELS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'ai')
FACE_DETECTION_MODEL = os.path.join(AI_MODELS_PATH, 'face_detection')
FACE_MESH_MODEL = os.path.join(AI_MODELS_PATH, 'face_mesh')
EYEWEAR_RECOMMENDATION_MODEL = os.path.join(AI_MODELS_PATH, 'eyewear_recommendation')

# Cache configuration
CACHE_TYPE = os.getenv('CACHE_TYPE', 'SimpleCache')
CACHE_DEFAULT_TIMEOUT = 300

# Celery configuration
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

# API Rate limiting
RATELIMIT_DEFAULT = "200 per day, 50 per hour"
RATELIMIT_STORAGE_URL = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')

# Make sure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AI_MODELS_PATH, exist_ok=True) 