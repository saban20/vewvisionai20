// index.js
import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { SocketProvider } from './context/SocketContext';
import * as tf from '@tensorflow/tfjs';
import AIEyewearEngine from './utils/AIEyewearEngine';

// Contexts
export const ThemeContext = createContext({ themeMode: 'light', setThemeMode: () => {} });
export const AccessibilityContext = createContext({ /* ... */ });
export const AIContext = createContext(null);

const preloadAIModels = async () => {
  try {
    await tf.ready();
    const aiEngine = new AIEyewearEngine(null, null);
    await aiEngine.initialize();
    return { initialized: true, error: null };
  } catch (error) {
    return { initialized: false, error: error.message };
  }
};

const AccessibilityProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const toggleThemeMode = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const [aiStatus, setAiStatus] = useState({ initialized: false, loading: true, error: null });
  // ... other accessibility states ...

  useEffect(() => {
    preloadAIModels().then(status => setAiStatus({ ...status, loading: false }));
  }, []);

  const theme = useMemo(() => createTheme({ /* ... */ }), [themeMode, /* dependencies */]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: toggleThemeMode }}>
      <AccessibilityContext.Provider value={{ /* accessibility values */ }}>
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

// ... FaceCalibration and FaceScanner3D with fixes applied ...

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

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('ServiceWorker registered:', reg.scope))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}