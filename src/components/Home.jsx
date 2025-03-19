// src/components/Home.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const Home = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.9), rgba(26, 37, 38, 0.9))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Holographic Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, rgba(0, 216, 255, 0.1) 0%, rgba(15, 20, 25, 0) 70%)',
          zIndex: 0,
        }}
        className="hologram"
      />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2.5rem', md: '5rem' }, fontWeight: 700, mb: 2 }}
          className="hologram"
        >
          NewVision AI
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, maxWidth: 600, mx: 'auto', mb: 4 }}
        >
          Precision eye measurements powered by AI and AR.
        </Typography>
        <Box
          component="img"
          src="https://via.placeholder.com/400x300?text=Holographic+Eye"
          alt="Holographic Eye Scan"
          sx={{
            width: { xs: '80%', md: '400px' },
            height: 'auto',
            mb: 4,
            borderRadius: 2,
          }}
          className="hologram-image"
        />
        <Button
          component={RouterLink}
          to="/register"
          className="hologram-button"
          sx={{ fontSize: '1.2rem', px: 4, py: 1.5 }}
        >
          Get Started
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already exploring the future?{' '}
          <RouterLink
            to="/login"
            style={{ color: '#00D8FF', textDecoration: 'none', fontWeight: 500 }}
          >
            Sign In
          </RouterLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 