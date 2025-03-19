import React, { useState, Suspense, useContext, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
// Import Socket Context
import { useSocket } from '../context/SocketContext';
// Import centralized theme
import { theme } from '../theme';

// Lazy load heavy components
const FaceScanner3D = lazy(() => import('../components/FaceScanner3D'));
const EyewearStyler = lazy(() => import('../components/EyewearStyler'));
const MeasurementsPanel = lazy(() => import('../components/MeasurementsPanel'));
const CosmicLoader = lazy(() => import('../components/CosmicLoader'));
const RealtimeFaceAnalysis = lazy(() => import('../components/FaceScanner/RealtimeFaceAnalysis'));
const GamifiedMeasurementDarkTheme = lazy(() => import('../components/FaceScanner/GamifiedMeasurementDarkTheme'));

// Fallback component for lazy loading
const ComponentLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    py: theme.spacing.xxl,
    flexDirection: 'column'
  }}>
    <CircularProgress size={60} sx={{ 
      color: theme.colors.primary,
      boxShadow: '0 0 15px rgba(110, 86, 207, 0.5)',
    }} />
    <Typography variant="body1" sx={{ mt: theme.spacing.md }}>
      Loading component...
    </Typography>
  </Box>
);

/**
 * Enhanced Face Scanner Page with 3D scanning, styling, and measurements
 */
const FaceScannerPage = ({ showNotification }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  
  // Get theme colors based on dark mode
  const colors = theme.getModeColors(darkMode);
  
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
    
    // Transition to eyewear component
    showNotification('Measurements completed successfully!', 'success');
    setActiveComponent('eyewear');
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  // Render active component based on state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'scanner':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <GamifiedMeasurementDarkTheme 
              onMeasurementComplete={handleMeasurements}
            />
          </Suspense>
        );
      case 'eyewear':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <EyewearStyler 
              aiMeasurements={userData} 
            />
          </Suspense>
        );
      case 'measurements':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <MeasurementsPanel 
              measurementId={measurementId}
              measurements={userData} 
              darkMode={darkMode}
            />
          </Suspense>
        );
      default:
        return (
          <Box sx={{ 
            textAlign: 'center', 
            padding: theme.spacing.lg, 
            backgroundColor: colors.cardLight,
            borderRadius: theme.borderRadius.md
          }}>
            <Typography variant="h5" color={colors.text}>
              Please select a component to view
            </Typography>
          </Box>
        );
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      <Container maxWidth="xl" sx={{ py: theme.spacing.lg }}>
        <Box sx={{ mb: theme.spacing.lg }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={theme.typography.fontWeights.bold}
            sx={{ 
              mb: theme.spacing.md, 
              color: colors.text,
              textAlign: 'center' 
            }}
          >
            Advanced Face Scanner
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: theme.spacing.lg, 
              textAlign: 'center',
              color: colors.textSecondary
            }}
          >
            Get precise facial measurements and find the perfect eyewear for your face shape.
          </Typography>

          {/* Navigation tabs */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: theme.spacing.lg }}>
            <Grid item>
              <Button
                variant={activeComponent === 'scanner' ? 'contained' : 'outlined'}
                onClick={() => setActiveComponent('scanner')}
                sx={{
                  borderRadius: theme.borderRadius.pill,
                  px: theme.spacing.lg,
                  py: theme.spacing.sm,
                  backgroundColor: activeComponent === 'scanner' ? theme.colors.primary : 'transparent',
                  color: activeComponent === 'scanner' ? '#fff' : colors.text,
                  borderColor: colors.border,
                  '&:hover': {
                    backgroundColor: activeComponent === 'scanner' ? theme.colors.primaryDark : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                Face Scanner
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeComponent === 'eyewear' ? 'contained' : 'outlined'}
                onClick={() => setActiveComponent('eyewear')}
                disabled={!userData}
                sx={{
                  borderRadius: theme.borderRadius.pill,
                  px: theme.spacing.lg,
                  py: theme.spacing.sm,
                  backgroundColor: activeComponent === 'eyewear' ? theme.colors.primary : 'transparent',
                  color: activeComponent === 'eyewear' ? '#fff' : colors.text,
                  borderColor: colors.border,
                  '&:hover': {
                    backgroundColor: activeComponent === 'eyewear' ? theme.colors.primaryDark : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                Virtual Try-On
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeComponent === 'measurements' ? 'contained' : 'outlined'}
                onClick={() => setActiveComponent('measurements')}
                disabled={!userData}
                sx={{
                  borderRadius: theme.borderRadius.pill,
                  px: theme.spacing.lg,
                  py: theme.spacing.sm,
                  backgroundColor: activeComponent === 'measurements' ? theme.colors.primary : 'transparent',
                  color: activeComponent === 'measurements' ? '#fff' : colors.text,
                  borderColor: colors.border,
                  '&:hover': {
                    backgroundColor: activeComponent === 'measurements' ? theme.colors.primaryDark : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                Measurements
              </Button>
            </Grid>
          </Grid>

          {/* Main content area */}
          <Box sx={{ 
            backgroundColor: colors.background,
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            boxShadow: theme.getBoxShadow(darkMode),
            transition: theme.transitions.default
          }}>
            {renderActiveComponent()}
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default FaceScannerPage; 