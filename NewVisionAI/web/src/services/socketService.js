import { io } from 'socket.io-client';
import { getAuthToken } from './authService';

// Get API URL from environment or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create socket instance
let socket = null;
let isInitializing = false;

/**
 * Initialize and connect to the WebSocket server
 * @param {string} userId - The current user's ID
 * @returns {object} The socket instance
 */
export const initializeSocket = (userId) => {
  // Only initialize once
  if (socket) return socket;
  if (isInitializing) return null;
  
  isInitializing = true;
  
  try {
    // Make sure we have a userId and token
    if (!userId) {
      console.warn('Cannot initialize socket: No user ID provided');
      isInitializing = false;
      return null;
    }
    
    const token = getAuthToken();
    if (!token) {
      console.warn('Cannot initialize socket: No auth token available');
      isInitializing = false;
      return null;
    }
    
    // Connect to the socket.io server with authentication
    socket = io(API_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      
      // Join the user's room for private messages
      socket.emit('join', { user_id: userId });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    isInitializing = false;
    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    isInitializing = false;
    return null;
  }
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    try {
      socket.disconnect();
    } catch (error) {
      console.error('Error disconnecting socket:', error);
    } finally {
      socket = null;
    }
  }
};

/**
 * Get the current socket instance
 * @returns {object|null} The socket instance or null if not initialized
 */
export const getSocket = () => socket;

/**
 * Subscribe to a socket event
 * @param {string} event - The event name to subscribe to
 * @param {function} callback - The callback function to execute when the event is received
 */
export const subscribeToEvent = (event, callback) => {
  if (socket && event && typeof callback === 'function') {
    socket.on(event, callback);
  } else {
    if (!socket) {
      console.warn('Socket not initialized. Call initializeSocket first.');
    }
  }
};

/**
 * Unsubscribe from a socket event
 * @param {string} event - The event name to unsubscribe from
 * @param {function} callback - The callback function to remove
 */
export const unsubscribeFromEvent = (event, callback) => {
  if (socket && event) {
    if (callback && typeof callback === 'function') {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

/**
 * Send an event to the server
 * @param {string} event - The event name to emit
 * @param {object} data - The data to send
 */
export const emitEvent = (event, data) => {
  if (socket && event) {
    try {
      socket.emit(event, data);
    } catch (error) {
      console.error(`Error emitting event ${event}:`, error);
    }
  } else {
    if (!socket) {
      console.warn('Socket not initialized. Call initializeSocket first.');
    }
  }
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
  subscribeToEvent,
  unsubscribeFromEvent,
  emitEvent
}; 