import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  Dataset as DatasetIcon,
  Storage as StorageIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';

import ModelTraining from './ModelTraining';
import DatasetManager from './DatasetManager';
import UserMetrics from './UserMetrics';
import SystemMetrics from './SystemMetrics';

const drawerWidth = 240;

function DashboardContent() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Mock data for dashboard cards
  const dashboardData = {
    users: 1243,
    scans: 8724,
    models: 6,
    datasets: 12,
    activeUsers: 432,
    conversionRate: 7.8
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'model-training':
        return <ModelTraining />;
      case 'dataset-management':
        return <DatasetManager />;
      case 'users':
        return <UserMetrics />;
      case 'metrics':
        return <SystemMetrics />;
      case 'dashboard':
      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Dashboard Summary Cards */}
              <Grid item xs={12} md={4} lg={3}>
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
                    Total Users
                  </Typography>
                  <Typography component="p" variant="h3">
                    {dashboardData.users}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    +6% from last month
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
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
                    Face Scans
                  </Typography>
                  <Typography component="p" variant="h3">
                    {dashboardData.scans}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    +12% from last month
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
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
                    AI Models
                  </Typography>
                  <Typography component="p" variant="h3">
                    {dashboardData.models}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    2 in training
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
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
                    Training Datasets
                  </Typography>
                  <Typography component="p" variant="h3">
                    {dashboardData.datasets}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    3 require validation
                  </Typography>
                </Paper>
              </Grid>

              {/* Active Model Training */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Active Model Training
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardHeader 
                            title="Face Shape Detection Model v2.3"
                            subheader="Started 2 hours ago"
                            action={
                              <Tooltip title="View details">
                                <IconButton>
                                  <PsychologyIcon />
                                </IconButton>
                              </Tooltip>
                            }
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Training Progress: 64%
                            </Typography>
                            <LinearProgress variant="determinate" value={64} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Accuracy:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                87.3%
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Loss:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                0.24
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                ETA:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                1h 12m
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardHeader 
                            title="Frame Recommendation Engine v1.8"
                            subheader="Started 5 hours ago"
                            action={
                              <Tooltip title="View details">
                                <IconButton>
                                  <PsychologyIcon />
                                </IconButton>
                              </Tooltip>
                            }
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Training Progress: 89%
                            </Typography>
                            <LinearProgress variant="determinate" value={89} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Accuracy:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                92.1%
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Loss:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                0.18
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                ETA:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                28m
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              {/* Recent Data Analysis */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                      <Tab label="Data Statistics" />
                      <Tab label="Model Performance" />
                      <Tab label="System Health" />
                    </Tabs>
                  </Box>
                  
                  {selectedTab === 0 && (
                    <Box>
                      <Typography variant="body1" paragraph>
                        Face data statistics show a balanced distribution across age groups, with 52% female and 48% male samples. 
                        Ethnic diversity metrics show improvement with increased representation in previously underrepresented groups.
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Most Common Face Shapes</Typography>
                            <Typography variant="body2">Oval: 32%</Typography>
                            <Typography variant="body2">Round: 28%</Typography>
                            <Typography variant="body2">Square: 15%</Typography>
                            <Typography variant="body2">Heart: 14%</Typography>
                            <Typography variant="body2">Diamond: 11%</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Average Measurements</Typography>
                            <Typography variant="body2">Pupillary Distance: 63.4mm</Typography>
                            <Typography variant="body2">Face Width: 142.7mm</Typography>
                            <Typography variant="body2">Temple Width: 129.3mm</Typography>
                            <Typography variant="body2">Nose Bridge: 17.2mm</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Recommendation Metrics</Typography>
                            <Typography variant="body2">Satisfied Users: 82%</Typography>
                            <Typography variant="body2">Purchase Rate: 24%</Typography>
                            <Typography variant="body2">Return Rate: 5.3%</Typography>
                            <Typography variant="body2">Repeat Visitors: 67%</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  {selectedTab === 1 && (
                    <Box>
                      <Typography variant="body1" paragraph>
                        The face shape recognition model has reached 94.2% accuracy on validation data, a 2.1% improvement
                        over the previous version. Frame recommendation precision has improved by 7.3% with the integration
                        of the new dimensional analysis algorithm.
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Model Performance</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Face Detection:</Typography>
                              <Typography variant="body2" fontWeight="medium">99.1%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Shape Classification:</Typography>
                              <Typography variant="body2" fontWeight="medium">94.2%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Measurement Precision:</Typography>
                              <Typography variant="body2" fontWeight="medium">±0.4mm</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Recommendation Relevance:</Typography>
                              <Typography variant="body2" fontWeight="medium">87.4%</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  {selectedTab === 2 && (
                    <Box>
                      <Typography variant="body1" paragraph>
                        System is operating within normal parameters. Average response time is 248ms,
                        with 99.98% uptime over the past 30 days. CPU and memory utilization are within expected ranges.
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Resource Utilization</Typography>
                            <Typography variant="body2">CPU: 42%</Typography>
                            <Typography variant="body2">Memory: 63%</Typography>
                            <Typography variant="body2">Storage: 57%</Typography>
                            <Typography variant="body2">Network: 28%</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Response Times</Typography>
                            <Typography variant="body2">API Requests: 124ms</Typography>
                            <Typography variant="body2">Face Detection: 248ms</Typography>
                            <Typography variant="body2">Recommendations: 173ms</Typography>
                            <Typography variant="body2">Database Queries: 65ms</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            VisionAI Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(open
              ? {
                  overflowX: 'hidden',
                }
              : {
                  overflowX: 'hidden',
                  width: theme.spacing(7),
                  [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                  },
                }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItemButton 
            selected={activeSection === 'dashboard'}
            onClick={() => setActiveSection('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          
          <ListItemButton 
            selected={activeSection === 'model-training'}
            onClick={() => setActiveSection('model-training')}
          >
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText primary="Model Training" />
          </ListItemButton>
          
          <ListItemButton 
            selected={activeSection === 'dataset-management'}
            onClick={() => setActiveSection('dataset-management')}
          >
            <ListItemIcon>
              <DatasetIcon />
            </ListItemIcon>
            <ListItemText primary="Dataset Management" />
          </ListItemButton>
          
          <ListItemButton 
            selected={activeSection === 'users'}
            onClick={() => setActiveSection('users')}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
          
          <ListItemButton 
            selected={activeSection === 'metrics'}
            onClick={() => setActiveSection('metrics')}
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Metrics & Reports" />
          </ListItemButton>
          
          <Divider sx={{ my: 1 }} />
          
          <ListItemButton>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Data Warehouse" />
          </ListItemButton>
          
          <ListItemButton>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="System Architecture" />
          </ListItemButton>
          
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {renderMainContent()}
      </Box>
    </Box>
  );
}

export default function AdminDashboard() {
  return <DashboardContent />;
} 