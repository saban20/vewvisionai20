import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import FaceIcon from '@mui/icons-material/Face';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const HelpDialog = ({ open, onClose, darkMode }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px',
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          color: darkMode ? '#f5f5f7' : 'inherit',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpOutlineIcon sx={{ mr: 1, color: '#0071e3' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Face Measurement Help
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: darkMode ? '#a1a1a6' : '#86868b',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          How Face Measurements Work
        </Typography>
        
        <Typography variant="body2" paragraph sx={{ color: darkMode ? '#f5f5f7' : 'inherit' }}>
          Our advanced AI technology uses computer vision to accurately capture your facial measurements, ensuring a perfect fit for your eyewear. The measurements include:
        </Typography>

        <List sx={{ mb: 2 }}>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FaceIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Face dimensions (width, height, shape)" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit',
                fontWeight: 500 
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FaceIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Pupillary distance (PD)" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit',
                fontWeight: 500 
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FaceIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Nose bridge width" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit',
                fontWeight: 500 
              }} 
            />
          </ListItem>
        </List>

        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: '#0071e3', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Privacy Notice
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }}>
            Your face scan data is processed locally on your device and is only stored if you choose to save your measurements. We never share your biometric data with third parties.
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
          Troubleshooting Tips
        </Typography>

        <List>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LightbulbIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="If your face isn't detected, check your lighting and position" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit' 
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LightbulbIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="For most accurate results, remove glasses and keep hair away from your face" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit' 
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LightbulbIcon sx={{ color: '#0071e3', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Use a device with a good quality front-facing camera" 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: darkMode ? '#f5f5f7' : 'inherit' 
              }} 
            />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            backgroundColor: '#0071e3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0058a3',
            },
            borderRadius: '8px',
            textTransform: 'none',
            px: 3
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog; 