import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress, 
  Chip,
  Alert,
  Grid
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { AccessibilityContext, AIContext, ThemeContext } from '../index';
import { SocketContext } from '../context/SocketContext';
import AIEyewearEngine from '../utils/AIEyewearEngine';

// Animation keyframes
const scan = keyframes`
  0% { top: 20%; }
  50% { top: 80%; }
  100% { top: 20%; }
`;

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

// Styled components
const ScanLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '2px',
  left: 0,
  right: 0,
  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
  boxShadow: `0 0 8px ${theme.palette.primary.main}`,
  zIndex: 2,
  animation: `${scan} 3s ease-in-out infinite`
}));

const ScannerLabel = styled(Box)(({ theme, processing }) => ({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 16px',
  borderRadius: 20,
  background: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  zIndex: 3,
  animation: processing ? `${pulse} 1.5s ease-in-out infinite` : 'none'
}));

/**
 * FaceScanner3D component for scanning and analyzing user's face
 * 
 * @param {Object} props
 * @param {Function} props.onResults - Callback for when scan is complete
 * @param {boolean} props.isIOS - Whether running on iOS device
 */
const FaceScanner3D = ({ onResults, isIOS = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [calibrationFactor, setCalibrationFactor] = useState(1.0);
  const [cameraReady, setCameraReady] = useState(false);
  
  const { themeMode } = useContext(ThemeContext);
  const { reduceMotion } = useContext(AccessibilityContext);
  const { status: aiStatus, setStatus: setAIStatus } = useContext(AIContext);
  const { connected, connect, emit } = useContext(SocketContext);
  const navigate = useNavigate();
  
  const darkMode = themeMode === 'dark';

  // Connect to socket server
  useEffect(() => {
    connect();
    setServerConnected(connected);
  }, [connect, connected]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCameraReady(true);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError(`Camera error: ${error.message}`);
      }
    };
    
    initCamera();
    
    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize AI engine
  useEffect(() => {
    const initEngine = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        setStatus('Loading AI model...');
        const aiEngine = new AIEyewearEngine(
          videoRef.current, 
          canvasRef.current, 
          isIOS,
          // Progress callback
          (progress) => {
            if (progress.stage === 'model_ready') {
              setStatus('Ready');
            } else {
              setStatus(`${progress.stage} (${progress.progress}%)`);
            }
          }
        );
        
        // Apply calibration factor if available
        if (calibrationFactor !== 1.0) {
          aiEngine.setCalibrationFactor(calibrationFactor);
        }
        
        await aiEngine.initialize();
        setEngine(aiEngine);
        
        // Start continuous face detection
        aiEngine.start();
        
        // Update global AI status
        setAIStatus(prev => ({
          ...prev,
          faceScannerReady: true
        }));
      } catch (err) {
        console.error('Engine init error:', err);
        setError(`Failed to initialize scanner: ${err.message}`);
        setStatus('Error');
      }
    };
    
    if (cameraReady) {
      initEngine();
    }
    
    return () => {
      if (engine) {
        engine.stop();
      }
    };
  }, [cameraReady, isIOS, calibrationFactor, setAIStatus, engine]);

  const handleCapture = async () => {
    if (!engine) {
      setError('Scanner not ready yet');
      return;
    }
    
    setStatus('Processing...');
    setProcessing(true);
    
    try {
      // Get face measurements and analysis
      const localResults = engine.getResults();
      
      if (!localResults) {
        throw new Error('No face detected. Please position your face in the center of the frame.');
      }
      
      // Process with server if connected
      if (serverConnected) {
        // Emit data to socket server
        emit('analyze_face', localResults, (serverResults) => {
          if (serverResults.error) {
            setError(`Server error: ${serverResults.error}`);
            finishProcessing(localResults);
          } else {
            // Merge local and server results
            finishProcessing({
              ...localResults,
              ...serverResults,
              processingMode: 'realtime'
            });
          }
        });
      } else {
        // Just use local results
        finishProcessing({
          ...localResults,
          processingMode: 'offline'
        });
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(`Processing failed: ${err.message}`);
      setStatus('Failed');
      setProcessing(false);
    }
  };
  
  const finishProcessing = (results) => {
    setStatus('Scan complete');
    setProcessing(false);
    
    // Call the callback with results
    onResults(results);
    
    // Navigate to results page
    setTimeout(() => {
      navigate('/results');
    }, 500);
  };
  
  // Set calibration factor
  const setCalibration = (factor) => {
    setCalibrationFactor(factor);
    if (engine) {
      engine.setCalibrationFactor(factor);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'relative', 
        overflow: 'hidden', 
        mb: 3,
        bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              Quantum Resonance Scanner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Position your face in the center and maintain a neutral expression
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              icon={serverConnected ? <WifiIcon /> : <WifiOffIcon />}
              label={serverConnected ? "Online" : "Offline"}
              color={serverConnected ? "success" : "warning"}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ position: 'relative', m: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <video 
            ref={videoRef} 
            style={{ 
              width: '100%',
              maxHeight: '60vh',
              transform: 'scaleX(-1)' // Mirror view
            }} 
            autoPlay 
            muted 
            playsInline 
          />
          
          <canvas 
            ref={canvasRef} 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%',
              height: '100%',
              transform: 'scaleX(-1)' // Mirror to match video
            }}
          />
          
          {!reduceMotion && !processing && (
            <ScanLine data-testid="scan-line" />
          )}
          
          <ScannerLabel processing={processing}>
            {processing && <CircularProgress size={16} color="primary" />}
            <Typography variant="body2">{status}</Typography>
          </ScannerLabel>
        </Box>
      </Box>
      
      <Box sx={{ p: 3, pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          startIcon={<PhotoCameraIcon />}
          disabled={processing || status === 'Initializing...' || !!error}
          onClick={handleCapture}
        >
          Capture & Analyze
        </Button>
      </Box>
    </Paper>
  );
};

export default FaceScanner3D; 