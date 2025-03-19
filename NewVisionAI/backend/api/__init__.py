from api.auth import auth_bp as auth
from api.user import user
from api.products import products
from api.measurements import measurements
from api.face_scanner import face_scanner

__all__ = ['auth', 'user', 'products', 'measurements', 'face_scanner'] 