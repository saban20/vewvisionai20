import React, { useContext, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Divider, 
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Chip,
  Slider,
  Radio,
  RadioGroup,
  ButtonGroup,
  Button
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccessibilityNew as AccessibilityIcon,
  Close as CloseIcon,
  TextFields as TextFieldsIcon,
  FormatSize as FontSizeIcon,
  Contrast as ContrastIcon,
  Animation as NoMotionIcon,
  VolumeUp as VolumeUpIcon,
  Keyboard as KeyboardIcon,
  Mouse as MouseIcon,
  TouchApp as TouchIcon,
  ArrowUpward as FocusIcon,
  Colorize as ColorizeIcon,
  FormatLineSpacing as LineSpacingIcon
} from '@mui/icons-material';
import { AccessibilityContext, ThemeContext } from '../index';

/**
 * Accessibility settings panel component that allows users to customize their experience
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the panel is open
 * @param {function} props.onClose - Function to call when panel is closed
 */
const AccessibilityPanel = ({ open, onClose }) => {
  // Access theme and accessibility contexts
  const { 
    voiceAssist, setVoiceAssist,
    reduceMotion, setReduceMotion,
    highContrast, setHighContrast,
    largeText, setLargeText,
    // New accessibility settings
    lineSpacing, setLineSpacing,
    focusIndicator, setFocusIndicator,
    keyboardShortcuts, setKeyboardShortcuts,
    textSpacing, setTextSpacing,
    colorFilters, setColorFilters
  } = useContext(AccessibilityContext);
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  // Announce accessibility panel to screen readers when opened
  useEffect(() => {
    if (open && voiceAssist) {
      const message = 'Accessibility settings panel opened. Use tab to navigate through options.';
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }, [open, voiceAssist]);

  // Handle keyboard shortcuts for panel navigation and control
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e) => {
      // Close panel on Escape
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Keyboard shortcuts for quick settings if enabled
      if (keyboardShortcuts) {
        // Alt + D toggles dark mode
        if (e.altKey && e.key === 'd') {
          handleThemeToggle();
          e.preventDefault();
        }
        // Alt + C toggles contrast
        if (e.altKey && e.key === 'c') {
          setHighContrast(!highContrast);
          e.preventDefault();
        }
        // Alt + T toggles text size
        if (e.altKey && e.key === 't') {
          setLargeText(!largeText);
          e.preventDefault();
        }
        // Alt + M toggles motion
        if (e.altKey && e.key === 'm') {
          setReduceMotion(!reduceMotion);
          e.preventDefault();
        }
        // Alt + V toggles voice assistance
        if (e.altKey && e.key === 'v') {
          setVoiceAssist(!voiceAssist);
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, themeMode, highContrast, largeText, reduceMotion, voiceAssist, keyboardShortcuts]);

  // Handlers for settings changes
  const handleThemeToggle = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    // Announce the change if voice assist is enabled
    if (voiceAssist) {
      const message = `Theme switched to ${newMode} mode`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const announceChange = (setting, value) => {
    if (voiceAssist) {
      const message = `${setting} ${value ? 'enabled' : 'disabled'}`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLineSpacingChange = (event, newValue) => {
    setLineSpacing(newValue);
    if (voiceAssist) {
      const message = `Line spacing set to ${newValue === 1 ? 'normal' : newValue === 1.5 ? 'medium' : 'large'}`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFocusIndicatorChange = (event) => {
    setFocusIndicator(event.target.value);
    if (voiceAssist) {
      const message = `Focus indicator set to ${event.target.value}`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleColorFilterChange = (filter) => {
    setColorFilters(filter);
    if (voiceAssist) {
      const message = `Color filter set to ${filter === 'none' ? 'none' : filter}`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  // If panel is not open, don't render anything
  if (!open) return null;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: { xs: '100%', sm: 380 },
        zIndex: (theme) => theme.zIndex.drawer + 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={5}
        sx={{
          height: '100%',
          borderRadius: { xs: 0, sm: '12px 0 0 12px' },
          px: 3,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessibilityIcon color="primary" sx={{ mr: 1 }} aria-hidden="true" />
            <Typography variant="h5" component="h2" id="accessibility-title">Accessibility</Typography>
          </Box>
          <Tooltip title="Close panel (Esc)">
            <IconButton 
              onClick={onClose} 
              aria-label="Close accessibility panel"
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3 }} />
        
        {/* Display Mode */}
        <List
          subheader={
            <ListSubheader component="div" id="display-settings-header" sx={{ px: 0 }}>
              Display
            </ListSubheader>
          }
          dense
          sx={{ mb: 2 }}
        >
          <ListItem 
            secondaryAction={
              <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode (Alt+D)`}>
                <IconButton onClick={handleThemeToggle} color="primary" aria-label={`Toggle dark/light mode. Currently ${themeMode} mode.`}>
                  {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemIcon>
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText 
              primary="Theme Mode" 
              secondary={`Currently: ${themeMode === 'dark' ? 'Dark' : 'Light'}`}
            />
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={largeText} 
                  onChange={() => {
                    setLargeText(!largeText);
                    announceChange('Large text', !largeText);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle larger text' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FontSizeIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>Larger Text (Alt+T)</Typography>
                </Box>
              }
            />
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={highContrast} 
                  onChange={() => {
                    setHighContrast(!highContrast);
                    announceChange('High contrast', !highContrast);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle high contrast' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ContrastIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>High Contrast (Alt+C)</Typography>
                </Box>
              }
            />
          </ListItem>
          
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LineSpacingIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                <Typography id="line-spacing-slider">Line Spacing</Typography>
              </Box>
              <Slider
                aria-labelledby="line-spacing-slider"
                value={lineSpacing}
                onChange={handleLineSpacingChange}
                step={0.25}
                marks={[
                  { value: 1, label: 'Normal' },
                  { value: 1.5, label: 'Medium' },
                  { value: 2, label: 'Large' },
                ]}
                min={1}
                max={2}
                valueLabelDisplay="off"
              />
            </Box>
          </ListItem>
          
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ColorizeIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                <Typography>Color Filters</Typography>
              </Box>
              <ButtonGroup variant="outlined" aria-label="color filter options" fullWidth>
                <Button
                  onClick={() => handleColorFilterChange('none')}
                  variant={colorFilters === 'none' ? 'contained' : 'outlined'}
                >
                  None
                </Button>
                <Button
                  onClick={() => handleColorFilterChange('protanopia')}
                  variant={colorFilters === 'protanopia' ? 'contained' : 'outlined'}
                >
                  Red-blind
                </Button>
                <Button
                  onClick={() => handleColorFilterChange('deuteranopia')}
                  variant={colorFilters === 'deuteranopia' ? 'contained' : 'outlined'}
                >
                  Green-blind
                </Button>
              </ButtonGroup>
            </Box>
          </ListItem>
        </List>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Motion & Interaction */}
        <List
          subheader={
            <ListSubheader component="div" id="interaction-settings-header" sx={{ px: 0 }}>
              Motion & Interaction
            </ListSubheader>
          }
          dense
          sx={{ mb: 2 }}
        >
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={reduceMotion} 
                  onChange={() => {
                    setReduceMotion(!reduceMotion);
                    announceChange('Reduce motion', !reduceMotion);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle reduce motion' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NoMotionIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>Reduce Motion (Alt+M)</Typography>
                </Box>
              }
            />
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={voiceAssist} 
                  onChange={() => {
                    setVoiceAssist(!voiceAssist);
                    // Don't announce this one as it may be confusing
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle voice assistance' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VolumeUpIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>Voice Assistance (Alt+V)</Typography>
                </Box>
              }
            />
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={keyboardShortcuts} 
                  onChange={() => {
                    setKeyboardShortcuts(!keyboardShortcuts);
                    announceChange('Keyboard shortcuts', !keyboardShortcuts);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle keyboard shortcuts' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyboardIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>Keyboard Shortcuts</Typography>
                </Box>
              }
            />
          </ListItem>
          
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FocusIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                <Typography id="focus-indicator-group-label">Focus Indicator</Typography>
              </Box>
              <RadioGroup
                aria-labelledby="focus-indicator-group-label"
                value={focusIndicator}
                onChange={handleFocusIndicatorChange}
                row
              >
                <FormControlLabel value="default" control={<Radio />} label="Default" />
                <FormControlLabel value="enhanced" control={<Radio />} label="Enhanced" />
                <FormControlLabel value="high" control={<Radio />} label="High Visibility" />
              </RadioGroup>
            </Box>
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={textSpacing} 
                  onChange={() => {
                    setTextSpacing(!textSpacing);
                    announceChange('Increased text spacing', !textSpacing);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'Toggle increased text spacing' }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextFieldsIcon sx={{ mr: 1, fontSize: '1.2rem' }} aria-hidden="true" />
                  <Typography>Increased Text Spacing</Typography>
                </Box>
              }
            />
          </ListItem>
        </List>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Keyboard shortcuts reference */}
        {keyboardShortcuts && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Keyboard Shortcuts</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip size="small" label="Alt+D: Toggle theme" icon={<DarkModeIcon fontSize="small" />} />
              <Chip size="small" label="Alt+C: High contrast" icon={<ContrastIcon fontSize="small" />} />
              <Chip size="small" label="Alt+T: Larger text" icon={<FontSizeIcon fontSize="small" />} />
              <Chip size="small" label="Alt+M: Reduce motion" icon={<NoMotionIcon fontSize="small" />} />
              <Chip size="small" label="Alt+V: Voice assist" icon={<VolumeUpIcon fontSize="small" />} />
              <Chip size="small" label="Esc: Close panel" icon={<CloseIcon fontSize="small" />} />
            </Box>
          </Box>
        )}
        
        {/* Information section */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            These settings help make the application more accessible for different needs.
            Your preferences will be saved for future visits.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={onClose}>Close</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccessibilityPanel; 