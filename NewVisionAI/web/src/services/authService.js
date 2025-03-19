/**
 * Authentication service for token management
 */

// Token storage key
const TOKEN_KEY = 'newvision_auth_token';

/**
 * Get the auth token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set the auth token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the auth token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if a user is authenticated
 * @returns {boolean} True if the user has a valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // JWT tokens format: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return false;
    
    // Decode the base64 payload
    const decodedData = JSON.parse(atob(payload));
    
    // Check if token is expired
    const expiration = decodedData.exp * 1000; // convert to milliseconds
    return expiration > Date.now();
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated
}; 