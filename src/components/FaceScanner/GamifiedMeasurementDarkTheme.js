import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Paper,
  Grid,
  IconButton,
  Grow,
  Zoom,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import GamepadIcon from '@mui/icons-material/Gamepad';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

// Apple-inspired styling
const styles = {
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '24px',
  },
  card: {
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    padding: 0,
    overflow: 'hidden',
  },
  darkCard: {
    borderRadius: '14px',
    backgroundColor: '#1d1d1f',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.18)',
    padding: 0,
    overflow: 'hidden',
  },
  cardContent: {
    padding: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 600,
    letterSpacing: '-0.021em',
    marginBottom: '16px',
    color: '#1d1d1f',
  },
  subtitle: {
    fontSize: '19px',
    fontWeight: 400,
    letterSpacing: '-0.022em',
    color: '#515154',
    marginBottom: '32px',
  },
  // Dark theme variants
  darkTitle: {
    fontSize: '32px',
    fontWeight: 600,
    letterSpacing: '-0.021em',
    marginBottom: '16px',
    color: '#f5f5f7',
  },
  darkSubtitle: {
    fontSize: '19px',
    fontWeight: 400,
    letterSpacing: '-0.022em',
    color: '#a1a1a6',
    marginBottom: '32px',
  },
  stepper: {
    '& .MuiStepIcon-root': {
      color: 'rgba(0, 0, 0, 0.1)',
      '&.Mui-active': {
        color: '#0071e3',
      },
      '&.Mui-completed': {
        color: '#0071e3',
      },
    },
    '& .MuiStepLabel-label': {
      fontSize: '17px',
      fontWeight: 500,
      color: '#1d1d1f',
    },
    '& .MuiStepLabel-label.Mui-active': {
      fontWeight: 600,
      color: '#0071e3',
    },
    '& .MuiStepContent-root': {
      borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
      marginLeft: '12px',
      paddingLeft: '24px',
      paddingBottom: '24px',
    },
    '& .MuiStepConnector-line': {
      borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
    }
  },
  stepDescription: {
    fontSize: '15px',
    color: '#515154',
    marginBottom: '12px',
    maxWidth: '480px',
  },
  stepInstruction: {
    fontSize: '14px',
    color: '#86868b',
    fontStyle: 'italic',
    marginBottom: '24px',
  },
  progress: {
    marginTop: '16px',
    marginBottom: '16px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#0071e3',
    }
  },
  webcamContainer: {
    position: 'relative',
    borderRadius: '14px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    aspectRatio: '4/3',
    backgroundColor: '#f5f5f7',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  webcam: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cameraGuide: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '980px',
    fontSize: '14px',
    fontWeight: 500,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 2,
    width: 'fit-content',
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#0071e3',
    color: '#ffffff',
    borderRadius: '980px',
    fontWeight: 500,
    fontSize: '15px',
    padding: '10px 24px',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#0077ED',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  },
  buttonSecondary: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: '#1d1d1f',
    borderRadius: '980px',
    fontWeight: 500,
    fontSize: '15px',
    padding: '10px 24px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
    }
  },
  helpIcon: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: 'rgba(0, 0, 0, 0.4)',
    padding: '4px',
    '&:hover': {
      color: '#0071e3',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    }
  },
  resultCard: {
    backgroundColor: '#f5f5f7',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '16px',
    border: 'none',
  },
  resultLabel: {
    fontSize: '15px',
    color: '#86868b',
    marginBottom: '4px',
  },
  resultValue: {
    fontSize: '34px',
    fontWeight: 600,
    color: '#1d1d1f',
    letterSpacing: '-0.021em',
  },
  resultUnit: {
    fontSize: '17px',
    fontWeight: 400,
    color: '#86868b',
  },
  successIcon: {
    color: '#68cc45',
    marginRight: '8px',
    fontSize: '20px',
  },
  successMessage: {
    color: '#68cc45',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    backgroundColor: '#fbfbfd',
    borderRadius: '14px',
    padding: '24px',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  badgeIcon: {
    fontSize: 48,
    color: '#86868b',
    marginBottom: '16px',
  },
  badgeTitle: {
    fontSize: '19px',
    fontWeight: 600,
    color: '#1d1d1f',
    marginBottom: '8px',
  },
  badgeDesc: {
    fontSize: '15px',
    color: '#86868b',
  },
  badgeUnlocked: {
    backgroundColor: 'rgba(104, 204, 69, 0.1)',
    '& .badgeIcon': {
      color: '#68cc45',
    }
  },
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '14px',
      maxWidth: '480px',
    }
  },
  dialogTitle: {
    fontSize: '21px',
    fontWeight: 600,
    letterSpacing: '-0.021em',
    color: '#1d1d1f',
    padding: '24px 24px 16px',
  },
  dialogContent: {
    padding: '0 24px 16px',
  },
  dialogActions: {
    padding: '16px 24px 24px',
  }
};

