import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';
import { login } from '../utils/auth';

/**
 * Login page with email, password, and social login options
 */
const Login = ({ setIsAuthenticated, showNotification }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call for demo purposes
      // In a real app, this would be an actual API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      // In a real app, you would get a token from your backend
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2ODUwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const mockUserData = {
        id: '123',
        name: 'John Doe',
        email: email,
        role: 'user',
      };
      
      // Store token and user data
      login(mockToken, mockUserData);
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Show success notification
      showNotification('Successfully logged in', 'success');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = (provider) => {
    setError('');
    showNotification(`${provider} login is not implemented in this demo`, 'info');
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3}
        sx={{ 
          mt: 4, 
          p: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Log In
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mb={4}>
            Welcome back! Please enter your details to log in.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mb: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
            
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ py: 1.2 }}
              >
                Google
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('Facebook')}
                sx={{ py: 1.2 }}
              >
                Facebook
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin('Apple')}
                sx={{ py: 1.2 }}
              >
                Apple
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          By logging in, you agree to our{' '}
          <Link component={RouterLink} to="/terms" variant="body2">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link component={RouterLink} to="/privacy" variant="body2">
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login; 