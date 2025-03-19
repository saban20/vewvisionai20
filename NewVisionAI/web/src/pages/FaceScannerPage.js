import React, { useState, Suspense, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

// Import new components
import FaceScanner3D from '../components/FaceScanner3D';
import EyewearStyler from '../components/EyewearStyler';
import MeasurementsPanel from '../components/MeasurementsPanel';
import CosmicLoader from '../components/CosmicLoader';
import RealtimeFaceAnalysis from '../components/FaceScanner/RealtimeFaceAnalysis';

// Import Socket Context
import { useSocket } from '../context/SocketContext';

/**
 * Enhanced Face Scanner Page with 3D scanning, styling, and measurements
 */
const FaceScannerPage = ({ showNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Get socket context with default fallback values
  const socketContext = useSocket() || {};
  const { socketReady = false, processingUpdates = [] } = socketContext;
  
  // State management
  const [activeComponent, setActiveComponent] = useState('scanner');
  const [userData, setUserData] = useState(null);
  const [measurementId, setMeasurementId] = useState(null);

  // Handle measurements completion
  const handleMeasurements = (data) => {
    setUserData(data);
    if (data.measurementId) {
      setMeasurementId(data.measurementId);
    }
    setActiveComponent('styler');
    showNotification('Face scan completed successfully! Now try on some frames.', 'success');
  };

  // Navigation helper
  const handleNavigate = (section) => {
    if ((section === 'styler' || section === 'measurements') && !userData) {
      showNotification('Please complete a face scan first', 'warning');
      return;
    }
    setActiveComponent(section);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Face Analysis System
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Scan your face to get precise measurements and eyewear recommendations
        </Typography>
      </motion.div>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant={activeComponent === 'scanner' ? 'contained' : 'outlined'}
          onClick={() => handleNavigate('scanner')}
          className={activeComponent === 'scanner' ? 'nebula-button' : ''}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            background: activeComponent === 'scanner' 
              ? 'linear-gradient(45deg, #6E56CF 30%, #FF1493 90%)'
              : 'transparent',
            boxShadow: activeComponent === 'scanner' 
              ? '0 0 15px rgba(110, 86, 207, 0.5)'
              : 'none',
            '&:hover': {
              boxShadow: '0 0 15px rgba(110, 86, 207, 0.3)',
            }
          }}
        >
          Face Scanner
        </Button>
        
        <Button 
          variant={activeComponent === 'styler' ? 'contained' : 'outlined'}
          onClick={() => handleNavigate('styler')}
          disabled={!userData}
          className={activeComponent === 'styler' ? 'nebula-button' : ''}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            background: activeComponent === 'styler' 
              ? 'linear-gradient(45deg, #6E56CF 30%, #FF1493 90%)'
              : 'transparent',
            boxShadow: activeComponent === 'styler' 
              ? '0 0 15px rgba(110, 86, 207, 0.5)'
              : 'none',
            '&:hover': {
              boxShadow: '0 0 15px rgba(110, 86, 207, 0.3)',
            }
          }}
        >
          Try Eyewear
        </Button>
        
        <Button 
          variant={activeComponent === 'measurements' ? 'contained' : 'outlined'}
          onClick={() => handleNavigate('measurements')}
          disabled={!userData}
          className={activeComponent === 'measurements' ? 'nebula-button' : ''}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            background: activeComponent === 'measurements' 
              ? 'linear-gradient(45deg, #6E56CF 30%, #FF1493 90%)'
              : 'transparent',
            boxShadow: activeComponent === 'measurements' 
              ? '0 0 15px rgba(110, 86, 207, 0.5)'
              : 'none',
            '&:hover': {
              boxShadow: '0 0 15px rgba(110, 86, 207, 0.3)',
            }
          }}
        >
          View Measurements
        </Button>
        
        <Button 
          variant={activeComponent === 'realtime' ? 'contained' : 'outlined'}
          onClick={() => setActiveComponent('realtime')}
          className={activeComponent === 'realtime' ? 'nebula-button' : ''}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            background: activeComponent === 'realtime' 
              ? 'linear-gradient(45deg, #6E56CF 30%, #FF1493 90%)'
              : 'transparent',
            boxShadow: activeComponent === 'realtime' 
              ? '0 0 15px rgba(110, 86, 207, 0.5)'
              : 'none',
            '&:hover': {
              boxShadow: '0 0 15px rgba(110, 86, 207, 0.3)',
            }
          }}
        >
          Real-Time Analysis
        </Button>
      </Box>

      <Paper
        elevation={4}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'rgba(18, 18, 38, 0.7)',
          border: '1px solid rgba(110, 86, 207, 0.3)',
          backdropFilter: 'blur(10px)',
          p: 3,
          mb: 4,
          position: 'relative'
        }}
      >
        <Box sx={{ perspective: '1000px' }}>
          <Suspense fallback={<CosmicLoader />}>
            <motion.div
              initial={{ rotateX: 20, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {activeComponent === 'scanner' && (
                <FaceScanner3D onMeasurementsComplete={handleMeasurements} />
              )}
              {activeComponent === 'styler' && (
                <EyewearStyler aiMeasurements={userData} />
              )}
              {activeComponent === 'measurements' && (
                <MeasurementsPanel measurements={userData} />
              )}
              {activeComponent === 'realtime' && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <RealtimeFaceAnalysis 
                      userId={userData?.userId} 
                      measurementId={measurementId} 
                    />
                  </Grid>
                  
                  {/* Socket connection status */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 2,
                      bgcolor: socketReady ? 'success.dark' : 'error.dark',
                      borderRadius: 1
                    }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%',
                          bgcolor: socketReady ? 'success.light' : 'error.light',
                          boxShadow: socketReady 
                            ? '0 0 10px rgba(76, 175, 80, 0.7)' 
                            : '0 0 10px rgba(244, 67, 54, 0.7)'
                        }} 
                      />
                      <Typography variant="body2">
                        {socketReady 
                          ? 'Real-time connection established' 
                          : 'Real-time connection not available'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </motion.div>
          </Suspense>
        </Box>
      </Paper>

      {userData && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="contained"
            onClick={() => navigate('/shop')}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #FF1493 30%, #6E56CF 90%)',
              boxShadow: '0 0 15px rgba(255, 20, 147, 0.5)',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: '0 0 20px rgba(110, 86, 207, 0.7)',
              }
            }}
          >
            Browse All Eyewear
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default FaceScannerPage; 