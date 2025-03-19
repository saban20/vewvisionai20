import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Grid,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';

// Icons
import GamepadIcon from '@mui/icons-material/Gamepad';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Base Components (loaded immediately)
import Webcam from 'react-webcam';
import { theme } from '../../theme';

// Face detection utilities
import { 
  loadFaceDetectionModules, 
  detectFaceLandmarks, 
  calculateMeasurements 
} from '../../utils/faceDetection';

// Lazy loaded subcomponents
const RewardSystem = lazy(() => import('./measurement/RewardSystem'));
const MeasurementInstructions = lazy(() => import('./measurement/MeasurementInstructions'));
const MeasurementResults = lazy(() => import('./measurement/MeasurementResults'));
const HelpDialog = lazy(() => import('./measurement/HelpDialog'));

// Component loader
const ComponentLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    py: theme.spacing.xl 
  }}>
    <CircularProgress size={30} sx={{ color: theme.colors.primary }} />
    <Typography variant="body2" sx={{ ml: theme.spacing.md }}>
      Loading component...
    </Typography>
  </Box>
);

const GamifiedMeasurementDarkTheme = ({ onMeasurementComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const webcamRef = useRef(null);
  const detectionModulesRef = useRef(null);
  
  // Get theme colors based on dark mode
  const colors = theme.getModeColors(darkMode);
  
  // Load face detection on mount
  useEffect(() => {
    const initFaceDetection = async () => {
      try {
        // Load all required modules using our utility
        const modules = await loadFaceDetectionModules();
        detectionModulesRef.current = modules;
        console.log('Face detection modules loaded successfully');
      } catch (error) {
        console.error('Error loading face detection modules:', error);
        setCameraError('Failed to load face detection modules.');
      }
    };
    
    initFaceDetection();
    
    // Cleanup
    return () => {
      if (detectionModulesRef.current?.tf) {
        detectionModulesRef.current.tf.dispose();
      }
    };
  }, []);
  
  const handleCameraReady = () => {
    setCameraReady(true);
  };
  
  const handleCameraError = (error) => {
    setCameraError(`Camera error: ${error.message || 'Failed to access camera'}`);
    console.error('Camera error:', error);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const startMeasurement = async () => {
    if (!webcamRef.current || !detectionModulesRef.current) {
      setCameraError('Camera or face detection not initialized.');
      return;
    }
    
    setIsCapturing(true);
    setIsProcessing(true);
    setProgress(10);
    
    try {
      const { faceapi } = detectionModulesRef.current;
      
      // Take screenshot from webcam
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        throw new Error('Failed to capture image from camera');
      }
      
      setProgress(30);
      
      // Detect face landmarks using our utility
      const faces = await detectFaceLandmarks(faceapi, screenshot);
      
      setProgress(60);
      
      // Get face landmarks
      const face = faces[0];
      const landmarks = face.keypoints;
      
      setProgress(80);
      
      // Calculate measurements using our utility
      const image = new Image();
      image.src = screenshot;
      await new Promise(resolve => { image.onload = resolve; });
      
      const measurementResults = calculateMeasurements(landmarks, image.width, image.height);
      
      setProgress(100);
      setMeasurements(measurementResults);
      setIsCompleted(true);
      setShowReward(true);
      
      // Call callback with measurements
      if (onMeasurementComplete) {
        onMeasurementComplete(measurementResults);
      }
      
    } catch (error) {
      console.error('Error during face measurement:', error);
      setCameraError(error.message || 'Error during face measurement');
      setProgress(0);
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };
  
  const handleHelpToggle = () => {
    setShowHelp(!showHelp);
  };
  
  const handleRewardClose = () => {
    setShowReward(false);
  };
  
  const steps = [
    {
      label: 'Prepare for Measurement',
      description: 'Position your face in the frame and ensure good lighting.',
    },
    {
      label: 'Capture and Analyze',
      description: 'Stay still while we scan and analyze your facial features.',
    },
    {
      label: 'View Measurements',
      description: 'Review your detailed facial measurements and recommended eyewear.',
    },
  ];
  
  // Generate webcam constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  
  return (
    <Box sx={{ 
      backgroundColor: colors.background,
      p: theme.spacing.md,
      minHeight: '100vh',
      transition: theme.transitions.default
    }}>
      <Card 
        sx={{ 
          borderRadius: theme.borderRadius.lg,
          backgroundColor: colors.card,
          boxShadow: theme.getBoxShadow(darkMode),
          overflow: 'hidden',
          color: colors.text
        }}
      >
        <Box sx={{ p: theme.spacing.lg }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: theme.spacing.lg 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GamepadIcon sx={{ mr: theme.spacing.sm, color: theme.colors.primary }} />
              <Typography variant="h5" fontWeight={theme.typography.fontWeights.semiBold}>
                Face Measurement Experience
              </Typography>
            </Box>
            
            <Box>
              <IconButton onClick={handleHelpToggle} sx={{ color: colors.text }}>
                <HelpOutlineIcon />
              </IconButton>
              <IconButton onClick={toggleDarkMode} sx={{ color: colors.text }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Box>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={theme.typography.fontWeights.medium}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography sx={{ mb: theme.spacing.md }}>{step.description}</Typography>
                  
                  {index === 0 && (
                    <Suspense fallback={<ComponentLoader />}>
                      <MeasurementInstructions darkMode={darkMode} />
                    </Suspense>
                  )}
                  
                  {/* Camera View */}
                  {index === 1 && (
                    <Box sx={{ mb: theme.spacing.md }}>
                      {cameraError ? (
                        <Typography color="error" sx={{ mb: theme.spacing.md }}>
                          {cameraError}
                        </Typography>
                      ) : (
                        <Box sx={{ 
                          position: 'relative', 
                          borderRadius: theme.borderRadius.md,
                          overflow: 'hidden',
                          border: `1px solid ${colors.border}`
                        }}>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            onUserMedia={handleCameraReady}
                            onUserMediaError={handleCameraError}
                            mirrored={true}
                            style={{
                              width: '100%',
                              borderRadius: theme.borderRadius.md,
                            }}
                          />
                          
                          {/* Measurement guidelines overlay */}
                          <Box sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'none',
                          }}>
                            <Box sx={{ 
                              border: `2px dashed ${theme.colors.primary}`,
                              borderRadius: '50%',
                              width: '60%',
                              height: '80%',
                              opacity: 0.7
                            }} />
                          </Box>
                          
                          {/* Progress indicator */}
                          {isProcessing && (
                            <Box sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0
                            }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                  height: 8,
                                  backgroundColor: 'rgba(0,0,0,0.2)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.colors.primary
                                  }
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  {/* Measurement Results */}
                  {index === 2 && measurements && (
                    <Suspense fallback={<ComponentLoader />}>
                      <MeasurementResults measurements={measurements} darkMode={darkMode} />
                    </Suspense>
                  )}
                  
                  <Box sx={{ mb: theme.spacing.md, mt: theme.spacing.md }}>
                    <Grid container spacing={2}>
                      {index > 0 && (
                        <Grid item>
                          <Button 
                            variant="outlined"
                            onClick={handleBack}
                            disabled={isCapturing}
                            sx={{
                              borderRadius: theme.borderRadius.pill,
                              color: colors.text,
                              borderColor: colors.border,
                              '&:hover': {
                                borderColor: theme.colors.primary,
                                backgroundColor: 'rgba(0,0,0,0.04)'
                              }
                            }}
                          >
                            Back
                          </Button>
                        </Grid>
                      )}
                      
                      <Grid item>
                        {index === steps.length - 1 ? (
                          <Button
                            variant="contained"
                            onClick={() => onMeasurementComplete && onMeasurementComplete(measurements)}
                            disabled={!measurements}
                            endIcon={<CheckCircleIcon />}
                            sx={{
                              borderRadius: theme.borderRadius.pill,
                              backgroundColor: theme.colors.primary,
                              '&:hover': {
                                backgroundColor: theme.colors.primaryDark
                              }
                            }}
                          >
                            Complete
                          </Button>
                        ) : index === 1 ? (
                          <Button
                            variant="contained"
                            onClick={startMeasurement}
                            disabled={isCapturing || !cameraReady}
                            sx={{
                              borderRadius: theme.borderRadius.pill,
                              backgroundColor: theme.colors.primary,
                              '&:hover': {
                                backgroundColor: theme.colors.primaryDark
                              }
                            }}
                          >
                            {isCapturing ? (
                              <>
                                <CircularProgress size={20} sx={{ mr: theme.spacing.sm, color: '#fff' }} />
                                Processing...
                              </>
                            ) : (
                              'Capture & Measure'
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                              borderRadius: theme.borderRadius.pill,
                              backgroundColor: theme.colors.primary,
                              '&:hover': {
                                backgroundColor: theme.colors.primaryDark
                              }
                            }}
                          >
                            Continue
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {isCompleted && (
            <Box sx={{ 
              mt: theme.spacing.lg, 
              p: theme.spacing.md, 
              backgroundColor: colors.cardLight,
              borderRadius: theme.borderRadius.md
            }}>
              <Typography variant="h6" sx={{ mb: theme.spacing.md }}>
                <CheckCircleIcon sx={{ 
                  verticalAlign: 'middle', 
                  mr: theme.spacing.sm,
                  color: theme.colors.success
                }} /> 
                Measurement Complete!
              </Typography>
              <Typography>
                Your face measurements have been successfully processed and are ready to use 
                for finding the perfect eyewear fit.
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
      
      {/* Help Dialog */}
      <Suspense fallback={null}>
        {showHelp && (
          <HelpDialog open={showHelp} onClose={handleHelpToggle} darkMode={darkMode} />
        )}
      </Suspense>
      
      {/* Rewards Dialog */}
      <Suspense fallback={null}>
        {showReward && (
          <RewardSystem 
            open={showReward} 
            onClose={handleRewardClose} 
            darkMode={darkMode} 
            measurements={measurements} 
          />
        )}
      </Suspense>
    </Box>
  );
};

export default GamifiedMeasurementDarkTheme; 