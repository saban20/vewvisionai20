import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Paper,
  Grid,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaceIcon from '@mui/icons-material/Face';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const FaceShapeInfo = ({ userFaceShape, darkMode }) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  // Face shape data
  const faceShapes = {
    oval: {
      description: "Oval face shapes are longer than they are wide, with a jaw that is narrower than the forehead and high cheekbones.",
      recommendations: ["Square", "Rectangle", "Wayfarer"],
      avoid: ["Oval", "Round"]
    },
    round: {
      description: "Round face shapes have soft curves with width and length in similar proportions, and full cheeks.",
      recommendations: ["Rectangle", "Square", "Angular", "Wayfarer"],
      avoid: ["Round", "Circular"]
    },
    square: {
      description: "Square face shapes have a strong jawline, broad forehead, and straight sides.",
      recommendations: ["Round", "Oval", "Cat-Eye", "Aviator"],
      avoid: ["Square", "Rectangle", "Geometric"]
    },
    heart: {
      description: "Heart face shapes are wider at the brow and narrower at the chin, with high cheekbones.",
      recommendations: ["Round", "Aviator", "Light-rimmed", "Semi-rimless"],
      avoid: ["Decorative", "Cat-Eye"]
    },
    diamond: {
      description: "Diamond face shapes have a narrow forehead and jawline with broad cheekbones.",
      recommendations: ["Cat-Eye", "Oval", "Rimless", "Semi-rimless"],
      avoid: ["Narrow", "Rectangle"]
    },
    rectangular: {
      description: "Rectangular face shapes are longer than they are wide with a long straight cheek line.",
      recommendations: ["Round", "Square", "Oversized", "Geometric"],
      avoid: ["Rectangle", "Narrow"]
    }
  };

  // Get user's face shape data
  const faceShapeData = userFaceShape ? faceShapes[userFaceShape.toLowerCase()] : null;

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Accordion 
        expanded={expanded} 
        onChange={handleAccordionChange}
        elevation={darkMode ? 2 : 1}
        sx={{ 
          backgroundColor: darkMode ? '#1e1e1e' : 'white',
          color: darkMode ? '#f5f5f7' : 'inherit'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#f5f5f7' : 'inherit' }} />}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, color: '#0071e3' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Face Shape Guide
            </Typography>
            {userFaceShape && (
              <Chip 
                label={`Your face shape: ${userFaceShape}`} 
                size="small" 
                icon={<FaceIcon />} 
                sx={{ ml: 2 }} 
                color="primary"
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {faceShapeData ? (
            <Box>
              <Typography variant="body2" paragraph>
                {faceShapeData.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={darkMode ? 2 : 0} 
                    sx={{ 
                      p: 2, 
                      backgroundColor: darkMode ? 'rgba(0, 120, 0, 0.1)' : '#f0f7f0',
                      color: darkMode ? '#f5f5f7' : 'inherit'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 18, color: '#4caf50' }} />
                      Recommended Frames:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {faceShapeData.recommendations.map((frame, idx) => (
                        <Chip 
                          key={idx} 
                          label={frame} 
                          size="small" 
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={darkMode ? 2 : 0} 
                    sx={{ 
                      p: 2, 
                      backgroundColor: darkMode ? 'rgba(120, 0, 0, 0.1)' : '#fff0f0',
                      color: darkMode ? '#f5f5f7' : 'inherit'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
                      Frames to Avoid:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {faceShapeData.avoid.map((frame, idx) => (
                        <Chip 
                          key={idx} 
                          label={frame} 
                          size="small" 
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" paragraph>
                Want more precise recommendations? Try our 3D face scanner for personalized eyewear suggestions based on your exact measurements.
              </Typography>

              <Button 
                variant="outlined" 
                href="/face-scanner" 
                sx={{ 
                  mt: 1,
                  color: darkMode ? '#f5f5f7' : '#0071e3',
                  borderColor: darkMode ? '#f5f5f7' : '#0071e3'
                }}
              >
                Go to Face Scanner
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {Object.entries(faceShapes).map(([shape, data]) => (
                <Grid item xs={12} sm={6} md={4} key={shape}>
                  <Paper 
                    elevation={darkMode ? 2 : 1} 
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      backgroundColor: darkMode ? '#1e1e1e' : 'white',
                      color: darkMode ? '#f5f5f7' : 'inherit'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <FaceIcon sx={{ mr: 1, fontSize: 18 }} />
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ fontSize: '0.875rem' }}>
                      {data.description}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                      Recommended frames:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {data.recommendations.slice(0, 3).map((frame, idx) => (
                        <Chip 
                          key={idx} 
                          label={frame} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FaceShapeInfo; 