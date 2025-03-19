import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  Chip,
  Grid,
  Skeleton,
  LinearProgress
} from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import FaceIcon from '@mui/icons-material/Face';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ProductRecommendations = ({ recommendations, loading, faceShape, measurements, darkMode }) => {
  const getMatchScore = (product) => {
    return product.matchScore || Math.floor(Math.random() * 30) + 70; // Fallback for demo
  };

  const getReasonText = (product) => {
    if (!product.matchReason) {
      if (faceShape) {
        return `This frame style is ideal for ${faceShape} face shapes.`;
      }
      return 'This frame style complements your facial proportions.';
    }
    return product.matchReason;
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#f5f5f7' : 'inherit' }}>
            AI Recommendations
          </Typography>
        </Box>
        <LinearProgress sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card elevation={darkMode ? 2 : 1} sx={{ 
                display: 'flex',
                backgroundColor: darkMode ? '#1e1e1e' : 'white',
                color: darkMode ? '#f5f5f7' : 'inherit'
              }}>
                <Skeleton variant="rectangular" width={100} height={100} animation="wave" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} animation="wave" />
                  <Skeleton variant="text" width="40%" height={20} animation="wave" />
                  <Skeleton variant="text" width="80%" height={20} animation="wave" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // No recommendations
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Render recommendation list
  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoAwesomeIcon sx={{ mr: 1, color: '#0071e3' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#f5f5f7' : 'inherit' }}>
          AI Recommendations for You
        </Typography>
      </Box>
      {faceShape && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FaceIcon sx={{ mr: 1, fontSize: 18, color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} />
          <Typography variant="body2" color="textSecondary">
            Based on your {faceShape} face shape and measurements
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {recommendations.map((product, index) => {
          const matchScore = getMatchScore(product);
          return (
            <Grid item xs={12} key={index}>
              <Card 
                elevation={darkMode ? 2 : 1} 
                sx={{ 
                  display: 'flex',
                  backgroundColor: darkMode ? '#1e1e1e' : 'white',
                  color: darkMode ? '#f5f5f7' : 'inherit',
                  border: '1px solid',
                  borderColor: index === 0 ? '#0071e3' : 'transparent'
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'contain', p: 1, bgcolor: darkMode ? '#2a2a2a' : '#f5f5f7' }}
                  image={product.imageUrl}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Chip 
                      label={`${matchScore}% Match`} 
                      size="small" 
                      color={matchScore > 90 ? "success" : "primary"}
                      icon={<RecommendIcon />}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.brand} · ${product.price}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontStyle: 'italic', color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                    {getReasonText(product)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProductRecommendations; 