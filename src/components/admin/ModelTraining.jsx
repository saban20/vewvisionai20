import React, { useState } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress 
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const ModelTraining = () => {
  const [activeModels, setActiveModels] = useState([
    {
      id: 1,
      name: 'Face Shape Detection v2.3',
      type: 'detection',
      status: 'training',
      progress: 64,
      accuracy: 87.3,
      loss: 0.24,
      startTime: '2023-06-10T14:30:00',
      dataset: 'face_shapes_2023',
      parameters: {
        learningRate: 0.001,
        batchSize: 64,
        epochs: 100,
        optimizer: 'adam'
      }
    },
    {
      id: 2,
      name: 'Frame Recommendation Engine v1.8',
      type: 'recommendation',
      status: 'training',
      progress: 89,
      accuracy: 92.1,
      loss: 0.18,
      startTime: '2023-06-10T11:45:00',
      dataset: 'frames_customer_data_2023',
      parameters: {
        learningRate: 0.0005,
        batchSize: 32,
        epochs: 150,
        optimizer: 'adam'
      }
    }
  ]);

  const [savedModels, setSavedModels] = useState([
    {
      id: 3,
      name: 'Facial Landmark Detection v3.1',
      type: 'landmark',
      status: 'saved',
      accuracy: 96.5,
      loss: 0.12,
      lastUpdated: '2023-06-01T09:20:00',
      dataset: 'facial_landmarks_hd',
      parameters: {
        learningRate: 0.0008,
        batchSize: 48,
        epochs: 200,
        optimizer: 'adamw'
      }
    },
    {
      id: 4,
      name: 'Prescription Reader v1.2',
      type: 'ocr',
      status: 'saved',
      accuracy: 89.3,
      loss: 0.31,
      lastUpdated: '2023-05-28T13:45:00',
      dataset: 'prescription_images_2023',
      parameters: {
        learningRate: 0.001,
        batchSize: 16,
        epochs: 80,
        optimizer: 'sgd'
      }
    },
    {
      id: 5,
      name: 'User Satisfaction Predictor v1.0',
      type: 'analytics',
      status: 'saved',
      accuracy: 84.7,
      loss: 0.37,
      lastUpdated: '2023-05-20T10:15:00',
      dataset: 'user_feedback_2023',
      parameters: {
        learningRate: 0.002,
        batchSize: 128,
        epochs: 50,
        optimizer: 'rmsprop'
      }
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'detection',
    dataset: '',
    parameters: {
      learningRate: 0.001,
      batchSize: 32,
      epochs: 100,
      optimizer: 'adam'
    }
  });

  const [detailedView, setDetailedView] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModel({
      ...newModel,
      [name]: value
    });
  };

  const handleParameterChange = (param, value) => {
    setNewModel({
      ...newModel,
      parameters: {
        ...newModel.parameters,
        [param]: value
      }
    });
  };

  const handleCreateModel = () => {
    const model = {
      id: Date.now(),
      ...newModel,
      status: 'ready',
      progress: 0,
      accuracy: 0,
      loss: 0,
      startTime: null,
      lastUpdated: new Date().toISOString()
    };
    
    setSavedModels([...savedModels, model]);
    setOpenDialog(false);
    setNewModel({
      name: '',
      type: 'detection',
      dataset: '',
      parameters: {
        learningRate: 0.001,
        batchSize: 32,
        epochs: 100,
        optimizer: 'adam'
      }
    });
  };

  const handleStartTraining = (modelId) => {
    const modelToStart = savedModels.find(model => model.id === modelId);
    
    if (modelToStart) {
      const updatedModel = {
        ...modelToStart,
        status: 'training',
        progress: 0,
        startTime: new Date().toISOString()
      };
      
      setActiveModels([...activeModels, updatedModel]);
      setSavedModels(savedModels.filter(model => model.id !== modelId));
    }
  };

  const handleStopTraining = (modelId) => {
    const modelToStop = activeModels.find(model => model.id === modelId);
    
    if (modelToStop) {
      const updatedModel = {
        ...modelToStop,
        status: 'paused',
        lastUpdated: new Date().toISOString()
      };
      
      setSavedModels([...savedModels, updatedModel]);
      setActiveModels(activeModels.filter(model => model.id !== modelId));
    }
  };

  const handleDeleteModel = (modelId) => {
    setSavedModels(savedModels.filter(model => model.id !== modelId));
  };

  const handleViewDetails = (model) => {
    setDetailedView(model);
  };

  const handleCloseDetails = () => {
    setDetailedView(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatDuration = (startTimeString) => {
    const startTime = new Date(startTimeString);
    const now = new Date();
    const diffMs = now - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Model Training
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Model
        </Button>
      </Box>

      {/* Active Training Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Active Training
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        {activeModels.length > 0 ? (
          <Grid container spacing={3}>
            {activeModels.map((model) => (
              <Grid item xs={12} md={6} key={model.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{model.name}</Typography>
                      <Chip 
                        label={model.type} 
                        color="primary" 
                        size="small" 
                        sx={{ textTransform: 'capitalize' }} 
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Training Progress: {model.progress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={model.progress} 
                        sx={{ height: 8, borderRadius: 4 }} 
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Accuracy:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {model.accuracy}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Loss:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {model.loss}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Dataset:
                        </Typography>
                        <Typography variant="body1">
                          {model.dataset}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                        <Typography variant="body1">
                          {formatDuration(model.startTime)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<StopIcon />}
                      onClick={() => handleStopTraining(model.id)}
                    >
                      Stop
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleViewDetails(model)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">No models are currently training.</Alert>
        )}
      </Paper>

      {/* Saved Models Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Available Models
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        {savedModels.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Accuracy</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={model.type} 
                        color="secondary" 
                        size="small" 
                        sx={{ textTransform: 'capitalize' }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={model.status} 
                        color={model.status === 'paused' ? 'warning' : 'success'} 
                        size="small" 
                        sx={{ textTransform: 'capitalize' }} 
                      />
                    </TableCell>
                    <TableCell>{model.accuracy}%</TableCell>
                    <TableCell>{formatDate(model.lastUpdated)}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => handleStartTraining(model.id)}
                        title="Start Training"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton 
                        color="info" 
                        size="small" 
                        onClick={() => handleViewDetails(model)}
                        title="View Details"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDeleteModel(model.id)}
                        title="Delete Model"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No saved models available.</Alert>
        )}
      </Paper>

      {/* New Model Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New AI Model</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Configure the parameters for your new AI model. Choose appropriate settings based on your training objectives.
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model Name"
                  name="name"
                  value={newModel.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Model Type</InputLabel>
                  <Select
                    name="type"
                    value={newModel.type}
                    label="Model Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="detection">Face Shape Detection</MenuItem>
                    <MenuItem value="landmark">Facial Landmark</MenuItem>
                    <MenuItem value="recommendation">Frame Recommendation</MenuItem>
                    <MenuItem value="ocr">Prescription Reader</MenuItem>
                    <MenuItem value="analytics">User Analytics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Dataset"
                  name="dataset"
                  value={newModel.dataset}
                  onChange={handleInputChange}
                  helperText="Enter the name of the dataset to be used for training"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Training Parameters
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Learning Rate: {newModel.parameters.learningRate}</Typography>
                <Slider
                  value={newModel.parameters.learningRate}
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => handleParameterChange('learningRate', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Optimizer</InputLabel>
                  <Select
                    value={newModel.parameters.optimizer}
                    label="Optimizer"
                    onChange={(e) => handleParameterChange('optimizer', e.target.value)}
                  >
                    <MenuItem value="adam">Adam</MenuItem>
                    <MenuItem value="sgd">SGD</MenuItem>
                    <MenuItem value="rmsprop">RMSprop</MenuItem>
                    <MenuItem value="adamw">AdamW</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Batch Size"
                  value={newModel.parameters.batchSize}
                  onChange={(e) => handleParameterChange('batchSize', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Epochs"
                  value={newModel.parameters.epochs}
                  onChange={(e) => handleParameterChange('epochs', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateModel} 
            variant="contained" 
            disabled={!newModel.name || !newModel.dataset}
          >
            Create Model
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Details Dialog */}
      {detailedView && (
        <Dialog open={true} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle>
            Model Details: {detailedView.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {detailedView.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip 
                    label={detailedView.status} 
                    color={
                      detailedView.status === 'training' ? 'primary' : 
                      detailedView.status === 'paused' ? 'warning' : 'success'
                    } 
                    size="small" 
                    sx={{ textTransform: 'capitalize' }} 
                  />
                </Grid>
                {detailedView.status === 'training' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Start Time</Typography>
                      <Typography variant="body1">
                        {formatDate(detailedView.startTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Duration</Typography>
                      <Typography variant="body1">
                        {formatDuration(detailedView.startTime)}
                      </Typography>
                    </Grid>
                  </>
                )}
                {detailedView.status !== 'training' && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Last Updated</Typography>
                    <Typography variant="body1">
                      {formatDate(detailedView.lastUpdated)}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Dataset</Typography>
                  <Typography variant="body1">
                    {detailedView.dataset}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Accuracy</Typography>
                  <Typography variant="body1">
                    {detailedView.accuracy}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Loss</Typography>
                  <Typography variant="body1">
                    {detailedView.loss}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Training Parameters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Learning Rate</Typography>
                <Typography variant="body1">
                  {detailedView.parameters.learningRate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Optimizer</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {detailedView.parameters.optimizer}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Batch Size</Typography>
                <Typography variant="body1">
                  {detailedView.parameters.batchSize}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Epochs</Typography>
                <Typography variant="body1">
                  {detailedView.parameters.epochs}
                </Typography>
              </Grid>
            </Grid>
            
            {detailedView.status === 'training' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>Training Progress</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {detailedView.progress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={detailedView.progress} 
                    sx={{ height: 10, borderRadius: 5, mb: 3 }} 
                  />
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {detailedView.status === 'training' ? (
              <Button 
                color="warning"
                startIcon={<StopIcon />}
                onClick={() => {
                  handleStopTraining(detailedView.id);
                  handleCloseDetails();
                }}
              >
                Stop Training
              </Button>
            ) : (
              <Button 
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => {
                  handleStartTraining(detailedView.id);
                  handleCloseDetails();
                }}
              >
                Start Training
              </Button>
            )}
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ModelTraining; 