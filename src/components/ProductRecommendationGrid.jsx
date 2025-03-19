import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Rating, 
  IconButton, 
  Tooltip,
  Button,
  useTheme,
  Tabs,
  Tab,
  Fade,
  Zoom,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArIcon from '@mui/icons-material/ViewInAr';
import InfoIcon from '@mui/icons-material/Info';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onTryOn, onAddToCart }) => {
  const theme = useTheme();
  const [favorite, setFavorite] = useState(false);
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setFavorite(!favorite);
  };
  
  const handleTryOn = (e) => {
    e.stopPropagation();
    onTryOn && onTryOn(product);
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };
  
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {product.isNew && (
          <Chip
            label="New"
            color="primary"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              zIndex: 1,
              fontWeight: 'bold' 
            }}
          />
        )}
        
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.imageUrl || 'https://picsum.photos/300/300?random=' + product.id}
            alt={product.name}
            sx={{ objectFit: 'contain', p: 2 }}
          />
          
          <Box 
            sx={{ 
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton 
                size="small" 
                onClick={toggleFavorite}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                {favorite ? 
                  <FavoriteIcon fontSize="small" color="error" /> : 
                  <FavoriteBorderIcon fontSize="small" />
                }
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Virtual try-on">
              <IconButton 
                size="small" 
                onClick={handleTryOn}
                color="primary"
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                <ArIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pt: 1, pb: '12px !important' }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              fontWeight: 600,
              fontSize: '1rem',
              mb: 0.5
            }}
          >
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {product.brand}
          </Typography>
          
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${product.price.toFixed(2)}
            </Typography>
            
            <Rating 
              value={product.rating} 
              readOnly 
              precision={0.5} 
              size="small" 
            />
          </Stack>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            <Chip 
              label={product.frameShape} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={product.frameMaterial} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={product.color} 
              size="small" 
              variant="outlined" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="View details">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ 
                borderRadius: 6,
                px: 2
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
        
        {product.fitScore && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: -15,
              right: -15,
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
              border: `2px solid ${theme.palette.primary.main}`,
              zIndex: 1
            }}
          >
            <Typography 
              variant="h6" 
              color="primary.main" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              {product.fitScore}%
            </Typography>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

const ProductRecommendationGrid = ({ products = [], onTryOn, onAddToCart }) => {
  const [filterValue, setFilterValue] = useState('all');
  
  const handleFilterChange = (event, newValue) => {
    setFilterValue(newValue);
  };
  
  const filteredProducts = React.useMemo(() => {
    if (filterValue === 'all') return products;
    if (filterValue === 'bestFit') return [...products].sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
    if (filterValue === 'price-low') return [...products].sort((a, b) => a.price - b.price);
    if (filterValue === 'price-high') return [...products].sort((a, b) => b.price - a.price);
    if (filterValue === 'rating') return [...products].sort((a, b) => b.rating - a.rating);
    return products;
  }, [products, filterValue]);
  
  return (
    <Box>
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={filterValue} 
          onChange={handleFilterChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="product filtering options"
        >
          <Tab label="All Products" value="all" />
          <Tab label="Best Fit" value="bestFit" />
          <Tab label="Price: Low to High" value="price-low" />
          <Tab label="Price: High to Low" value="price-high" />
          <Tab label="Highest Rated" value="rating" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        {filteredProducts.map((product, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={product.id || index}
          >
            <Zoom 
              in={true} 
              style={{ 
                transitionDelay: `${index * 100}ms`
              }}
            >
              <Box>
                <ProductCard 
                  product={product} 
                  onTryOn={onTryOn}
                  onAddToCart={onAddToCart}
                />
              </Box>
            </Zoom>
          </Grid>
        ))}
      </Grid>
      
      {filteredProducts.length === 0 && (
        <Box 
          sx={{ 
            py: 8, 
            textAlign: 'center' 
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductRecommendationGrid; 