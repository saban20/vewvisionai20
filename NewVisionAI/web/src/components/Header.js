import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Badge,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  ShoppingCart as ShoppingCartIcon,
  AccessibilityNew as AccessibilityIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  FaceRetouchingNatural as FaceIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { ThemeContext, AccessibilityContext } from '../index';
import { logout } from '../utils/auth';
import AccessibilityPanel from './AccessibilityPanel';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

/**
 * Main application header with navigation and user controls
 */
const Header = ({ isAuthenticated, setIsAuthenticated, showNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const { reduceMotion } = useContext(AccessibilityContext);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };
  
  // Handle drawer toggle
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Handle user menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle user menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle notifications menu
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Handle user logout
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    handleMenuClose();
    showNotification('Successfully logged out', 'success');
    navigate('/');
  };
  
  // Navigation list used in both toolbar and drawer
  const navigationItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', auth: true },
    { text: 'Face Scanner', icon: <FaceIcon />, path: '/face-scanner', auth: true },
    { text: 'Shop', icon: <ShoppingCartIcon />, path: '/shop', auth: true },
  ];
  
  // Inside Navigation Drawer
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          NewVision AI
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography variant="body2">Welcome, User</Typography>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          (!item.auth || (item.auth && isAuthenticated)) && (
            <ListItem 
              button 
              component={RouterLink} 
              to={item.path} 
              key={item.text}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
      
      <Divider />
      
      <List>
        {isAuthenticated ? (
          <>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login">
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
        <ListItem button onClick={() => setAccessibilityPanelOpen(true)}>
          <ListItemIcon><AccessibilityIcon /></ListItemIcon>
          <ListItemText primary="Accessibility" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{
          transition: reduceMotion ? 'none' : 'all 0.3s',
        }}
      >
        <Toolbar>
          {/* Menu icon for mobile */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
              fontWeight: 'bold',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NewVision AI
          </Typography>
          
          {/* Nav links - desktop only */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {navigationItems.map((item) => (
                (!item.auth || (item.auth && isAuthenticated)) && (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>
          )}
          
          {/* Search */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          {/* Action buttons */}
          <Box sx={{ display: 'flex' }}>
            {/* Theme toggle */}
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton color="inherit" onClick={handleThemeToggle} aria-label="toggle theme">
                {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Accessibility panel toggle */}
            <Tooltip title="Accessibility options">
              <IconButton 
                color="inherit" 
                onClick={() => setAccessibilityPanelOpen(true)}
                aria-label="accessibility options"
              >
                <AccessibilityIcon />
              </IconButton>
            </Tooltip>
            
            {/* Notifications - for authenticated users */}
            {isAuthenticated && (
              <>
                <Tooltip title="Notifications">
                  <IconButton 
                    color="inherit" 
                    onClick={handleNotificationsOpen}
                    aria-label="notifications"
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                
                <Menu
                  anchorEl={notificationsAnchorEl}
                  open={Boolean(notificationsAnchorEl)}
                  onClose={handleNotificationsClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleNotificationsClose}>
                    <Typography variant="body2">
                      Your prescription was updated
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <Typography variant="body2">
                      New eyewear recommendations available
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <Typography variant="body2">
                      Account verification complete
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleNotificationsClose}>
                    <Typography variant="body2" color="primary">
                      See all notifications
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
            
            {/* User menu - for authenticated users */}
            {isAuthenticated ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    aria-label="account settings"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      navigate('/profile');
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      navigate('/settings');
                    }}
                  >
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Login/Register buttons for non-authenticated users
              !isMobile && (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={RouterLink} 
                    to="/register"
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </>
              )
            )}
            
            {/* Help button */}
            <Tooltip title="Help">
              <IconButton 
                color="inherit"
                aria-label="help"
                sx={{ ml: 1 }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile navigation drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
      {/* Accessibility panel */}
      <AccessibilityPanel 
        open={accessibilityPanelOpen} 
        onClose={() => setAccessibilityPanelOpen(false)}
      />
    </>
  );
};

export default Header; 