/**
 * Debug Utilities for VisionAI
 * 
 * This file contains utilities for debugging VisionAI components
 * and tracking data flow through the application.
 */

// Enable/disable debug mode globally
const DEBUG_MODE = process.env.NODE_ENV === 'development';

/**
 * Log messages in development mode only
 * @param {String} component - Component name
 * @param {String} message - Message to log
 * @param {*} data - Optional data to log
 */
export const debugLog = (component, message, data = null) => {
  if (!DEBUG_MODE) return;
  
  const style = 'background: #0066cc; color: white; padding: 2px 4px; border-radius: 2px;';
  
  if (data) {
    console.groupCollapsed(`%c${component}%c ${message}`, style, '');
    console.log(data);
    console.groupEnd();
  } else {
    console.log(`%c${component}%c ${message}`, style, '');
  }
};

/**
 * Track API calls for debugging
 * @param {String} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @param {Object} response - API response
 */
export const trackApiCall = (endpoint, params, response) => {
  if (!DEBUG_MODE) return;
  
  console.groupCollapsed(`%cAPI Call%c ${endpoint}`, 'background: #cc6600; color: white; padding: 2px 4px; border-radius: 2px;', '');
  console.log('Params:', params);
  console.log('Response:', response);
  console.groupEnd();
};

/**
 * Track face detection process
 * @param {Object} imageData - Image data
 * @param {Object} detectionResult - Detection result
 */
export const trackFaceDetection = (imageData, detectionResult) => {
  if (!DEBUG_MODE) return;
  
  console.groupCollapsed('%cFace Detection%c Result', 
                        'background: #990066; color: white; padding: 2px 4px; border-radius: 2px;', '');
  console.log('Detection Result:', detectionResult);
  if (detectionResult && detectionResult.pupillaryDistance) {
    console.log(`Pupillary Distance: ${detectionResult.pupillaryDistance}mm`);
  }
  console.groupEnd();
};

/**
 * Track errors for debugging
 * @param {String} component - Component name
 * @param {Error} error - Error object
 * @param {String} context - Additional context
 */
export const trackError = (component, error, context = '') => {
  if (!DEBUG_MODE) return;
  
  console.groupCollapsed(`%cERROR%c ${component} ${context}`, 
                        'background: #cc0000; color: white; padding: 2px 4px; border-radius: 2px;', '');
  console.error(error);
  console.groupEnd();
  
  // You could also send errors to a monitoring service here
};

/**
 * Create a performance tracker for timing operations
 * @param {String} operationName - Name of the operation to track
 * @returns {Function} Call to end timing and log result
 */
export const trackPerformance = (operationName) => {
  if (!DEBUG_MODE) return () => {};
  
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`%cPerformance%c ${operationName}: ${duration.toFixed(2)}ms`, 
               'background: #006600; color: white; padding: 2px 4px; border-radius: 2px;', '');
  };
};

/**
 * Add debug info to a DOM element (in dev mode only)
 * @param {HTMLElement} element - DOM element
 * @param {Object} debugInfo - Debug information to display
 */
export const attachDebugInfo = (element, debugInfo) => {
  if (!DEBUG_MODE || !element) return;
  
  // Create debug info element
  const debugElement = document.createElement('div');
  debugElement.className = 'debug-info';
  debugElement.style.cssText = 'position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-size: 10px; z-index: 9999;';
  
  // Add debug info
  let debugText = '';
  for (const [key, value] of Object.entries(debugInfo)) {
    debugText += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}<br>`;
  }
  
  debugElement.innerHTML = debugText;
  
  // Add to element
  element.style.position = 'relative';
  element.appendChild(debugElement);
}; 