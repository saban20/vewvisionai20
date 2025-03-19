import React, { useState, useEffect, lazy, Suspense, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material'; 
import { ThemeContext } from './index';
import aiService from './utils/aiService';

// Lazy load subcomponents
const ProductFilters = lazy(() => import('./components/eyewear/ProductFilters'));
const ProductGrid = lazy(() => import('./components/eyewear/ProductGrid'));
const ProductRecommendations = lazy(() => import('./components/eyewear/ProductRecommendations'));
const FaceShapeInfo = lazy(() => import('./components/eyewear/FaceShapeInfo'));

// Loading component for suspended components
const ComponentLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    py: 3
  }}>
    <CircularProgress size={30} color="primary" />
    <Typography variant="body2" sx={{ ml: 2 }}>
      Loading component...
    </Typography>
  </Box>
);

const EyewearStyler = ({ aiMeasurements }) => {
  const { themeMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Determine if dark mode is active
  const darkMode = themeMode === 'dark';

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
        
        // Use the AI service to get recommendations
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

  return (
    <Box sx={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      p: 2,
      backgroundColor: darkMode ? '#121212' : '#f8f9fa',
      color: darkMode ? '#ffffff' : '#212121',
      borderRadius: 2,
      transition: 'all 0.3s ease'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          textAlign: 'center',
          fontWeight: 600
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
            />
          </Suspense>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={darkMode ? 2 : 1} 
            sx={{ 
              p: 3, 
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#212121',
              borderRadius: 1,
              mb: 3,
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
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