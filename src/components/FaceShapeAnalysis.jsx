import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FaceShapeAnalysis = ({ faceShape }) => {
  const navigate = useNavigate();
  
  const getFaceShapeDescription = (shape) => {
    if (!shape) return 'Analyze your face to determine your face shape';
    
    const descriptions = {
      Oval: 'Oval face shapes are versatile and balanced. Most frame styles complement this shape well.',
      Round: 'Round face shapes have soft curves and equal width and length. Angular frames can add definition.',
      Square: 'Square face shapes have strong jaw lines and angular features. Rounded frames can soften these features.'
    };
    
    return descriptions[shape] || `Your face shape appears to be ${shape}.`;
  };
  
  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <Card className="hologram-card" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" className="hologram">Face Shape Analysis</Typography>
        <Typography sx={{ mb: 2 }}>{getFaceShapeDescription(faceShape)}</Typography>
        
        {!faceShape && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              onClick={handleStartAnalysis}
              variant="contained" 
              className="hologram-button"
            >
              Start Face Analysis
            </Button>
          </Box>
        )}
        
        {faceShape && (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Based on AI-powered facial landmark detection
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceShapeAnalysis; 