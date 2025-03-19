/**
 * Centralized theme configuration for the NewVisionAI application
 * Contains colors, spacing, typography, and component-specific styling
 */

import { createTheme } from '@mui/material/styles';

// Define base colors
const baseColors = {
  primary: '#3f51b5',
  secondary: '#f50057',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Light theme colors
  lightBackground: '#f8f9fa',
  lightSurface: '#ffffff',
  lightText: '#212121',
  lightTextSecondary: '#757575',
  lightBorder: '#e0e0e0',
  lightCard: '#ffffff',
  
  // Dark theme colors
  darkBackground: '#121212',
  darkSurface: '#1e1e1e',
  darkText: '#ffffff',
  darkTextSecondary: '#b0b0b0',
  darkBorder: '#333333',
  darkCard: '#282828',
};

// Define spacing system
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Define border radius
const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  round: '50%',
};

// Define typography settings
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  lineHeights: {
    xs: 1,
    sm: 1.2,
    md: 1.4,
    lg: 1.6,
    xl: 1.8,
  },
};

// Define transitions
const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
};

// Create the base Material-UI theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: baseColors.primary,
    },
    secondary: {
      main: baseColors.secondary,
    },
    error: {
      main: baseColors.error,
    },
    warning: {
      main: baseColors.warning,
    },
    info: {
      main: baseColors.info,
    },
    success: {
      main: baseColors.success,
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeightLight: typography.fontWeights.light,
    fontWeightRegular: typography.fontWeights.regular,
    fontWeightMedium: typography.fontWeights.medium,
    fontWeightBold: typography.fontWeights.bold,
  },
  shape: {
    borderRadius: 8,
  },
});

// Extended theme with our custom properties
export const theme = {
  ...muiTheme,
  colors: baseColors,
  spacing,
  borderRadius,
  typography,
  transitions,
  
  // Helper function to get box shadow based on theme
  getBoxShadow: (isDark) => isDark 
    ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  
  // Helper function to get colors based on dark/light mode
  getModeColors: (isDark) => ({
    background: isDark ? baseColors.darkBackground : baseColors.lightBackground,
    surface: isDark ? baseColors.darkSurface : baseColors.lightSurface,
    text: isDark ? baseColors.darkText : baseColors.lightText,
    textSecondary: isDark ? baseColors.darkTextSecondary : baseColors.lightTextSecondary,
    border: isDark ? baseColors.darkBorder : baseColors.lightBorder,
    card: isDark ? baseColors.darkCard : baseColors.lightCard,
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    success: baseColors.success,
    warning: baseColors.warning,
    error: baseColors.error,
    info: baseColors.info,
  }),
}; 