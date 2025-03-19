import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
  Paper,
  useTheme,
  Slider,
  IconButton,
  Switch,
  Tooltip,
  FormControlLabel,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon,
  AccessibilityNew as AccessibilityIcon,
  Info as InfoIcon,
  Sync as SyncIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CompareArrows as CompareArrowsIcon,
  RotateRight as RotateRightIcon,
} from '@mui/icons-material';
import { Chart, registerables } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import io from 'socket.io-client';

Chart.register(...registerables);

// Placeholder APIs
const MeasurementsApi = {
  getAll: async () => {
    // Simulate API call with mock data
    return [
      {
        id: 'm1',
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
        pupillaryDistance: 64.2,
        verticalDifference: 1.5,
        noseBridgeWidth: 19.8,
        symmetryScore: 0.92,
      },
      {
        id: 'm2',
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 14, // 14 days ago
        pupillaryDistance: 64.0,
        verticalDifference: 1.3,
        noseBridgeWidth: 19.8,
        symmetryScore: 0.91,
      },
      {
        id: 'm3',
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
        pupillaryDistance: 63.8,
        verticalDifference: 1.6,
        noseBridgeWidth: 19.7,
        symmetryScore: 0.90,
      }
    ];
  }
};

const ShopApi = {
  getRecommendations: async (params) => {
    // Simulate API call with mock data
    return [
      { id: 'r1', name: 'Premium Eyewear Frame', price: 129.99 },
      { id: 'r2', name: 'Lightweight Titanium', price: 149.99 },
      { id: 'r3', name: 'Classic Round Frame', price: 99.99 },
      { id: 'r4', name: 'Designer Full Rim', price: 179.99 },
      { id: 'r5', name: 'Sport Performance Frame', price: 159.99 },
    ];
  }
};

