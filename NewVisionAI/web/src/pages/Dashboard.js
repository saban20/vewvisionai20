import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  ViewInAr as ViewIcon,
  CalendarToday as CalendarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ShoppingCart as CartIcon,
  Visibility as EyeIcon,
  FavoriteBorder as HeartIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ showNotification }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    measurements: 0,
    savedFrames: 0,
    orders: 0,
    recentActivity: []
  });
  
  const navigate = useNavigate();

  // Simulate fetching user dashboard data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStats({
          measurements: 2,
          savedFrames: 4,
          orders: 1,
          recentActivity: [
            { 
              id: 1, 
              type: 'measurement',
              title: 'Face Scan Completed', 
              date: '2023-04-15 14:30', 
              icon: <PersonIcon color="primary" />
            },
            { 
              id: 2, 
              type: 'favorite',
              title: 'Added Classic Aviator to Favorites', 
              date: '2023-04-14 10:15', 
              icon: <HeartIcon color="error" />
            },
            { 
              id: 3, 
              type: 'order',
              title: 'Order #ORD-001 Placed', 
              date: '2023-03-15 16:45', 
              icon: <CartIcon color="success" />
            },
            { 
              id: 4, 
              type: 'view',
              title: 'Tried on 5 Virtual Frames', 
              date: '2023-03-10 11:30', 
              icon: <EyeIcon color="info" />
            },
          ]
        });
        setLoading(false);
      }, 1500);
    };

    fetchData();
  }, []);

  const handleActivityClick = (activity) => {
    // Navigate based on activity type
    switch (activity.type) {
      case 'measurement':
        navigate(`/analysis/${activity.id}`);
        break;
      case 'favorite':
        navigate('/profile');
        break;
      case 'order':
        navigate('/profile');
        break;
      case 'view':
        navigate('/face-scanner');
        break;
      default:
        navigate('/profile');
    }
  };

  const handleScanFace = () => {
    navigate('/face-scanner');
  };

  const handleBrowseShop = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your NewVisionAI experience.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.measurements}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Face Measurements
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                  <PersonIcon />
                </Avatar>
              </Box>
              <Button 
                variant="text" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/face-scanner')}
              >
                Take New Measurement
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.savedFrames}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved Frames
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                  <HeartIcon />
                </Avatar>
              </Box>
              <Button 
                variant="text" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/profile')}
              >
                View Saved Frames
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.orders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders Placed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <CartIcon />
                </Avatar>
              </Box>
              <Button 
                variant="text" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/profile')}
              >
                View Order History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Dashboard Sections */}
      <Grid container spacing={4}>
        {/* Recent Activity Feed */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {stats.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItemButton onClick={() => handleActivityClick(activity)}>
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.title} 
                      secondary={activity.date} 
                    />
                  </ListItemButton>
                  {index < stats.recentActivity.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            {stats.recentActivity.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No recent activity found.
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="text" 
                endIcon={<HistoryIcon />}
                onClick={() => navigate('/profile')}
              >
                View All Activity
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  startIcon={<PersonIcon />}
                  onClick={handleScanFace}
                  sx={{ py: 1.5 }}
                >
                  Scan Your Face
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  size="large"
                  startIcon={<ViewIcon />}
                  onClick={handleBrowseShop}
                  sx={{ py: 1.5 }}
                >
                  Browse Frames
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    New Summer Collection Launch
                  </Typography>
                </Box>
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  May 15, 2023
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommendation
              </Typography>
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" paragraph>
                  Based on your face shape, we recommend trying oval frames.
                </Typography>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => navigate('/shop')}
                >
                  See Recommendations
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 