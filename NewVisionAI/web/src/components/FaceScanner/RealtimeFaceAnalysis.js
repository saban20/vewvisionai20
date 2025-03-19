import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Grid, Chip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { subscribeToEvent, unsubscribeFromEvent, emitEvent } from '../../services/socketService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RealtimeFaceAnalysis = ({ userId, measurementId }) => {
  const [status, setStatus] = useState('idle');
  const [measurements, setMeasurements] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [error, setError] = useState(null);
  const processingTimerRef = useRef(null);
  
  // Use useMemo for chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => ({
    labels: confidenceHistory.map((_, index) => `Update ${index + 1}`),
    datasets: [
      {
        label: 'Confidence Score',
        data: confidenceHistory,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4
      }
    ]
  }), [confidenceHistory]);
  
  // Use useMemo for chart options to prevent recalculation on every render
  const chartOptions = useMemo(() => {
    const minValue = confidenceHistory.length > 0 
      ? Math.max(0, Math.min(...confidenceHistory) - 0.1) 
      : 0;
      
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'AI Confidence Score History',
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: minValue,
          max: 1.0
        }
      }
    };
  }, [confidenceHistory]);
  
  // Handle processing updates from the server
  const handleProcessingUpdate = useRef((data) => {
    setStatus(data.status);
    
    if (data.measurements) {
      setMeasurements(data.measurements);
    }
    
    if (data.status === 'processing_complete') {
      // Start analysis when processing is complete
      requestAnalysis(data.measurement_id);
    }
  }).current;
  
  // Handle processing errors from the server
  const handleProcessingError = useRef((data) => {
    setError(data.error);
    setStatus('error');
  }).current;
  
  // Handle analysis results from the server
  const handleAnalysisResult = useRef((data) => {
    setAnalysisResults(data);
    setStatus('analysis_complete');
    
    // Add the confidence score to the history
    if (data.confidence) {
      setConfidenceHistory(prev => [...prev, data.confidence]);
    }
  }).current;
  
  // Request face analysis from the server
  const requestAnalysis = useRef((measurementId) => {
    setStatus('analyzing');
    
    // Emit an event to request face analysis
    emitEvent('face_analysis_request', {
      measurement_id: measurementId,
      request_id: Date.now().toString(),
      user_id: userId
    });
  }).current;
  
  // Initialize event listeners when component mounts
  useEffect(() => {
    // Subscribe to socket events
    subscribeToEvent('processing_update', handleProcessingUpdate);
    subscribeToEvent('processing_error', handleProcessingError);
    subscribeToEvent('face_analysis_result', handleAnalysisResult);
    
    // Request initial analysis if we have a measurement ID
    if (measurementId) {
      requestAnalysis(measurementId);
    }
    
    // Start simulated real-time updates for demo purposes
    processingTimerRef.current = setInterval(() => {
      if (status === 'analyzing') {
        // Simulate receiving updated confidence scores
        const newConfidence = 0.7 + (Math.random() * 0.3); // Random between 0.7 and 1.0
        setConfidenceHistory(prev => [...prev, newConfidence]);
        
        // Update the analysis results with the new confidence
        setAnalysisResults(prev => {
          if (prev) {
            return {
              ...prev,
              confidence_score: newConfidence
            };
          }
          return prev;
        });
      }
    }, 2000);
    
    // Cleanup function to unsubscribe from events
    return () => {
      unsubscribeFromEvent('processing_update', handleProcessingUpdate);
      unsubscribeFromEvent('processing_error', handleProcessingError);
      unsubscribeFromEvent('face_analysis_result', handleAnalysisResult);
      
      if (processingTimerRef.current) {
        clearInterval(processingTimerRef.current);
      }
    };
  }, [handleProcessingUpdate, handleProcessingError, handleAnalysisResult, requestAnalysis, measurementId, status]);
  
  // Render based on current status
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1">
              Waiting for face scan data...
            </Typography>
          </Box>
        );
        
      case 'processing_started':
      case 'face_detected':
      case 'measurements_extracted':
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Processing your face scan...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {status === 'processing_started' ? 'Initializing analysis...' : 
               status === 'face_detected' ? 'Face detected! Extracting measurements...' :
               'Measurements extracted! Finalizing analysis...'}
            </Typography>
          </Box>
        );
        
      case 'analyzing':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body1">
                Analyzing your face measurements in real-time...
              </Typography>
            </Box>
            
            {analysisResults && (
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Current Analysis Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Face Shape:</Typography>
                    <Typography variant="body1">{analysisResults.face_shape}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Confidence Score:</Typography>
                    <Typography variant="body1">{(analysisResults.confidence_score * 100).toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Recommended Styles:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {analysisResults.recommended_styles && analysisResults.recommended_styles.map((style, index) => (
                        <Chip key={index} label={style} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {confidenceHistory.length > 1 && (
              <Box sx={{ mt: 3 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            )}
          </Box>
        );
        
      case 'analysis_complete':
        return (
          <Box sx={{ p: 3 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Analysis complete! Here are your results.
            </Alert>
            
            {analysisResults && (
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Final Analysis Results
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Face Shape:</Typography>
                    <Typography variant="body1">{analysisResults.face_shape}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Confidence Score:</Typography>
                    <Typography variant="body1">{(analysisResults.confidence_score * 100).toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Recommended Styles:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {analysisResults.recommended_styles && analysisResults.recommended_styles.map((style, index) => (
                        <Chip key={index} label={style} color="primary" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {confidenceHistory.length > 1 && (
              <Box sx={{ mt: 3 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            )}
          </Box>
        );
        
      case 'error':
        return (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error || 'An error occurred during processing.'}
            </Alert>
          </Box>
        );
        
      default:
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1">
              {status}
            </Typography>
          </Box>
        );
    }
  };
  
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 3 
    }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText' 
      }}>
        <Typography variant="h6">
          Real-Time Face Analysis
        </Typography>
      </Box>
      
      {renderContent()}
    </Box>
  );
};

export default RealtimeFaceAnalysis; 