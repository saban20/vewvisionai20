import React from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  IconButton,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StyleIcon from '@mui/icons-material/Style';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { theme } from '../../theme';

const ProductFilters = ({ filters, onChange, darkMode, toggleDarkMode }) => {
  // Style preferences
  const styleOptions = {
    'modern': 'Modern',
    'classic': 'Classic',
    'sporty': 'Sporty',
    'luxury': 'Luxury',
    'minimalist': 'Minimalist'
  };

  // Color preferences
  const colorOptions = {
    'black': 'Black',
    'tortoise': 'Tortoise',
    'clear': 'Clear',
    'gold': 'Gold',
    'silver': 'Silver',
    'colorful': 'Colorful'
  };

  // Frame shapes
  const frameShapes = {
    'round': 'Round',
    'square': 'Square',
    'rectangular': 'Rectangular',
    'cat-eye': 'Cat-Eye',
    'aviator': 'Aviator',
    'oval': 'Oval'
  };

  // Use theme colors based on darkMode
  const colors = theme.getModeColors(darkMode);

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    onChange({ 
      minPrice: newValue[0],
      maxPrice: newValue[1]
    });
  };

  // Handle brand change
  const handleBrandChange = (event) => {
    onChange({ brand: event.target.value });
  };

  // Handle frame shape change
  const handleFrameShapeChange = (event) => {
    onChange({ frameShape: event.target.value });
  };

  return (
    <Box>
      {/* Dark mode toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: theme.spacing.md }}>
        <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Brand filter */}
      <Paper elevation={darkMode ? 2 : 0} sx={{ 
        p: theme.spacing.md, 
        mb: theme.spacing.lg, 
        backgroundColor: darkMode ? theme.colors.cardDark : theme.components.filter.light.bg,
        color: darkMode ? theme.colors.darkText : 'inherit'
      }}>
        <Typography variant="subtitle1" sx={{ mb: theme.spacing.md, fontWeight: theme.typography.fontWeights.semiBold }}>
          Brand
        </Typography>
        <FormControl fullWidth variant="outlined" size="small">
          <Select
            value={filters.brand}
            onChange={handleBrandChange}
            displayEmpty
            sx={{
              backgroundColor: darkMode ? theme.colors.darkOverlay : 'white',
              color: darkMode ? theme.colors.darkText : 'inherit'
            }}
          >
            <MenuItem value="">All Brands</MenuItem>
            <MenuItem value="NewVision">NewVision</MenuItem>
            <MenuItem value="OpticLux">OpticLux</MenuItem>
            <MenuItem value="SkyView">SkyView</MenuItem>
            <MenuItem value="PureFrame">PureFrame</MenuItem>
            <MenuItem value="ChicVision">ChicVision</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Frame Shape filter */}
      <Paper elevation={darkMode ? 2 : 0} sx={{ 
        p: theme.spacing.md, 
        mb: theme.spacing.lg, 
        backgroundColor: darkMode ? theme.colors.cardDark : theme.components.filter.light.bg,
        color: darkMode ? theme.colors.darkText : 'inherit'
      }}>
        <Typography variant="subtitle1" sx={{ mb: theme.spacing.md, fontWeight: theme.typography.fontWeights.semiBold }}>
          <StyleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Frame Shape
        </Typography>
        <FormControl fullWidth variant="outlined" size="small">
          <Select
            value={filters.frameShape}
            onChange={handleFrameShapeChange}
            displayEmpty
            sx={{
              backgroundColor: darkMode ? theme.colors.darkOverlay : 'white',
              color: darkMode ? theme.colors.darkText : 'inherit'
            }}
          >
            <MenuItem value="">All Shapes</MenuItem>
            {Object.entries(frameShapes).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Price Range filter */}
      <Paper elevation={darkMode ? 2 : 0} sx={{ 
        p: theme.spacing.md, 
        mb: theme.spacing.lg,
        backgroundColor: darkMode ? theme.colors.cardDark : theme.components.filter.light.bg,
        color: darkMode ? theme.colors.darkText : 'inherit'
      }}>
        <Typography variant="subtitle1" sx={{ mb: theme.spacing.md, fontWeight: theme.typography.fontWeights.semiBold }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Price Range (${filters.minPrice} - ${filters.maxPrice})
        </Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{
            color: theme.colors.primary,
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              backgroundColor: darkMode ? theme.colors.cardDark : '#fff',
              border: `2px solid ${theme.colors.primary}`,
            },
            '& .MuiSlider-rail': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : '#d2d2d7',
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default ProductFilters; 