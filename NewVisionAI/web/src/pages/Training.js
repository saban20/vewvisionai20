import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  LinearProgress,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  BarChart as ChartIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const Training = ({ showNotification }) => {
  const [loading, setLoading] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState('idle'); // idle, preparing, training, paused, completed
  const [progress, setProgress] = useState(0);
  const [epochsCompleted, setEpochsCompleted] = useState(0);
  const [totalEpochs] = useState(100);
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    loss: 0,
    validationAccuracy: 0,
    validationLoss: 0,
  });
  const [datasets, setDatasets] = useState([
    { id: 1, name: 'Frame Style Dataset', size: '2.3 GB', images: 5420, status: 'available' },
    { id: 2, name: 'Face Shape Dataset', size: '1.8 GB', images: 3850, status: 'available' },
    { id: 3, name: 'User Upload Dataset', size: '0.4 GB', images: 750, status: 'available' },
  ]);

  // Simulated training progress
  useEffect(() => {
    let interval;
    
    if (trainingStatus === 'training') {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTrainingStatus('completed');
            showNotification('Training completed successfully!', 'success');
            return 100;
          }
          
          // Update epochs completed
          const newEpochsCompleted = Math.floor((newProgress / 100) * totalEpochs);
          setEpochsCompleted(newEpochsCompleted);
          
          // Update metrics with some randomization to simulate real training
          setMetrics({
            accuracy: 0.75 + (newProgress / 400),
            loss: 0.5 - (newProgress / 250),
            validationAccuracy: 0.72 + (newProgress / 500),
            validationLoss: 0.55 - (newProgress / 300),
          });
          
          return newProgress;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingStatus, totalEpochs, showNotification]);

  const handleStartTraining = () => {
    setLoading(true);
    
    // Simulate preparation phase
    setTrainingStatus('preparing');
    setTimeout(() => {
      setLoading(false);
      setTrainingStatus('training');
      showNotification('Model training started', 'info');
    }, 2000);
  };

  const handlePauseTraining = () => {
    setTrainingStatus(trainingStatus === 'paused' ? 'training' : 'paused');
    showNotification(
      trainingStatus === 'paused' ? 'Training resumed' : 'Training paused',
      'info'
    );
  };

  const handleStopTraining = () => {
    setTrainingStatus('idle');
    setProgress(0);
    setEpochsCompleted(0);
    setMetrics({
      accuracy: 0,
      loss: 0,
      validationAccuracy: 0,
      validationLoss: 0,
    });
    showNotification('Training stopped and progress reset', 'warning');
  };

  const handleUploadDataset = () => {
    // In a real app, this would open a file picker and handle dataset uploads
    showNotification('Dataset upload functionality not implemented in demo', 'info');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Model Training
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Train and fine-tune the AI models used for eyewear recommendations and face analysis.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Training Control Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Training Control Panel
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Training Status: 
                <Chip 
                  label={trainingStatus.charAt(0).toUpperCase() + trainingStatus.slice(1)} 
                  color={
                    trainingStatus === 'idle' ? 'default' :
                    trainingStatus === 'preparing' ? 'warning' :
                    trainingStatus === 'training' ? 'primary' :
                    trainingStatus === 'paused' ? 'secondary' :
                    'success'
                  }
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    color={trainingStatus === 'paused' ? 'secondary' : 'primary'}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {epochsCompleted} of {totalEpochs} epochs completed
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={handleStartTraining}
                disabled={loading || ['training', 'completed'].includes(trainingStatus)}
              >
                {loading ? <CircularProgress size={24} /> : 'Start Training'}
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                startIcon={trainingStatus === 'paused' ? <PlayIcon /> : <PauseIcon />}
                onClick={handlePauseTraining}
                disabled={!['training', 'paused'].includes(trainingStatus)}
              >
                {trainingStatus === 'paused' ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopIcon />}
                onClick={handleStopTraining}
                disabled={trainingStatus === 'idle'}
              >
                Stop & Reset
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ChartIcon />}
                disabled={!['training', 'paused', 'completed'].includes(trainingStatus)}
              >
                View Detailed Metrics
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Current Training Metrics
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy
                    </Typography>
                    <Typography variant="h6">
                      {(metrics.accuracy * 100).toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Loss
                    </Typography>
                    <Typography variant="h6">
                      {metrics.loss.toFixed(4)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Val Accuracy
                    </Typography>
                    <Typography variant="h6">
                      {(metrics.validationAccuracy * 100).toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Val Loss
                    </Typography>
                    <Typography variant="h6">
                      {metrics.validationLoss.toFixed(4)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {trainingStatus === 'completed' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Training completed successfully! The model is ready for deployment.
              </Alert>
            )}
          </Paper>
        </Grid>
        
        {/* Dataset Management */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Datasets
            </Typography>
            
            <List>
              {datasets.map((dataset) => (
                <ListItem key={dataset.id} divider>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={dataset.name}
                    secondary={`${dataset.size} • ${dataset.images} images`}
                  />
                  <Chip 
                    size="small"
                    label={dataset.status}
                    color={dataset.status === 'available' ? 'success' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUploadDataset}
            >
              Upload New Dataset
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Training Tips
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Use diverse datasets for better generalization" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Monitor validation loss to prevent overfitting" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Training can take several hours to complete" />
              </ListItem>
            </List>
            
            <Button
              variant="text"
              endIcon={<ArrowIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                /* Navigate to documentation */
              }}
            >
              View Full Documentation
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Training; 