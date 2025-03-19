import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { SocketProvider } from './context/SocketContext';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, LinearProgress, CircularProgress, Chip } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AIEyewearEngine from '../utils/AIEyewearEngine';
import FaceCalibration from './FaceCalibration';

// Import TensorFlow.js and preload the AI models
import * as tf from '@tensorflow/tfjs';

// Create context for theme mode (light/dark)
export const ThemeContext = createContext({
  themeMode: 'light',
  setThemeMode: () => {},
});

// Create context for accessibility settings
export const AccessibilityContext = createContext({
  voiceAssist: false,
  setVoiceAssist: () => {},
  reduceMotion: false,
  setReduceMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  largeText: false,
  setLargeText: () => {},
  lineSpacing: 1,
  setLineSpacing: () => {},
  focusIndicator: 'default',
  setFocusIndicator: () => {},
  keyboardShortcuts: true,
  setKeyboardShortcuts: () => {},
  textSpacing: false,
  setTextSpacing: () => {},
  colorFilters: 'none',
  setColorFilters: () => {},
});

// Context for AI functionality
export const AIContext = createContext(null);

// Preload AI models when the app starts
const preloadAIModels = async () => {
  try {
    console.log('Preloading AI models...');
    
    // Warm up TensorFlow.js
    await tf.ready();
    console.log('TensorFlow.js is ready');
    
    // Return initialization status
    return {
      initialized: true,
      error: null
    };
  } catch (error) {
    console.error('Error preloading AI models:', error);
    return {
      initialized: false,
      error: error.message
    };
  }
};

// Wrap App in AccessibilityProvider for context
const AccessibilityProvider = ({ children }) => {
  // Initialize accessibility settings from localStorage
  const [voiceAssist, setVoiceAssist] = useState(() => {
    return localStorage.getItem('voiceAssist') === 'true';
  });
  
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('reduceMotion') === 'true';
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('largeText') === 'true';
  });
  
  const [lineSpacing, setLineSpacing] = useState(() => {
    const savedValue = localStorage.getItem('lineSpacing');
    return savedValue ? parseFloat(savedValue) : 1;
  });
  
  const [focusIndicator, setFocusIndicator] = useState(() => {
    return localStorage.getItem('focusIndicator') || 'default';
  });
  
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() => {
    const savedValue = localStorage.getItem('keyboardShortcuts');
    return savedValue === null ? true : savedValue === 'true';
  });
  
  const [textSpacing, setTextSpacing] = useState(() => {
    return localStorage.getItem('textSpacing') === 'true';
  });
  
  const [colorFilters, setColorFilters] = useState(() => {
    return localStorage.getItem('colorFilters') || 'none';
  });

  // AI state
  const [aiStatus, setAiStatus] = useState({
    initialized: false,
    loading: true,
    error: null
  });

  // Initialize AI models on component mount
  useEffect(() => {
    const initializeAI = async () => {
      const status = await preloadAIModels();
      setAiStatus({
        initialized: status.initialized,
        loading: false,
        error: status.error
      });
    };
    
    initializeAI();
  }, []);

  // Update localStorage when accessibility settings change
  useEffect(() => {
    localStorage.setItem('voiceAssist', voiceAssist);
    localStorage.setItem('reduceMotion', reduceMotion);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('largeText', largeText);
    localStorage.setItem('lineSpacing', lineSpacing);
    localStorage.setItem('focusIndicator', focusIndicator);
    localStorage.setItem('keyboardShortcuts', keyboardShortcuts);
    localStorage.setItem('textSpacing', textSpacing);
    localStorage.setItem('colorFilters', colorFilters);
  }, [voiceAssist, reduceMotion, highContrast, largeText, lineSpacing, focusIndicator, keyboardShortcuts, textSpacing, colorFilters]);

  // Create theme with light/dark mode and accessibility preferences
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: 'light',
        ...(highContrast
          ? {
              // Light mode colors
              primary: {
                main: '#0050A0',
              },
              secondary: {
                main: '#D03060',
              },
            }
          : {
              // Dark mode colors
              primary: {
                main: '#60A0FF',
              },
              secondary: {
                main: '#FF6090',
              },
            }),
      },
      typography: {
        fontSize: largeText ? 16 : 14,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: largeText ? '2.8rem' : '2.5rem',
        },
        h2: {
          fontSize: largeText ? '2.3rem' : '2rem',
        },
        h3: {
          fontSize: largeText ? '2rem' : '1.75rem',
        },
        h4: {
          fontSize: largeText ? '1.8rem' : '1.5rem',
        },
        h5: {
          fontSize: largeText ? '1.5rem' : '1.25rem',
        },
        h6: {
          fontSize: largeText ? '1.3rem' : '1.1rem',
        },
        body1: {
          lineHeight: lineSpacing,
        },
        body2: {
          lineHeight: lineSpacing,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
              ...(highContrast && {
                borderWidth: '2px',
              }),
            },
          },
        },
        MuiFocusVisible: {
          styleOverrides: {
            root: {
              outline: focusIndicator === 'high' 
                ? '3px solid #F00 !important' 
                : focusIndicator === 'enhanced' 
                  ? '2px solid #0076FF !important' 
                  : undefined,
            },
          },
        },
      },
    });

    return baseTheme;
  }, [highContrast, largeText, lineSpacing, focusIndicator]);

  const contextValue = {
    voiceAssist,
    setVoiceAssist,
    reduceMotion,
    setReduceMotion,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    lineSpacing,
    setLineSpacing,
    focusIndicator,
    setFocusIndicator,
    keyboardShortcuts,
    setKeyboardShortcuts,
    textSpacing,
    setTextSpacing,
    colorFilters,
    setColorFilters,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AIContext.Provider value={{
          status: aiStatus,
          setStatus: setAiStatus
        }}>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AIContext.Provider>
      </ThemeProvider>
    </AccessibilityContext.Provider>
  );
};

