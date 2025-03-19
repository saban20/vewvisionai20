import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StraightenIcon from '@mui/icons-material/Straighten';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FaceIcon from '@mui/icons-material/Face';

const MeasurementResults = ({ measurements, darkMode }) => {
  if (!measurements) {
    return (
      <Typography sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }}>
        No measurement data available.
      </Typography>
    );
  }

  const ResultCard = ({ label, value, unit, icon }) => (
    <Paper
      elevation={darkMode ? 2 : 1}
      sx={{
        p: 2,
        borderRadius: '12px',
        height: '100%',
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
        color: darkMode ? '#f5f5f7' : 'inherit',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode ? '0 8px 16px rgba(0,0,0,0.3)' : '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          backgroundColor: darkMode ? 'rgba(0, 113, 227, 0.2)' : 'rgba(0, 113, 227, 0.1)',
          color: '#0071e3',
          mr: 1
        }}>
          {icon}
        </Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
        {value}
        <Typography component="span" variant="body1" sx={{ ml: 0.5, color: darkMode ? '#a1a1a6' : '#86868b' }}>
          {unit}
        </Typography>
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
        <Typography sx={{ color: '#4caf50', fontWeight: 500 }}>
          Measurements completed successfully
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ResultCard 
            label="Face Width"
            value={measurements.faceWidth}
            unit="cm"
            icon={<StraightenIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ResultCard 
            label="Face Height"
            value={measurements.faceHeight}
            unit="cm"
            icon={<StraightenIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <ResultCard 
            label="Eye Distance"
            value={measurements.eyeDistance}
            unit="cm"
            icon={<StraightenIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <ResultCard 
            label="Nose Bridge"
            value={measurements.noseBridge}
            unit="cm"
            icon={<StraightenIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <ResultCard 
            label="Temple Width"
            value={measurements.templeWidth}
            unit="cm"
            icon={<StraightenIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={darkMode ? 2 : 1}
            sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? '#f5f5f7' : 'inherit'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Face Analysis Results
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Based on your facial measurements, we've determined:
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <FaceIcon sx={{ fontSize: 48, color: '#0071e3', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Face Shape
                  </Typography>
                  <Chip 
                    label={measurements.faceShape} 
                    sx={{ 
                      mt: 1,
                      backgroundColor: darkMode ? 'rgba(0, 113, 227, 0.2)' : 'rgba(0, 113, 227, 0.1)',
                      color: '#0071e3',
                      fontWeight: 500
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <VerifiedUserIcon sx={{ mr: 1, fontSize: 20, color: '#4caf50' }} />
                    Measurement Accuracy
                  </Typography>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 12, 
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 6,
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${measurements.accuracy}%`,
                        backgroundColor: '#4caf50',
                        borderRadius: 6,
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Your measurements were captured with {measurements.accuracy}% accuracy. This will provide a
                    reliable basis for eyewear recommendations.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeasurementResults; 