import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { io } from 'socket.io-client';

const FaceScanner = ({ onScanComplete }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection with reconnection options
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
      setError(null);
      setReconnectAttempts(0);
      
      // Clear any existing reconnect timer
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setSocketConnected(false);
      
      // Increment reconnect attempts
      setReconnectAttempts(prev => prev + 1);
      
      // Set error message if we've tried multiple times
      if (reconnectAttempts > 2) {
        setError(`Connection to server failed. Retrying... (${reconnectAttempts})`);
      }
      
      // Manual reconnection after delay
      reconnectTimerRef.current = setTimeout(() => {
        if (newSocket && !newSocket.connected && reconnectAttempts < 5) {
          console.log('Attempting to reconnect...');
          newSocket.connect();
        } else if (reconnectAttempts >= 5) {
          setError('Could not connect to server. Please check your connection and try again later.');
        }
      }, 1000);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect manually
        reconnectTimerRef.current = setTimeout(() => {
          newSocket.connect();
        }, 1000);
      }
    });
    
    newSocket.on('measurements', (data) => {
      console.log('Received measurements:', data);
      setIsProcessing(false);
      
      if (onScanComplete) {
        onScanComplete(data);
      }
    });
    
    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message || 'An error occurred during face scanning');
      setIsProcessing(false);
    });
    
    setSocket(newSocket);
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [onScanComplete, reconnectAttempts]);

  const startCamera = () => {
    if (isStreaming) {
      stopCamera();
      return;
    }
    
    setError(null);
    
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user" 
      } 
    })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsStreaming(true);
        }
      })
      .catch(error => {
        console.error('Camera error:', error);
        setError('Failed to access camera. Please check permissions.');
      });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    if (!socket || !socketConnected) {
      setError('Server connection is not available. Please try again later.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame on canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data as base64
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Send to server via socket
      socket.emit('scan_face', {
        frame: imageData,
        method: 'mediapipe' // Default to mediapipe method
      });
    } catch (err) {
      console.error('Error capturing image:', err);
      setError('Failed to capture image. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event) => {
    if (!socket || !socketConnected) {
      setError('Server connection is not available. Please try again later.');
      return;
    }
    
    const file = event.target.files[0];
    if (file) {
      try {
        setIsProcessing(true);
        setError(null);
        const reader = new FileReader();
        
        reader.onload = (e) => {
          // Send to server via socket
          socket.emit('scan_face', {
            frame: e.target.result,
            method: 'mediapipe' // Default to mediapipe method
          });
        };
        
        reader.onerror = () => {
          setError('Failed to read the image file. Please try another file.');
          setIsProcessing(false);
        };
        
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error handling file upload:', err);
        setError('Failed to process the image file. Please try another file.');
        setIsProcessing(false);
      }
    }
  };

  const reconnectToServer = () => {
    if (socket) {
      setError('Attempting to reconnect to server...');
      setReconnectAttempts(0);
      socket.connect();
    }
  };

  return (
    <Card sx={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', p: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CameraAltIcon sx={{ fontSize: 30, color: '#CC0000', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Face Scanner
          </Typography>
          
          {/* Connection status indicator */}
          <Box 
            sx={{ 
              ml: 'auto', 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: socketConnected ? '#4CAF50' : '#F44336'
            }} 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Take a photo or upload an image to measure your facial features for perfect eyewear fit.
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)} 
            sx={{ mb: 2 }}
            action={
              !socketConnected && (
                <Button color="inherit" size="small" onClick={reconnectToServer}>
                  Reconnect
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={startCamera}
            disabled={isProcessing || (!socketConnected && isStreaming)}
            sx={{ backgroundColor: '#CC0000' }}
          >
            {isStreaming ? 'Stop Camera' : 'Start Camera'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing || !socketConnected}
            sx={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}
          >
            Upload Photo
          </Button>
          
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </Box>
        
        {isStreaming && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: '8px',
                backgroundColor: '#000000' 
              }}
            />
            
            <Button
              variant="contained"
              onClick={captureImage}
              disabled={isProcessing || !socketConnected}
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                backgroundColor: '#CC0000' 
              }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Capture'}
            </Button>
          </Box>
        )}
        
        {isProcessing && !isStreaming && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <Typography variant="body2" sx={{ color: '#AAAAAA', mt: 2 }}>
          For best results, ensure your face is well-lit and directly facing the camera.
          {!socketConnected && ' Server connection is currently unavailable.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FaceScanner; 