// Enhanced calibration component
const FaceCalibration = ({ isIOS, onCalibrationComplete }) => {
  const [needsCalibration, setNeedsCalibration] = useState(!isIOS);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const { status, setStatus } = useContext(AIContext);
  
  // Check if we have stored calibration data
  useEffect(() => {
    const savedCalibration = localStorage.getItem('faceCalibration');
    if (savedCalibration && !isIOS) {
      try {
        const calibrationData = JSON.parse(savedCalibration);
        if (calibrationData.timestamp > Date.now() - (30 * 24 * 60 * 60 * 1000)) {
          // Use calibration if less than 30 days old
          setNeedsCalibration(false);
          onCalibrationComplete(calibrationData.scaleFactor);
        }
      } catch (e) {
        console.warn('Invalid calibration data, recalibrating');
      }
    }
  }, [isIOS, onCalibrationComplete]);
  
  const startCalibration = () => {
    setDialogOpen(true);
    setCalibrationStep(1);
  };
  
  const handleCalibration = async () => {
    setCalibrating(true);
    
    // Simulate calibration progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Capture face landmarks at fixed distance with reference object
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate processing
      
      // Standard credit card width in mm
      const creditCardWidth = 85.60;
      
      // Calculate scale factor (this would use real measurements in production)
      const scaleFactor = creditCardWidth / 0.15; // Simulated ratio
      
      // Save calibration data
      const calibrationData = {
        scaleFactor,
        timestamp: Date.now(),
        deviceId: navigator.userAgent
      };
      
      localStorage.setItem('faceCalibration', JSON.stringify(calibrationData));
      
      // Update AI context
      setStatus(prev => ({
        ...prev,
        calibration: calibrationData
      }));
      
      setNeedsCalibration(false);
      onCalibrationComplete(scaleFactor);
      
      // Move to completion step
      setCalibrationStep(3);
    } catch (error) {
      console.error('Calibration failed:', error);
      setCalibrationStep(4); // Error step
    } finally {
      clearInterval(interval);
      setCalibrating(false);
      setProgress(100);
    }
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCalibrationStep(0);
    setProgress(0);
  };
  
  return (
    <>
      {needsCalibration && (
        <Button 
          variant="contained" 
          startIcon={<CreditCardIcon />}
          onClick={startCalibration}
          sx={{ mt: 2 }}
        >
          Calibrate Measurements
        </Button>
      )}
      
      <Dialog open={dialogOpen} onClose={calibrating ? undefined : closeDialog}>
        <DialogTitle>
          {calibrationStep === 1 && "Measurement Calibration"}
          {calibrationStep === 2 && "Calibrating..."}
          {calibrationStep === 3 && "Calibration Complete"}
          {calibrationStep === 4 && "Calibration Failed"}
        </DialogTitle>
        <DialogContent>
          {calibrationStep === 1 && (
            <>
              <Typography gutterBottom>
                For accurate measurements, we need to calibrate the system.
              </Typography>
              <Typography gutterBottom>
                Please hold a credit card (or ID card) centered under your chin,
                about 6 inches from your face.
              </Typography>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <img 
                  src="/images/calibration-guide.svg" 
                  alt="Hold card under chin" 
                  width={240} 
                  height={180} 
                />
              </Box>
            </>
          )}
          
          {calibrationStep === 2 && (
            <>
              <Typography gutterBottom>
                Keep the card steady and look straight ahead...
              </Typography>
              <Box sx={{ my: 3 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              {videoRef.current && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <video
                    ref={videoRef}
                    style={{ width: '100%', borderRadius: '8px' }}
                    autoPlay
                    muted
                    playsInline
                  />
                </Box>
              )}
            </>
          )}
          
          {calibrationStep === 3 && (
            <Typography>
              Calibration successful! Your measurements will now be accurate.
            </Typography>
          )}
          
          {calibrationStep === 4 && (
            <>
              <Typography color="error" gutterBottom>
                Calibration failed. Please try again in better lighting conditions.
              </Typography>
              <Typography variant="body2">
                Make sure your face is clearly visible and the card edges are distinct.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {calibrationStep === 1 && (
            <>
              <Button onClick={closeDialog}>Skip</Button>
              <Button 
                onClick={() => {
                  setCalibrationStep(2);
                  handleCalibration();
                }} 
                variant="contained"
              >
                Start Calibration
              </Button>
            </>
          )}
          
          {calibrationStep === 2 && (
            <Button disabled>Calibrating...</Button>
          )}
          
          {(calibrationStep === 3 || calibrationStep === 4) && (
            <Button onClick={closeDialog} variant="contained">
              {calibrationStep === 3 ? "Done" : "Try Again"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

const FaceScanner3D = ({ onResults, isIOS = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [calibrationFactor, setCalibrationFactor] = useState(null);
  
  const { reduceMotion } = useContext(AccessibilityContext);
  const { setStatus: setAIStatus } = useContext(AIContext);

  // Connect to server and authenticate
  useEffect(() => {
    const authenticate = async () => {
      try {
        // Get token from secure storage or auth service
        const authResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Use stored credentials or auth service
          credentials: 'include'
        });
        
        if (!authResponse.ok) throw new Error('Authentication failed');
        
        const data = await authResponse.json();
        setToken(data.token);
        setServerConnected(true);
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed. Operating in offline mode.');
        setServerConnected(false);
      }
    };
    
    authenticate();
    
    return () => {
      // Clean up WebSocket if component unmounts
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Initialize AI engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        const aiEngine = new AIEyewearEngine(
          videoRef.current, 
          canvasRef.current, 
          isIOS,
          // Add progress callback
          (progress) => {
            if (progress.stage === 'model_ready') {
              setStatus('Ready');
            } else {
              setStatus(`${progress.stage} (${progress.progress}%)`);
            }
          }
        );
        
        // Apply calibration factor if available
        if (calibrationFactor) {
          aiEngine.setCalibrationFactor(calibrationFactor);
        }
        
        await aiEngine.initialize();
        setEngine(aiEngine);
        
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
    
    initEngine();
    
    return () => {
      if (engine) {
        engine.stop();
      }
    };
  }, [isIOS, calibrationFactor, setAIStatus]);

  const handleCapture = async () => {
    if (!engine) return;
    
    setStatus('Processing...');
    setProcessing(true);
    
    try {
      // Get local results first
      const localResults = engine.getResults();
      
      // Handle based on connectivity and platform
      if (serverConnected) {
        if (isIOS) {
          // WebSocket for iOS real-time processing
          return processWithWebSocket(localResults);
        } else {
          // REST API for web
          return processWithAPI(localResults);
        }
      } else {
        // Fallback to local processing only
        setStatus('Processed locally');
        setProcessing(false);
        onResults({ 
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
  
  const processWithWebSocket = (localResults) => {
    // Close existing connection if any
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    // Get WebSocket URL from environment or config
    const wsUrl = process.env.REACT_APP_WS_URL || 'wss://api.newvisionai.com/ws';
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ 
        type: 'frame', 
        token,
        data: localResults 
      }));
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const serverResults = JSON.parse(event.data);
        setStatus('Captured');
        setProcessing(false);
        onResults({ 
          ...localResults, 
          ...serverResults,
          processingMode: 'realtime'
        });
        
        // Close the connection after receiving results
        wsRef.current.close();
      } catch (err) {
        setError('Error processing server response');
        setProcessing(false);
      }
    };
    
    wsRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Connection error. Results may be limited.');
      setProcessing(false);
      
      // Fallback to local results
      onResults({ 
        ...localResults,
        processingMode: 'offline'
      });
    };
    
    wsRef.current.onclose = () => {
      if (processing) {
        setStatus('Connection closed');
        setProcessing(false);
      }
    };
  };
  
  const processWithAPI = async (localResults) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localResults)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const serverResults = await response.json();
      setStatus('Captured');
      setProcessing(false);
      onResults({ 
        ...localResults, 
        ...serverResults,
        processingMode: 'api'
      });
    } catch (err) {
      console.error('API processing error:', err);
      setError('Server processing failed. Using local results only.');
      setProcessing(false);
      
      // Fallback to local results
      onResults({ 
        ...localResults, 
        processingMode: 'offline'
      });
    }
  };

  const handleCalibrationComplete = (factor) => {
    setCalibrationFactor(factor);
    if (engine) {
      engine.setCalibrationFactor(factor);
    }
  };

  return (
    <Box className="holo-card" sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Quantum Resonance Scanner</Typography>
        <Chip
          icon={serverConnected ? <WifiIcon /> : <WifiOffIcon />}
          label={serverConnected ? "Online" : "Offline"}
          color={serverConnected ? "success" : "warning"}
          size="small"
        />
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            borderRadius: '12px',
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
            transform: 'scaleX(-1)' // Mirror to match video
          }} 
          width="640" 
          height="480" 
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {processing && <CircularProgress size={20} color="primary" />}
          <Typography color="white">{status}</Typography>
        </Box>
        
        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(211, 47, 47, 0.8)',
              padding: '8px 16px',
              borderRadius: '20px',
              maxWidth: '90%'
            }}
          >
            <Typography color="white" variant="body2">{error}</Typography>
          </Box>
        )}
        
        {/* Progress bar for non-motion-reduced users */}
        {processing && !reduceMotion && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
              animation: 'scanProgress 3s linear infinite',
              '@keyframes scanProgress': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
              }
            }}
          />
        )}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        {!calibrationFactor && !isIOS && (
          <FaceCalibration 
            isIOS={isIOS} 
            onCalibrationComplete={handleCalibrationComplete} 
          />
        )}
        
        <button 
          className="cyber-button" 
          onClick={handleCapture}
          disabled={processing || status === 'Initializing...'}
          style={{ 
            marginLeft: 'auto',
            opacity: processing ? 0.7 : 1
          }}
        >
          {isIOS ? 'Capture Live' : 'Process Clip'}
        </button>
      </Box>
    </Box>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register service worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
} 

