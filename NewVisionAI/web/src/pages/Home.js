import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  FaceRetouchingNatural as FaceIcon,
  VisibilityOutlined as EyeIcon, 
  ShoppingCartOutlined as CartIcon,
  AssessmentOutlined as AnalyticsIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  DevicesOutlined as DevicesIcon,
  AccessibilityNew as AccessibilityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Safe import with fallback
let heroImage;
try {
  heroImage = require('../assets/images/ai-face-scanner-hero.jpg');
} catch (error) {
  console.log('Hero image not found, using fallback');
  heroImage = null;
}

/**
 * Home page component with hero section, features, and call to action
 */
const Home = ({ showNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Features of the application
  const features = [
    {
      icon: <FaceIcon fontSize="large" color="primary" />,
      title: 'Precise Face Scan',
      description: 'Capture accurate facial measurements quickly.'
    },
    {
      icon: <EyeIcon fontSize="large" color="primary" />,
      title: 'Virtual Try-On',
      description: 'Experience a realistic 3D try-on in seconds.'
    },
    {
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
      title: 'Smart Recommendations',
      description: 'Get eyewear suggestions tailored to your face.'
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Data',
      description: 'Your privacy is our top priority.'
    }
  ];
  
  // Testimonials from users
  const testimonials = [
    {
      quote: "I've always struggled to find glasses that fit me well. NewVision AI recommended frames that fit perfectly on the first try!",
      author: "Sarah M.",
      title: "First-time glasses wearer",
      rating: 5
    },
    {
      quote: "The precision of the eye measurements is impressive. My new prescription feels exactly right, and the frames look great on me.",
      author: "Michael T.",
      title: "Long-time glasses wearer",
      rating: 5
    },
    {
      quote: "As an optometrist, I'm impressed by the accuracy. This technology complements traditional eye exams beautifully.",
      author: "Dr. Jessica L.",
      title: "Optometrist",
      rating: 4.5
    }
  ];
  
  const handleStartScan = () => {
    navigate('/face-scanner');
    showNotification('Starting face scanner...', 'info');
  };
  
  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 0,
          mb: 6,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'primary.main',
            opacity: 0.05,
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ py: { xs: 6, md: 10 } }}>
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Perfect Eyewear Fit with AI Precision
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                NewVision AI uses augmented reality and artificial intelligence 
                to measure your face precisely and recommend the perfect eyewear for you.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <button 
                  className="nebula-button"
                  onClick={handleStartScan}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaceIcon style={{ fontSize: '1.2rem' }} /> Start Face Scan
                </button>
                
                <Button 
                  variant="outlined"
                  size="large"
                  onClick={handleLearnMore}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
              <Box
                sx={{
                  height: { xs: 300, md: 500 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  bgcolor: 'rgba(0, 113, 227, 0.05)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  ...(heroImage ? {
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : {}),
                }}
              >
                {/* Overlay to ensure text readability */}
                {heroImage && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      zIndex: 0,
                    }}
                  />
                )}
                
                {/* Featured Eyewear Section - Removed carousel as requested */}
                <Container maxWidth="lg" sx={{ my: 8, position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="h3" 
                    align="center" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: heroImage ? 'common.white' : 'inherit',
                    }}
                  >
                    Discover Your Perfect Frame
                  </Typography>
                  <Typography 
                    variant="h6" 
                    align="center" 
                    color={heroImage ? 'common.white' : 'text.secondary'}
                    sx={{ mb: 6 }}
                  >
                    Start your AI-powered eyewear journey today
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={() => navigate('/shop')}
                      sx={{ 
                        borderRadius: '28px',
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Browse All Frames
                    </Button>
                  </Box>
                </Container>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 6,
          }}
        >
          Features
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="glass-card" style={{ height: '100%' }}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ textAlign: 'center' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {feature.description}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* How It Works Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              mb: 6,
            }}
          >
            How It Works
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 20px',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <Typography variant="h4">1</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  Scan Your Face
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use our AR technology to capture precise measurements of your face from various angles.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 20px',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <Typography variant="h4">2</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  AI Analysis
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our AI analyzes your face shape, features, and measurements to determine your ideal eyewear fit.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 20px',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <Typography variant="h4">3</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  Virtual Try-On
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  See personalized recommendations and try them on virtually with our realistic 3D rendering.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 6,
          }}
        >
          What Our Users Say
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={1}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontStyle: 'italic',
                      mb: 2,
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 2,
                      }}
                    >
                      {testimonial.author.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Find Your Perfect Eyewear?
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Start your journey to perfect vision and style with our state-of-the-art face scanning technology.
            It only takes a few minutes to get your personalized recommendations.
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            color="secondary"
            onClick={handleStartScan}
            sx={{ 
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              boxShadow: theme.shadows[4],
            }}
          >
            Start Your Face Scan Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 