import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../../../NewVisionAI/web/src/index';

const ThemeToggle = ({ size = 'medium' }) => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  
  const handleToggle = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };
  
  return (
    <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton 
        onClick={handleToggle} 
        color="inherit" 
        size={size}
        aria-label={`Toggle ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 