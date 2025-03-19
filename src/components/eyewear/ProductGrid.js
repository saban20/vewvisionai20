import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
  Chip,
  Rating
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductGrid = ({ products, loading, darkMode, onProductSelect }) => {
  // Handle product selection
  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Show skeleton loaders when loading
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(8)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card elevation={darkMode ? 2 : 1} sx={{ 
              height: '100%',
              backgroundColor: darkMode ? '#1e1e1e' : 'white',
              color: darkMode ? '#f5f5f7' : 'inherit'
            }}>
              <Skeleton variant="rectangular" height={200} animation="wave" />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} animation="wave" />
                <Skeleton variant="text" width="60%" height={20} animation="wave" />
                <Skeleton variant="text" width="40%" height={20} animation="wave" />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="rectangular" width={100} height={36} animation="wave" />
                  <Skeleton variant="circular" width={36} height={36} animation="wave" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // No products found
  if (!products || products.length === 0) {
    return (
      <Box sx={{ 
        py: 4, 
        textAlign: 'center',
        color: darkMode ? '#f5f5f7' : 'inherit'
      }}>
        <Typography variant="h6" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your filters or try a different search.
        </Typography>
      </Box>
    );
  }

  // Render product grid
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Card 
            elevation={darkMode ? 2 : 1} 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              backgroundColor: darkMode ? '#1e1e1e' : 'white',
              color: darkMode ? '#f5f5f7' : 'inherit',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: darkMode ? '0 8px 16px rgba(0,0,0,0.5)' : '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => handleProductClick(product)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2, backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f7' }}
              />
              {product.isNew && (
                <Chip 
                  label="New" 
                  size="small"
                  color="primary"
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    left: 12,
                    fontWeight: 'bold'
                  }}
                />
              )}
              {product.discount > 0 && (
                <Chip 
                  label={`-${product.discount}%`} 
                  size="small"
                  color="error"
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {product.brand}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {product.frameShape} · {product.color}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={product.rating} 
                  precision={0.5} 
                  size="small" 
                  readOnly 
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  ({product.reviewCount})
                </Typography>
              </Box>
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? '#f5f5f7' : 'inherit' }}>
                  ${product.price}
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      minWidth: 0, 
                      p: 1, 
                      borderRadius: '50%',
                      mr: 1,
                      color: darkMode ? '#f5f5f7' : 'inherit',
                      borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'
                    }}
                  >
                    <FavoriteBorderIcon fontSize="small" />
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      backgroundColor: '#0071e3',
                      '&:hover': {
                        backgroundColor: '#0058a9'
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid; 