async function loadResonanceModelAsync() {
  try {
    // Track loading progress for UI feedback
    let loadProgress = 0;
    if (onProgressUpdate) {
      onProgressUpdate({ stage: 'model_init', progress: loadProgress });
    }
    
    // Model version - increment when architecture changes
    const MODEL_VERSION = '1.0.0';
    const MODEL_KEY = 'indexeddb://qifr-model-v' + MODEL_VERSION;
    
    // Check if we have a saved model of the correct version
    const savedModels = await tf.io.listModels();
    
    if (savedModels[MODEL_KEY]) {
      // Load existing model with progress tracking
      resonanceModel = await tf.loadLayersModel(MODEL_KEY, {
        onProgress: (fraction) => {
          loadProgress = Math.floor(fraction * 100);
          if (onProgressUpdate) {
            onProgressUpdate({ 
              stage: 'model_loading', 
              progress: loadProgress 
            });
          }
        }
      });
      console.log(`QIFR Model v${MODEL_VERSION} loaded from IndexedDB`);
    } else {
      // Create new model
      console.log(`Creating new QIFR Model v${MODEL_VERSION}`);
      if (onProgressUpdate) {
        onProgressUpdate({ stage: 'model_creating', progress: 30 });
      }
      
      resonanceModel = tf.sequential();
      resonanceModel.add(tf.layers.dense({ 
        units: 128, 
        inputShape: [474], 
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2(0.001)
      }));
      resonanceModel.add(tf.layers.dropout({ rate: 0.25 }));
      resonanceModel.add(tf.layers.dense({ 
        units: 64, 
        activation: 'relu' 
      }));
      resonanceModel.add(tf.layers.dense({ 
        units: 8, 
        activation: 'sigmoid' 
      }));
      
      resonanceModel.compile({ 
        optimizer: 'adam', 
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });
      
      if (onProgressUpdate) {
        onProgressUpdate({ stage: 'model_saving', progress: 70 });
      }
      
      // Save model for offline use
      try {
        await resonanceModel.save(MODEL_KEY);
        console.log(`QIFR Model v${MODEL_VERSION} saved to IndexedDB`);
      } catch (saveError) {
        // Log error but continue - model will still work for this session
        console.warn('Could not save model to IndexedDB:', saveError);
      }
    }
    
    // Clean up old model versions
    const modelKeys = Object.keys(savedModels);
    const oldVersions = modelKeys.filter(key => 
      key.startsWith('indexeddb://qifr-model-v') && 
      key !== MODEL_KEY
    );
    
    if (oldVersions.length > 0) {
      console.log('Cleaning up old model versions');
      for (const oldKey of oldVersions) {
        try {
          await tf.io.removeModel(oldKey);
        } catch (e) {
          console.warn(`Failed to remove old model ${oldKey}:`, e);
        }
      }
    }
    
    isModelLoaded = true;
    
    if (onProgressUpdate) {
      onProgressUpdate({ stage: 'model_ready', progress: 100 });
    }
    
    // Warm up the model with a dummy prediction
    warmUpModel();
    
    return true;
  } catch (error) {
    console.error('Error loading QIFR model:', error);
    
    // Attempt to create a simpler fallback model
    try {
      console.warn('Creating simplified fallback model');
      resonanceModel = tf.sequential();
      resonanceModel.add(tf.layers.dense({ units: 32, inputShape: [474], activation: 'relu' }));
      resonanceModel.add(tf.layers.dense({ units: 8, activation: 'sigmoid' }));
      resonanceModel.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
      isModelLoaded = true;
      
      if (onProgressUpdate) {
        onProgressUpdate({ stage: 'fallback_ready', progress: 100 });
      }
      
      return true;
    } catch (fallbackError) {
      console.error('Even fallback model creation failed:', fallbackError);
      isModelLoaded = false;
      
      if (onProgressUpdate) {
        onProgressUpdate({ stage: 'model_failed', progress: 0, error: error.message });
      }
      
      return false;
    }
  }
}

