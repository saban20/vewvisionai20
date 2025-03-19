import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socketService';
import { getUserId } from '../utils/auth';

// Create Socket context
const SocketContext = createContext(null);

// Socket Provider component
export const SocketProvider = ({ children }) => {
  const [socketReady, setSocketReady] = useState(false);
  const [processingUpdates, setProcessingUpdates] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket when component mounts
  useEffect(() => {
    const userId = getUserId();
    
    if (userId) {
      // Initialize the socket
      socketRef.current = initializeSocket(userId);
      
      // Set up event listeners
      if (socketRef.current) {
        socketRef.current.on('connect', () => {
          console.log('Socket connected with ID:', socketRef.current.id);
          setSocketReady(true);
        });
        
        socketRef.current.on('processing_update', (data) => {
          console.log('Processing update:', data);
          setProcessingUpdates(prev => [...prev, data]);
        });
        
        socketRef.current.on('face_analysis_result', (data) => {
          console.log('Face analysis result:', data);
          setLatestAnalysis(data);
        });
      }
    }
    
    // Clean up when component unmounts
    return () => {
      disconnectSocket();
      setSocketReady(false);
      socketRef.current = null;
    };
  }, []);
  
  // Value to provide to consumers - use a memoized value to prevent unnecessary re-renders
  const contextValue = {
    socket: socketRef.current,
    socketReady,
    processingUpdates,
    latestAnalysis,
    clearUpdates: () => setProcessingUpdates([])
  };
  
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext; 