import React, { useContext, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FaceIcon from '@mui/icons-material/Face';
import StraightenIcon from '@mui/icons-material/Straighten';
import TuneIcon from '@mui/icons-material/Tune';
import GradeIcon from '@mui/icons-material/Grade';
import { ThemeContext } from '../index';
import { useNavigate } from 'react-router-dom';

// Face shape images (using placeholder images)
const faceShapeImages = {
  "Oval": "https://via.placeholder.com/200x250?text=Oval",
  "Round": "https://via.placeholder.com/200x250?text=Round",
  "Square": "https://via.placeholder.com/200x250?text=Square",
  "Heart": "https://via.placeholder.com/200x250?text=Heart",
  "Rectangle": "https://via.placeholder.com/200x250?text=Rectangle",
  "Diamond": "https://via.placeholder.com/200x250?text=Diamond",
  "Undefined": "https://via.placeholder.com/200x250?text=Analyzing..."
};

// Product recommendations based on face shape
const recommendedStyles = {
  "Oval": ["Rectangle", "Square", "Geometric"],
  "Round": ["Rectangle", "Square", "Wayfarer", "Cat Eye"],
  "Square": ["Round", "Oval", "Aviator"],
  "Heart": ["Aviator", "Cat Eye", "Rounded"],
  "Rectangle": ["Oversized", "Round", "Oval"],
  "Diamond": ["Cat Eye", "Oval", "Rimless"]
};

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Premium Rectangle Frames",
    price: "$129.99",
    image: "https://via.placeholder.com/300x200?text=Rectangle+Frames",
    style: "Rectangle",
    color: "Black",
    rating: 4.8
  },
  {
    id: 2,
    name: "Classic Wayfarer",
    price: "$149.99",
    image: "https://via.placeholder.com/300x200?text=Wayfarer",
    style: "Wayfarer",
    color: "Tortoise",
    rating: 4.7
  },
  {
    id: 3,
    name: "Modern Geometric Eyewear",
    price: "$159.99",
    image: "https://via.placeholder.com/300x200?text=Geometric",
    style: "Geometric",
    color: "Silver",
    rating: 4.5
  }
];

/**
 * ResultsPage component
 * Displays analysis results and recommendations
 * 
 * @param {Object} props
 * @param {Object} props.results - Face analysis results
 */