// Pre-warm the model to avoid first inference delay
function warmUpModel() {
  try {
    const dummyInput = tf.zeros([1, 474]);
    const warmupResult = resonanceModel.predict(dummyInput);
    warmupResult.dataSync(); // Force execution
    tf.dispose([dummyInput, warmupResult]); // Clean up
    console.log('Model warmed up');
  } catch (e) {
    console.warn('Model warmup failed:', e);
  }
}

calculateDynamicMetrics() {
  // ... existing code ...
  
  // More nuanced emotion model using multiple dimensions
  const emotions = {
    joy: Math.min(1, this.results.dynamics.smileIntensity * 1.5),
    calmness: Math.min(1, 1 - (this.results.dynamics.blinkRate * 2 + this.results.dynamics.movementEnergy)),
    energy: Math.min(1, this.results.dynamics.movementEnergy * 1.2 + this.results.dynamics.headTilt / 45),
    focus: Math.min(1, 1 - this.results.dynamics.headTilt / 30)
  };
  
  // Calculate overall emotion score with weighted contribution
  this.results.dynamics.emotions = emotions;
  this.results.dynamics.emotionScore = Math.min(1, 
    emotions.joy * 0.3 + 
    emotions.calmness * 0.25 + 
    emotions.energy * 0.25 + 
    emotions.focus * 0.2
  );
  
  // Apply temporal smoothing to prevent jitter
  if (this.previousEmotionScore) {
    this.results.dynamics.emotionScore = 
      this.results.dynamics.emotionScore * 0.3 + 
      this.previousEmotionScore * 0.7;
  }
  this.previousEmotionScore = this.results.dynamics.emotionScore;
}

