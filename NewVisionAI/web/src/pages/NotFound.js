import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  useTheme
} from '@mui/material';
import { 
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon
} from '@mui/icons-material';

/**
 * 404 Not Found page for handling routes that don't exist
 */
const NotFound = ({ showNotification }) => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          mt: 4
        }}
      >
        <SadIcon
          color="primary"
          sx={{
            fontSize: 100,
            mb: 2,
            opacity: 0.7,
          }}
        />
        
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          paragraph
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to our home page.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
          sx={{ 
            px: 4,
            py: 1.5,
            borderRadius: 2,
          }}
          onClick={() => showNotification('Redirected to home page', 'info')}
        >
          Back to Home
        </Button>
      </Paper>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          If you believe this is an error, please contact our support team at support@newvision-ai.com
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound; 