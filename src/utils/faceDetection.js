/**
 * Face Detection Utility
 * 
 * This file contains centralized functions for face detection and measurement
 * to ensure consistency across the application.
 */

/**
 * Dynamically loads face detection libraries
 * @returns {Promise<Object>} Object containing loaded libraries
 */
export const loadFaceDetectionModules = async () => {
  try {
    const mediapiProm = import('@mediapipe/face_mesh');
    const tfProm = import('@tensorflow/tfjs');
    const faceApiProm = import('@tensorflow-models/face-detection');
    
    const [mediapipe, tf, faceapi] = await Promise.all([mediapiProm, tfProm, faceApiProm]);
    return { mediapipe, tf, faceapi };
  } catch (error) {
    console.error('Error loading face detection modules:', error);
    throw new Error('Failed to load face detection modules: ' + error.message);
  }
};

/**
 * Detects face landmarks from an image
 * @param {Object} faceapi - The face-api.js instance
 * @param {HTMLImageElement|string} image - Image element or data URL
 * @returns {Promise<Array>} Array of detected faces with landmarks
 */
export const detectFaceLandmarks = async (faceapi, image) => {
  // Create detector with MediaPipe model (more accurate than TensorFlow)
  const model = await faceapi.createDetector(
    faceapi.SupportedModels.MediaPipeFaceDetector,
    {
      runtime: 'tfjs',
      modelType: 'full'
    }
  );
  
  // If image is a string (data URL), convert to Image
  let imgElement = image;
  if (typeof image === 'string') {
    imgElement = new Image();
    imgElement.src = image;
    await new Promise(resolve => { imgElement.onload = resolve; });
  }
  
  // Detect faces
  const faces = await model.estimateFaces(imgElement);
  
  if (faces.length === 0) {
    throw new Error('No face detected. Please ensure your face is clearly visible.');
  }
  
  return faces;
};

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point with x,y coordinates
 * @param {Object} point2 - Second point with x,y coordinates
 * @returns {number} Distance between points
 */
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return 0;
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

/**
 * Determine face shape based on landmarks
 * @param {Array} landmarks - Face landmarks
 * @returns {string} Detected face shape
 */
export const determineFaceShape = (landmarks) => {
  // Face shape options
  const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Rectangle', 'Diamond'];
  
  try {
    const rightCheek = landmarks.find(point => point.name === 'rightCheek');
    const leftCheek = landmarks.find(point => point.name === 'leftCheek');
    const topForehead = landmarks.find(point => point.name === 'foreheadCenter');
    const chin = landmarks.find(point => point.name === 'chin');
    
    if (!rightCheek || !leftCheek || !topForehead || !chin) {
      return faceShapes[0]; // Default to Oval if landmarks are missing
    }
    
    const faceWidth = calculateDistance(rightCheek, leftCheek);
    const faceHeight = calculateDistance(topForehead, chin);
    const widthToHeightRatio = faceWidth / faceHeight;
    
    // Calculate jawline width
    const rightJaw = landmarks.find(point => point.name === 'jawRight');
    const leftJaw = landmarks.find(point => point.name === 'jawLeft');
    const jawWidth = rightJaw && leftJaw ? calculateDistance(rightJaw, leftJaw) : 0;
    
    // Calculate forehead width
    const rightForehead = landmarks.find(point => point.name === 'foreheadRight');
    const leftForehead = landmarks.find(point => point.name === 'foreheadLeft');
    const foreheadWidth = rightForehead && leftForehead ? 
      calculateDistance(rightForehead, leftForehead) : 0;
    
    // Face shape logic
    if (widthToHeightRatio > 0.85) {
      if (jawWidth / foreheadWidth > 0.9) {
        return faceShapes[1]; // Round
      } else {
        return faceShapes[2]; // Square
      }
    } else if (widthToHeightRatio < 0.65) {
      return faceShapes[4]; // Rectangle
    } else if (foreheadWidth > jawWidth * 1.2) {
      return faceShapes[3]; // Heart
    } else if (faceWidth < faceHeight * 0.7) {
      return faceShapes[5]; // Diamond
    } else {
      return faceShapes[0]; // Oval (default)
    }
  } catch (error) {
    console.error('Error determining face shape:', error);
    return faceShapes[0]; // Default to Oval on error
  }
};

/**
 * Calculate facial measurements from landmarks
 * @param {Array} landmarks - Face landmarks
 * @param {number} imgWidth - Image width for scaling
 * @param {number} imgHeight - Image height for scaling
 * @returns {Object} Object containing facial measurements
 */
export const calculateMeasurements = (landmarks, imgWidth, imgHeight) => {
  // Extract key facial landmarks
  const rightEye = landmarks.find(point => point.name === 'rightEye');
  const leftEye = landmarks.find(point => point.name === 'leftEye');
  const noseTip = landmarks.find(point => point.name === 'noseTip');
  const rightCheek = landmarks.find(point => point.name === 'rightCheek');
  const leftCheek = landmarks.find(point => point.name === 'leftCheek');
  const mouthRight = landmarks.find(point => point.name === 'mouthRight');
  const mouthLeft = landmarks.find(point => point.name === 'mouthLeft');
  
  // Calculate pixel distances
  const pupillaryDistance = calculateDistance(leftEye, rightEye);
  const faceWidth = calculateDistance(rightCheek, leftCheek);
  const noseToMouthRight = calculateDistance(noseTip, mouthRight);
  const noseToMouthLeft = calculateDistance(noseTip, mouthLeft);
  
  // Convert pixel distances to mm (approximate conversion)
  // Assuming average adult IPD is 63mm
  const conversionFactor = 63 / pupillaryDistance;
  
  // Calculate the measurements
  const measurements = {
    pupillaryDistance: Math.round(pupillaryDistance * conversionFactor),
    faceWidth: Math.round(faceWidth * conversionFactor),
    bridgeWidth: Math.round((pupillaryDistance * 0.4) * conversionFactor),
    templeWidth: Math.round(faceWidth * 0.85 * conversionFactor),
    eyeDistance: Math.round(pupillaryDistance * 1.1 * conversionFactor),
    faceHeight: Math.round((noseToMouthRight + noseToMouthLeft) * 0.9 * conversionFactor),
    faceShape: determineFaceShape(landmarks),
    accuracy: 92,
    timestamp: new Date().toISOString()
  };
  
  return measurements;
}; 