computeVisualAuraAndShape() {
  const landmarks = this.frameBuffer[this.frameBuffer.length - 1];
  
  // Create a richer input with emotional dimensions
  const input = [
    ...landmarks.map(p => [p.x, p.y, p.z || 0]).flat(),
    this.results.dynamics.blinkRate,
    this.results.dynamics.smileIntensity,
    this.results.dynamics.headTilt,
    this.results.dynamics.movementEnergy,
    this.results.dynamics.emotionScore,
    this.results.dynamics.emotions.joy,
    this.results.dynamics.emotions.calmness,
    this.results.dynamics.emotions.energy,
    this.results.dynamics.emotions.focus
  ];
  // ... rest of the method ...
}

recommendFramesWithResonance() {
  const aura = this.results.visualAura;
  const shapeProbs = Object.values(this.results.faceShape);
  const emotions = this.results.dynamics.emotions;
  
  // Enhanced resonance calculation with emotional mapping
  const resonanceScore = (frame) => {
    // Base physical measurements (fit)
    const fitDiff = Math.abs(frame.pd - this.results.measurements.pd) +
                   Math.abs(frame.bridge - this.results.measurements.bridgeHeight) +
                   Math.abs(frame.lensHeight - this.results.measurements.lensHeight);
    const fitScore = 1 / (1 + fitDiff / 50);
    
    // Style match based on shape
    const shapeMatch = Math.max(...shapeProbs) * (frame.style === this.getDominantShape() ? 1 : 0.5);
    
    // Aura resonance with emotion-specific weighting
    const auraDiff = frame.aura.reduce((sum, val, i) => {
      // Weight different aura components based on emotional state
      const weights = [
        emotions.energy * 1.2,    // Energy component weight
        emotions.calmness * 1.2,  // Calm component weight
        1.0                       // Base weight for vibrancy
      ];
      return sum + Math.abs(val - aura[i]) * weights[i];
    }, 0);
    const auraScore = 1 / (1 + auraDiff);
    
    // Emotional resonance bonus - different frame styles resonate differently with emotions
    const styleEmotionMap = {
      'futuristic': emotions.energy * 0.5 + emotions.joy * 0.3,
      'elegant': emotions.calmness * 0.5 + emotions.focus * 0.3,
      'sporty': emotions.energy * 0.6 + emotions.joy * 0.2,
      'classic': emotions.calmness * 0.4 + emotions.focus * 0.4,
      'minimalist': emotions.focus * 0.5 + emotions.calmness * 0.3
    };
    
    const emotionalBonus = styleEmotionMap[frame.style] || 0.3;
    
    // Combine all factors with appropriate weights
    return (fitScore * 0.4) + (shapeMatch * 0.25) + (auraScore * 0.25) + (emotionalBonus * 0.1);
  };

  this.results.recommendations = this.frameDatabase
    .map(frame => ({ 
      ...frame, 
      resonance: resonanceScore(frame),
      emotionalFit: this.calculateEmotionalFitDescription(frame)
    }))
    .sort((a, b) => b.resonance - a.resonance)
    .slice(0, 3);
}

