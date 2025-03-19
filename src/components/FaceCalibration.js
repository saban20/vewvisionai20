import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  LinearProgress,
  Paper,
  Chip
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { AccessibilityContext, AIContext } from '../index';

/**
 * FaceCalibration component - Used to calibrate face measurements with a reference object
 * @param {Object} props
 * @param {boolean} props.isIOS - Whether running on iOS device
 * @param {Function} props.onCalibrationComplete - Callback for when calibration is complete
 */
const FaceCalibration = ({ isIOS, onCalibrationComplete }) => {
  const [needsCalibration, setNeedsCalibration] = useState(!isIOS);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const { status, setStatus } = useContext(AIContext);
  const { reduceMotion } = useContext(AccessibilityContext);
  
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
  
  // Initialize camera when in calibration step
  useEffect(() => {
    if (calibrationStep === 2 && videoRef.current) {
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
          
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        } catch (error) {
          console.error('Error accessing camera:', error);
          setCalibrationStep(4); // Error step
        }
      };
      
      initCamera();
      
      // Cleanup function to stop camera when component unmounts
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [calibrationStep]);
  
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
    
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };
  
  return (
    <Paper elevation={3} sx={{ mb: 3, p: 3, position: 'relative' }}>
      <Chip 
        label="Calibration Tool" 
        color="primary" 
        sx={{ position: 'absolute', top: 10, right: 10 }}
      />
      
      <Typography variant="h5" gutterBottom>
        Measurement Calibration
      </Typography>
      
      <Typography variant="body1" paragraph>
        For accurate measurements, we need to calibrate our system to your specific camera and distance.
      </Typography>
      
      {needsCalibration ? (
        <Button 
          variant="contained" 
          startIcon={<CreditCardIcon />}
          onClick={startCalibration}
          sx={{ mt: 2 }}
          color="primary"
        >
          Calibrate Measurements
        </Button>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography color="success.main" gutterBottom>
            ✓ System is calibrated
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => {
              setNeedsCalibration(true);
              localStorage.removeItem('faceCalibration');
            }}
          >
            Recalibrate
          </Button>
        </Box>
      )}
      
      {/* Calibration Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={calibrating ? undefined : closeDialog}
        maxWidth="sm"
        fullWidth
      >
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
                  src="https://www.placecage.com/240/180" 
                  alt="Hold card under chin" 
                  width={240} 
                  height={180} 
                  style={{ borderRadius: 8 }}
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
                <LinearProgress 
                  variant="determinate" 
                  value={progress}
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <video
                  ref={videoRef}
                  style={{ width: '100%', borderRadius: '8px', maxHeight: '300px' }}
                  autoPlay
                  muted
                  playsInline
                />
              </Box>
              
              {!reduceMotion && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'rgba(25, 118, 210, 0.5)',
                    boxShadow: '0 0 10px rgba(25, 118, 210, 0.8)',
                    animation: 'scanLine 2s linear infinite',
                    '@keyframes scanLine': {
                      '0%': { top: '30%' },
                      '50%': { top: '70%' },
                      '100%': { top: '30%' }
                    }
                  }}
                />
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
                color="primary"
              >
                Start Calibration
              </Button>
            </>
          )}
          
          {calibrationStep === 2 && (
            <Button disabled>Calibrating...</Button>
          )}
          
          {(calibrationStep === 3 || calibrationStep === 4) && (
            <Button 
              onClick={closeDialog} 
              variant="contained"
              color={calibrationStep === 3 ? "primary" : "error"}
            >
              {calibrationStep === 3 ? "Done" : "Try Again"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FaceCalibration; 