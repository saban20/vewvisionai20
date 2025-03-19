import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../main';
import { Typography, TextField, Button, Box, Paper, Alert, Container } from '@mui/material';

const CustomerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials');
    } else {
      navigate('/dashboard');
    }
  };

  console.log('CustomerLogin rendering, username:', username);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }} className="hologram-card">
          <Typography variant="h4" className="text-center mb-6 hologram">Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-[#2A3439] border border-[#3C4A50] rounded-lg text-[#D9D9D9] mb-4 focus:outline-none focus:ring-2 focus:ring-[#00D8FF]"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#2A3439] border border-[#3C4A50] rounded-lg text-[#D9D9D9] mb-4 focus:outline-none focus:ring-2 focus:ring-[#00D8FF]"
          />
          <Button id="login-btn" className="hologram-button w-full" onClick={handleLogin}>
            Login
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body1">
              Don't have an account?{' '}
              <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                <Button color="primary" className="hologram-button">Register</Button>
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerLogin; 