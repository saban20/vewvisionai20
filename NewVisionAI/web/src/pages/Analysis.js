import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Face as FaceIcon,
  AddShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Simulated face measurement data
const MOCK_MEASUREMENT = {
  id: 1,
  date: '2023-04-15',
  time: '14:30',
  metrics: {
    faceShape: 'Oval',
    faceWidth: 142,
    faceHeight: 205,
    interPupillaryDistance: 63,
    noseToEar: 97,
    templeLength: 145,
  },
  recommendations: [
    {
      id: 101,
      name: 'Classic Aviator',
      brand: 'RayBan',
      price: 149.99,
      image: 'https://via.placeholder.com/300x150?text=Classic+Aviator',
      matchScore: 95,
    },
    {
      id: 102,
      name: 'Round Metal',
      brand: 'RayBan',
      price: 159.99,
      image: 'https://via.placeholder.com/300x150?text=Round+Metal',
      matchScore: 88,
    },
    {
      id: 103,
      name: 'Square Frame',
      brand: 'Prada',
      price: 229.99,
      image: 'https://via.placeholder.com/300x150?text=Square+Frame',
      matchScore: 82,
    },
  ],
  faceScanImage: 'https://via.placeholder.com/400x300?text=Face+Scan+Image',
};

const Analysis = ({ showNotification }) => {
  const { measurementId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [measurement, setMeasurement] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState([]);

  // Fetch measurement data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call using the measurementId
      setTimeout(() => {
        setMeasurement(MOCK_MEASUREMENT);
        setLoading(false);
      }, 1500);
    };

    fetchData();
  }, [measurementId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleAddToCart = (product) => {
    // In a real app, this would add the item to the cart
    showNotification(`Added ${product.name} to cart`, 'success');
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        showNotification('Removed from favorites', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showNotification('Added to favorites', 'success');
        return [...prev, productId];
      }
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    showNotification('Share functionality not implemented in demo', 'info');
  };

  const handleDownload = () => {
    // In a real app, this would download the measurement data
    showNotification('Measurement data download started', 'info');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Face Analysis Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scan from {measurement.date} at {measurement.time}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Download Data">
          <IconButton onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share Results">
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 4 }}
      >
        <Tab icon={<FaceIcon />} label="FACE ANALYSIS" />
        <Tab icon={<FavoriteIcon />} label="RECOMMENDATIONS" />
      </Tabs>

      {/* Face Analysis Tab */}
      {tabValue === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Face Scan
              </Typography>
              <Box 
                component="img"
                src={measurement.faceScanImage}
                alt="Face Scan"
                sx={{ 
                  width: '100%', 
                  borderRadius: 1,
                  mb: 2
                }}
              />
              <Typography variant="body2" color="text.secondary">
                This scan was taken on {measurement.date} and provides accurate measurements
                for finding the perfect eyewear fit.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Face Measurements
              </Typography>
              <Chip 
                label={`Face Shape: ${measurement.metrics.faceShape}`}
                color="primary"
                icon={<FaceIcon />}
                sx={{ mb: 3 }}
              />
              <List disablePadding>
                <ListItem divider>
                  <ListItemText 
                    primary="Face Width" 
                    secondary="The widest part of your face" 
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {measurement.metrics.faceWidth} mm
                  </Typography>
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Face Height" 
                    secondary="From hairline to chin" 
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {measurement.metrics.faceHeight} mm
                  </Typography>
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Interpupillary Distance" 
                    secondary="Distance between your pupils" 
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {measurement.metrics.interPupillaryDistance} mm
                  </Typography>
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Nose to Ear" 
                    secondary="From nose bridge to ear" 
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {measurement.metrics.noseToEar} mm
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Temple Length" 
                    secondary="From ear to back of head" 
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {measurement.metrics.templeLength} mm
                  </Typography>
                </ListItem>
              </List>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  What Does This Mean?
                </Typography>
                <Typography variant="body2" paragraph>
                  Your face shape is {measurement.metrics.faceShape}, which is characterized by balanced proportions.
                  This shape is versatile and suits most eyewear styles.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setTabValue(1)}
                >
                  See Recommended Frames
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Recommendations Tab */}
      {tabValue === 1 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Recommended Frames
          </Typography>
          <Typography variant="body1" paragraph>
            Based on your face measurements, here are the frames that would fit you best:
          </Typography>

          <Grid container spacing={3}>
            {measurement.recommendations.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {product.brand}
                        </Typography>
                        <Typography variant="h6" component="div">
                          {product.name}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${product.matchScore}% Match`}
                        color={
                          product.matchScore > 90 ? 'success' :
                          product.matchScore > 80 ? 'primary' : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ mt: 1 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    
                    <Tooltip title="Why This Match">
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {product.matchScore > 90 
                            ? 'Perfect for your face shape and size'
                            : product.matchScore > 80
                              ? 'Good match for your face structure'
                              : 'Compatible with your measurements'}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<CartIcon />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <IconButton 
                      color="error"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favorites.includes(product.id) 
                        ? <FavoriteIcon /> 
                        : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/shop')}
            >
              Browse All Frames
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Analysis; 