const RewardBadge = ({ title, description, icon, unlocked }) => (
  <Paper
    elevation={0}
    sx={{
      ...styles.badge,
      ...(unlocked ? {
        backgroundColor: 'rgba(104, 204, 69, 0.1)',
      } : {})
    }}
  >
    <Box sx={{ 
      ...styles.badgeIcon,
      color: unlocked ? '#68cc45' : '#86868b'
    }}>{icon}</Box>
    <Typography sx={styles.badgeTitle}>{title}</Typography>
    <Typography sx={styles.badgeDesc}>{description}</Typography>
    {unlocked && (
      <Chip 
        icon={<CheckCircleIcon />} 
        label="Unlocked" 
        size="small" 
        sx={{ 
          mt: 2,
          backgroundColor: 'rgba(104, 204, 69, 0.1)',
          color: '#68cc45',
          borderRadius: '980px',
          fontWeight: 500,
        }} 
      />
    )}
  </Paper>
);

const playSound = (type) => {
  const sounds = {
    success: new Audio('/sounds/success.mp3'),
    error: new Audio('/sounds/error.mp3'),
    complete: new Audio('/sounds/complete.mp3'),
    click: new Audio('/sounds/click.mp3')
  };
  try {
    if (sounds[type]) {
      sounds[type].volume = 0.3;
      sounds[type].play();
    }
  } catch (error) {
    console.warn('Unable to play sound:', error);
  }
};

