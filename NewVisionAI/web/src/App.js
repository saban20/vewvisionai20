import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Box, CircularProgress, Snackbar, Alert, Typography, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery } from '@mui/material';
import './App.css'; // Import the cosmic-themed CSS
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FaceIcon from '@mui/icons-material/Face';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import BugReportIcon from '@mui/icons-material/BugReport';
import ThemeToggle from '../src/components/ThemeToggle';
import ComponentTester from '../src/ComponentTester';

// Context & Utilities
import { getToken, isTokenValid } from './utils/auth';
import { AccessibilityContext, ThemeContext } from './index';

// Lazy load components - even those used on most pages
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FaceScannerPage = lazy(() => import('./pages/FaceScannerPage'));
const ComponentDemo = lazy(() => import('./pages/ComponentDemo'));
const Training = lazy(() => import('./pages/Training'));

// Loading fallback component
const PageLoader = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Loading...
    </Typography>
  </Box>
);

// Smaller loader for components
const ComponentLoader = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      p: 2
    }}
  >
    <CircularProgress size={24} />
  </Box>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { voiceAssist, reduceMotion } = useContext(AccessibilityContext);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { themeMode } = useContext(ThemeContext);

  // Handle screen reader announcements for page changes
  useEffect(() => {
    if (voiceAssist) {
      // Get the current page name from the URL path
      const pageName = location.pathname.split('/').pop() || 'home';
      const formattedPageName = pageName
        .replace(/-/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
        
      // Announce page change using Web Speech API
      const utterance = new SpeechSynthesisUtterance(`Navigated to ${formattedPageName} page`);
      window.speechSynthesis.speak(utterance);
    }
  }, [location.pathname, voiceAssist]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (token && isTokenValid(token)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });

    // If voice assist is enabled, announce the notification
    if (voiceAssist) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const [redirecting, setRedirecting] = useState(false);
    
    useEffect(() => {
      if (!loading && !isAuthenticated && !redirecting) {
        // Show notification about redirection
        showNotification('Please log in to access this page', 'warning');
        setRedirecting(true);
      }
    }, [loading, isAuthenticated, redirecting]);
    
    if (loading) {
      return <PageLoader />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Eyewear', icon: <FaceIcon />, path: '/eyewear' },
    { text: 'Cart', icon: <ShoppingCartIcon />, path: '/cart' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Component Tester', icon: <BugReportIcon />, path: '/tester' },
  ];

  const drawer = (
    <Box sx={{ width: 240 }}>
      <Box sx={{ py: 2, px: 3 }}>
        <Typography variant="h6">VisionAI</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={toggleDrawer}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: themeMode === 'dark' ? '#121212' : '#f5f5f7',
      transition: reduceMotion ? 'none' : 'background-color 0.3s ease'
    }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VisionAI
          </Typography>
          
          <ThemeToggle />
          
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {drawer}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/eyewear" element={<Dashboard />} />
          <Route path="/cart" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="/tester" element={<ComponentTester />} />
        </Routes>
      </Box>
      
      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} VisionAI - Advanced Eyewear Technology
        </Typography>
      </Box>

      {/* Global notification system */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          elevation={6} 
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App; 