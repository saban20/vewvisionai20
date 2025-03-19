import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Placeholder API
const MeasurementsApi = {
  getById: async (id) => {
    // Mock data
    return {
      id,
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 days ago
      pupillaryDistance: 64.5,
      verticalDifference: 1.2,
      noseBridgeWidth: 19.5,
      symmetryScore: 0.94,
      confidenceMetrics: {
        stabilityScore: 0.92,
        eyeOpennessScore: 0.95
      }
    };
  },
  analyze: async (id) => {
    // Mock analysis data
    return {
      id,
      faceShape: 'Oval',
      populationComparison: {
        averagePD: 63.0,
        percentileRank: 65
      },
      fitRecommendations: [
        'Medium to large frames would suit your face shape.',
        'Rectangular or square frames provide good contrast.'
      ],
      alerts: [],
      recommendations: true
    };
  },
  getRecommendedProducts: async (id) => {
    // Mock product recommendations
    return [
      {
        id: 'prod1',
        name: 'Designer Rectangle Frame',
        price: 149.99,
        image: '/product1.jpg',
        fitScore: 0.95,
        description: 'Premium rectangle frames optimized for your measurements.'
      },
      {
        id: 'prod2',
        name: 'Classic Oval Titanium',
        price: 129.99,
        image: '/product2.jpg',
        fitScore: 0.92,
        description: 'Lightweight titanium frames with perfect oval shape.'
      },
      {
        id: 'prod3',
        name: 'Modern Square Frame',
        price: 179.99,
        image: '/product3.jpg',
        fitScore: 0.89,
        description: 'Contemporary square frames with premium materials.'
      }
    ];
  }
};

// Placeholder components
const AIAnalysisCard = ({ analysis, measurements }) => (
  <Card sx={{ mb: 4 }} className="hologram-card">
    <CardContent>
      <Typography variant="h6" gutterBottom className="hologram">AI Analysis</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1">
        Based on your pupillary distance of {measurements.pupillaryDistance.toFixed(1)}mm, your measurements are in the
        {analysis.populationComparison.percentileRank}th percentile of the population.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Fit Recommendations:</Typography>
        <ul>
          {analysis.fitRecommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </Box>
    </CardContent>
  </Card>
);

const FaceShapeAnalysis = ({ analysis }) => (
  <Card sx={{ mb: 4 }} className="hologram-card">
    <CardContent>
      <Typography variant="h6" gutterBottom className="hologram">Face Shape Analysis</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center', width: '100%', maxWidth: 300 }} className="hologram">
          <Typography variant="h5" color="primary.main" className="hologram">{analysis.faceShape}</Typography>
          <Typography variant="body2">Face Shape</Typography>
        </Paper>
      </Box>
      <Typography variant="body1">
        Your face shape is {analysis.faceShape}, which is characterized by balanced proportions and a gently rounded jawline.
        This versatile face shape works well with most frame styles.
      </Typography>
    </CardContent>
  </Card>
);

const ProductRecommendationCard = ({ product }) => (
  <Card className="hologram-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">Fit Score: {(product.fitScore * 100).toFixed(0)}%</Typography>
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>{product.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
      <Typography variant="h6" color="primary.main">${product.price.toFixed(2)}</Typography>
    </CardContent>
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" variant="outlined">Details</Button>
      <Button size="small" variant="contained" startIcon={<ShoppingCartIcon />} className="hologram-button">
        Add to Cart
      </Button>
    </Box>
  </Card>
);

const Analysis = () => {
  const theme = useTheme();
  const { measurementId } = useParams();
  const [measurement, setMeasurement] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const measurementData = await MeasurementsApi.getById(measurementId);
        setMeasurement(measurementData);
        const analysisData = await MeasurementsApi.analyze(measurementId);
        setAnalysis(analysisData);
        if (analysisData && analysisData.recommendations) {
          const recommendationsData = await MeasurementsApi.getRecommendedProducts(measurementId);
          setRecommendations(recommendationsData);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching analysis data:', err);
        setError('Failed to load analysis data.');
      } finally {
        setLoading(false);
      }
    };

    if (measurementId) fetchData();
  }, [measurementId]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const preparePdComparisonData = () => {
    if (!analysis) return null;
    return {
      labels: ['Your PD', 'Average Adult PD'],
      datasets: [
        {
          label: 'Pupillary Distance (mm)',
          data: [measurement.pupillaryDistance, analysis.populationComparison.averagePD],
          backgroundColor: [theme.palette.primary.main, theme.palette.secondary.main],
          borderColor: [theme.palette.primary.dark, theme.palette.secondary.dark],
          borderWidth: 1,
        },
      ],
    };
  };

  const pdComparisonData = preparePdComparisonData();
  const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Millimeters (mm)' } } } };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress className="hologram" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }} className="hologram-card">
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button component={RouterLink} to="/dashboard" variant="outlined" className="hologram-button">Return to Dashboard</Button>
      </Container>
    );
  }

  if (!measurement || !analysis) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }} className="hologram-card">
        <Alert severity="warning" sx={{ mb: 4 }}>No measurement data found.</Alert>
        <Button component={RouterLink} to="/dashboard" variant="outlined" className="hologram-button">Return to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="hologram-card">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className="hologram">Measurement Analysis</Typography>
        <Typography variant="body1" color="text.secondary">Detailed analysis of your eye measurements.</Typography>
      </Box>

      <Card sx={{ mb: 4 }} className="hologram-card">
        <CardContent>
          <Typography variant="h6" gutterBottom className="hologram">Measurement Summary</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Measurement ID:</Typography>
                    <Typography variant="body1">{measurement.id.substring(0, 8)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date:</Typography>
                    <Typography variant="body1">{formatDate(measurement.timestamp)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>Key Measurements:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }} className="hologram">
                      <Typography variant="body2" color="text.secondary">Pupillary Distance (PD)</Typography>
                      <Typography variant="h4" color="primary.main">{measurement.pupillaryDistance.toFixed(1)}</Typography>
                      <Typography variant="body2">mm</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }} className="hologram">
                      <Typography variant="body2" color="text.secondary">Vertical Difference</Typography>
                      <Typography variant="h4" color="primary.main">{measurement.verticalDifference.toFixed(1)}</Typography>
                      <Typography variant="body2">mm</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Confidence Metrics:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label={`Stability: ${(measurement.confidenceMetrics.stabilityScore * 100).toFixed(0)}%`} color={measurement.confidenceMetrics.stabilityScore >= 0.8 ? 'success' : 'primary'} variant="outlined" />
                <Chip label={`Eye Openness: ${(measurement.confidenceMetrics.eyeOpennessScore * 100).toFixed(0)}%`} color={measurement.confidenceMetrics.eyeOpennessScore >= 0.8 ? 'success' : 'primary'} variant="outlined" />
              </Box>
              <Box sx={{ height: 200 }}>{pdComparisonData && <Bar data={pdComparisonData} options={barOptions} />}</Box>
              <Typography variant="caption" align="center" sx={{ display: 'block', mt: 1 }}>Your PD vs. Average</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <AIAnalysisCard analysis={analysis} measurements={measurement} />
      <FaceShapeAnalysis analysis={analysis} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom className="hologram">Recommended Products</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {recommendations.length > 0 ? (
            recommendations.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductRecommendationCard product={product} measurements={measurement} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }} className="hologram">
                <Typography variant="body1">No recommendations yet.</Typography>
                <Button component={RouterLink} to="/shop" variant="contained" color="primary" startIcon={<ShoppingCartIcon />} className="hologram-button">
                  Browse Products
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Analysis; 