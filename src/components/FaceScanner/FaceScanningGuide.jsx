import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button,
  CircularProgress,
  useTheme,
  Paper,
  Fade,
  Grid
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const steps = [
  {
    label: 'Position your face',
    description: 'Ensure your face is centered in the frame and well-lit.',
    icon: <FaceIcon />,
  },
  {
    label: 'Stay still',
    description: 'Hold your position for a few seconds while we take precise measurements.',
    icon: <FaceIcon />,
  },
  {
    label: 'Scanning complete',
    description: 'Your facial measurements have been successfully captured.',
    icon: <CheckCircleIcon color="success" />,
  },
];

const FaceScanningGuide = ({ onScanComplete, children }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [faceCentered, setFaceCentered] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate face detection and scanning process
  useEffect(() => {
    if (activeStep === 0 && !faceCentered) {
      // Simulate face detection after 2 seconds
      const timer = setTimeout(() => {
        setFaceCentered(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (activeStep === 1 && scanning) {
      // Simulate scanning progress
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            setScanning(false);
            setActiveStep(2);
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [activeStep, faceCentered, scanning]);

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
      setScanning(true);
    } else if (activeStep === 2) {
      onScanComplete && onScanComplete();
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e2f 0%, #2d2d44 100%)' 
            : 'linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Face Scanning Guide
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={() => (
                <Box sx={{ 
                  color: activeStep >= index ? 'primary.main' : 'text.disabled',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {step.icon}
                </Box>
              )}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                
                {index === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      border: '2px dashed',
                      borderColor: faceCentered ? 'success.main' : 'primary.main',
                      borderRadius: '50%',
                      width: 180,
                      height: 180,
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 2
                    }}>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: faceCentered ? 1 : [0.9, 1, 0.9],
                          transition: { 
                            scale: { 
                              repeat: faceCentered ? 0 : Infinity, 
                              duration: 2
                            } 
                          }
                        }}
                      >
                        <FaceIcon sx={{ fontSize: 100, color: faceCentered ? 'success.main' : 'primary.main' }} />
                      </motion.div>
                      
                      {children}
                    </Box>
                    
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!faceCentered}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Continue
                    </Button>
                  </Box>
                )}
                
                {index === 1 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={scanProgress} 
                        size={60} 
                        thickness={4}
                        sx={{ mx: 'auto' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {`${Math.round(scanProgress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Grid item xs={3} key={i}>
                          <Fade in={scanProgress > i * 25} timeout={500}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                height: 8, 
                                bgcolor: 'primary.main',
                                borderRadius: 4
                              }} 
                            />
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Typography variant="body2" align="center" sx={{ fontStyle: 'italic' }}>
                      {scanning ? 'Please hold still...' : 'Scan complete!'}
                    </Typography>
                  </Box>
                )}
                
                {index === 2 && (
                  <Box sx={{ mb: 2 }}>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          fontSize: 80, 
                          color: 'success.main',
                          display: 'block',
                          mx: 'auto',
                          mb: 2
                        }} 
                      />
                    </motion.div>
                    
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      fullWidth
                    >
                      View Results
                    </Button>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default FaceScanningGuide; 