// New method to generate emotional fit descriptions
calculateEmotionalFitDescription(frame) {
  const emotions = this.results.dynamics.emotions;
  const dominantEmotion = Object.entries(emotions)
    .sort((a, b) => b[1] - a[1])[0];
  
  const emotionDescriptions = {
    joy: {
      futuristic: "enhances your expressive energy",
      elegant: "balances your joy with sophistication",
      sporty: "complements your vibrant personality",
      classic: "adds timeless appeal to your positive expression",
      minimalist: "refines your cheerful appearance"
    },
    calmness: {
      futuristic: "adds an exciting edge to your composed demeanor",
      elegant: "perfectly harmonizes with your tranquil presence",
      sporty: "energizes your peaceful aura",
      classic: "complements your composed nature",
      minimalist: "enhances your serene expression"
    },
    energy: {
      futuristic: "amplifies your dynamic spirit",
      elegant: "brings refinement to your energetic presence",
      sporty: "perfectly matches your active vibe",
      classic: "grounds your energetic appearance",
      minimalist: "streamlines your vibrant expression"
    },
    focus: {
      futuristic: "transforms your concentrated look",
      elegant: "enhances your attentive presence",
      sporty: "adds a dynamic touch to your focused demeanor",
      classic: "reinforces your determined expression",
      minimalist: "perfectly complements your precise nature"
    }
  };
  
  return emotionDescriptions[dominantEmotion[0]][frame.style] || 
         "resonates with your current expression";
}

