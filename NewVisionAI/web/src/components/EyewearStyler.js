import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress
} from '@mui/material';
import StyleIcon from '@mui/icons-material/Style';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FaceIcon from '@mui/icons-material/Face';

// Clean and modern styling
const styles = {
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#1d1d1f',
  },
  subtitle: {
    fontSize: '19px',
    fontWeight: 400,
    color: '#515154',
    marginBottom: '40px',
  },
  card: {
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: 'none',
    background: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    transform: 'scale(1.01)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
  cardMedia: {
    height: 280,
    backgroundPosition: 'center 35%',
  },
  cardContent: {
    padding: '24px',
    flexGrow: 1,
  },
  filterSection: {
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '32px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  filterTitle: {
    fontSize: '19px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#1d1d1f',
  },
  recommendButton: {
    background: '#0071e3',
    color: '#ffffff',
    fontWeight: 500,
    borderRadius: '980px',
    padding: '12px 24px',
    textTransform: 'none',
    fontSize: '17px',
    boxShadow: 'none',
    '&:hover': {
      background: '#0077ED',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  }
};

const EyewearStyler = ({ faceAnalysis, onRecommendationSelected }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stylePreferences, setStylePreferences] = useState({
    modern: true,
    classic: false,
    sporty: false,
    luxury: false,
    minimalist: true
  });
  const [colorPreferences, setColorPreferences] = useState({
    black: true,
    tortoise: true,
    clear: false,
    colorful: false,
    metallic: true
  });
  const [priceRange, setPriceRange] = useState([50, 300]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample data - in a real app, this would come from an API
      const eyewearDatabase = [
        {
          id: 'ew-001',
          name: 'Modern Square',
          brand: 'NewVision',
          shape: 'square',
          material: 'acetate',
          color: 'black',
          style: 'modern',
          price: 129.99,
          confidenceScore: 0.91,
          imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
          bestFor: ['square', 'oval', 'heart'],
          features: ['blue light filtering', 'anti-scratch coating']
        },
        {
          id: 'ew-002',
          name: 'Classic Round',
          brand: 'OpticLux',
          shape: 'round',
          material: 'metal',
          color: 'gold',
          style: 'classic',
          price: 159.99,
          confidenceScore: 0.87,
          imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666',
          bestFor: ['square', 'rectangular', 'diamond'],
          features: ['polarized', 'lightweight']
        },
        {
          id: 'ew-003',
          name: 'Minimalist Rectangle',
          brand: 'PureFrame',
          shape: 'rectangular',
          material: 'titanium',
          color: 'black',
          style: 'minimalist',
          price: 249.99,
          confidenceScore: 0.95,
          imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371',
          bestFor: ['round', 'oval', 'heart'],
          features: ['hypoallergenic', 'memory titanium']
        }
      ];
      
      const faceShape = faceAnalysis?.faceShape?.primaryShape || 'oval';
      
      // Filter by preferences
      let filtered = eyewearDatabase.filter(item => {
        // Check style preference
        if (!stylePreferences[item.style]) return false;
        
        // Check color preference
        if (!colorPreferences[item.color]) return false;
        
        // Check price range
        if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
        
        return true;
      });
      
      // Sort by compatibility with face shape
      filtered = filtered.sort((a, b) => {
        const aCompatible = a.bestFor.includes(faceShape);
        const bCompatible = b.bestFor.includes(faceShape);
        
        if (aCompatible && !bCompatible) return -1;
        if (!aCompatible && bCompatible) return 1;
        return b.confidenceScore - a.confidenceScore;
      });
      
      setRecommendations(filtered);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStyleChange = (event) => {
    setStylePreferences({
      ...stylePreferences,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleColorChange = (event) => {
    setColorPreferences({
      ...colorPreferences,
      [event.target.name]: event.target.checked
    });
  };
  
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h2" sx={styles.title}>
        Find Your Perfect Eyewear
      </Typography>
      <Typography variant="body1" sx={styles.subtitle}>
        Based on your face analysis, we'll recommend frames that complement your unique features.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={styles.filterSection} elevation={0}>
            <Typography sx={styles.filterTitle}>
              <StyleIcon fontSize="small" sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              Frame Style
            </Typography>
            <FormControl component="fieldset">
              <FormGroup>
                {Object.keys(stylePreferences).map((style) => (
                  <FormControlLabel
                    key={style}
                    control={
                      <Checkbox 
                        checked={stylePreferences[style]} 
                        onChange={handleStyleChange} 
                        name={style}
                      />
                    }
                    label={style.charAt(0).toUpperCase() + style.slice(1)}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Paper>

          <Paper sx={styles.filterSection} elevation={0}>
            <Typography sx={styles.filterTitle}>
              <ColorLensIcon fontSize="small" sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              Frame Color
            </Typography>
            <FormControl component="fieldset">
              <FormGroup>
                {Object.keys(colorPreferences).map((color) => (
                  <FormControlLabel
                    key={color}
                    control={
                      <Checkbox 
                        checked={colorPreferences[color]} 
                        onChange={handleColorChange} 
                        name={color}
                      />
                    }
                    label={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Paper>

          <Paper sx={styles.filterSection} elevation={0}>
            <Typography sx={styles.filterTitle}>
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={50}
              max={500}
              step={10}
            />
          </Paper>

          <Button
            variant="contained"
            fullWidth
            sx={styles.recommendButton}
            onClick={generateRecommendations}
            startIcon={<AutoAwesomeIcon />}
            disabled={loading}
          >
            {loading ? 'Finding Matches...' : 'Find My Perfect Frames'}
          </Button>
        </Grid>

        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {recommendations.length > 0 ? (
                recommendations.map((item) => (
                  <Grid item xs={12} sm={6} md={6} key={item.id}>
                    <Card sx={styles.card}>
                      <CardMedia
                        component="img"
                        height="280"
                        image={item.imageUrl}
                        alt={item.name}
                      />
                      <CardContent sx={styles.cardContent}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.brand}
                        </Typography>
                        <Box sx={{ my: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.features.map((feature, idx) => (
                            <Chip 
                              key={idx} 
                              label={feature} 
                              size="small" 
                              variant="outlined" 
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="h6" color="primary">
                            ${item.price}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            onClick={() => onRecommendationSelected && onRecommendationSelected(item)}
                          >
                            Select
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: '100%', textAlign: 'center', py: 6 }}>
                  <FaceIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select your preferences and click 'Find My Perfect Frames' to see recommendations
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EyewearStyler; 