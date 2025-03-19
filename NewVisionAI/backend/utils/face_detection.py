import os
import numpy as np
import cv2
import math
from flask import current_app
import mediapipe as mp

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Key landmarks for measurements
# These indices are based on the MediaPipe Face Mesh landmarks
# https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
LEFT_EYE_OUTER = 33
LEFT_EYE_INNER = 133
RIGHT_EYE_INNER = 362
RIGHT_EYE_OUTER = 263
NOSE_TIP = 4
CHIN_BOTTOM = 152
LEFT_TEMPLE = 54
RIGHT_TEMPLE = 284
LEFT_CHEEK = 206
RIGHT_CHEEK = 426
LEFT_EYEBROW = 105
RIGHT_EYEBROW = 334
TOP_SKULL = 10
FOREHEAD_CENTER = 151

def detect_face(image_path):
    """
    Detect face in an image and extract landmarks.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Tuple (face_detected, face_data)
            face_detected: Boolean indicating if a face was detected
            face_data: Dictionary with face landmark coordinates if face detected
    """
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        return False, None
    
    # Convert to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process with MediaPipe
    results = face_mesh.process(image_rgb)
    
    if not results.multi_face_landmarks:
        return False, None
    
    # Get image dimensions
    height, width, _ = image.shape
    
    # Extract face landmarks
    face_landmarks = results.multi_face_landmarks[0]
    landmarks = {}
    
    for idx, landmark in enumerate(face_landmarks.landmark):
        # Convert normalized coordinates to pixel coordinates
        x = int(landmark.x * width)
        y = int(landmark.y * height)
        z = landmark.z
        landmarks[idx] = (x, y, z)
    
    # Calculate face orientation from landmarks
    orientation = calculate_face_orientation(landmarks)
    
    # Calculate face center
    face_center = calculate_face_center(landmarks)
    
    return True, {
        'landmarks': landmarks,
        'image_width': width,
        'image_height': height,
        'orientation': orientation,
        'face_center': face_center
    }

def calculate_face_orientation(landmarks):
    """
    Calculate face orientation from landmarks.
    
    Args:
        landmarks: Dictionary of landmark points
        
    Returns:
        Dictionary with roll, pitch, yaw angles in degrees
    """
    # Calculate vectors for orientation
    # This is a simplified calculation, a full head pose estimation would be more complex
    
    # Get key points
    nose = landmarks.get(NOSE_TIP)
    left_eye = landmarks.get(LEFT_EYE_OUTER)
    right_eye = landmarks.get(RIGHT_EYE_OUTER)
    chin = landmarks.get(CHIN_BOTTOM)
    
    if not all([nose, left_eye, right_eye, chin]):
        return {'roll': 0, 'pitch': 0, 'yaw': 0}
    
    # Calculate roll (tilt left/right)
    dx = right_eye[0] - left_eye[0]
    dy = right_eye[1] - left_eye[1]
    roll = math.degrees(math.atan2(dy, dx))
    
    # Calculate pitch (tilt up/down)
    dy = chin[1] - nose[1]
    dz = chin[2] - nose[2]
    pitch = math.degrees(math.atan2(dy, dz))
    
    # Calculate yaw (face left/right)
    dx = nose[0] - (left_eye[0] + right_eye[0]) / 2
    dz = nose[2] - (left_eye[2] + right_eye[2]) / 2
    yaw = math.degrees(math.atan2(dx, dz))
    
    return {
        'roll': roll,
        'pitch': pitch,
        'yaw': yaw
    }

def calculate_face_center(landmarks):
    """
    Calculate the center of the face from landmarks.
    
    Args:
        landmarks: Dictionary of landmark points
        
    Returns:
        Tuple (x, y) of face center coordinates
    """
    # Get key points
    left_eye = landmarks.get(LEFT_EYE_OUTER)
    right_eye = landmarks.get(RIGHT_EYE_OUTER)
    nose = landmarks.get(NOSE_TIP)
    chin = landmarks.get(CHIN_BOTTOM)
    
    if not all([left_eye, right_eye, nose, chin]):
        return (0, 0)
    
    # Calculate center
    x = (left_eye[0] + right_eye[0] + nose[0] + chin[0]) / 4
    y = (left_eye[1] + right_eye[1] + nose[1] + chin[1]) / 4
    
    return (int(x), int(y))

