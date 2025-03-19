import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Slider,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Snackbar,
  Menu,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FaceRetouchingNatural as FaceIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

const ComponentDemo = () => {
  // State for interactive components
  const [tabValue, setTabValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchState, setSwitchState] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState('option1');
  const [checkboxState, setCheckboxState] = useState({
    option1: true,
    option2: false,
    option3: false,
  });
  const [dropdownValue, setDropdownValue] = useState('');

  // Component Demo Sections
  const sections = [
    { id: 'typography', label: 'Typography' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'layout', label: 'Layout Components' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'dataDisplay', label: 'Data Display' },
  ];

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSwitchChange = (event) => {
    setSwitchState(event.target.checked);
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Component Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page showcases UI components used throughout the NewVisionAI application.
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4 }}
      >
        {sections.map((section) => (
          <Tab key={section.id} label={section.label} id={`tab-${section.id}`} />
        ))}
      </Tabs>

      {/* Typography Section */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Typography
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h1" gutterBottom>h1. Heading</Typography>
          <Typography variant="h2" gutterBottom>h2. Heading</Typography>
          <Typography variant="h3" gutterBottom>h3. Heading</Typography>
          <Typography variant="h4" gutterBottom>h4. Heading</Typography>
          <Typography variant="h5" gutterBottom>h5. Heading</Typography>
          <Typography variant="h6" gutterBottom>h6. Heading</Typography>
          <Typography variant="subtitle1" gutterBottom>
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
            dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" gutterBottom>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
            dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            button text
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            caption text
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            overline text
          </Typography>
        </Paper>
      )}

      {/* Buttons Section */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Buttons
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Standard Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained">Primary</Button>
              <Button variant="contained" color="secondary">Secondary</Button>
              <Button variant="contained" color="success">Success</Button>
              <Button variant="contained" color="error">Error</Button>
              <Button variant="contained" color="info">Info</Button>
              <Button variant="contained" color="warning">Warning</Button>
              <Button variant="contained" disabled>Disabled</Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Outlined Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined">Primary</Button>
              <Button variant="outlined" color="secondary">Secondary</Button>
              <Button variant="outlined" color="success">Success</Button>
              <Button variant="outlined" color="error">Error</Button>
              <Button variant="outlined" color="info">Info</Button>
              <Button variant="outlined" color="warning">Warning</Button>
              <Button variant="outlined" disabled>Disabled</Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Text Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="text">Primary</Button>
              <Button variant="text" color="secondary">Secondary</Button>
              <Button variant="text" color="success">Success</Button>
              <Button variant="text" color="error">Error</Button>
              <Button variant="text" color="info">Info</Button>
              <Button variant="text" color="warning">Warning</Button>
              <Button variant="text" disabled>Disabled</Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Buttons with Icons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<FaceIcon />}>
                Start Icon
              </Button>
              <Button variant="contained" endIcon={<SettingsIcon />}>
                End Icon
              </Button>
              <Button variant="outlined" startIcon={<AddIcon />}>
                Add New
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
              <IconButton aria-label="settings">
                <SettingsIcon />
              </IconButton>
              <IconButton aria-label="favorite" color="error">
                <FavoriteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Cosmic Theme Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <button className="nebula-button">
                Nebula Button
              </button>
              <button className="nebula-button" style={{opacity: 0.8}}>
                Nebula Light
              </button>
              <button className="nebula-button" disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
                Nebula Disabled
              </button>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Button Sizes</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="contained" size="small">Small</Button>
              <Button variant="contained" size="medium">Medium</Button>
              <Button variant="contained" size="large">Large</Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Inputs Section */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Inputs
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Text Fields</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Standard" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Required" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Disabled" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  disabled 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Password" 
                  type="password" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Error" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  error 
                  helperText="Error message" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="With Helper Text" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  helperText="Helper text" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Multiline" 
                  multiline 
                  rows={4} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Selects</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="simple-select-label">Option</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    value={dropdownValue}
                    label="Option"
                    onChange={handleDropdownChange}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Checkboxes</Typography>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkboxState.option1} 
                  onChange={handleCheckboxChange} 
                  name="option1" 
                />
              }
              label="Option 1"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkboxState.option2} 
                  onChange={handleCheckboxChange} 
                  name="option2" 
                />
              }
              label="Option 2"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkboxState.option3} 
                  onChange={handleCheckboxChange} 
                  name="option3" 
                  color="secondary"
                />
              }
              label="Option 3 (Secondary Color)"
            />
            <FormControlLabel
              control={
                <Checkbox disabled />
              }
              label="Disabled"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Radio Buttons</Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Radio Group</FormLabel>
              <RadioGroup
                value={selectedValue}
                onChange={handleRadioChange}
              >
                <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
                <FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Switches</Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={switchState} 
                  onChange={handleSwitchChange} 
                />
              }
              label={switchState ? "On" : "Off"}
            />
            <FormControlLabel
              control={
                <Switch color="secondary" />
              }
              label="Secondary Color"
            />
            <FormControlLabel
              disabled
              control={
                <Switch />
              }
              label="Disabled"
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Slider</Typography>
            <Box sx={{ width: 300 }}>
              <Typography gutterBottom>Value: {sliderValue}</Typography>
              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
              <Slider
                disabled
                defaultValue={30}
                aria-label="Disabled slider"
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* Layout Components Section */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Layout Components
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Cards</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ minHeight: 200 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Standard Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basic example of a Material UI card with title and description.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <div className="glass-card">
                  <h3>Cosmic Glass Card</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '10px' }}>
                    A beautiful glass morphism card with cosmic theme styling and hover effects.
                  </p>
                  <div style={{ marginTop: '15px' }}>
                    <button className="nebula-button" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Explore</button>
                  </div>
                </div>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ minHeight: 200, bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Elevated Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      An elevated card with shadow and border-radius styling.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small" color="secondary">Share</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Paper</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body1">
                    Paper with elevation 1 (default)
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="body1">
                    Paper with elevation 3
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">
                    Outlined Paper
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Accordion</Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Accordion Item 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Accordion Item 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>Disabled Accordion</Typography>
              </AccordionSummary>
            </Accordion>
          </Box>
        </Paper>
      )}

      {/* Feedback Section */}
      {tabValue === 4 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Feedback
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Alerts</Typography>
            <Alert severity="error" sx={{ mb: 2 }}>This is an error alert — check it out!</Alert>
            <Alert severity="warning" sx={{ mb: 2 }}>This is a warning alert — check it out!</Alert>
            <Alert severity="info" sx={{ mb: 2 }}>This is an info alert — check it out!</Alert>
            <Alert severity="success" sx={{ mb: 2 }}>This is a success alert — check it out!</Alert>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Progress</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>Circular Progress</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CircularProgress />
                <CircularProgress color="secondary" />
                <CircularProgress color="success" />
                <CircularProgress color="error" />
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>Linear Progress</Typography>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress />
              </Box>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress color="secondary" />
              </Box>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress color="success" />
              </Box>
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={50} />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Snackbar</Typography>
            <Button variant="outlined" onClick={handleSnackbarOpen}>
              Show Snackbar
            </Button>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              message="This is a snackbar message"
              action={
                <Button color="secondary" size="small" onClick={handleSnackbarClose}>
                  CLOSE
                </Button>
              }
            />
          </Box>
        </Paper>
      )}

      {/* Navigation Section */}
      {tabValue === 5 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Navigation
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Tabs</Typography>
            <Box sx={{ width: '100%', mb: 2 }}>
              <Tabs value={0} aria-label="basic tabs example">
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
            </Box>

            <Box sx={{ width: '100%' }}>
              <Tabs value={0} variant="fullWidth" aria-label="full width tabs example">
                <Tab icon={<HomeIcon />} label="HOME" />
                <Tab icon={<PersonIcon />} label="PROFILE" />
                <Tab icon={<SettingsIcon />} label="SETTINGS" />
              </Tabs>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Menu</Typography>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              variant="outlined"
              endIcon={<MoreIcon />}
            >
              Open Menu
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Paper>
      )}

      {/* Data Display Section */}
      {tabValue === 6 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Data Display
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Avatars</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar>H</Avatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>N</Avatar>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>OP</Avatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Chips</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Basic" />
              <Chip label="Primary" color="primary" />
              <Chip label="Secondary" color="secondary" />
              <Chip label="Success" color="success" />
              <Chip label="Error" color="error" />
              <Chip label="Info" color="info" />
              <Chip label="Warning" color="warning" />
              <Chip label="With Icon" icon={<FaceIcon />} />
              <Chip 
                label="Deletable" 
                onDelete={() => {}} 
              />
              <Chip 
                avatar={<Avatar>M</Avatar>} 
                label="With Avatar" 
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Tooltips</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Basic Tooltip">
                <Button variant="outlined">Hover Me</Button>
              </Tooltip>
              <Tooltip title="Top Placement" placement="top">
                <Button variant="outlined">Top</Button>
              </Tooltip>
              <Tooltip title="Right Placement" placement="right">
                <Button variant="outlined">Right</Button>
              </Tooltip>
              <Tooltip title="Bottom Placement" placement="bottom">
                <Button variant="outlined">Bottom</Button>
              </Tooltip>
              <Tooltip title="Left Placement" placement="left">
                <Button variant="outlined">Left</Button>
              </Tooltip>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>Lists</Typography>
            <Paper elevation={0} variant="outlined" sx={{ maxWidth: 360 }}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="John Doe" secondary="Software Engineer" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Jane Smith" secondary="Product Designer" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <NotificationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" secondary="Enable push notifications" />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ComponentDemo; 