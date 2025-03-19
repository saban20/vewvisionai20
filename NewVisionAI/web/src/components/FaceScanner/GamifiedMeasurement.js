import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  LinearProgress, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  useTheme
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  SportsEsports as GameIcon,
  Camera as CameraIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

/**
 * GamifiedMeasurement component
 * A fun, interactive way to get accurate facial measurements
 * using webcam and gamification techniques
 */
const GamifiedMeasurement = ({ onMeasurementComplete }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const measuringPointsRef = useRef([]);
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState(null);
  const [measurementPoints, setMeasurementPoints] = useState([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  
  // Game steps/challenges
  const gameSteps = [
    {
      id: 'pupillary',
      title: 'Measure Pupillary Distance',
      instruction: 'Click on the center of each pupil to measure the distance between your eyes.',
      pointsNeeded: 2,
      successMessage: 'Great! We measured your pupillary distance.',
      image: '👁️ 📏 👁️',
      measurementUnits: 'mm'
    },
    {
      id: 'temple_width',
      title: 'Measure Temple Width',
      instruction: 'Click on each temple (side of your head) to measure the width.',
      pointsNeeded: 2,
      successMessage: 'Perfect! Temple width recorded.',
      image: '👂 📏 👂',
      measurementUnits: 'mm'
    },
    {
      id: 'face_height',
      title: 'Measure Face Height',
      instruction: 'Click on your chin and then the top of your forehead to measure face height.',
      pointsNeeded: 2,
      successMessage: 'Excellent! Face height measured.',
      image: '⬆️ 📏 ⬇️',
      measurementUnits: 'mm'
    },
    {
      id: 'bridge',
      title: 'Measure Bridge Width',
      instruction: 'Click on each side of the bridge of your nose to measure width.',
      pointsNeeded: 2,
      successMessage: 'Well done! Bridge width recorded.',
      image: '👃 📏',
      measurementUnits: 'mm'
    }
  ];
  
  // Initialize camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
            setShowInstruction(true);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access is required for measurement. Please allow camera access and reload the page.');
      }
    };
    
    setupCamera();
    
    // Cleanup
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);
  
  // Start game timer when game starts
  useEffect(() => {
    if (gameStarted && !timerInterval) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameStarted, timerInterval]);
  
  // Start calibration process
  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
    
    // Simulate calibration progress
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsCalibrating(false);
          setGameStarted(true);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };
  
  // Handle game start
  const handleStartGame = () => {
    setGameStarted(true);
    setGameStep(0);
    setScore(0);
    setTimer(0);
    setShowInstruction(false);
    setMeasurementPoints([]);
    measuringPointsRef.current = [];
    setCurrentMeasurement(gameSteps[0]);
  };
  
  // Handle canvas click (for marking measurement points)
  const handleCanvasClick = (e) => {
    if (!gameStarted || isCalibrating) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    // Get canvas bounds
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate scale factors (if video and canvas have different dimensions)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate actual coordinates on the canvas
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // Add point to measurement
    const newPoint = { x: canvasX, y: canvasY };
    const updatedPoints = [...measuringPointsRef.current, newPoint];
    measuringPointsRef.current = updatedPoints;
    setMeasurementPoints(updatedPoints);
    
    // Check if we have enough points for current measurement
    const currentStep = gameSteps[gameStep];
    if (updatedPoints.length >= currentStep.pointsNeeded) {
      // Calculate measurement
      calculateMeasurement(updatedPoints, currentStep.id);
      
      // Show success message
      setShowSuccess(true);
      
      // Add points to score
      setScore(prev => prev + 10);
      
      // Clear for next measurement after brief delay
      setTimeout(() => {
        setShowSuccess(false);
        
        // Move to next measurement or finish
        if (gameStep < gameSteps.length - 1) {
          setGameStep(prev => prev + 1);
          setCurrentMeasurement(gameSteps[gameStep + 1]);
          measuringPointsRef.current = [];
          setMeasurementPoints([]);
        } else {
          // Game complete, compile all measurements
          compileMeasurements();
        }
      }, 1500);
    }
  };
  
  // Calculate measurement based on points and type
  const calculateMeasurement = (points, measurementType) => {
    if (points.length < 2) return 0;
    
    // Calculate distance between two points (Euclidean distance)
    const calculateDistance = (p1, p2) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };
    
    // Get pixel distance
    const pixelDistance = calculateDistance(points[0], points[1]);
    
    // Convert to mm (this is a mock conversion - in real app would be calibrated)
    // For demo, we're using arbitrary conversion factors
    let mmDistance = 0;
    let accuracy = 0;
    
    switch (measurementType) {
      case 'pupillary':
        // Typical PD range is 54-74mm
        mmDistance = 54 + (pixelDistance / 10);
        accuracy = Math.min(100, 70 + Math.random() * 30); // Random accuracy for demo
        break;
      case 'temple_width':
        // Typical temple width range is 130-150mm
        mmDistance = 130 + (pixelDistance / 15);
        accuracy = Math.min(100, 70 + Math.random() * 30);
        break;
      case 'face_height':
        // Typical face height range is 180-230mm
        mmDistance = 180 + (pixelDistance / 20);
        accuracy = Math.min(100, 70 + Math.random() * 30);
        break;
      case 'bridge':
        // Typical bridge width range is 15-25mm
        mmDistance = 15 + (pixelDistance / 30);
        accuracy = Math.min(100, 70 + Math.random() * 30);
        break;
      default:
        mmDistance = pixelDistance / 10;
        accuracy = 70;
    }
    
    // Update accuracy state
    setAccuracy(prev => Math.max(prev, Math.floor(accuracy)));
    
    // Store measurement result
    const result = {
      type: measurementType,
      value: parseFloat(mmDistance.toFixed(1)),
      accuracy: parseFloat(accuracy.toFixed(1)),
      timestamp: new Date().toISOString()
    };
    
    // Add to measurements array in component state
    gameSteps[gameStep].measurement = result;
  };
  
  // Compile all measurements when game is complete
  const compileMeasurements = () => {
    // Generate measurement results from all steps
    const results = {
      pupillaryDistance: gameSteps.find(step => step.id === 'pupillary')?.measurement?.value || 63,
      templeLength: gameSteps.find(step => step.id === 'temple_width')?.measurement?.value || 140,
      bridgeWidth: gameSteps.find(step => step.id === 'bridge')?.measurement?.value || 18,
      faceHeight: gameSteps.find(step => step.id === 'face_height')?.measurement?.value || 200,
      frameWidth: 0, // Calculated from other measurements
      lensWidth: 0, // Calculated
      lensHeight: 0, // Calculated
      scanQuality: accuracy / 100,
      completionTime: timer,
      scanDataURL: null, // Would be a data URL of a face scan in a real app
      timestamp: new Date().toISOString()
    };
    
    // Calculate additional measurements
    results.frameWidth = results.templeLength * 0.9; // Approximate
    results.lensWidth = results.pupillaryDistance * 0.75; // Approximate
    results.lensHeight = results.lensWidth * 0.6; // Common aspect ratio
    
    // Show completion dialog and call callback
    onMeasurementComplete(results);
    
    // Reset game state
    setGameStarted(false);
    clearInterval(timerInterval);
    setTimerInterval(null);
  };
  
  // Draw measuring points and lines on canvas
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !cameraReady) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const drawFrame = () => {
      // Draw video frame
      ctx.drawImage(video, 0, 0);
      
      // Draw measurement points
      if (measurementPoints.length > 0) {
        measurementPoints.forEach((point, index) => {
          // Draw point
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = theme.palette.primary.main;
          ctx.fill();
          
          // Draw point number
          ctx.font = '16px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(index + 1, point.x - 5, point.y + 5);
        });
        
        // Draw line between points
        if (measurementPoints.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(measurementPoints[0].x, measurementPoints[0].y);
          ctx.lineTo(measurementPoints[1].x, measurementPoints[1].y);
          ctx.strokeStyle = theme.palette.secondary.main;
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Calculate and display distance
          const dx = measurementPoints[1].x - measurementPoints[0].x;
          const dy = measurementPoints[1].y - measurementPoints[0].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Convert to approximate mm (mock)
          const currentStep = gameSteps[gameStep];
          let mmDistance = 0;
          
          switch (currentStep.id) {
            case 'pupillary':
              mmDistance = 54 + (distance / 10);
              break;
            case 'temple_width':
              mmDistance = 130 + (distance / 15);
              break;
            case 'face_height':
              mmDistance = 180 + (distance / 20);
              break;
            case 'bridge':
              mmDistance = 15 + (distance / 30);
              break;
            default:
              mmDistance = distance / 10;
          }
          
          // Draw distance text
          const midX = (measurementPoints[0].x + measurementPoints[1].x) / 2;
          const midY = (measurementPoints[0].y + measurementPoints[1].y) / 2 - 20;
          
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 3;
          const text = `${mmDistance.toFixed(1)} ${currentStep.measurementUnits}`;
          ctx.strokeText(text, midX - 30, midY);
          ctx.fillText(text, midX - 30, midY);
        }
      }
      
      // Show calibration overlay during calibration
      if (isCalibrating) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw face outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width/4, canvas.height/3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw text
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Calibrating...', canvas.width/2, canvas.height/2 - 100);
        ctx.fillText(`${calibrationProgress}%`, canvas.width/2, canvas.height/2 + 120);
      }
      
      requestAnimationFrame(drawFrame);
    };
    
    const frameId = requestAnimationFrame(drawFrame);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [cameraReady, measurementPoints, isCalibrating, calibrationProgress, gameStep, theme]);
  
  // Render instruction dialog
  const renderInstructionDialog = () => (
    <Dialog
      open={showInstruction && cameraReady}
      onClose={() => setShowInstruction(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <GameIcon color="primary" />
          <Typography variant="h6">Face Measurement Game</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>
          Let's make face measurements fun! Follow these simple steps:
        </Typography>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              1. Camera Calibration
            </Typography>
            <Typography>
              We'll first calibrate the camera to ensure accurate measurements.
              Just position your face in the center of the frame.
            </Typography>
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              2. Follow Instructions
            </Typography>
            <Typography>
              For each measurement, you'll be asked to click on specific points
              on your face. Be as precise as possible for better results!
            </Typography>
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              3. Complete All Measurements
            </Typography>
            <Typography>
              Complete all measurements to get your final score and accurate
              eyewear recommendations.
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setShowInstruction(false);
            startCalibration();
          }}
          variant="contained"
          startIcon={<CameraIcon />}
        >
          Start Calibration
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Game stats display */}
      {gameStarted && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            px: 2,
            py: 1,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="body2">
            <strong>Score:</strong> {score}
          </Typography>
          <Typography variant="body2">
            <strong>Accuracy:</strong> {accuracy}%
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {timer}s
          </Typography>
        </Box>
      )}
      
      {/* Current measurement instructions */}
      {gameStarted && currentMeasurement && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: theme.palette.primary.main,
            color: 'white'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {currentMeasurement.title}
          </Typography>
          <Typography variant="body2">
            {currentMeasurement.instruction}
          </Typography>
          <Typography variant="h5" align="center" sx={{ my: 1 }}>
            {currentMeasurement.image}
          </Typography>
          <Typography variant="body2" fontStyle="italic">
            Click Points: {measurementPoints.length}/{currentMeasurement.pointsNeeded}
          </Typography>
        </Paper>
      )}
      
      {/* Video and canvas container */}
      <Box 
        sx={{ 
          position: 'relative',
          height: 450,
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden'
        }}
        onClick={handleCanvasClick}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Success indicator */}
        {showSuccess && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10
            }}
          >
            <CheckIcon
              sx={{
                fontSize: 60,
                color: 'lightgreen',
                mb: 2
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
              }}
            >
              {gameSteps[gameStep].successMessage}
            </Typography>
          </Box>
        )}
        
        {/* Calibration overlay */}
        {isCalibrating && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              p: 2
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
              Calibrating Camera...
            </Typography>
            <LinearProgress variant="determinate" value={calibrationProgress} />
          </Box>
        )}
        
        {/* Start button overlay */}
        {!gameStarted && !isCalibrating && cameraReady && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 10
            }}
          >
            <GameIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 3
              }}
            >
              Face Measurement Game
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GameIcon />}
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          </Box>
        )}
        
        {/* Camera not ready message */}
        {!cameraReady && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mb: 2
              }}
            >
              Initializing Camera...
            </Typography>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        )}
      </Box>
      
      {/* Render instruction dialog */}
      {renderInstructionDialog()}
    </Box>
  );
};

export default GamifiedMeasurement; 