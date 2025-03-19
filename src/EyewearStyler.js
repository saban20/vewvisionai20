import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material'; 
import { theme } from '../theme';
import aiService from '../utils/aiService';

// Lazy load subcomponents
const ProductFilters = lazy(() => import('./eyewear/ProductFilters'));
const ProductGrid = lazy(() => import('./eyewear/ProductGrid'));
const ProductRecommendations = lazy(() => import('./eyewear/ProductRecommendations'));
const FaceShapeInfo = lazy(() => import('./eyewear/FaceShapeInfo'));

// Loading component for suspended components
const ComponentLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    py: theme.spacing.xl 
  }}>
    <CircularProgress size={30} sx={{ color: theme.colors.primary }} />
    <Typography variant="body2" sx={{ ml: theme.spacing.md }}>
      Loading component...
    </Typography>
  </Box>
);

const EyewearStyler = ({ aiMeasurements }) => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    frameShape: '',
    frameMaterial: '',
    lensType: '',
    gender: '',
    minPrice: 0,
    maxPrice: 1000,
    faceShape: aiMeasurements?.faceShape || '',
  });

  // Get theme colors based on dark mode
  const colors = theme.getModeColors(darkMode);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Implementing basic query string for filtering
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Get AI-recommended products if measurements are available
  useEffect(() => {
    const getRecommendations = async () => {
      if (!aiMeasurements) return;

      try {
        setLoading(true);
        
        // Use the AI service to get recommendations instead of local TensorFlow
        const recommendationData = await aiService.getEyewearRecommendations(aiMeasurements);
        
        // Fetch the recommended products
        const response = await fetch('/api/products/recommended', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            measurements: aiMeasurements,
            recommendations: recommendationData
          }),
        });
        
        const recommendedProducts = await response.json();
        setRecommendations(recommendedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setLoading(false);
      }
    };

    getRecommendations();
  }, [aiMeasurements]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box sx={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      p: theme.spacing.md,
      backgroundColor: colors.background,
      color: colors.text,
      borderRadius: theme.borderRadius.lg,
      transition: theme.transitions.default
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: theme.spacing.lg, 
          textAlign: 'center',
          fontWeight: theme.typography.fontWeights.semiBold
        }}
      >
        Virtual Eyewear Styler
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Suspense fallback={<ComponentLoader />}>
            <ProductFilters 
              filters={filters} 
              onChange={handleFilterChange} 
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </Suspense>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={darkMode ? 2 : 1} 
            sx={{ 
              p: theme.spacing.md, 
              backgroundColor: colors.card,
              color: colors.text,
              borderRadius: theme.borderRadius.md,
              mb: theme.spacing.lg,
              boxShadow: theme.getBoxShadow(darkMode)
            }}
          >
            {/* Face Shape Information */}
            {aiMeasurements && (
              <Suspense fallback={<ComponentLoader />}>
                <FaceShapeInfo 
                  userFaceShape={aiMeasurements.faceShape}
                  darkMode={darkMode}
                />
              </Suspense>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <Suspense fallback={<ComponentLoader />}>
                <ProductRecommendations 
                  recommendations={recommendations}
                  faceShape={aiMeasurements?.faceShape}
                  measurements={aiMeasurements}
                  darkMode={darkMode}
                />
              </Suspense>
            )}

            {/* Product Grid */}
            <Suspense fallback={<ComponentLoader />}>
              <ProductGrid 
                products={products}
                loading={loading}
                darkMode={darkMode}
              />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EyewearStyler; 