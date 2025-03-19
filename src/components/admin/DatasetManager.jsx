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
  Chip,
  Card,
  CardContent,
  CardActions,
  CardMedia,
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
  LinearProgress,
  Stack,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PieChart as PieChartIcon,
  Image as ImageIcon,
  FilterAlt as FilterAltIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';

const DatasetManager = () => {
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      name: 'Face Shapes 2023',
      type: 'face_shapes',
      status: 'validated',
      size: '2.4 GB',
      samples: 15842,
      created: '2023-04-15T10:30:00',
      lastModified: '2023-06-02T14:20:00',
      labels: ['oval', 'round', 'square', 'heart', 'diamond'],
      distribution: {
        oval: 32,
        round: 28,
        square: 15,
        heart: 14,
        diamond: 11
      },
      quality: 'high',
      format: 'jpg',
      models: ['Face Shape Detection v2.3'],
      tags: ['production', 'balanced'],
      thumbnail: 'https://picsum.photos/300/200?random=1'
    },
    {
      id: 2,
      name: 'Facial Landmarks HD',
      type: 'facial_landmarks',
      status: 'validated',
      size: '3.8 GB',
      samples: 24567,
      created: '2023-03-10T09:15:00',
      lastModified: '2023-05-28T11:40:00',
      labels: ['eye', 'nose', 'mouth', 'jawline', 'eyebrow'],
      distribution: {
        eye: 25,
        nose: 20,
        mouth: 20,
        jawline: 15,
        eyebrow: 20
      },
      quality: 'high',
      format: 'png',
      models: ['Facial Landmark Detection v3.1'],
      tags: ['production', 'high-resolution'],
      thumbnail: 'https://picsum.photos/300/200?random=2'
    },
    {
      id: 3,
      name: 'Frames Customer Data 2023',
      type: 'frame_preferences',
      status: 'validated',
      size: '1.7 GB',
      samples: 9854,
      created: '2023-05-05T13:45:00',
      lastModified: '2023-06-01T16:30:00',
      labels: ['round', 'square', 'cat-eye', 'aviator', 'rectangle'],
      distribution: {
        round: 30,
        square: 25,
        'cat-eye': 18,
        aviator: 12,
        rectangle: 15
      },
      quality: 'medium',
      format: 'json',
      models: ['Frame Recommendation Engine v1.8'],
      tags: ['production', 'customer', 'preferences'],
      thumbnail: 'https://picsum.photos/300/200?random=3'
    },
    {
      id: 4,
      name: 'Prescription Images 2023',
      type: 'prescription',
      status: 'needs_validation',
      size: '5.2 GB',
      samples: 32145,
      created: '2023-05-20T08:30:00',
      lastModified: '2023-06-05T10:15:00',
      labels: ['handwritten', 'typed', 'digital'],
      distribution: {
        handwritten: 45,
        typed: 35,
        digital: 20
      },
      quality: 'mixed',
      format: 'multiple',
      models: ['Prescription Reader v1.2'],
      tags: ['needs-cleaning', 'ocr'],
      thumbnail: 'https://picsum.photos/300/200?random=4'
    },
    {
      id: 5,
      name: 'User Feedback 2023',
      type: 'analytics',
      status: 'processing',
      size: '850 MB',
      samples: 54289,
      created: '2023-05-25T15:20:00',
      lastModified: '2023-06-08T12:30:00',
      labels: ['positive', 'negative', 'neutral'],
      distribution: {
        positive: 65,
        negative: 15,
        neutral: 20
      },
      quality: 'high',
      format: 'csv',
      models: ['User Satisfaction Predictor v1.0'],
      tags: ['sentiment', 'feedback'],
      thumbnail: 'https://picsum.photos/300/200?random=5'
    },
    {
      id: 6,
      name: 'Augmented Face Shapes',
      type: 'face_shapes',
      status: 'uploading',
      size: '4.1 GB',
      samples: 28932,
      created: '2023-06-10T09:30:00',
      lastModified: '2023-06-10T09:30:00',
      labels: ['oval', 'round', 'square', 'heart', 'diamond'],
      distribution: {
        oval: 20,
        round: 20,
        square: 20,
        heart: 20,
        diamond: 20
      },
      quality: 'synthetic',
      format: 'jpg',
      models: [],
      tags: ['augmented', 'balanced'],
      thumbnail: 'https://picsum.photos/300/200?random=6',
      uploadProgress: 68
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'lastModified', direction: 'desc' });
  const [uploadingDataset, setUploadingDataset] = useState({
    name: '',
    type: 'face_shapes',
    quality: 'high',
    format: 'jpg',
    tags: [],
    files: null
  });

  // Sort datasets based on current sort configuration
  const sortedDatasets = React.useMemo(() => {
    const sortableDatasets = [...datasets];
    if (sortConfig.key) {
      sortableDatasets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDatasets;
  }, [datasets, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleOpenDialog = (dataset) => {
    setSelectedDataset(dataset);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDataset(null);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setUploadProgress(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadingDataset({
      ...uploadingDataset,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setUploadingDataset({
      ...uploadingDataset,
      files: e.target.files
    });
  };

  const handleTagsChange = (e) => {
    setUploadingDataset({
      ...uploadingDataset,
      tags: e.target.value
    });
  };

  const simulateUpload = () => {
    // Reset progress
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Add the new dataset to the list
          const newDataset = {
            id: Date.now(),
            name: uploadingDataset.name,
            type: uploadingDataset.type,
            status: 'processing',
            size: '0 MB',
            samples: 0,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            labels: [],
            distribution: {},
            quality: uploadingDataset.quality,
            format: uploadingDataset.format,
            models: [],
            tags: uploadingDataset.tags,
            thumbnail: 'https://picsum.photos/300/200?random=' + Date.now()
          };
          
          setDatasets([...datasets, newDataset]);
          
          // Close dialog after short delay
          setTimeout(() => {
            handleCloseUploadDialog();
            
            // Reset uploading dataset
            setUploadingDataset({
              name: '',
              type: 'face_shapes',
              quality: 'high',
              format: 'jpg',
              tags: [],
              files: null
            });
          }, 1000);
        }
        
        return newProgress;
      });
    }, 300);
  };

  const handleDeleteDataset = (datasetId) => {
    setDatasets(datasets.filter(dataset => dataset.id !== datasetId));
  };

  const handleValidateDataset = (datasetId) => {
    setDatasets(datasets.map(dataset => 
      dataset.id === datasetId 
        ? { ...dataset, status: 'validated', lastModified: new Date().toISOString() } 
        : dataset
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'success';
      case 'needs_validation': return 'warning';
      case 'processing': return 'info';
      case 'uploading': return 'primary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'needs_validation': return 'Needs Validation';
      case 'uploading': return 'Uploading';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dataset Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<CloudUploadIcon />}
          onClick={handleOpenUploadDialog}
        >
          Upload Dataset
        </Button>
      </Box>

      {/* Dataset Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(to right, #4facfe, #00f2fe)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Datasets
            </Typography>
            <Typography component="p" variant="h3">
              {datasets.length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {datasets.filter(d => d.status === 'validated').length} validated
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(to right, #6a11cb, #2575fc)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Samples
            </Typography>
            <Typography component="p" variant="h3">
              {datasets.reduce((total, dataset) => total + dataset.samples, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Across all datasets
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Storage Used
            </Typography>
            <Typography component="p" variant="h3">
              {datasets.reduce((total, dataset) => {
                const size = parseFloat(dataset.size.split(' ')[0]);
                const unit = dataset.size.split(' ')[1];
                
                // Convert to MB for calculation
                let sizeInMB = size;
                if (unit === 'GB') sizeInMB = size * 1024;
                if (unit === 'KB') sizeInMB = size / 1024;
                
                return total + sizeInMB;
              }, 0).toFixed(1)} GB
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              57% of allocated storage
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(to right, #43e97b, #38f9d7)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Active Models
            </Typography>
            <Typography component="p" variant="h3">
              {new Set(datasets.flatMap(d => d.models)).size}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Using these datasets
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Datasets Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0 }}>
            Datasets
          </Typography>
          <Box>
            <Tooltip title="Filter datasets">
              <IconButton size="small" sx={{ mr: 1 }}>
                <FilterAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                        : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer' 
                    }}
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' 
                        ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                        : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Samples</TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer' 
                    }}
                    onClick={() => handleSort('lastModified')}
                  >
                    Last Modified
                    {sortConfig.key === 'lastModified' && (
                      sortConfig.direction === 'asc' 
                        ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                        : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Used By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDatasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {dataset.status === 'uploading' ? (
                        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1.5 }}>
                          <CircularProgress
                            variant="determinate"
                            value={dataset.uploadProgress}
                            size={24}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                              {dataset.uploadProgress}%
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <ImageIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      )}
                      {dataset.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={dataset.type.replace('_', ' ')} 
                      size="small" 
                      sx={{ textTransform: 'capitalize' }} 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {dataset.status === 'uploading' ? (
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={dataset.uploadProgress} 
                          sx={{ height: 6, borderRadius: 3 }} 
                        />
                      </Box>
                    ) : (
                      <Chip 
                        label={getStatusLabel(dataset.status)} 
                        color={getStatusColor(dataset.status)} 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell>{dataset.samples.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(dataset.lastModified)}</TableCell>
                  <TableCell>
                    {dataset.models.length > 0 ? (
                      <Stack direction="row" spacing={0.5}>
                        {dataset.models.map((model, index) => (
                          index < 2 ? (
                            <Chip 
                              key={model} 
                              label={model.split(' ')[0]} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          ) : (
                            index === 2 && (
                              <Chip 
                                key="more" 
                                label={`+${dataset.models.length - 2}`} 
                                size="small" 
                              />
                            )
                          )
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not in use
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(dataset)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {dataset.status === 'needs_validation' && (
                      <Tooltip title="Validate Dataset">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleValidateDataset(dataset.id)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="Download Dataset">
                      <IconButton size="small" color="info">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete Dataset">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteDataset(dataset.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dataset Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle>Upload New Dataset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload a new dataset for AI model training. Please provide dataset details and upload your files.
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Dataset Name"
                  name="name"
                  value={uploadingDataset.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Dataset Type</InputLabel>
                  <Select
                    name="type"
                    value={uploadingDataset.type}
                    label="Dataset Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="face_shapes">Face Shapes</MenuItem>
                    <MenuItem value="facial_landmarks">Facial Landmarks</MenuItem>
                    <MenuItem value="frame_preferences">Frame Preferences</MenuItem>
                    <MenuItem value="prescription">Prescription</MenuItem>
                    <MenuItem value="analytics">User Analytics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Data Quality</InputLabel>
                  <Select
                    name="quality"
                    value={uploadingDataset.quality}
                    label="Data Quality"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
                    <MenuItem value="synthetic">Synthetic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>File Format</InputLabel>
                  <Select
                    name="format"
                    value={uploadingDataset.format}
                    label="File Format"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="jpg">JPG</MenuItem>
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="multiple">Multiple Formats</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    name="tags"
                    value={uploadingDataset.tags}
                    label="Tags"
                    onChange={handleTagsChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="production">Production</MenuItem>
                    <MenuItem value="testing">Testing</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="augmented">Augmented</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="needs-cleaning">Needs Cleaning</MenuItem>
                    <MenuItem value="high-resolution">High Resolution</MenuItem>
                    <MenuItem value="low-resolution">Low Resolution</MenuItem>
                    <MenuItem value="ocr">OCR</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                    <MenuItem value="sentiment">Sentiment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Select Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {uploadingDataset.files 
                    ? `${uploadingDataset.files.length} files selected` 
                    : 'No files selected'}
                </Typography>
              </Grid>
              
              {uploadProgress > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Uploading: {uploadProgress}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      sx={{ height: 8, borderRadius: 4 }} 
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            onClick={simulateUpload}
            disabled={!uploadingDataset.name || !uploadingDataset.files || uploadProgress > 0}
          >
            Upload Dataset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dataset Details Dialog */}
      {selectedDataset && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Dataset Details: {selectedDataset.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardMedia
                    component="img"
                    height="160"
                    image={selectedDataset.thumbnail}
                    alt={selectedDataset.name}
                  />
                  <CardContent>
                    <Box sx={{ mb: 1.5 }}>
                      <Chip 
                        label={getStatusLabel(selectedDataset.status)} 
                        color={getStatusColor(selectedDataset.status)} 
                        size="small" 
                        sx={{ mr: 0.5 }}
                      />
                      <Chip 
                        label={selectedDataset.type.replace('_', ' ')} 
                        variant="outlined"
                        size="small" 
                        sx={{ textTransform: 'capitalize' }} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">Created on</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatDate(selectedDataset.created)}</Typography>
                    
                    <Typography variant="body2" color="text.secondary">Last modified</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatDate(selectedDataset.lastModified)}</Typography>
                    
                    <Typography variant="body2" color="text.secondary">Size</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{selectedDataset.size}</Typography>
                    
                    <Typography variant="body2" color="text.secondary">Format</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {selectedDataset.format.toUpperCase()}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">Quality</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {selectedDataset.quality.charAt(0).toUpperCase() + selectedDataset.quality.slice(1)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Dataset Overview
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    This dataset contains {selectedDataset.samples.toLocaleString()} samples
                    {selectedDataset.models.length > 0 
                      ? ` and is currently used by ${selectedDataset.models.length} model${selectedDataset.models.length > 1 ? 's' : ''}.`
                      : ' and is not currently used by any models.'
                    }
                  </Typography>
                  
                  {selectedDataset.models.length > 0 && (
                    <Box sx={{ mt: 1.5, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Used by models:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedDataset.models.map(model => (
                          <Chip 
                            key={model}
                            label={model}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 1.5, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedDataset.tags.map(tag => (
                        <Chip 
                          key={tag}
                          label={tag}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PieChartIcon sx={{ mr: 1 }} /> Class Distribution
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {Object.entries(selectedDataset.distribution).map(([label, percentage]) => (
                      <Grid item xs={6} md={4} key={label}>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {label}:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ height: 8, borderRadius: 4 }} 
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                {selectedDataset.status === 'needs_validation' && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This dataset requires validation before it can be used for model training.
                  </Alert>
                )}
                
                {selectedDataset.status === 'processing' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This dataset is currently being processed. Some statistics may be incomplete.
                  </Alert>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {selectedDataset.status === 'needs_validation' && (
              <Button
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  handleValidateDataset(selectedDataset.id);
                  handleCloseDialog();
                }}
              >
                Validate Dataset
              </Button>
            )}
            <Button
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                handleDeleteDataset(selectedDataset.id);
                handleCloseDialog();
              }}
            >
              Delete
            </Button>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default DatasetManager; 