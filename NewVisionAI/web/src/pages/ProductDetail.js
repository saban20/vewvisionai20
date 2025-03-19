import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Rating,
  Breadcrumbs,
  Link,
  Alert,
  Chip,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Face as FaceIcon,
  ColorLens as ColorIcon,
  ScatterPlot as MaterialIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Mock product data
const MOCK_PRODUCTS = {
  101: {
    id: 101,
    name: 'Classic Aviator',
    brand: 'RayBan',
    price: 149.99,
    image: 'https://via.placeholder.com/600x400?text=Classic+Aviator',
    additionalImages: [
      'https://via.placeholder.com/600x400?text=Classic+Aviator+Side',
      'https://via.placeholder.com/600x400?text=Classic+Aviator+Front',
      'https://via.placeholder.com/600x400?text=Classic+Aviator+Back',
    ],
    category: 'Sunglasses',
    description: 'The timeless RayBan Classic Aviator features a teardrop shape that flatters most face shapes. Originally designed for U.S. aviators in 1937, this style has since become an icon in eyewear fashion.',
    features: [
      'Polarized lenses available',
      'UV400 protection',
      'Adjustable nose pads',
      'Metal frame construction',
      'Available in multiple lens colors',
    ],
    specs: {
      material: 'Metal',
      colors: ['Gold', 'Silver', 'Black'],
      frameWidth: 142,
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 145,
    },
    faceShapes: ['Oval', 'Heart', 'Square'],
    rating: 4.7,
    reviewCount: 245,
    inStock: true,
    bestSeller: true,
  },
  102: {
    id: 102,
    name: 'Round Metal',
    brand: 'RayBan',
    price: 159.99,
    image: 'https://via.placeholder.com/600x400?text=Round+Metal',
    additionalImages: [
      'https://via.placeholder.com/600x400?text=Round+Metal+Side',
      'https://via.placeholder.com/600x400?text=Round+Metal+Front',
      'https://via.placeholder.com/600x400?text=Round+Metal+Back',
    ],
    category: 'Sunglasses',
    description: 'The RayBan Round Metal sunglasses are a timeless model that combines great styling with exceptional quality, performance and comfort.',
    features: [
      'Crystal lenses',
      'UV400 protection',
      'Adjustable nose pads',
      'Slim metal frame',
      'Iconic round design',
    ],
    specs: {
      material: 'Metal',
      colors: ['Gold', 'Silver', 'Black'],
      frameWidth: 136,
      lensWidth: 50,
      bridgeWidth: 21,
      templeLength: 145,
    },
    faceShapes: ['Oval', 'Square'],
    rating: 4.5,
    reviewCount: 198,
    inStock: true,
    bestSeller: false,
  },
};

const ProductDetail = ({ showNotification }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call using the productId
      setTimeout(() => {
        const productData = MOCK_PRODUCTS[productId];
        if (productData) {
          setProduct(productData);
          // Default selected color to first available color
          setSelectedColor(productData.specs.colors[0]);
        }
        setLoading(false);
      }, 1500);
    };

    fetchData();
  }, [productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newValue = prev + change;
      return newValue < 1 ? 1 : newValue;
    });
  };

  const handleAddToCart = () => {
    showNotification(`Added ${quantity} ${product.name} to cart`, 'success');
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    showNotification(
      isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite ? 'info' : 'success'
    );
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    showNotification('Share functionality not implemented in demo', 'info');
  };

  const handleBackClick = () => {
    navigate('/shop');
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error">
          Product not found. The product you're looking for doesn't exist or has been removed.
        </Alert>
        <Button 
          startIcon={<BackIcon />} 
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Return to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button"
          variant="body2" 
          color="inherit"
          onClick={() => navigate('/')}
        >
          Home
        </Link>
        <Link 
          component="button"
          variant="body2" 
          color="inherit"
          onClick={() => navigate('/shop')}
        >
          Shop
        </Link>
        <Link 
          component="button"
          variant="body2" 
          color="inherit"
          onClick={() => navigate(`/shop?category=${product.category.toLowerCase()}`)}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box 
              component="img"
              src={selectedImage === 0 ? product.image : product.additionalImages[selectedImage - 1]}
              alt={product.name}
              sx={{ 
                width: '100%', 
                borderRadius: 1,
                height: 'auto'
              }}
            />
          </Paper>
          
          {/* Thumbnail Images */}
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Paper 
                elevation={selectedImage === 0 ? 4 : 1} 
                sx={{ 
                  p: 0.5, 
                  border: selectedImage === 0 ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  cursor: 'pointer'
                }}
                onClick={() => handleImageSelect(0)}
              >
                <Box 
                  component="img"
                  src={product.image}
                  alt={`${product.name} main`}
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Paper>
            </Grid>
            {product.additionalImages.map((img, index) => (
              <Grid item xs={3} key={index}>
                <Paper 
                  elevation={selectedImage === index + 1 ? 4 : 1} 
                  sx={{ 
                    p: 0.5, 
                    border: selectedImage === index + 1 ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageSelect(index + 1)}
                >
                  <Box 
                    component="img"
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    sx={{ width: '100%', height: 'auto' }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            {product.bestSeller && (
              <Chip 
                label="Best Seller" 
                color="secondary"
                size="small"
                sx={{ mb: 1 }}
              />
            )}
            <Typography variant="subtitle1" color="text.secondary">
              {product.brand}
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviewCount} reviews)
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Product Options */}
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Color</FormLabel>
              <RadioGroup
                row
                value={selectedColor}
                onChange={handleColorChange}
              >
                {product.specs.colors.map((color) => (
                  <FormControlLabel 
                    key={color} 
                    value={color} 
                    control={<Radio />} 
                    label={color} 
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton onClick={() => handleQuantityChange(1)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                fullWidth
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <IconButton 
                color="error"
                onClick={toggleFavorite}
                sx={{ border: '1px solid', borderColor: 'grey.300' }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton 
                onClick={handleShare}
                sx={{ border: '1px solid', borderColor: 'grey.300' }}
              >
                <ShareIcon />
              </IconButton>
            </Box>

            {/* Compatibility Info */}
            <Box sx={{ mb: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FaceIcon sx={{ mr: 1 }} /> Face Shape Compatibility
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.faceShapes.map(shape => (
                  <Chip 
                    key={shape} 
                    label={shape}
                    icon={<CheckIcon fontSize="small" />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Specs */}
          <Box>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ mb: 2 }}
            >
              <Tab label="Features" />
              <Tab label="Specifications" />
            </Tabs>

            {tabValue === 0 && (
              <List dense>
                {product.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            )}

            {tabValue === 1 && (
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MaterialIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Material" 
                    secondary={product.specs.material} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ColorIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Colors Available" 
                    secondary={product.specs.colors.join(', ')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Frame Width" 
                    secondary={`${product.specs.frameWidth} mm`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Lens Width" 
                    secondary={`${product.specs.lensWidth} mm`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Bridge Width" 
                    secondary={`${product.specs.bridgeWidth} mm`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Temple Length" 
                    secondary={`${product.specs.templeLength} mm`} 
                  />
                </ListItem>
              </List>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Product Recommendations */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          You might also like
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {/* Just showing one related product for simplicity */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box 
                component="img"
                src="https://via.placeholder.com/300x150?text=Related+Product"
                alt="Related Product"
                sx={{ width: '100%', height: 'auto', mb: 2 }}
              />
              <Typography variant="subtitle1">
                Similar Frame Style
              </Typography>
              <Typography variant="body2" color="text.secondary">
                $129.99
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => navigate('/products/102')}
              >
                View Details
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail; 