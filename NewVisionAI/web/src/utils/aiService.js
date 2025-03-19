/**
 * AI Service
 * 
 * This service handles communication with the backend AI endpoints
 * instead of loading TensorFlow models directly in the browser.
 */

import axios from 'axios';

// Configure base axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000, // 30 seconds timeout for AI operations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add authorization token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Create a cancelable request
 * 
 * @returns {Object} Object with request method and cancel function
 */
const createCancelableRequest = () => {
  const source = axios.CancelToken.source();
  
  return {
    cancelToken: source.token,
    cancel: () => source.cancel('Request canceled by user')
  };
};

/**
 * Process a face image to get measurements
 * 
 * @param {string} imageBase64 - Base64 encoded image
 * @param {Object} options - Request options including cancelToken
 * @returns {Promise<Object>} - Measurements object
 */
export const processFace = async (imageBase64, options = {}) => {
  try {
    const response = await apiClient.post('/ai/process-face', {
      image: imageBase64
    }, {
      cancelToken: options.cancelToken
    });
    
    return response.data.measurements;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    handleApiError(error, 'Face processing failed');
  }
};

/**
 * Get eyewear recommendations based on measurements
 * 
 * @param {Object} measurements - Facial measurements
 * @param {Object} preferences - User preferences (optional)
 * @param {Object} options - Request options including cancelToken
 * @returns {Promise<Object>} - Recommendations object
 */
export const getEyewearRecommendations = async (measurements, preferences = {}, options = {}) => {
  try {
    const response = await apiClient.post('/ai/recommend-eyewear', {
      measurements,
      preferences
    }, {
      cancelToken: options.cancelToken
    });
    
    return response.data.recommendations;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    handleApiError(error, 'Eyewear recommendation failed');
  }
};

/**
 * Detect face shape from an image
 * 
 * @param {string} imageBase64 - Base64 encoded image
 * @param {Object} options - Request options including cancelToken
 * @returns {Promise<Object>} - Face shape and confidence
 */
export const detectFaceShape = async (imageBase64, options = {}) => {
  try {
    const response = await apiClient.post('/ai/face-shape', {
      image: imageBase64
    }, {
      cancelToken: options.cancelToken
    });
    
    return {
      faceShape: response.data.face_shape,
      confidence: response.data.confidence
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    handleApiError(error, 'Face shape detection failed');
  }
};

/**
 * Virtual try-on for eyewear frames
 * 
 * @param {string} imageBase64 - Base64 encoded image
 * @param {number} frameId - Frame ID to try on
 * @param {Object} options - Request options including cancelToken
 * @returns {Promise<Object>} - Result with image URL
 */
export const virtualTryOn = async (imageBase64, frameId, options = {}) => {
  try {
    const response = await apiClient.post('/ai/virtual-try-on', {
      image: imageBase64,
      frame_id: frameId
    }, {
      cancelToken: options.cancelToken
    });
    
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    handleApiError(error, 'Virtual try-on failed');
  }
};

/**
 * Handle API errors consistently
 * 
 * @param {Error} error - Error object
 * @param {string} fallbackMessage - Fallback error message
 * @throws {Error} - Re-throws with appropriate message
 */
const handleApiError = (error, fallbackMessage) => {
  let errorMessage = fallbackMessage;
  
  if (error.response) {
    // Server responded with an error
    const { data } = error.response;
    errorMessage = data.message || data.error || fallbackMessage;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Server did not respond. Please check your connection.';
  }
  
  // Log the error
  console.error(errorMessage, error);
  
  // Re-throw with appropriate message
  throw new Error(errorMessage);
};

export default {
  processFace,
  getEyewearRecommendations,
  detectFaceShape,
  virtualTryOn,
  createCancelableRequest
}; 