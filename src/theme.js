/**
 * Centralized theme configuration for the NewVisionAI application
 * Contains colors, spacing, typography, and component-specific styling
 */

export const theme = {
  // Color palette
  colors: {
    // Primary colors
    primary: '#0071e3',
    primaryDark: '#0058a3',
    primaryLight: '#0077ED',
    
    // UI colors
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    gold: '#FFD700',
    
    // Text colors
    textPrimary: '#1d1d1f',
    textSecondary: '#86868b',
    textTertiary: '#515154',
    
    // Background colors
    bgLight: '#f5f5f7',
    bgDark: '#121212',
    cardLight: '#ffffff',
    cardDark: '#1a1a1a',
    cardHeaderDark: '#2a2a2a',
    
    // Dark mode specific
    darkText: '#f5f5f7',
    darkTextSecondary: '#a1a1a6',
    darkBorder: '#333',
    darkOverlay: 'rgba(255, 255, 255, 0.05)'
  },
  
  // Spacing values
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  // Typography
  typography: {
    fontWeights: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '2.5rem'
    }
  },
  
  // Border radiuses
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '14px',
    xl: '16px',
    pill: '9999px'
  },
  
  // Shadows
  shadows: {
    light: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
      md: '0 4px 12px rgba(0, 0, 0, 0.12)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    dark: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
      md: '0 4px 12px rgba(0, 0, 0, 0.3)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.5)'
    }
  },
  
  // Component-specific styling
  components: {
    // Card styles
    card: {
      light: {
        bg: '#ffffff',
        border: 'none',
        shadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      },
      dark: {
        bg: '#1a1a1a',
        border: 'none',
        shadow: '0 2px 12px rgba(0, 0, 0, 0.2)'
      }
    },
    
    // Button styles
    button: {
      primary: {
        bg: '#0071e3',
        text: '#ffffff',
        hoverBg: '#0058a3',
        borderRadius: '8px'
      },
      secondary: {
        light: {
          bg: 'rgba(0, 0, 0, 0.04)',
          text: '#1d1d1f',
          hoverBg: 'rgba(0, 0, 0, 0.07)'
        },
        dark: {
          bg: 'rgba(255, 255, 255, 0.05)',
          text: '#f5f5f7',
          hoverBg: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    
    // Filter section styles
    filter: {
      light: {
        bg: 'rgba(0, 0, 0, 0.02)',
        border: 'none'
      },
      dark: {
        bg: '#1e1e1e',
        border: 'none'
      }
    }
  },
  
  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.2s ease',
    slow: 'all 0.5s ease'
  },
  
  // Helpers for dark/light mode
  getModeColors: (isDarkMode) => {
    return {
      text: isDarkMode ? '#f5f5f7' : '#1d1d1f',
      textSecondary: isDarkMode ? '#a1a1a6' : '#86868b',
      background: isDarkMode ? '#121212' : '#f5f5f7',
      card: isDarkMode ? '#1a1a1a' : 'white',
      border: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'
    };
  },
  
  getBoxShadow: (isDarkMode, size = 'md') => {
    const shadows = {
      sm: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
      md: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.12)',
      lg: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.1)'
    };
    return shadows[size];
  }
}; 