const ResultsPage = ({ results }) => {
  const { themeMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const isDarkMode = themeMode === 'dark';
  
  // Extract data from results
  const { 
    faceShape = "Oval", 
    measurements = {}, 
    confidence = 0.85,
    processingMode = "offline"
  } = results || {};
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleNewScan = () => {
    navigate('/scan');
  };
  
  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          position: 'relative',
          bgcolor: isDarkMode ? '#1e1e1e' : '#fff'
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Chip 
            color={processingMode === 'offline' ? 'warning' : 'success'} 
            label={processingMode === 'offline' ? 'Local Analysis' : 'Cloud Enhanced'}
            size="small"
          />
        </Box>
        
        <Typography variant="h4" gutterBottom>
          Your Analysis Results
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Based on our AI analysis, we've determined your measurements and ideal frame recommendations.
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Face Shape Analysis" icon={<FaceIcon />} iconPosition="start" />
          <Tab label="Measurements" icon={<StraightenIcon />} iconPosition="start" />
          <Tab label="Recommendations" icon={<GradeIcon />} iconPosition="start" />
        </Tabs>
        
        {/* Face Shape Analysis Tab */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={faceShapeImages[faceShape] || faceShapeImages.Undefined}
                  alt={`${faceShape} face shape`}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom align="center">
                    {faceShape} Face
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Confidence: {Math.round(confidence * 100)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                About {faceShape} Face Shapes
              </Typography>
              
              <Typography variant="body1" paragraph>
                {getFaceShapeDescription(faceShape)}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Recommended Frame Styles
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {(recommendedStyles[faceShape] || []).map((style, index) => (
                  <Chip key={index} label={style} color="primary" variant="outlined" />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Frame Styles to Avoid
              </Typography>
              
              <Typography variant="body1">
                {getStylesToAvoid(faceShape)}
              </Typography>
            </Grid>
          </Grid>
        )}
        
        {/* Measurements Tab */}
        {activeTab === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <StraightenIcon sx={{ mr: 1 }} /> Your Key Measurements
                    </Typography>
                    
                    <List>
                      <ListItem divider>
                        <ListItemText 
                          primary="Pupillary Distance (PD)" 
                          secondary={`${measurements.pupillaryDistance || 64} mm`} 
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemText 
                          primary="Face Width" 
                          secondary={`${measurements.faceWidth || 140} mm`} 
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemText 
                          primary="Bridge Width" 
                          secondary={`${measurements.bridgeWidth || 20} mm`} 
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemText 
                          primary="Temple Length" 
                          secondary={`${measurements.templeLength || 140} mm`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Frame Width" 
                          secondary={`${measurements.frameWidth || 135} mm`} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <TuneIcon sx={{ mr: 1 }} /> Ideal Frame Dimensions
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Based on your facial measurements, we recommend frames with these dimensions:
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Lens Width" 
                          secondary={`${measurements.lensWidth || 50} mm`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Lens Height" 
                          secondary={`${measurements.lensHeight || 35} mm`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Bridge Width" 
                          secondary={`${measurements.bridgeWidth || 20} mm`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Temple Length" 
                          secondary={`${measurements.templeLength || 140} mm`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Total Frame Width" 
                          secondary={`${measurements.frameWidth || 135} mm`}
                        />
                      </ListItem>
                    </List>
                    
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      These measurements ensure your glasses fit comfortably and look great.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Recommendations Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Recommended Products for You
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              We've selected these frames based on your face shape and measurements.
            </Typography>
            
            <Grid container spacing={3}>
              {sampleProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.style} · {product.color}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" color="primary">
                          {product.price}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`★ ${product.rating}`} 
                          color="secondary"
                        />
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button variant="outlined" fullWidth>
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleNewScan}
        >
          Scan Again
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
};

// Helper functions
function getFaceShapeDescription(faceShape) {
  const descriptions = {
    "Oval": "Oval faces are considered the most versatile shape as they have balanced proportions. The face is about 1.5 times longer than it is wide, with a gently rounded jawline and a slightly wider forehead.",
    "Round": "Round faces feature fuller cheeks, a rounded chin, and softer angles. The width and height of the face are roughly equal, creating a circular appearance.",
    "Square": "Square faces have strong, angular features with a prominent jawline and forehead that are roughly the same width. The sides of the face are straight, creating a boxy appearance.",
    "Heart": "Heart-shaped faces have a wider forehead that tapers down to a narrower chin. The cheekbones are typically high and well-defined, creating a romantic appearance.",
    "Rectangle": "Rectangle (or oblong) faces are longer than they are wide, with a straight cheek line and similar width at the forehead and jawline. This shape features an elongated appearance.",
    "Diamond": "Diamond faces have narrow foreheads and jawlines with the cheekbones as the widest part of the face. This creates a diamond-like geometric appearance."
  };
  
  return descriptions[faceShape] || "Face shape analysis provides personalized frame recommendations based on your unique facial structure.";
}

function getStylesToAvoid(faceShape) {
  const avoidStyles = {
    "Oval": "While most styles work well, extremely small frames that disrupt your face's natural balance should be avoided.",
    "Round": "Avoid round frames that echo your face shape and frames that are too small, as they can make your face appear fuller.",
    "Square": "Avoid square or geometric frames that emphasize your angular features. These can make your face appear boxy and more angular.",
    "Heart": "Avoid frames that are heavy or detailed on the bottom, as well as very small frames that can emphasize the narrowness of your chin.",
    "Rectangle": "Avoid narrow or small frames that can make your face appear longer. Also avoid very short frames with sharp angles.",
    "Diamond": "Avoid angular, narrow frames that mimic your face shape, and frames that are wider than your cheekbones."
  };
  
  return avoidStyles[faceShape] || "Certain frame shapes may not complement your facial structure as well as our recommended options.";
}

export default ResultsPage; 