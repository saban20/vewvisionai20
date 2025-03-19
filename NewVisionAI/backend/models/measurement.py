import json
from models.base import BaseModel
from config.database import db

class Measurement(BaseModel):
    """Model for storing eyewear measurements."""
    
    __tablename__ = 'measurements'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pupillary_distance = db.Column(db.Float)
    temple_length = db.Column(db.Float)
    bridge_width = db.Column(db.Float)
    lens_width = db.Column(db.Float)
    lens_height = db.Column(db.Float)
    frame_width = db.Column(db.Float)
    face_width = db.Column(db.Float)
    face_height = db.Column(db.Float)
    notes = db.Column(db.Text)
    scan_data_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    user = db.relationship('User', back_populates='measurements')
    face_analysis = db.relationship('FaceAnalysis', uselist=False, back_populates='measurement')
    
    def __repr__(self):
        return f'<Measurement {self.id} for User {self.user_id}>'

class FaceAnalysis(BaseModel):
    """Model for storing face analysis results."""
    
    __tablename__ = 'face_analyses'
    
    measurement_id = db.Column(db.Integer, db.ForeignKey('measurements.id'), nullable=False)
    face_shape = db.Column(db.String(50))
    face_symmetry = db.Column(db.Float)  # Score between 0-1
    skin_tone = db.Column(db.String(50))
    recommended_styles = db.Column(db.Text)  # JSON string of recommended frame styles
    recommended_colors = db.Column(db.Text)  # JSON string of recommended frame colors
    facial_features = db.Column(db.Text)  # JSON string of detected facial features
    confidence_score = db.Column(db.Float)  # AI confidence score
    analysis_version = db.Column(db.String(20))  # Version of the analysis algorithm
    
    # Relationships
    measurement = db.relationship('Measurement', back_populates='face_analysis')
    
    @property
    def recommended_styles_list(self):
        """Convert JSON string to list."""
        if self.recommended_styles:
            return json.loads(self.recommended_styles)
        return []
    
    @recommended_styles_list.setter
    def recommended_styles_list(self, styles_list):
        """Convert list to JSON string."""
        self.recommended_styles = json.dumps(styles_list)
    
    @property
    def recommended_colors_list(self):
        """Convert JSON string to list."""
        if self.recommended_colors:
            return json.loads(self.recommended_colors)
        return []
    
    @recommended_colors_list.setter
    def recommended_colors_list(self, colors_list):
        """Convert list to JSON string."""
        self.recommended_colors = json.dumps(colors_list)
    
    @property
    def facial_features_dict(self):
        """Convert JSON string to dictionary."""
        if self.facial_features:
            return json.loads(self.facial_features)
        return {}
    
    @facial_features_dict.setter
    def facial_features_dict(self, features_dict):
        """Convert dictionary to JSON string."""
        self.facial_features = json.dumps(features_dict)
    
    def __repr__(self):
        return f'<FaceAnalysis {self.id} for Measurement {self.measurement_id}>' 