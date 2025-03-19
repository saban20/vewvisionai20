import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

// Mock data for eyewear products
const MOCK_PRODUCTS = [
  {
    id: 101,
    name: 'Classic Aviator',
    brand: 'RayBan',
    price: 149.99,
    image: 'https://via.placeholder.com/300x150?text=Classic+Aviator',
    category: 'Sunglasses',
    faceShapes: ['Oval', 'Heart', 'Square'],
    material: 'Metal',
    color: 'Gold',
    bestSeller: true,
  },
  {
    id: 102,
    name: 'Round Metal',
    brand: 'RayBan',
    price: 159.99,
    image: 'https://via.placeholder.com/300x150?text=Round+Metal',
    category: 'Sunglasses',
    faceShapes: ['Oval', 'Square'],
    material: 'Metal',
    color: 'Silver',
    bestSeller: false,
  },
  {
    id: 103,
    name: 'Wayfarer',
    brand: 'RayBan',
    price: 139.99,
    image: 'https://via.placeholder.com/300x150?text=Wayfarer',
    category: 'Sunglasses',
    faceShapes: ['Round', 'Oval'],
    material: 'Acetate',
    color: 'Black',
    bestSeller: true,
  },
  {
    id: 104,
    name: 'Clubmaster',
    brand: 'RayBan',
    price: 169.99,
    image: 'https://via.placeholder.com/300x150?text=Clubmaster',
    category: 'Sunglasses',
    faceShapes: ['Diamond', 'Oval'],
    material: 'Mixed',
    color: 'Tortoise',
    bestSeller: false,
  },
  {
    id: 105,
    name: 'Square Frame',
    brand: 'Prada',
    price: 229.99,
    image: 'https://via.placeholder.com/300x150?text=Square+Frame',
    category: 'Optical',
    faceShapes: ['Round', 'Oval'],
    material: 'Acetate',
    color: 'Black',
    bestSeller: false,
  },
  {
    id: 106,
    name: 'Cat Eye',
    brand: 'Gucci',
    price: 249.99,
    image: 'https://via.placeholder.com/300x150?text=Cat+Eye',
    category: 'Optical',
    faceShapes: ['Diamond', 'Oval', 'Heart'],
    material: 'Acetate',
    color: 'Tortoise',
    bestSeller: true,
  },
  {
    id: 107,
    name: 'Oval',
    brand: 'Versace',
    price: 219.99,
    image: 'https://via.placeholder.com/300x150?text=Oval',
    category: 'Optical',
    faceShapes: ['Square', 'Rectangle'],
    material: 'Metal',
    color: 'Gold',
    bestSeller: false,
  },
  {
    id: 108,
    name: 'Rectangular',
    brand: 'Oakley',
    price: 189.99,
    image: 'https://via.placeholder.com/300x150?text=Rectangular',
    category: 'Sunglasses',
    faceShapes: ['Round', 'Oval'],
    material: 'Plastic',
    color: 'Black',
    bestSeller: false,
  },
];

const Shop = ({ showNotification }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [categoryFilters, setCategoryFilters] = useState({
    sunglasses: true,
    optical: true,
  });
  const [brandFilters, setBrandFilters] = useState({
    RayBan: true,
    Prada: true,
    Gucci: true,
    Versace: true,
    Oakley: true,
  });
  const [faceShapeFilters, setFaceShapeFilters] = useState({
    Oval: true,
    Round: true,
    Square: true,
    Heart: true,
    Diamond: true,
    Rectangle: true,
  });
  const [priceRange, setPriceRange] = useState([0, 300]);
  
  // Sorting
  const [sortOption, setSortOption] = useState('featured');
  
  // Pagination
  const [page, setPage] = useState(1);
  const productsPerPage = 6;

  // Simulate fetching products
  useEffect(() => {
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 1500);
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.brand.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    filtered = filtered.filter(product => 
      (product.category === 'Sunglasses' && categoryFilters.sunglasses) ||
      (product.category === 'Optical' && categoryFilters.optical)
    );

    // Apply brand filter
    filtered = filtered.filter(product => brandFilters[product.brand]);

    // Apply face shape filter
    filtered = filtered.filter(product => 
      product.faceShapes.some(shape => faceShapeFilters[shape])
    );

    // Apply price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch(sortOption) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, this would use a date field
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'featured':
      default:
        // Featured products first (best sellers)
        filtered.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
    // Reset to first page when filters change
    setPage(1);
  }, [products, searchTerm, categoryFilters, brandFilters, faceShapeFilters, priceRange, sortOption]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilters({
      ...categoryFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleBrandChange = (event) => {
    setBrandFilters({
      ...brandFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleFaceShapeChange = (event) => {
    setFaceShapeFilters({
      ...faceShapeFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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

  const handleAddToCart = (product) => {
    showNotification(`Added ${product.name} to cart`, 'success');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Calculate paginated results
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shop Eyewear
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find the perfect frames that match your style and face shape.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                Filters
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Category
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={categoryFilters.sunglasses} 
                      onChange={handleCategoryChange} 
                      name="sunglasses" 
                    />
                  }
                  label="Sunglasses"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={categoryFilters.optical} 
                      onChange={handleCategoryChange} 
                      name="optical" 
                    />
                  }
                  label="Optical"
                />
              </FormGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Brand
              </Typography>
              <FormGroup>
                {Object.keys(brandFilters).map(brand => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox 
                        checked={brandFilters[brand]} 
                        onChange={handleBrandChange} 
                        name={brand} 
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Face Shape
              </Typography>
              <FormGroup>
                {Object.keys(faceShapeFilters).map(shape => (
                  <FormControlLabel
                    key={shape}
                    control={
                      <Checkbox 
                        checked={faceShapeFilters[shape]} 
                        onChange={handleFaceShapeChange} 
                        name={shape} 
                      />
                    }
                    label={shape}
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={300}
                step={10}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
            </Box>

            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setCategoryFilters({ sunglasses: true, optical: true });
                setBrandFilters({
                  RayBan: true,
                  Prada: true,
                  Gucci: true,
                  Versace: true,
                  Oakley: true,
                });
                setFaceShapeFilters({
                  Oval: true,
                  Round: true,
                  Square: true,
                  Heart: true,
                  Diamond: true,
                  Rectangle: true,
                });
                setPriceRange([0, 300]);
                setSearchTerm('');
              }}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={7}>
                <TextField
                  fullWidth
                  placeholder="Search frames..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SortIcon sx={{ mr: 1 }} />
                  <FormControl fullWidth size="small">
                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      value={sortOption}
                      label="Sort By"
                      onChange={handleSortChange}
                    >
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="price_low">Price: Low to High</MenuItem>
                      <MenuItem value="price_high">Price: High to Low</MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Results Info */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} results
            </Typography>
            
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No frames match your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search term.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.bestSeller && (
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
                          zIndex: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Best Seller
                      </Box>
                    )}
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {product.brand}
                      </Typography>
                      <Typography variant="h6" component="div" gutterBottom>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography 
                          variant="body1" 
                          component="span" 
                          sx={{ fontWeight: 'bold' }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {product.faceShapes.map(shape => (
                          <Chip 
                            key={shape} 
                            label={shape}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box 
                      sx={{ 
                        p: 1, 
                        display: 'flex', 
                        justifyContent: 'space-between'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<CartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </Button>
                      <IconButton 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
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
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                count={Math.ceil(filteredProducts.length / productsPerPage)} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Shop; 