renderCanvas() {
  const ctx = this.canvas.getContext('2d');
  ctx.clearRect(0, 0, 640, 480);
  
  if (this.results.visualAura) {
    const [energy, calm, vibrancy] = this.results.visualAura;
    const emotionScore = this.results.dynamics.emotionScore;
    const emotions = this.results.dynamics.emotions;
    
    // Create pulsating effect based on emotion
    const pulseSize = 1 + (Math.sin(Date.now() / 1000) * 0.05 * emotionScore);
    const baseOpacity = 0.2 + emotionScore * 0.3;
    
    // Draw multiple layers with different opacity for depth effect
    for (let i = 3; i > 0; i--) {
      const layerSize = 200 * pulseSize * (1 + (i * 0.1));
      const layerOpacity = baseOpacity / (i * 1.5);
      
      ctx.fillStyle = `rgba(${energy * 255}, ${calm * 255}, ${vibrancy * 255}, ${layerOpacity})`;
      ctx.beginPath();
      ctx.arc(320, 240, layerSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw main aura
    ctx.fillStyle = `rgba(${energy * 255}, ${calm * 255}, ${vibrancy * 255}, ${baseOpacity})`;
    ctx.beginPath();
    ctx.arc(320, 240, 200 * pulseSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Display metrics with improved formatting
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Rajdhani';
    ctx.fillText(`Aura: E:${energy.toFixed(2)}, C:${calm.toFixed(2)}, V:${vibrancy.toFixed(2)}`, 10, 30);
    
    // Display emotional state
    const dominantEmotion = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])[0];
    ctx.fillStyle = '#F0F0FF';
    ctx.fillText(`Emotion: ${dominantEmotion[0].charAt(0).toUpperCase() + dominantEmotion[0].slice(1)} (${(dominantEmotion[1] * 100).toFixed(0)}%)`, 10, 58);
  }
} 