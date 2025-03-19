from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Create SQLAlchemy instance
db = SQLAlchemy()

# Create Migration instance
migrate = Migrate()

# Database models will be imported here to ensure they're registered with SQLAlchemy
# This is done after creating the db instance to avoid circular imports
from models.user import User
from models.measurement import Measurement
from models.product import Product
from models.order import Order
from models.face_analysis import FaceAnalysis 