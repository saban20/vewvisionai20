import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Profile = ({ showNotification }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    measurements: [],
    savedFrames: [],
    orderHistory: []
  });
  const [tabValue, setTabValue] = useState(0);

  // Simulated data loading - in a real app, you would fetch from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      // This would be replaced with actual API data
      setUserData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        measurements: [
          { id: 1, date: '2023-04-15', status: 'Complete' },
          { id: 2, date: '2023-03-22', status: 'Complete' },
        ],
        savedFrames: [
          { id: 101, name: 'Classic Aviator', brand: 'RayBan', added: '2023-04-10' },
          { id: 102, name: 'Modern Round', brand: 'Warby Parker', added: '2023-04-05' },
        ],
        orderHistory: [
          { id: 'ORD-001', date: '2023-03-15', status: 'Delivered', items: 2, total: '$249.99' },
        ]
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showNotification('Profile updated successfully', 'success');
    }, 1000);
  };

  if (loading && !userData.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Grid container spacing={4}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 120, height: 120, mb: 2 }}
                src={userData.avatar}
              >
                {userData.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="h2">
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.email}
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleProfileUpdate} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Personal Information
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                defaultValue={userData.name}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                defaultValue={userData.email}
                variant="outlined"
                type="email"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="profile tabs"
            >
              <Tab icon={<HistoryIcon />} label="Measurements" />
              <Tab icon={<FavoriteIcon />} label="Saved Frames" />
              <Tab icon={<VisibilityIcon />} label="Order History" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Measurements Tab */}
              {tabValue === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Your Face Measurements
                  </Typography>
                  {userData.measurements.length > 0 ? (
                    <List>
                      {userData.measurements.map((item) => (
                        <ListItem 
                          key={item.id} 
                          button
                          divider
                          onClick={() => {/* Navigate to measurement details */}}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={`Measurement #${item.id}`} 
                            secondary={`Taken on ${item.date}`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      You haven't taken any measurements yet.
                    </Typography>
                  )}
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PersonIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => {/* Navigate to scanner */}}
                  >
                    Take New Measurement
                  </Button>
                </>
              )}

              {/* Saved Frames Tab */}
              {tabValue === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Saved Frames
                  </Typography>
                  <Grid container spacing={2}>
                    {userData.savedFrames.map((frame) => (
                      <Grid item xs={12} sm={6} key={frame.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{frame.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {frame.brand}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Saved on {frame.added}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Order History Tab */}
              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Order History
                  </Typography>
                  {userData.orderHistory.length > 0 ? (
                    <List>
                      {userData.orderHistory.map((order) => (
                        <ListItem 
                          key={order.id} 
                          button
                          divider
                          onClick={() => {/* Navigate to order details */}}
                        >
                          <ListItemText 
                            primary={`Order #${order.id}`} 
                            secondary={`Placed on ${order.date} - ${order.status}`} 
                          />
                          <Typography variant="body2">
                            {order.total}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      You haven't placed any orders yet.
                    </Typography>
                  )}
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => {/* Navigate to shop */}}
                  >
                    Shop Now
                  </Button>
                </>
              )}

              {/* Settings Tab */}
              {tabValue === 3 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Account Settings
                  </Typography>
                  <Box component="form">
                    <Typography variant="subtitle1" gutterBottom>
                      Notification Preferences
                    </Typography>
                    {/* Add notification toggles */}
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Current Password"
                      type="password"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="New Password"
                      type="password"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm New Password"
                      type="password"
                      variant="outlined"
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3 }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 