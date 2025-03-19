import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Paper,
  Chip,
  Zoom,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import FaceIcon from '@mui/icons-material/Face';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ConfettiExplosion from 'react-confetti-explosion';

const RewardSystem = ({ open, onClose, darkMode, measurements }) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [isExploding, setIsExploding] = useState(false);

  // Determine badges based on measurements
  const badges = [
    {
      id: 'first_scan',
      title: 'First Scan',
      description: 'Completed your first face scan',
      icon: <LooksOneIcon fontSize="large" />,
      unlocked: true,
      points: 100,
    },
    {
      id: 'accurate',
      title: 'Precision Master',
      description: 'Achieved highly accurate measurements',
      icon: <FilterCenterFocusIcon fontSize="large" />,
      unlocked: measurements?.accuracy > 90,
      points: 150,
    },
    {
      id: 'complete',
      title: 'Complete Profile',
      description: 'All facial dimensions captured',
      icon: <FaceIcon fontSize="large" />,
      unlocked: measurements && Object.keys(measurements).length >= 7,
      points: 200,
    }
  ];

  // Calculate total points
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShowBadges(true);
      }, 500);

      setTimeout(() => {
        setShowConfetti(true);
        setIsExploding(true);
      }, 1200);

      // Calculate total points
      const points = badges
        .filter(badge => badge.unlocked)
        .reduce((total, badge) => total + badge.points, 0);
      
      setEarnedPoints(points);
    } else {
      setShowBadges(false);
      setShowConfetti(false);
    }
  }, [open, badges]);

  const Badge = ({ badge, index }) => (
    <Zoom in={showBadges} style={{ transitionDelay: `${index * 200}ms` }}>
      <Paper
        elevation={darkMode ? 3 : 1}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: '14px',
          backgroundColor: darkMode 
            ? (badge.unlocked ? 'rgba(76, 175, 80, 0.1)' : '#1e1e1e') 
            : (badge.unlocked ? 'rgba(76, 175, 80, 0.05)' : 'white'),
          color: darkMode ? '#f5f5f7' : 'inherit',
          border: badge.unlocked ? '1px solid' : 'none',
          borderColor: darkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)'
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: darkMode 
              ? (badge.unlocked ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.05)') 
              : (badge.unlocked ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.03)'),
            color: badge.unlocked ? '#4caf50' : (darkMode ? '#666' : '#bbb'),
            mb: 2
          }}
        >
          {badge.icon}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          {badge.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#a1a1a6' : '#86868b' }}>
          {badge.description}
        </Typography>
        {badge.unlocked ? (
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`+${badge.points} points`} 
            size="small"
            sx={{ 
              backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
              color: '#4caf50',
              fontWeight: 500
            }} 
          />
        ) : (
          <Chip 
            label="Locked" 
            size="small"
            sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? '#666' : '#999',
            }} 
          />
        )}
      </Paper>
    </Zoom>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px',
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          color: darkMode ? '#f5f5f7' : 'inherit',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEventsIcon sx={{ mr: 1, color: '#FFD700' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Rewards Unlocked!
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: darkMode ? '#a1a1a6' : '#86868b',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {showConfetti && (
          <Box sx={{ position: 'absolute', top: '20%', left: '50%' }}>
            {isExploding && (
              <ConfettiExplosion
                force={0.6}
                duration={2500}
                particleCount={100}
                width={1600}
              />
            )}
          </Box>
        )}

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Zoom in={showConfetti}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                Congratulations!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: darkMode ? '#a1a1a6' : '#86868b' }}>
                You've earned points and unlocked achievements by completing your face measurement.
              </Typography>
              <Chip 
                icon={<StarIcon />} 
                label={`${earnedPoints} Points Earned`} 
                sx={{ 
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  px: 3,
                  py: 2.5,
                  backgroundColor: darkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.3)',
                }}
              />
            </Box>
          </Zoom>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Badges Earned
          </Typography>
          <Grid container spacing={3}>
            {badges.map((badge, index) => (
              <Grid item xs={12} md={4} key={badge.id}>
                <Badge badge={badge} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={darkMode ? 2 : 1}
            sx={{
              p: 3,
              borderRadius: '14px',
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VerifiedUserIcon sx={{ mr: 1, color: '#0071e3' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Level Up Your Experience
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: darkMode ? '#a1a1a6' : '#86868b' }}>
              Continue using the face scanning features to earn more points and unlock additional rewards. 
              Your points can be used for exclusive discounts on premium eyewear frames!
            </Typography>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
            color: darkMode ? '#f5f5f7' : 'inherit',
            mr: 1,
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Close
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#0071e3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0058a3',
            },
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Continue to Products
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardSystem; 