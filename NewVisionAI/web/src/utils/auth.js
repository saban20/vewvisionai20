/**
 * Authentication utilities for handling tokens and user sessions
 */

// Token storage key
const TOKEN_KEY = 'newvision_auth_token';
const USER_DATA_KEY = 'newvision_user_data';

/**
 * Stores the authentication token in local storage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieves the authentication token from local storage
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the authentication token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Stores user data in local storage
 * @param {Object} userData - User data object to store
 */
export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Retrieves user data from local storage
 * @returns {Object|null} The stored user data or null if not found
 */
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Removes user data from local storage
 */
export const removeUserData = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Checks if the token exists and is valid
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is valid, false otherwise
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT tokens are in the format: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return false;
    
    // Decode the base64 payload
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const { exp } = JSON.parse(jsonPayload);
    
    // Check if token is expired
    return exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Logs out the user by removing all authentication data
 */
export const logout = () => {
  removeToken();
  removeUserData();
};

/**
 * Logs in the user by storing token and user data
 * @param {string} token - JWT token
 * @param {Object} userData - User data
 */
export const login = (token, userData) => {
  setToken(token);
  setUserData(userData);
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token && isTokenValid(token);
};

/**
 * Extract user ID from JWT token
 * @returns {string|null} User ID or null if not found/invalid
 */
export const getUserId = () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    // JWT tokens are in format: header.payload.signature
    // We need to decode the payload (middle part)
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    
    // Extract the user ID from the token payload
    // This assumes the backend uses 'sub' or 'id' claim for the user ID
    return decodedPayload.sub || decodedPayload.id || null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}; 