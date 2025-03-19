// src/main.jsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

export const ThemeContext = React.createContext();
export const AccessibilityContext = React.createContext();
export const AIContext = React.createContext();
export const AuthContext = React.createContext();

const Main = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (username, password) => {
    if (password === 'pass' && (username === 'user' || username.includes('@'))) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const enableVoiceControl = () => console.log('Voice control enabled');
  const aiStatus = { loading: false, initialized: true, error: null };

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
        <AccessibilityContext.Provider value={{ enableVoiceControl }}>
          <AIContext.Provider value={{ status: aiStatus }}>
            <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
              <App />
            </AuthContext.Provider>
          </AIContext.Provider>
        </AccessibilityContext.Provider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<Main />); 