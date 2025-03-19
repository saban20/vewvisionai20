import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { SocketProvider } from './context/SocketContext';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, LinearProgress, CircularProgress, Chip } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AIEyewearEngine from './utils/AIEyewearEngine';
import * as tf from '@tensorflow/tfjs';

// Contexts
export const ThemeContext = createContext({ themeMode: 'light', setThemeMode: () => {} });
export const AccessibilityContext = createContext({
  voiceAssist: false, setVoiceAssist: () => {},
  reduceMotion: false, setReduceMotion: () => {},
  highContrast: false, setHighContrast: () => {},
  largeText: false, setLargeText: () => {},
  lineSpacing: 1, setLineSpacing: () => {},
  focusIndicator: 'default', setFocusIndicator: () => {},
  keyboardShortcuts: true, setKeyboardShortcuts: () => {},
  textSpacing: false, setTextSpacing: () => {},
  colorFilters: 'none', setColorFilters: () => {},
});
export const AIContext = createContext(null);

const preloadAIModels = async () => {
  try {
    console.log('Preloading AI models...');
    await tf.ready();
    const aiEngine = new AIEyewearEngine(null, null); // Assuming it tolerates null refs
    await aiEngine.initialize();
    console.log('TensorFlow.js and AIEyewearEngine ready');
    return { initialized: true, error: null };
  } catch (error) {
    console.error('Error preloading AI models:', error);
    return { initialized: false, error: error.message };
  }
};

const AccessibilityProvider = ({ children }) => {
  const [voiceAssist, setVoiceAssist] = useState(() => localStorage.getItem('voiceAssist') === 'true');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('reduceMotion') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('largeText') === 'true');
  const [lineSpacing, setLineSpacing] = useState(() => parseFloat(localStorage.getItem('lineSpacing') || '1'));
  const [focusIndicator, setFocusIndicator] = useState(() => localStorage.getItem('focusIndicator') || 'default');
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() => localStorage.getItem('keyboardShortcuts') !== 'false');
  const [textSpacing, setTextSpacing] = useState(() => localStorage.getItem('textSpacing') === 'true');
  const [colorFilters, setColorFilters] = useState(() => localStorage.getItem('colorFilters') || 'none');
  const [aiStatus, setAiStatus] = useState({ initialized: false, loading: true, error: null });
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    preloadAIModels().then(status => setAiStatus({ ...status, loading: false }));
  }, []);

  useEffect(() => {
    localStorage.setItem('voiceAssist', voiceAssist);
    localStorage.setItem('reduceMotion', reduceMotion);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('largeText', largeText);
    localStorage.setItem('lineSpacing', lineSpacing);
    localStorage.setItem('focusIndicator', focusIndicator);
    localStorage.setItem('keyboardShortcuts', keyboardShortcuts);
    localStorage.setItem('textSpacing', textSpacing);
    localStorage.setItem('colorFilters', colorFilters);
  }, [voiceAssist, reduceMotion, highContrast, largeText, lineSpacing, focusIndicator, keyboardShortcuts, textSpacing, colorFilters]);

  // Apply data attributes for CSS targeting
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-high-contrast', highContrast);
  }, [themeMode, highContrast]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      primary: { main: highContrast ? '#0050A0' : '#00D8FF' }, // Adjusted to match Tailwind
      secondary: { main: highContrast ? '#D03060' : '#FF4F5A' }, // Adjusted to match Tailwind
    },
    typography: {
      fontSize: largeText ? 16 : 14,
      fontFamily: "'Inter', sans-serif", // Match Tailwind
      body1: { lineHeight: lineSpacing },
      body2: { lineHeight: lineSpacing },
    },
  }), [themeMode, highContrast, largeText, lineSpacing]);

  const accessibilityValue = {
    voiceAssist, setVoiceAssist,
    reduceMotion, setReduceMotion,
    highContrast, setHighContrast,
    largeText, setLargeText,
    lineSpacing, setLineSpacing,
    focusIndicator, setFocusIndicator,
    keyboardShortcuts, setKeyboardShortcuts,
    textSpacing, setTextSpacing,
    colorFilters, setColorFilters,
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <AccessibilityContext.Provider value={accessibilityValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AIContext.Provider value={{ status: aiStatus, setStatus: setAiStatus }}>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AIContext.Provider>
        </ThemeProvider>
      </AccessibilityContext.Provider>
    </ThemeContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('ServiceWorker registered:', registration.scope))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
} 