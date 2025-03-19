import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Grid,
  Chip,
  Paper,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Button,
  Rating,
  Fade,
  IconButton,
  Switch
} from '@mui/material'; 
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FaceIcon from '@mui/icons-material/Face';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StyleIcon from '@mui/icons-material/Style';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import * as tf from '@tensorflow/tfjs';

// Apple-inspired styling
const styles = {
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '24px',
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
  cardActions: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  },
  productName: {
    fontSize: '21px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#1d1d1f',
    letterSpacing: '-0.021em',
  },
  productBrand: {
    fontSize: '15px',
    color: '#515154',
    fontWeight: 400,
    marginBottom: '16px',
  },
  chip: {
    borderRadius: '980px',
    fontWeight: 500,
    fontSize: '12px',
    marginRight: '8px',
    marginBottom: '8px',
    padding: '0 4px',
  },
  price: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1d1d1f',
    marginTop: '16px',
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
    letterSpacing: '-0.022em',
    boxShadow: 'none',
    '&:hover': {
      background: '#0077ED',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  },
  selectButton: {
    background: 'rgba(0, 0, 0, 0.04)',
    color: '#1d1d1f',
    borderRadius: '980px',
    padding: '10px 20px',
    textTransform: 'none',
    fontSize: '15px',
    letterSpacing: '-0.022em',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.07)',
    }
  },
  confidenceLabel: {
    fontSize: '13px',
    color: '#86868b',
    marginRight: '8px',
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
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModelLoaded(true);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const faceShape = faceAnalysis?.faceShape?.primaryShape || 'oval';
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
          name: 'Aviator Deluxe',
          brand: 'SkyView',
          shape: 'aviator',
          material: 'metal',
          color: 'silver',
          style: 'classic',
          price: 189.99,
          confidenceScore: 0.78,
          imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
          bestFor: ['oval', 'heart', 'round'],
          features: ['UV protection', 'adjustable nose pads']
        },
        {
          id: 'ew-004',
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
        },
        {
          id: 'ew-005',
          name: 'Cat-Eye Glamour',
          brand: 'ChicVision',
          shape: 'cat-eye',
          material: 'acetate',
          color: 'tortoise',
          style: 'luxury',
          price: 199.99,
          confidenceScore: 0.82,
          imageUrl: 'https://images.unsplash.com/photo-1589805639894-b42f9d1ce372',
          bestFor: ['square', 'round', 'diamond'],
          features: ['gradient lenses', 'premium hinges']
        }
      ];
      
      const filteredByStyle = eyewearDatabase.filter(item => 
        Object.keys(stylePreferences).some(style => 
          stylePreferences[style] && item.style === style
        )
      );
      const filteredByColor = filteredByStyle.filter(item => 
        Object.keys(colorPreferences).some(color => 
          colorPreferences[color] && item.color === color
        )
      );
      const filteredByPrice = filteredByColor.filter(item => 
        item.price >= priceRange[0] && item.price <= priceRange[1]
      );
      
      // Sort by confidence score and face shape match
      const ranked = filteredByPrice.map(item => {
        const faceShapeMatch = item.bestFor.includes(faceShape) ? 0.15 : 0;
        const adjustedScore = item.confidenceScore + faceShapeMatch;
        return { ...item, adjustedScore };
      }).sort((a, b) => b.adjustedScore - a.adjustedScore);
      
      setRecommendations(ranked);
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
  
  const handleSelectFrame = (item) => {
    onRecommendationSelected(item);
    playSound('success');
  };
  
  const playSound = (type) => {
    try {
      const sounds = {
        success: new Audio('/sounds/success.mp3'),
        click: new Audio('/sounds/click.mp3')
      };
      if (sounds[type]) {
        sounds[type].volume = 0.3;
        sounds[type].play();
      }
    } catch (error) {
      console.warn('Unable to play sound:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to document body
    if (!darkMode) {
      document.body.classList.add('dark-section');
    } else {
      document.body.classList.remove('dark-section');
    }
  };

  // Apply dark mode effect when component mounts/unmounts
  useEffect(() => {
    // Clean up on unmount
    return () => {
      document.body.classList.remove('dark-section');
    };
  }, []);

  return (
    <Box sx={styles.container}>
      {/* Add dark mode toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      
      <Typography variant="h4" sx={darkMode ? { ...styles.title, color: '#f5f5f7' } : styles.title}>
        Find Your Perfect Eyewear
      </Typography>
      <Typography sx={darkMode ? { ...styles.subtitle, color: '#a1a1a6' } : styles.subtitle}>
        Personalized recommendations based on your face analysis and preferences
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
                        sx={{
                          color: '#86868b',
                          '&.Mui-checked': {
                            color: '#0071e3',
                          }
                        }}
                      />
                    }
                    label={style.charAt(0).toUpperCase() + style.slice(1)}
                    sx={{ 
                      '.MuiFormControlLabel-label': {
                        fontSize: '15px',
                        color: '#1d1d1f'
                      }
                    }}
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
                        sx={{
                          color: '#86868b',
                          '&.Mui-checked': {
                            color: '#0071e3',
                          }
                        }}
                      />
                    }
                    label={color.charAt(0).toUpperCase() + color.slice(1)}
                    sx={{ 
                      '.MuiFormControlLabel-label': {
                        fontSize: '15px',
                        color: '#1d1d1f'
                      }
                    }}
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
              min={0}
              max={500}
              sx={{
                color: '#0071e3',
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  backgroundColor: '#fff',
                  border: '2px solid #0071e3',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#d2d2d7',
                }
              }}
            />
          </Paper>

          <Button 
            variant="contained"
            onClick={generateRecommendations}
            disabled={loading || !modelLoaded}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={styles.recommendButton}
          >
            {loading ? 'Finding Matches...' : 'Find Perfect Matches'}
          </Button>
        </Grid>

        <Grid item xs={12} md={8}>
          {recommendations.length > 0 ? (
            <Grid container spacing={3}>
              {recommendations.map((item, index) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card 
                      sx={{
                        ...styles.card,
                        ...(hoveredCard === item.id ? styles.cardHover : {})
                      }}
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardMedia
                        component="img"
                        sx={styles.cardMedia}
                        image={item.imageUrl}
                        alt={item.name}
                      />
                      <CardContent sx={styles.cardContent}>
                        <Typography sx={styles.productName}>
                          {item.name}
                        </Typography>
                        <Typography sx={styles.productBrand}>
                          {item.brand}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={item.shape} 
                            size="small" 
                            sx={{
                              ...styles.chip,
                              backgroundColor: 'rgba(0, 113, 227, 0.1)', 
                              color: '#0071e3'
                            }}
                          />
                          <Chip 
                            label={item.material} 
                            size="small" 
                            sx={{
                              ...styles.chip,
                              backgroundColor: 'rgba(104, 204, 69, 0.1)', 
                              color: '#68cc45'
                            }}
                          />
                          <Chip 
                            label={item.color} 
                            size="small" 
                            sx={{
                              ...styles.chip, 
                              backgroundColor: 'rgba(125, 85, 199, 0.1)', 
                              color: '#7d55c7'
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" sx={styles.confidenceLabel}>
                            Match Score
                          </Typography>
                          <Rating 
                            value={item.adjustedScore * 5 / 1.15} 
                            precision={0.5} 
                            readOnly 
                            size="small"
                            sx={{
                              color: '#0071e3'
                            }}
                          />
                        </Box>
                        
                        <Box>
                          {item.features.map((feature, idx) => (
                            <Typography key={idx} variant="body2" sx={{ color: '#515154', fontSize: '13px' }}>
                              • {feature}
                            </Typography>
                          ))}
                        </Box>
                        
                        <Typography sx={styles.price}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={styles.cardActions}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => handleSelectFrame(item)}
                          sx={styles.selectButton}
                        >
                          Select Frame
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column' }}>
              <FaceIcon sx={{ fontSize: 60, color: '#86868b', mb: 2 }} />
              <Typography variant="h6" color="#1d1d1f" sx={{ mb: 1 }}>
                {loading ? 'Finding your perfect frames...' : (modelLoaded ? 'Ready to find your perfect frames' : 'Loading analyzer...')}
              </Typography>
              <Typography variant="body2" color="#86868b" textAlign="center" sx={{ maxWidth: 400 }}>
                {loading 
                  ? 'This will only take a moment...' 
                  : 'Use the filters on the left to customize your preferences, then click "Find Perfect Matches" to see our recommendations.'}
              </Typography>
              {loading && (
                <CircularProgress size={40} sx={{ mt: 3, color: '#0071e3' }} />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

EyewearStyler.defaultProps = {
  faceAnalysis: {
    faceShape: { primaryShape: 'Oval', confidence: 0.87 },
    symmetry: 0.92,
    features: ['High cheekbones', 'Average nose width', 'Defined jawline']
  }
};

export default EyewearStyler; 