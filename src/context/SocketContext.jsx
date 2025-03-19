import React, { createContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext({
  socket: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
  emit: () => {},
  on: () => {},
  off: () => {},
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://api.newvisionai.com';
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Connect to Socket.IO server
  const connect = useCallback(() => {
    if (socket) {
      disconnect();
    }
    
    try {
      const socketInstance = io(SOCKET_URL, {
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 3000,
        transports: ['websocket', 'polling'],
      });
      
      socketInstance.on('connect', () => {
        setConnected(true);
        setReconnectAttempt(0);
        console.log('Socket.IO connected');
      });
      
      socketInstance.on('disconnect', (reason) => {
        setConnected(false);
        console.log(`Socket.IO disconnected: ${reason}`);
      });
      
      socketInstance.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setReconnectAttempt((prev) => prev + 1);
      });
      
      socketInstance.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Socket.IO reconnection attempt ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`);
        setReconnectAttempt(attemptNumber);
      });
      
      socketInstance.on('reconnect_failed', () => {
        console.error('Socket.IO reconnection failed after maximum attempts');
      });
      
      setSocket(socketInstance);
    } catch (error) {
      console.error('Failed to connect to Socket.IO:', error);
    }
  }, [socket, SOCKET_URL, MAX_RECONNECT_ATTEMPTS]);
  
  // Disconnect from Socket.IO
  const disconnect = useCallback(() => {
    if (socket) {
      try {
        socket.disconnect();
        setConnected(false);
      } catch (error) {
        console.error('Error disconnecting from Socket.IO:', error);
      }
    }
    
    setSocket(null);
  }, [socket]);
  
  // Emit event to Socket.IO server
  const emit = useCallback((eventName, data, callback) => {
    if (socket && connected) {
      try {
        socket.emit(eventName, data, callback);
        return true;
      } catch (error) {
        console.error(`Error emitting event ${eventName}:`, error);
        return false;
      }
    }
    return false;
  }, [socket, connected]);
  
  // Add event listener
  const on = useCallback((eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
      return true;
    }
    return false;
  }, [socket]);
  
  // Remove event listener
  const off = useCallback((eventName, callback) => {
    if (socket) {
      socket.off(eventName, callback);
      return true;
    }
    return false;
  }, [socket]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      connect, 
      disconnect, 
      emit, 
      on, 
      off 
    }}>
      {children}
    </SocketContext.Provider>
  );
}; 