import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Paper, Typography, Grid, FormControlLabel, Switch, Slider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * Component Test Suite - A utility for visually testing components in both light and dark modes
 * and at different viewport sizes to ensure proper responsiveness.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The component to test
 * @param {string} props.title - The title of the test
 * @param {boolean} props.withPadding - Whether to add padding around the component
 * @returns {React.ReactNode}
 */
export const ComponentTestSuite = ({ children, title, withPadding = true }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [viewportWidth, setViewportWidth] = useState(100);
  
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });
  
  const handleThemeChange = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const handleWidthChange = (event, newValue) => {
    setViewportWidth(newValue);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {title || 'Component Test Suite'}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === 'dark'}
                  onChange={handleThemeChange}
                />
              }
              label={`${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography id="viewport-width-slider" gutterBottom>
              Viewport Width: {viewportWidth}%
            </Typography>
            <Slider
              value={viewportWidth}
              onChange={handleWidthChange}
              aria-labelledby="viewport-width-slider"
              min={20}
              max={100}
              marks={[
                { value: 20, label: 'Mobile' },
                { value: 50, label: 'Tablet' },
                { value: 75, label: 'Laptop' },
                { value: 100, label: 'Desktop' },
              ]}
            />
          </Grid>
        </Grid>
        
        <Paper 
          elevation={3}
          sx={{ 
            p: withPadding ? 3 : 0,
            width: `${viewportWidth}%`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {children}
        </Paper>
        
        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Test your component in both light and dark modes, and at different viewport widths to ensure proper responsiveness.
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

/**
 * Theme Toggle Test - A simpler utility that just toggles between light and dark themes
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The component to test
 * @param {string} props.initialMode - The initial theme mode ('light' or 'dark')
 * @returns {React.ReactNode}
 */
export const ThemeToggleTest = ({ children, initialMode = 'light' }) => {
  const [mode, setMode] = useState(initialMode);
  
  const theme = createTheme({
    palette: {
      mode,
    },
  });
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
            />
          }
          label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
        />
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}; 