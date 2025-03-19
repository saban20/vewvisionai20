from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    """User model for storing user account information."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    measurements = db.relationship('Measurement', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Measurement(db.Model):
    """Model for storing facial measurements."""
    __tablename__ = 'measurements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Facial measurements
    pupillary_distance = db.Column(db.Float)
    temple_length = db.Column(db.Float)
    bridge_width = db.Column(db.Float)
    lens_width = db.Column(db.Float)
    lens_height = db.Column(db.Float)
    frame_width = db.Column(db.Float)
    face_width = db.Column(db.Float)
    face_height = db.Column(db.Float)
    
    # Additional metadata
    scan_data_url = db.Column(db.String(255))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to face analysis
    face_analysis = db.relationship('FaceAnalysis', uselist=False, backref='measurement', 
                                   lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Measurement {self.id} for User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pupillary_distance': self.pupillary_distance,
            'temple_length': self.temple_length,
            'bridge_width': self.bridge_width,
            'lens_width': self.lens_width,
            'lens_height': self.lens_height,
            'frame_width': self.frame_width,
            'face_width': self.face_width,
            'face_height': self.face_height,
            'scan_data_url': self.scan_data_url,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class FaceAnalysis(db.Model):
    """Model for storing face analysis results."""
    __tablename__ = 'face_analyses'

    id = db.Column(db.Integer, primary_key=True)
    measurement_id = db.Column(db.Integer, db.ForeignKey('measurements.id'), nullable=False)
    
    # Analysis results
    face_shape = db.Column(db.String(50))
    face_symmetry = db.Column(db.Float)
    skin_tone = db.Column(db.String(50))
    recommended_styles = db.Column(db.Text)  # Stored as JSON string
    recommended_colors = db.Column(db.Text)  # Stored as JSON string
    confidence_score = db.Column(db.Float)
    analysis_version = db.Column(db.String(20))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<FaceAnalysis {self.id} for Measurement {self.measurement_id}>'
    
    @property
    def recommended_styles_list(self):
        """Convert JSON string to list."""
        return json.loads(self.recommended_styles) if self.recommended_styles else []
    
    @property
    def recommended_colors_list(self):
        """Convert JSON string to list."""
        return json.loads(self.recommended_colors) if self.recommended_colors else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'measurement_id': self.measurement_id,
            'face_shape': self.face_shape,
            'face_symmetry': self.face_symmetry,
            'skin_tone': self.skin_tone,
            'recommended_styles': self.recommended_styles_list,
            'recommended_colors': self.recommended_colors_list,
            'confidence_score': self.confidence_score,
            'analysis_version': self.analysis_version,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 