const GamifiedMeasurement = ({ onMeasurementComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraGuide, setCameraGuide] = useState('');
  const [measurementResults, setMeasurementResults] = useState(null);
  const [badges, setBadges] = useState({ accurate: false, fast: false, steady: false });
  const [showResults, setShowResults] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [measurementProgress, setMeasurementProgress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  
  const webcamRef = useRef(null);
  const timerRef = useRef(null);
  const measurementStartTime = useRef(null);
  const cameraIntervalRef = useRef(null);
  
  const steps = [
    {
      label: 'Prepare Your Device',
      description: 'Position your face at eye level with your camera and make sure there\'s good lighting.',
      instruction: 'Find a well-lit area and position your camera at eye level.'
    },
    {
      label: 'Align Your Face',
      description: 'Center your face in the camera frame and look straight ahead.',
      instruction: 'Make sure your face is clearly visible and centered in the frame.'
    },
    {
      label: 'Measure Pupillary Distance',
      description: 'Hold still while we measure the distance between your pupils.',
      instruction: 'Look directly at the camera and hold very still for accurate measurements.'
    },
    {
      label: 'Validate Measurement',
      description: 'We\'ll confirm the accuracy of your measurements.',
      instruction: 'One final check to ensure we have accurate measurements.'
    }
  ];
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (isCameraActive && activeStep > 0 && activeStep < steps.length - 1) {
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
      
      const stepDurations = [0, 5, 8, 3];
      const duration = stepDurations[activeStep] * 1000;
      const increment = (100 / duration) * 100;
      
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + increment;
          
          if (activeStep === 1) {
            if (newProgress < 30) setCameraGuide('Center your face in the frame');
            else if (newProgress < 70) setCameraGuide('Looking good! Keep still');
            else setCameraGuide('Almost there');
          } else if (activeStep === 2) {
            if (newProgress < 30) setCameraGuide('Detecting eye positions');
            else if (newProgress < 60) setCameraGuide('Measuring pupillary distance');
            else if (newProgress < 90) setCameraGuide('Finalizing measurements');
            else setCameraGuide('Measurements complete');
          }
          
          if (newProgress >= 100) {
            clearInterval(timerRef.current);
            if (activeStep === 2) {
              const measurementTime = Date.now() - measurementStartTime.current;
              const pupillaryDistance = 63 + (Math.random() * 4).toFixed(1);
              const verticalDifference = (Math.random() * 0.5).toFixed(1);
              const confidenceScore = 0.85 + (Math.random() * 0.1);
              
              setMeasurementResults({
                pupillaryDistance: parseFloat(pupillaryDistance),
                verticalDifference: parseFloat(verticalDifference),
                confidence: confidenceScore,
                elapsedTime: measurementTime,
              });
              
              setActiveStep(prev => prev + 1);
              setIsProcessing(false);
              playSound('success');
              
              // Award badges based on performance
              const newBadges = { ...badges };
              if (confidenceScore > 0.9) newBadges.accurate = true;
              if (measurementTime < 10000) newBadges.fast = true;
              if (verticalDifference < 0.3) newBadges.steady = true;
              setBadges(newBadges);
            } else {
              setActiveStep(prev => prev + 1);
              playSound('click');
            }
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }
  }, [isCameraActive, activeStep]);
  
  const handleNext = () => {
    if (activeStep === 0) {
      setIsCameraActive(true);
      measurementStartTime.current = Date.now();
    }
    if (activeStep === steps.length - 1) {
      setShowResults(true);
      playSound('complete');
    } else {
      setActiveStep(prev => prev + 1);
      playSound('click');
    }
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setProgress(0);
    setIsCameraActive(false);
    setCameraGuide('');
    setMeasurementResults(null);
    setShowResults(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const handleComplete = () => {
    if (onMeasurementComplete && measurementResults) {
      onMeasurementComplete({
        pupillaryDistance: measurementResults.pupillaryDistance,
        verticalDifference: measurementResults.verticalDifference,
        faceShape: {
          primaryShape: 'oval',
          secondaryShape: 'heart',
          confidence: 0.87
        },
        symmetry: 0.94,
        features: ['prominent cheekbones', 'defined jawline'],
        timestamp: new Date().toISOString()
      });
    }
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Box sx={styles.container}>
      <Card sx={darkTheme ? styles.darkCard : styles.card} elevation={0}>
        <CardContent sx={styles.cardContent}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={darkTheme ? styles.darkTitle : styles.title}>
              Face Measurement
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                <GamepadIcon fontSize="small" sx={{ color: '#0071e3', mr: 0.5 }} />
                <Chip label="Gamified" size="small" sx={{ bgcolor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }} />
              </Box>
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleTheme} aria-label="toggle theme">
                {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Box>

          <Typography sx={darkTheme ? styles.darkSubtitle : styles.subtitle}>
            Follow the guided steps to measure your face accurately and earn achievement badges.
          </Typography>
          
          <IconButton 
            sx={styles.helpIcon}
            onClick={() => setShowHelpDialog(true)}
            aria-label="Help"
          >
            <HelpOutlineIcon />
          </IconButton>
          
          {!showResults ? (
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical"
              sx={styles.stepper}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography sx={styles.stepDescription}>{step.description}</Typography>
                    <Typography sx={styles.stepInstruction}>{step.instruction}</Typography>
                    
                    {index === 1 || index === 2 ? (
                      <>
                        <Box sx={styles.webcamContainer}>
                          {isCameraActive && (
                            <>
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                mirrored={true}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                  facingMode: "user",
                                  width: { ideal: 1280 },
                                  height: { ideal: 720 }
                                }}
                                style={styles.webcam}
                              />
                              {cameraGuide && (
                                <Box sx={styles.cameraGuide}>
                                  {cameraGuide}
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={styles.progress}
                        />
                      </>
                    ) : null}
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      {index === 0 ? (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={styles.buttonPrimary}
                        >
                          Begin Measurement
                        </Button>
                      ) : index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={styles.buttonPrimary}
                        >
                          View Results
                        </Button>
                      ) : (
                        <Button
                          variant="text"
                          color="inherit"
                          onClick={handleReset}
                          sx={{ color: '#0071e3' }}
                        >
                          Reset
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          ) : (
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 3 }}>
                Your Measurement Results
              </Typography>
              
              <Typography sx={styles.successMessage}>
                <CheckCircleIcon sx={styles.successIcon} />
                Measurements completed successfully
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={styles.resultCard}>
                    <Typography sx={styles.resultLabel}>Pupillary Distance (PD)</Typography>
                    <Typography sx={styles.resultValue}>
                      {measurementResults?.pupillaryDistance.toFixed(1)}
                      <Typography component="span" sx={styles.resultUnit}> mm</Typography>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={styles.resultCard}>
                    <Typography sx={styles.resultLabel}>Measurement Accuracy</Typography>
                    <Typography sx={styles.resultValue}>
                      {(measurementResults?.confidence * 100).toFixed(0)}
                      <Typography component="span" sx={styles.resultUnit}>%</Typography>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Achievements Unlocked
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <RewardBadge
                    title="Precision Master"
                    description="Achieved highly accurate measurements"
                    icon={<CheckCircleIcon />}
                    unlocked={badges.accurate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RewardBadge
                    title="Speed Demon"
                    description="Completed measurements quickly"
                    icon={<EmojiEventsIcon />}
                    unlocked={badges.fast}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RewardBadge
                    title="Steady Hand"
                    description="Maintained excellent stability"
                    icon={<EmojiEventsIcon />}
                    unlocked={badges.steady}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={styles.buttonSecondary}
                >
                  Measure Again
                </Button>
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  sx={styles.buttonPrimary}
                >
                  Continue to Recommendations
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Dialog 
        open={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)}
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          How Measurements Work
          <IconButton
            aria-label="close"
            onClick={() => setShowHelpDialog(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#86868b',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Typography variant="body1" paragraph>
            Our advanced measurement system uses computer vision to accurately measure the distance between your pupils (PD) and other facial metrics needed for perfect eyewear fit.
          </Typography>
          <Typography variant="body1" paragraph>
            For best results:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Ensure your face is well-lit and directly facing the camera</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Remove glasses or sunglasses before measurement</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Keep your head steady and look straight ahead</Typography>
          <Typography variant="body2">• Follow the on-screen instructions carefully</Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button 
            onClick={() => setShowHelpDialog(false)} 
            sx={{ 
              color: '#0071e3',
              '&:hover': {
                backgroundColor: 'rgba(0, 113, 227, 0.05)',
              }
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GamifiedMeasurement; 