// Utility function
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Dashboard = () => {
  const theme = useTheme();
  const [measurements, setMeasurements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState("disconnected");
  const [fitAdjustment, setFitAdjustment] = useState(0);
  const [fitAlerts, setFitAlerts] = useState([]);
  const socketRef = useRef(null);

  const handleFitAdjust = (event, newValue) => {
    setFitAdjustment(newValue);
    console.log(`Adjusting PD by: ${newValue}mm`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const measurementsData = await MeasurementsApi.getAll();
        setMeasurements(measurementsData);

        if (measurementsData.length > 0) {
          const latestMeasurement = measurementsData[0];
          const recommendationsData = await ShopApi.getRecommendations({
            pd: latestMeasurement.pupillaryDistance,
            vd: latestMeasurement.verticalDifference,
            noseBridge: latestMeasurement.noseBridgeWidth,
            limit: 5,
          });
          setRecommendations(recommendationsData);
          generateFitAlerts(latestMeasurement);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    const generateFitAlerts = (measurement) => {
      const alerts = [];
      if (measurement.symmetryScore < 0.8) {
        alerts.push({ id: 'asymmetry', severity: 'warning', message: 'Facial asymmetry detected.', recommendation: 'Consider flexible nose pads.' });
      }
      if (measurement.pupillaryDistance < 58 || measurement.pupillaryDistance > 72) {
        alerts.push({ id: 'unusual-pd', severity: 'info', message: 'Your PD is outside average range.', recommendation: 'Custom lenses recommended.' });
      }
      setFitAlerts(alerts);
    };

    fetchData();

    const socketUrl = 'https://api.newvisionai.com';
    socketRef.current = io(socketUrl, { transports: ['websocket'] });

    socketRef.current.on('connect', () => setRealtimeStatus("connected"));
    socketRef.current.on('disconnect', () => setRealtimeStatus("disconnected"));
    socketRef.current.on('analysisUpdate', () => setRealtimeStatus("connected"));

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const latestMeasurement = useMemo(() => measurements.length > 0 ? measurements[0] : null, [measurements]);

  const getPdChartData = () => {
    if (!measurements.length) return null;
    const sortedMeasurements = [...measurements].sort((a, b) => a.timestamp - b.timestamp);
    return {
      labels: sortedMeasurements.map(m => formatDate(m.timestamp)),
      datasets: [
        {
          label: 'Pupillary Distance (mm)',
          data: sortedMeasurements.map(m => m.pupillaryDistance),
          backgroundColor: hexToRgba(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          tension: 0.3,
        },
      ],
    };
  };

  const getSymmetryChartData = () => {
    if (!latestMeasurement) return null;
    return {
      labels: ['Symmetry', 'Asymmetry'],
      datasets: [
        {
          data: [latestMeasurement.symmetryScore * 100, (1 - latestMeasurement.symmetryScore) * 100],
          backgroundColor: [theme.palette.success.main, theme.palette.error.light],
          borderWidth: 1,
        },
      ],
    };
  };

  const pdChartData = getPdChartData();
  const symmetryChartData = getSymmetryChartData();

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: false, title: { display: true, text: 'Measurement (mm)' } } } };
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } };

  const renderMetricCard = (title, value, unit, desc, Icon) => (
    <Card className="hologram-card" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" className="hologram">{value} {unit}</Typography>
            <Typography variant="body2" color="text.secondary">{desc}</Typography>
          </Box>
          {Icon && <Icon sx={{ color: theme.palette.primary.main, fontSize: '2rem' }} />}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container className="hologram-card">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress className="hologram" />
          <Typography variant="h6" className="hologram">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="hologram-card">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" className="hologram">Dashboard</Typography>
          <Box>
            <Tooltip title={realtimeStatus === "connected" ? "Real-time active" : "Disconnected"}>
              <IconButton color={realtimeStatus === "connected" ? "success" : "error"}><SyncIcon /></IconButton>
            </Tooltip>
            {fitAlerts.length > 0 && (
              <Tooltip title={`${fitAlerts.length} fit alerts`}>
                <IconButton color="warning">
                  <Badge badgeContent={fitAlerts.length} color="warning"><NotificationsIcon /></Badge>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">Your eye measurements and recommendations.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {fitAlerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {fitAlerts.map(alert => (
            <Alert key={alert.id} severity={alert.severity} sx={{ mb: 2 }} className="hologram">
              <Typography variant="subtitle2">{alert.message}</Typography>
              <Typography variant="body2">{alert.recommendation}</Typography>
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" className="hologram">Quick Stats</Typography>
          {latestMeasurement ? (
            <>
              {renderMetricCard('Pupillary Distance', latestMeasurement.pupillaryDistance.toFixed(1), 'mm', 'Distance between pupils', <VisibilityIcon />)}
              {renderMetricCard('Eye Height Difference', latestMeasurement.verticalDifference.toFixed(1), 'mm', 'Vertical eye difference', <CompareArrowsIcon />)}
              {renderMetricCard('Nose Bridge Width', latestMeasurement.noseBridgeWidth.toFixed(1), 'mm', 'Nose bridge width', <AccessibilityIcon />)}
              {renderMetricCard('Face Symmetry', (latestMeasurement.symmetryScore * 100).toFixed(0), '%', 'Facial symmetry', <RotateRightIcon />)}
            </>
          ) : (
            <Alert severity="info">No measurements found. Scan using the iOS app.</Alert>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" className="hologram">Analysis</Typography>
          {latestMeasurement && (
            <>
              <Paper sx={{ p: 2, mb: 3 }} className="hologram">
                <Typography variant="subtitle2">PD Trend</Typography>
                <Box sx={{ height: 200 }}>{pdChartData && <Line data={pdChartData} options={chartOptions} />}</Box>
              </Paper>
              <Paper sx={{ p: 2, mb: 3 }} className="hologram">
                <Typography variant="subtitle2">Symmetry</Typography>
                <Box sx={{ height: 200 }}>{symmetryChartData && <Doughnut data={symmetryChartData} options={doughnutOptions} />}</Box>
              </Paper>
              <Paper sx={{ p: 2 }} className="hologram">
                <Typography variant="subtitle2">Fit Adjustment</Typography>
                <Slider value={fitAdjustment} onChange={handleFitAdjust} step={0.1} min={-5} max={5} valueLabelDisplay="auto" />
              </Paper>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" className="hologram">Recommendations</Typography>
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map(item => (
              <Card key={item.id} className="hologram-card" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>${item.price.toFixed(2)}</Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/analysis/${latestMeasurement?.id}`} startIcon={<InfoIcon />}>Details</Button>
                  <Button variant="contained" className="hologram-button" startIcon={<ShoppingCartIcon />}>Add to Cart</Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Alert severity="info">Complete a scan for recommendations.</Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 