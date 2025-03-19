import React, { useContext } from 'react';
import { ThemeContext } from '../main';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggle = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const isDarkMode = themeMode === 'dark';

  const handleToggle = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex justify-center mb-4">
      <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        <IconButton
          onClick={handleToggle}
          className="hologram-button"
          aria-label="Toggle theme"
          sx={{ color: '#fff' }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle; 