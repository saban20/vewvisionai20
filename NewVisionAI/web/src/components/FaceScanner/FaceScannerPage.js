import React, { useState } from 'react';
import { 
  Box, 
  Container,
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Refresh as ResetIcon,
  Save as SaveIcon,
  VideoCameraFront as CameraIcon,
  SportsEsports as GameIcon
} from '@mui/icons-material';

// Import scanner components
import FaceScanner3D from './FaceScanner3D';
import GamifiedMeasurement from './GamifiedMeasurement';
import MeasurementResults from './MeasurementResults';

/**
 * FaceScannerPage component
 * Main page for face scanning functionality with steps for different measurement techniques
 */
const FaceScannerPage = ({ showNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [scanMethod, setScanMethod] = useState(null);
  const [measurementResults, setMeasurementResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [savedToProfile, setSavedToProfile] = useState(false);
  
  // Steps in the process
  const steps = [
    'Choose Scan Method', 
    'Scan Your Face', 
    'View Results'
  ];
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle reset to start
  const handleReset = () => {
    setActiveStep(0);
    setScanMethod(null);
    setMeasurementResults(null);
    setSavedToProfile(false);
    setFaceAnalysis(null);
    showNotification && showNotification('Face scanner reset. Ready for a new scan.', 'info');
  };
  
  // Handle scan method selection
  const handleSelectMethod = (method) => {
    setScanMethod(method);
    const methodName = method === '3d' ? '3D Scanner' : 'Measurement Game';
    showNotification && showNotification(`Selected ${methodName} method. Let's get started!`, 'info');
    handleNext();
  };
  
  // Handle completion of 3D scan
  const handleScan3DComplete = (results) => {
    setLoading(true);
    showNotification && showNotification('Processing your face scan...', 'info');
    
    // Simulate API call for analysis
    setTimeout(() => {
      setMeasurementResults(results);
      
      // Sample face analysis results (in a real app, this would come from backend)
      setFaceAnalysis({
        faceShape: 'Oval',
        faceSymmetry: 'Balanced',
        skinTone: 'Medium',
        recommendedStyles: ['Rectangle', 'Square', 'Aviator'],
        recommendedColors: ['Black', 'Tortoise', 'Navy Blue', 'Gold']
      });
      
      setLoading(false);
      showNotification && showNotification('Face scan complete! Viewing your personalized results.', 'success');
      handleNext();
    }, 1500);
  };
  
  // Handle completion of gamified measurement
  const handleGameMeasurementComplete = (results) => {
    setLoading(true);
    showNotification && showNotification('Processing your measurements...', 'info');
    
    // Simulate API call for analysis
    setTimeout(() => {
      setMeasurementResults(results);
      
      // Sample face analysis results
      setFaceAnalysis({
        faceShape: 'Round',
        faceSymmetry: 'Slightly Asymmetric',
        skinTone: 'Warm',
        recommendedStyles: ['Rectangle', 'Square', 'Geometric'],
        recommendedColors: ['Tortoise', 'Brown', 'Gold', 'Green']
      });
      
      setLoading(false);
      showNotification && showNotification('Measurements complete! Here are your personalized eyewear recommendations.', 'success');
      handleNext();
    }, 1500);
  };
  
  // Handle save measurements
  const handleSaveMeasurements = () => {
    setLoading(true);
    showNotification && showNotification('Saving your measurements...', 'info');
    
    // Simulate API call to save
    setTimeout(() => {
      setSavedToProfile(true);
      setLoading(false);
      showNotification && showNotification('Your measurements have been saved to your profile!', 'success');
    }, 1000);
  };
  
  // Handle try frames
  const handleTryFrames = () => {
    // This would navigate to frames page with the measurements
    showNotification && showNotification('Redirecting to eyewear catalog with your personalized recommendations...', 'info');
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Choose Your Measurement Method
            </Typography>
            
            <Typography variant="body1" paragraph color="text.secondary">
              Select how you'd like to measure your face for eyewear:
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[6]
                    }
                  }}
                  onClick={() => handleSelectMethod('3d')}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <CameraIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        3D Face Scanner
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use our advanced 3D scanner for precise measurements with real-time feedback.
                        Best for accurate frame fitting.
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ mt: 3 }}
                        startIcon={<CameraIcon />}
                      >
                        Start 3D Scan
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[6]
                    }
                  }}
                  onClick={() => handleSelectMethod('game')}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <GameIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Measurement Game
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Play an interactive game to take your measurements. Fun and accurate approach
                        to find your perfect frames.
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        color="secondary"
                        sx={{ mt: 3 }}
                        startIcon={<GameIcon />}
                      >
                        Play Measurement Game
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Both methods provide accurate measurements for finding the perfect frames.
                Your data is securely saved to your profile for future shopping.
              </Typography>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            {scanMethod === '3d' ? (
              <FaceScanner3D onScanComplete={handleScan3DComplete} />
            ) : (
              <GamifiedMeasurement onMeasurementComplete={handleGameMeasurementComplete} />
            )}
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <MeasurementResults 
              measurements={measurementResults}
              faceAnalysis={faceAnalysis}
              loading={loading}
              onSave={handleSaveMeasurements}
              onTryFrames={handleTryFrames}
            />
            
            {savedToProfile && (
              <Paper 
                elevation={0} 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  borderRadius: 1
                }}
              >
                <Typography variant="body1" align="center">
                  ✓ Measurements successfully saved to your profile!
                </Typography>
              </Paper>
            )}
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Face Scanner
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Get precise measurements for perfectly fitting eyewear. Follow the steps below to scan your face.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Step content */}
        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<BackIcon />}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="outlined" 
                onClick={handleReset}
                startIcon={<ResetIcon />}
              >
                Scan Again
              </Button>
            ) : (
              activeStep === 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<NextIcon />}
                  disabled={activeStep === 1 || (activeStep === 0 && !scanMethod)}
                >
                  {activeStep === 0 ? 'Choose a Method' : 'Next'}
                </Button>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FaceScannerPage; 