import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

const ComponentLoader = ({ darkMode, message = "Loading component..." }) => {
  return (
    <Paper
      elevation={darkMode ? 2 : 1}
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#1e1e1e' : 'white',
        color: darkMode ? '#f5f5f7' : 'inherit',
        minHeight: 200
      }}
    >
      <CircularProgress 
        size={40} 
        thickness={4} 
        sx={{ 
          color: '#0071e3',
          mb: 2
        }} 
      />
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
        {message}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This may take a moment...
      </Typography>
    </Paper>
  );
};

export default ComponentLoader; 