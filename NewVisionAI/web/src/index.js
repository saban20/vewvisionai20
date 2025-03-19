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
import AIEyewearEngine from './utils/AIEyewearEngine';

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

  // Add state for theme mode
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
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
    localStorage.setItem('themeMode', themeMode);
  }, [voiceAssist, reduceMotion, highContrast, largeText, lineSpacing, focusIndicator, keyboardShortcuts, textSpacing, colorFilters, themeMode]);

  // Function to toggle theme mode
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create theme with light/dark mode and accessibility preferences
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: themeMode, // Use themeMode from state
        ...(highContrast
          ? {
              // High contrast colors
              primary: {
                main: themeMode === 'light' ? '#0050A0' : '#60A0FF',
              },
              secondary: {
                main: themeMode === 'light' ? '#D03060' : '#FF6090',
              },
            }
          : {
              // Regular colors
              primary: {
                main: themeMode === 'light' ? '#2979FF' : '#90CAF9',
              },
              secondary: {
                main: themeMode === 'light' ? '#F50057' : '#FF80AB',
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
  }, [themeMode, highContrast, largeText, lineSpacing, focusIndicator]);

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
    <ThemeContext.Provider value={{ themeMode, setThemeMode: toggleThemeMode }}>
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
    </ThemeContext.Provider>
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
        <App />
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