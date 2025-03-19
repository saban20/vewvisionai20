from datetime import datetime
from config.database import db

class BaseModel(db.Model):
    """Base model that other models will inherit from."""
    
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def save(self):
        """Save this model to the database."""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        """Delete this model from the database."""
        db.session.delete(self)
        db.session.commit()
        return self
    
    @classmethod
    def get_by_id(cls, id):
        """Get a record by its ID."""
        return cls.query.get(id)
    
    @classmethod
    def get_all(cls):
        """Get all records."""
        return cls.query.all()
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns} 