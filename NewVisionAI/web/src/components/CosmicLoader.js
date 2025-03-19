import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const CosmicLoader = ({ message = 'Loading...' }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}
  >
    <motion.div
      animate={{ 
        rotate: 360, 
        scale: [1, 1.2, 1] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5 
      }}
      style={{ 
        width: 50, 
        height: 50, 
        borderRadius: '50%', 
        background: '#FF1493', 
        boxShadow: '0 0 30px #FF1493' 
      }}
    />
    
    {message && (
      <Typography 
        variant="body1" 
        sx={{ 
          mt: 3, 
          color: 'white',
          textShadow: '0 0 10px rgba(255, 20, 147, 0.7)'
        }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

export default CosmicLoader; 