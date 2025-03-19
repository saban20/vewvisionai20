import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Card, CardMedia, CardContent, Grid, useMediaQuery, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Favorite, FavoriteBorder } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_GLASSES = [
  {
    id: 1,
    name: 'Classic Aviator',
    brand: 'RayBan',
    price: 149.99,
    image: 'https://via.placeholder.com/300x150?text=Classic+Aviator',
    category: 'Sunglasses',
    bestSeller: true
  },
  {
    id: 2,
    name: 'Round Metal',
    brand: 'RayBan',
    price: 159.99,
    image: 'https://via.placeholder.com/300x150?text=Round+Metal',
    category: 'Sunglasses',
    bestSeller: false
  },
  {
    id: 3,
    name: 'Wayfarer',
    brand: 'RayBan',
    price: 139.99,
    image: 'https://via.placeholder.com/300x150?text=Wayfarer',
    category: 'Sunglasses',
    bestSeller: true
  },
  {
    id: 4,
    name: 'Clubmaster',
    brand: 'RayBan',
    price: 169.99,
    image: 'https://via.placeholder.com/300x150?text=Clubmaster',
    category: 'Sunglasses',
    bestSeller: false
  },
  {
    id: 5,
    name: 'Square Frame',
    brand: 'Prada',
    price: 229.99,
    image: 'https://via.placeholder.com/300x150?text=Square+Frame',
    category: 'Optical',
    bestSeller: false
  },
  {
    id: 6,
    name: 'Cat Eye',
    brand: 'Gucci',
    price: 249.99,
    image: 'https://via.placeholder.com/300x150?text=Cat+Eye',
    category: 'Optical',
    bestSeller: true
  },
  {
    id: 7,
    name: 'Oval',
    brand: 'Versace',
    price: 219.99,
    image: 'https://via.placeholder.com/300x150?text=Oval',
    category: 'Optical',
    bestSeller: false
  },
  {
    id: 8,
    name: 'Rectangular',
    brand: 'Oakley',
    price: 189.99,
    image: 'https://via.placeholder.com/300x150?text=Rectangular',
    category: 'Optical',
    bestSeller: false
  }
];

const EyewearCarousel = ({ title = "Recommended Eyewear", subtitle, category, limit = 8, onProductClick }) => {
  const [favorites, setFavorites] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Determine how many items to show at once based on screen size
  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4;
  
  // Filter glasses by category if provided
  useEffect(() => {
    let filteredGlasses = [...MOCK_GLASSES];
    
    if (category) {
      filteredGlasses = filteredGlasses.filter(item => item.category === category);
    }
    
    // Limit the number of items if specified
    filteredGlasses = filteredGlasses.slice(0, limit);
    
    setVisibleItems(filteredGlasses);
  }, [category, limit]);
  
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleNext = () => {
    if (currentIndex + itemsPerPage < visibleItems.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    } else {
      // Loop back to the beginning
      setCurrentIndex(0);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    } else {
      // Loop to the end
      const lastPageIndex = Math.floor((visibleItems.length - 1) / itemsPerPage) * itemsPerPage;
      setCurrentIndex(lastPageIndex);
    }
  };
  
  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };
  
  // Calculate visible slices
  const visibleSlice = visibleItems.slice(currentIndex, currentIndex + itemsPerPage);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: 'beforeChildren'
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          <IconButton onClick={handlePrev} aria-label="previous">
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={handleNext} aria-label="next">
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Grid container spacing={2}>
            {visibleSlice.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <motion.div variants={itemVariants}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleProductClick(item)}
                  >
                    {item.bestSeller && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          left: 10, 
                          bgcolor: 'secondary.main', 
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          zIndex: 1
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold">
                          Best Seller
                        </Typography>
                      </Box>
                    )}
                    
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.image}
                      alt={item.name}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                      <IconButton 
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        color="error"
                        aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(item.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      
                      <Typography variant="body2" color="text.secondary">
                        {item.brand}
                      </Typography>
                      <Typography variant="h6" component="div" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
      
      {visibleItems.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          {[...Array(Math.ceil(visibleItems.length / itemsPerPage))].map((_, index) => {
            const isActive = index === Math.floor(currentIndex / itemsPerPage);
            return (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  mx: 0.5,
                  bgcolor: isActive ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
              />
            );
          })}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" color="primary">
          View All {category || 'Eyewear'}
        </Button>
      </Box>
    </Box>
  );
};

export default EyewearCarousel; 