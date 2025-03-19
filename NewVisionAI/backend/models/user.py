from werkzeug.security import generate_password_hash, check_password_hash
from models.base import BaseModel
from config.database import db

class User(BaseModel):
    """User model for authentication and profile management."""
    
    __tablename__ = 'users'
    
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    profile_picture = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    last_login = db.Column(db.DateTime)
    
    # Relationships
    measurements = db.relationship('Measurement', back_populates='user', lazy='dynamic')
    orders = db.relationship('Order', back_populates='user', lazy='dynamic')
    
    @property
    def password(self):
        """Password is write-only."""
        raise AttributeError('Password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        """Set password hash from plain text password."""
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        """Verify password against stored hash."""
        if self.password_hash:
            return check_password_hash(self.password_hash, password)
        return False
    
    def to_dict(self):
        """Convert user to dictionary (excluding sensitive fields)."""
        data = super().to_dict()
        # Remove sensitive fields
        del data['password_hash']
        return data
    
    def __repr__(self):
        return f'<User {self.username}>' 