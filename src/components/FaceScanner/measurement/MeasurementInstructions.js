import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { theme } from '../../../theme';

/**
 * Component displaying instructions for the facial measurement process
 */
const MeasurementInstructions = ({ darkMode }) => {
  // Get theme colors based on dark mode
  const colors = theme.getModeColors(darkMode);
  
  const instructions = [
    'Position your face in the center of the frame',
    'Remove glasses, hats, or anything covering your face',
    'Ensure good lighting conditions',
    'Keep a neutral expression',
    'Look straight ahead at the camera',
    'Follow the on-screen instructions during measurement'
  ];
  
  return (
    <Paper
      elevation={darkMode ? 2 : 1}
      sx={{
        p: theme.spacing.md,
        backgroundColor: colors.card,
        color: colors.text,
        borderRadius: theme.borderRadius.md,
        mb: theme.spacing.lg
      }}
    >
      <Typography variant="h6" sx={{ mb: theme.spacing.md, fontWeight: theme.typography.fontWeights.medium }}>
        How to Get Perfect Measurements
      </Typography>
      
      <Box sx={{ mb: theme.spacing.md }}>
        <List dense disablePadding>
          {instructions.map((instruction, index) => (
            <ListItem key={index} disableGutters sx={{ mb: theme.spacing.xs }}>
              <ListItemIcon sx={{ minWidth: '30px', color: theme.colors.primary }}>
                <CheckCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText 
                primary={instruction}
                primaryTypographyProps={{ 
                  fontSize: theme.typography.fontSizes.sm,
                  color: colors.text
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Typography variant="body2" sx={{ color: colors.textSecondary, fontStyle: 'italic' }}>
        For best results, follow these guidelines to ensure accurate measurements for your eyewear recommendations.
      </Typography>
    </Paper>
  );
};

export default MeasurementInstructions; 