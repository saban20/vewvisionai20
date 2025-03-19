import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FaceIcon from '@mui/icons-material/Face';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MeasurementInstructions = ({ darkMode }) => {
  return (
    <Paper 
      elevation={darkMode ? 2 : 0} 
      sx={{ 
        p: 3, 
        borderRadius: '12px',
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        color: darkMode ? '#f5f5f7' : 'inherit',
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LightbulbIcon sx={{ color: '#0071e3', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Tips for Accurate Measurements
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        <ListItem sx={{ py: 1 }}>
          <ListItemIcon>
            <FaceIcon sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Position your face" 
            secondary="Ensure your entire face is visible and centered in the camera frame"
            primaryTypographyProps={{ fontWeight: 500 }}
            secondaryTypographyProps={{ color: darkMode ? '#a1a1a6' : '#86868b' }}
          />
        </ListItem>

        <ListItem sx={{ py: 1 }}>
          <ListItemIcon>
            <AdjustIcon sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Good lighting" 
            secondary="Make sure your face is well lit with even lighting and no harsh shadows"
            primaryTypographyProps={{ fontWeight: 500 }}
            secondaryTypographyProps={{ color: darkMode ? '#a1a1a6' : '#86868b' }}
          />
        </ListItem>

        <ListItem sx={{ py: 1 }}>
          <ListItemIcon>
            <CheckCircleOutlineIcon sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Remove glasses" 
            secondary="Take off any eyewear for the most accurate measurements"
            primaryTypographyProps={{ fontWeight: 500 }}
            secondaryTypographyProps={{ color: darkMode ? '#a1a1a6' : '#86868b' }}
          />
        </ListItem>
      </List>

      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: darkMode ? '#a1a1a6' : '#86868b' }}>
        The system will guide you through each step. Just follow the instructions on screen.
      </Typography>
    </Paper>
  );
};

export default MeasurementInstructions; 