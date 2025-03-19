import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Snackbar, Alert, Typography } from '@mui/material';
import './App.css'; // Import the cosmic-themed CSS

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Services & Utilities
import { getToken, isTokenValid } from './utils/auth';
import { AccessibilityContext } from './index';

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

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { voiceAssist, reduceMotion } = useContext(AccessibilityContext);
  const location = useLocation();

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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="App">
      <div className="cosmic-bg"></div>
      
      <Header 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated}
        showNotification={showNotification}
      />
      
      {/* Main content area with id for skip link */}
      <Box 
        component="main" 
        id="main-content" 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          zIndex: 1
        }} 
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home showNotification={showNotification} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} showNotification={showNotification} />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} showNotification={showNotification} />} />
            <Route path="/components" element={<ComponentDemo />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard showNotification={showNotification} /></ProtectedRoute>} 
            />
            <Route 
              path="/analysis/:measurementId" 
              element={<ProtectedRoute><Analysis showNotification={showNotification} /></ProtectedRoute>} 
            />
            <Route 
              path="/shop" 
              element={<ProtectedRoute><Shop showNotification={showNotification} /></ProtectedRoute>} 
            />
            <Route 
              path="/products/:productId" 
              element={<ProtectedRoute><ProductDetail showNotification={showNotification} /></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><Profile showNotification={showNotification} /></ProtectedRoute>} 
            />
            {/* New Face Scanner route */}
            <Route 
              path="/face-scanner" 
              element={<ProtectedRoute><FaceScannerPage showNotification={showNotification} /></ProtectedRoute>} 
            />
            {/* AI Training route */}
            <Route 
              path="/training" 
              element={<ProtectedRoute><Training showNotification={showNotification} /></ProtectedRoute>} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound showNotification={showNotification} />} />
          </Routes>
        </Suspense>
      </Box>
      
      <Footer />

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
    </div>
  );
}

export default App; 