def extract_measurements(face_data):
    """
    Extract eyewear measurements from face data.
    
    Args:
        face_data: Dictionary with face landmark data
        
    Returns:
        Dictionary with eyewear measurements
    """
    if not face_data or 'landmarks' not in face_data:
        return {}
    
    landmarks = face_data['landmarks']
    
    # Get pixel to mm conversion factor
    # This would ideally be calibrated based on a reference object
    # For now, we'll use an approximate factor based on average face width
    # Average adult male face width is around 140mm
    left_temple = landmarks.get(LEFT_TEMPLE)
    right_temple = landmarks.get(RIGHT_TEMPLE)
    
    if not left_temple or not right_temple:
        return {}
    
    face_width_pixels = math.sqrt((right_temple[0] - left_temple[0])**2 + 
                                 (right_temple[1] - left_temple[1])**2)
    
    # Approximate conversion factor (pixels to mm)
    # This is a critical part that needs calibration in a real application
    pixel_to_mm = 140 / face_width_pixels
    
    # Calculate pupillary distance (PD)
    left_eye_inner = landmarks.get(LEFT_EYE_INNER)
    right_eye_inner = landmarks.get(RIGHT_EYE_INNER)
    
    if left_eye_inner and right_eye_inner:
        pd_pixels = math.sqrt((right_eye_inner[0] - left_eye_inner[0])**2 + 
                             (right_eye_inner[1] - left_eye_inner[1])**2)
        pupillary_distance = pd_pixels * pixel_to_mm
    else:
        pupillary_distance = None
    
    # Calculate bridge width
    # Distance between inner eyes
    if left_eye_inner and right_eye_inner:
        bridge_pixels = math.sqrt((right_eye_inner[0] - left_eye_inner[0])**2 + 
                                 (right_eye_inner[1] - left_eye_inner[1])**2)
        bridge_width = bridge_pixels * pixel_to_mm
    else:
        bridge_width = None
    
    # Calculate temple length (approximate)
    # From eye outer corner to ear (approximated)
    left_eye_outer = landmarks.get(LEFT_EYE_OUTER)
    right_eye_outer = landmarks.get(RIGHT_EYE_OUTER)
    
    if left_eye_outer and left_temple:
        left_temple_pixels = math.sqrt((left_temple[0] - left_eye_outer[0])**2 + 
                                      (left_temple[1] - left_eye_outer[1])**2)
        left_temple_length = left_temple_pixels * pixel_to_mm
    else:
        left_temple_length = None
    
    if right_eye_outer and right_temple:
        right_temple_pixels = math.sqrt((right_temple[0] - right_eye_outer[0])**2 + 
                                       (right_temple[1] - right_eye_outer[1])**2)
        right_temple_length = right_temple_pixels * pixel_to_mm
    else:
        right_temple_length = None
    
    # Use average of left and right if both are available
    if left_temple_length and right_temple_length:
        temple_length = (left_temple_length + right_temple_length) / 2
    else:
        temple_length = left_temple_length or right_temple_length
    
    # Calculate lens width (approximate)
    # Distance from inner to outer eye
    if left_eye_inner and left_eye_outer:
        left_lens_pixels = math.sqrt((left_eye_outer[0] - left_eye_inner[0])**2 + 
                                    (left_eye_outer[1] - left_eye_inner[1])**2)
        left_lens_width = left_lens_pixels * pixel_to_mm
    else:
        left_lens_width = None
    
    if right_eye_inner and right_eye_outer:
        right_lens_pixels = math.sqrt((right_eye_outer[0] - right_eye_inner[0])**2 + 
                                     (right_eye_outer[1] - right_eye_inner[1])**2)
        right_lens_width = right_lens_pixels * pixel_to_mm
    else:
        right_lens_width = None
    
    # Use average of left and right if both are available
    if left_lens_width and right_lens_width:
        lens_width = (left_lens_width + right_lens_width) / 2
    else:
        lens_width = left_lens_width or right_lens_width
    
    # Calculate lens height (approximate)
    # Distance from eyebrow to cheek
    left_eyebrow = landmarks.get(LEFT_EYEBROW)
    left_cheek = landmarks.get(LEFT_CHEEK)
    right_eyebrow = landmarks.get(RIGHT_EYEBROW)
    right_cheek = landmarks.get(RIGHT_CHEEK)
    
    if left_eyebrow and left_cheek:
        left_height_pixels = math.sqrt((left_cheek[0] - left_eyebrow[0])**2 + 
                                      (left_cheek[1] - left_eyebrow[1])**2)
        left_lens_height = left_height_pixels * pixel_to_mm * 0.7  # Scale factor for lens height
    else:
        left_lens_height = None
    
    if right_eyebrow and right_cheek:
        right_height_pixels = math.sqrt((right_cheek[0] - right_eyebrow[0])**2 + 
                                       (right_cheek[1] - right_eyebrow[1])**2)
        right_lens_height = right_height_pixels * pixel_to_mm * 0.7  # Scale factor for lens height
    else:
        right_lens_height = None
    
    # Use average of left and right if both are available
    if left_lens_height and right_lens_height:
        lens_height = (left_lens_height + right_lens_height) / 2
    else:
        lens_height = left_lens_height or right_lens_height
    
    # Calculate total frame width
    # Usually PD + 2 * lens width + bridge width
    if pupillary_distance and lens_width and bridge_width:
        frame_width = pupillary_distance + lens_width + bridge_width
    else:
        # Alternative calculation from temple to temple
        if left_temple and right_temple:
            frame_pixels = math.sqrt((right_temple[0] - left_temple[0])**2 + 
                                    (right_temple[1] - left_temple[1])**2)
            frame_width = frame_pixels * pixel_to_mm * 0.9  # Scale factor for frame width
        else:
            frame_width = None
    
    # Calculate face height
    forehead = landmarks.get(FOREHEAD_CENTER)
    chin = landmarks.get(CHIN_BOTTOM)
    
    if forehead and chin:
        face_height_pixels = math.sqrt((chin[0] - forehead[0])**2 + 
                                      (chin[1] - forehead[1])**2)
        face_height = face_height_pixels * pixel_to_mm
    else:
        face_height = None
    
    # Calculate face width (temple to temple)
    if left_temple and right_temple:
        face_width = face_width_pixels * pixel_to_mm
    else:
        face_width = None
    
    return {
        'pupillary_distance': round(pupillary_distance, 1) if pupillary_distance else None,
        'bridge_width': round(bridge_width, 1) if bridge_width else None,
        'temple_length': round(temple_length, 1) if temple_length else None,
        'lens_width': round(lens_width, 1) if lens_width else None,
        'lens_height': round(lens_height, 1) if lens_height else None,
        'frame_width': round(frame_width, 1) if frame_width else None,
        'face_width': round(face_width, 1) if face_width else None,
        'face_height': round(face_height, 1) if face_height else None
    } 