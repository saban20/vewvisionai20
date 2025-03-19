import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Button,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  Tooltip,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Face as FaceIcon,
  Straighten as MeasureIcon,
  CheckCircle as CheckIcon,
  Timeline as ChartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Style as StyleIcon,
  Palette as ColorIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';

// Import AI Connector
import aiConnector from '../../utils/AIConnector';

/**
 * MeasurementResults component
 * Displays the results of face measurements and provides recommended frame sizes
 */
const MeasurementResults = ({ 
  measurements,
  faceAnalysis,
  onSave,
  onTryFrames,
  loading = false,
  scanResults,
  onRetakeScan,
  onSaveMeasurements,
  onViewRecommendations
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [favoriteResults, setFavoriteResults] = useState(false);
  const [frameRecommendations, setFrameRecommendations] = useState([]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    setFavoriteResults(prev => !prev);
  };
  
  // Prepare frame recommendations based on scan results
  useEffect(() => {
    if (scanResults) {
      // Try to get recommendations from AI Engine first
      if (scanResults.frameRecommendations && scanResults.frameRecommendations.length > 0) {
        setFrameRecommendations(scanResults.frameRecommendations);
      } else {
        // Fall back to default recommendations based on face shape
        const defaultRecommendations = getDefaultRecommendations(scanResults.faceShape || 'oval');
        setFrameRecommendations(defaultRecommendations);
      }
    }
  }, [scanResults]);
  
  // Default recommendations if AI doesn't provide any
  const getDefaultRecommendations = (faceShape) => {
    const recommendations = {
      'oval': ['rectangle', 'square', 'aviator', 'wayfarer', 'round', 'cat_eye'],
      'round': ['rectangle', 'square', 'wayfarer', 'geometric'],
      'square': ['round', 'oval', 'cat_eye', 'aviator', 'rimless'],
      'heart': ['round', 'oval', 'wayfarer', 'rimless'],
      'oblong': ['round', 'square', 'oversized', 'geometric'],
      'diamond': ['cat_eye', 'oval', 'rimless', 'rectangle'],
      'triangle': ['cat_eye', 'aviator', 'oversized'],
      'pear': ['rectangle', 'cat_eye', 'square']
    };
    
    return recommendations[faceShape] || recommendations['oval'];
  };
  
  // If still loading or no measurements
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!measurements) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Typography color="text.secondary">
          No measurement data available.
        </Typography>
      </Box>
    );
  }
  
  // Determine ideal frame sizes based on measurements
  const idealFrameSize = {
    width: Math.round(measurements.frameWidth),
    bridge: Math.round(measurements.bridgeWidth),
    templeLength: Math.round(measurements.templeLength)
  };
  
  // Sample frame size ranges (would come from product database in real app)
  const frameRanges = {
    small: { width: '124-136', bridge: '14-18', templeLength: '135-145' },
    medium: { width: '136-146', bridge: '18-21', templeLength: '140-150' },
    large: { width: '146-156', bridge: '21-25', templeLength: '145-155' }
  };
  
  // Determine recommended frame size
  const determineFrameSize = () => {
    const width = idealFrameSize.width;
    
    if (width < 136) return 'small';
    if (width < 146) return 'medium';
    return 'large';
  };
  
  const recommendedSize = determineFrameSize();
  
  // Calculate compatibility for each frame size
  const calculateCompatibility = (size) => {
    const ranges = frameRanges[size];
    const widthRange = ranges.width.split('-').map(Number);
    const bridgeRange = ranges.bridge.split('-').map(Number);
    const templeRange = ranges.templeLength.split('-').map(Number);
    
    // Check if measurements are in range
    const widthMatch = idealFrameSize.width >= widthRange[0] && idealFrameSize.width <= widthRange[1];
    const bridgeMatch = idealFrameSize.bridge >= bridgeRange[0] && idealFrameSize.bridge <= bridgeRange[1];
    const templeMatch = idealFrameSize.templeLength >= templeRange[0] && idealFrameSize.templeLength <= templeRange[1];
    
    // Calculate match percentage
    let matchCount = 0;
    if (widthMatch) matchCount++;
    if (bridgeMatch) matchCount++;
    if (templeMatch) matchCount++;
    
    return Math.round((matchCount / 3) * 100);
  };
  
  const compatibility = {
    small: calculateCompatibility('small'),
    medium: calculateCompatibility('medium'),
    large: calculateCompatibility('large')
  };
  
  // Render the face shape section with AI-determined face shape
  const renderFaceShapeSection = () => {
    if (!scanResults || !scanResults.faceShape) return null;
    
    const faceShape = scanResults.faceShape;
    const confidence = scanResults.faceShapeConfidence || 0.75;
    
    return (
      <Box sx={styles.section}>
        <Typography variant="h6" gutterBottom>
          Face Shape Analysis
        </Typography>
        
        <Box sx={styles.faceShapeDisplay}>
          <Box sx={styles.faceShapeIcon}>
            {getFaceShapeIcon(faceShape)}
          </Box>
          <Box sx={styles.faceShapeInfo}>
            <Typography variant="h5" sx={styles.faceShapeName}>
              {capitalizeFirstLetter(faceShape)} Face
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {Math.round(confidence * 100)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={confidence * 100} 
              sx={styles.confidenceBar}
            />
            <Typography variant="body2" sx={styles.faceShapeDescription}>
              {getFaceShapeDescription(faceShape)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  // Render the measurements section with all AI measurements
  const renderMeasurementsSection = () => {
    if (!scanResults) return null;
    
    return (
      <Box sx={styles.section}>
        <Typography variant="h6" gutterBottom>
          Your Facial Measurements
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={styles.measurementCard}>
              <Typography variant="subtitle1">Pupillary Distance (PD)</Typography>
              <Typography variant="h4">{scanResults.measurements?.pupillaryDistance || '--'} mm</Typography>
              <Typography variant="caption">Distance between your pupils</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={styles.measurementCard}>
              <Typography variant="subtitle1">Bridge Width</Typography>
              <Typography variant="h4">{scanResults.measurements?.bridgeWidth || '--'} mm</Typography>
              <Typography variant="caption">Width of your nose bridge</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={styles.measurementCard}>
              <Typography variant="subtitle1">Temple Width</Typography>
              <Typography variant="h4">{scanResults.measurements?.templeWidth || '--'} mm</Typography>
              <Typography variant="caption">Width between your temples</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={styles.measurementCard}>
              <Typography variant="subtitle1">Lens Height</Typography>
              <Typography variant="h4">{scanResults.measurements?.lensHeight || '--'} mm</Typography>
              <Typography variant="caption">Ideal lens height for your face</Typography>
            </Paper>
          </Grid>
          
          {scanResults.measurements?.faceWidth && (
            <Grid item xs={12} sm={6}>
              <Paper sx={styles.measurementCard}>
                <Typography variant="subtitle1">Face Width</Typography>
                <Typography variant="h4">{scanResults.measurements.faceWidth} mm</Typography>
                <Typography variant="caption">Width of your face at cheekbones</Typography>
              </Paper>
            </Grid>
          )}
          
          {scanResults.measurements?.faceHeight && (
            <Grid item xs={12} sm={6}>
              <Paper sx={styles.measurementCard}>
                <Typography variant="subtitle1">Face Height</Typography>
                <Typography variant="h4">{scanResults.measurements.faceHeight} mm</Typography>
                <Typography variant="caption">Height from chin to forehead</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };
  
  // Render AI-generated frame recommendations
  const renderRecommendationsSection = () => {
    if (!frameRecommendations || frameRecommendations.length === 0) return null;
    
    return (
      <Box sx={styles.section}>
        <Typography variant="h6" gutterBottom>
          Recommended Frame Styles
        </Typography>
        
        <Typography variant="body2" paragraph>
          Based on your {scanResults?.faceShape || 'face'} shape, these frame styles will suit you best:
        </Typography>
        
        <Box sx={styles.frameStyles}>
          {frameRecommendations.map((style, index) => (
            <Chip 
              key={index}
              label={capitalizeFirstLetter(style.replace('_', ' '))}
              sx={styles.frameStyleChip}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        
        {scanResults?.recommendedStyle && (
          <Box sx={styles.styleSection}>
            <Typography variant="subtitle1" gutterBottom>
              AI-Recommended Style: <strong>{capitalizeFirstLetter(scanResults.recommendedStyle)}</strong>
            </Typography>
          </Box>
        )}
        
        <Box sx={styles.actionButtons} mt={2}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onViewRecommendations}
            startIcon={<ShoppingBagIcon />}
          >
            View Recommended Frames
          </Button>
        </Box>
      </Box>
    );
  };
  
  // Styles object
  const styles = {
    section: {
      marginBottom: 4
    },
    measurementCard: {
      padding: 2,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    faceShapeDisplay: {
      display: 'flex',
      alignItems: 'center',
      padding: 2
    },
    faceShapeIcon: {
      fontSize: '4rem',
      marginRight: 3
    },
    faceShapeInfo: {
      flex: 1
    },
    faceShapeName: {
      fontWeight: 'bold'
    },
    faceShapeDescription: {
      marginTop: 2
    },
    confidenceBar: {
      marginTop: 1,
      marginBottom: 2,
      height: 8,
      borderRadius: 4
    },
    frameStyles: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1
    },
    frameStyleChip: {
      margin: 0.5
    },
    styleSection: {
      marginTop: 2
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: 2
    }
  };
  
  // Helper functions
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getFaceShapeIcon = (faceShape) => {
    // Simple emoji representation for different face shapes
    const icons = {
      'oval': '🥚',
      'round': '⭕',
      'square': '🟧',
      'heart': '♥️',
      'oblong': '🔸',
      'diamond': '♦️',
      'triangle': '▲',
      'pear': '🍐'
    };
    
    return icons[faceShape] || '👤';
  };

  const getFaceShapeDescription = (faceShape) => {
    const descriptions = {
      'oval': 'The oval face is the most balanced face shape. It's longer than it is wide, with a rounded jawline and forehead.',
      'round': 'Round faces have curved lines with a width and length that are similar, with a rounded jawline and hairline.',
      'square': 'Square faces have a strong jawline, a flat base, and sides that are straight from the forehead to the jaw.',
      'heart': 'Heart-shaped faces have a wider forehead and narrower jawline, sometimes with a pointed chin.',
      'oblong': 'Oblong faces are longer than they are wide, with a long straight cheek line.',
      'diamond': 'Diamond faces have a narrow forehead and jawline with wide cheekbones.',
      'triangle': 'Triangular faces have a narrow forehead and wide jawline.',
      'pear': 'Pear-shaped faces have a narrow forehead and a wider jawline.'
    };
    
    return descriptions[faceShape] || 'A unique face shape with its own distinctive characteristics.';
  };
  
  return (
    <Card elevation={3} sx={{ overflow: 'visible' }}>
      {/* Header with user photo placeholder */}
      <Box
        sx={{
          position: 'relative',
          height: 120,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contralto,
          display: 'flex',
          alignItems: 'center',
          px: 3
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            border: '3px solid white',
            backgroundColor: theme.palette.secondary.main,
            position: 'absolute',
            bottom: -40
          }}
        >
          <FaceIcon sx={{ fontSize: 40 }} />
        </Avatar>
        
        <Box sx={{ ml: 12 }}>
          <Typography variant="h5" component="h2" fontWeight="bold" color="white">
            Face Measurement Results
          </Typography>
          <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
            Scan quality: {Math.round(measurements.scanQuality * 100)}% • {new Date(measurements.timestamp).toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title={favoriteResults ? "Remove from favorites" : "Add to favorites"}>
            <IconButton onClick={toggleFavorite} color="inherit">
              {favoriteResults ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share results">
            <IconButton color="inherit">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download results">
            <IconButton color="inherit">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Tabs for different views */}
      <Box sx={{ mt: 5, px: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<MeasureIcon />} label="Measurements" />
          <Tab icon={<StyleIcon />} label="Frame Recommendations" />
          {faceAnalysis && <Tab icon={<FaceIcon />} label="Face Analysis" />}
        </Tabs>
      </Box>
      
      {/* Tab content */}
      <CardContent sx={{ pt: 3 }}>
        {/* Measurements Tab */}
        {activeTab === 0 && (
          <Box>
            {renderMeasurementsSection()}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              These measurements are calculated based on your facial scan and can be used to find
              perfectly fitting eyewear. Save these measurements to your profile for future use.
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                startIcon={<ChartIcon />}
                onClick={() => {}}
              >
                View Details
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CheckIcon />}
                onClick={onSave}
              >
                Save Measurements
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Frame Recommendations Tab */}
        {activeTab === 1 && (
          <Box>
            {renderRecommendationsSection()}
          </Box>
        )}
        
        {/* Face Analysis Tab - only shown if face analysis data is available */}
        {activeTab === 2 && faceAnalysis && (
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Face Analysis Results
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Face Characteristics
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <FaceIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Face Shape"
                        secondary={faceAnalysis.faceShape || "Oval"} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <FaceIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Face Symmetry"
                        secondary={faceAnalysis.faceSymmetry || "Balanced"} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <ColorIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Skin Tone"
                        secondary={faceAnalysis.skinTone || "Medium"} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Recommended Styles
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(faceAnalysis.recommendedStyles || ['Rectangle', 'Round', 'Cat-Eye']).map((style, index) => (
                      <Chip key={index} label={style} color="primary" variant="outlined" />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                    Recommended Colors
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(faceAnalysis.recommendedColors || ['Black', 'Tortoise', 'Blue', 'Silver']).map((color, index) => (
                      <Chip key={index} label={color} color="secondary" variant="outlined" />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Style Recommendation
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Based on your face shape ({faceAnalysis.faceShape || "Oval"}), we recommend 
                    {(faceAnalysis.recommendedStyles || ['rectangle', 'round']).map((style, i, arr) => {
                      if (i === 0) return ` ${style}`;
                      if (i === arr.length - 1) return ` and ${style}`;
                      return `, ${style}`;
                    })} frames to complement your features.
                  </Typography>
                  
                  <Typography variant="body2">
                    For your skin tone ({faceAnalysis.skinTone || "Medium"}), 
                    {(faceAnalysis.recommendedColors || ['black', 'tortoise', 'blue']).map((color, i, arr) => {
                      if (i === 0) return ` ${color}`;
                      if (i === arr.length - 1) return ` and ${color}`;
                      return `, ${color}`;
                    })} colors would work well to enhance your natural coloring.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<StyleIcon />}
                onClick={onTryFrames}
              >
                Explore Recommended Frames
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementResults; 