import cv2
import numpy as np
from utils.face_detection import detect_face, extract_measurements, detect_face_dlib, extract_measurements_dlib
from models import User, Measurement, db

def process_frame_mediapipe(frame):
    """
    Process a frame using MediaPipe face detection.
    
    Args:
        frame: Image as numpy array
        
    Returns:
        Dictionary of measurements or None if no face detected
    """
    # Save frame to temporary file since detect_face requires a file path
    temp_path = "temp_frame.jpg"
    cv2.imwrite(temp_path, frame)
    
    # Detect face using MediaPipe
    face_detected, face_data = detect_face(temp_path)
    
    if face_detected:
        # Extract measurements from face data
        measurements = extract_measurements(face_data)
        return measurements
    
    return None

def process_frame_dlib(frame):
    """
    Process a frame using dlib face detection.
    
    Args:
        frame: Image as numpy array
        
    Returns:
        Dictionary of measurements or None if no face detected
    """
    # Detect face using dlib
    faces = detect_face_dlib(frame)
    
    if len(faces) > 0:
        # Extract measurements from the first detected face
        measurements = extract_measurements_dlib(faces[0], frame)
        return measurements
    
    return None

def process_frame(frame, method="mediapipe"):
    """
    Process a frame to detect faces and extract measurements.
    
    Args:
        frame: Image as numpy array
        method: Detection method - "mediapipe" or "dlib"
        
    Returns:
        Dictionary of measurements or None if no face detected
    """
    if method.lower() == "dlib":
        return process_frame_dlib(frame)
    else:
        return process_frame_mediapipe(frame)

def save_measurements(user_id, measurements):
    """
    Save facial measurements to the database for a specific user.
    
    Args:
        user_id: ID of the user
        measurements: Dictionary containing facial measurements
        
    Returns:
        Measurement: The saved measurement object
    """
    user = User.query.get(user_id)
    measurement = Measurement(user_id=user.id, **measurements)
    db.session.add(measurement)
    db.session.commit()
    
    return measurement

def get_user_measurements(user_id):
    """
    Get all measurements for a specific user.
    
    Args:
        user_id: ID of the user
        
    Returns:
        List of Measurement objects
    """
    return Measurement.query.filter_by(user_id=user_id).all()

def get_measurement(measurement_id):
    """
    Get a specific measurement by ID.
    
    Args:
        measurement_id: ID of the measurement
        
    Returns:
        Measurement object or None if not found
    """
    return Measurement.query.get(measurement_id)

def delete_measurement(measurement_id):
    """
    Delete a specific measurement.
    
    Args:
        measurement_id: ID of the measurement to delete
        
    Returns:
        bool: True if successful, False otherwise
    """
    measurement = Measurement.query.get(measurement_id)
    if measurement:
        db.session.delete(measurement)
        db.session.commit()
        return True
    return False 