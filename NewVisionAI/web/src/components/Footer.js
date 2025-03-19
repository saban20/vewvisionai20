import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  MailOutline as MailIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

/**
 * Application footer with links, social media, and legal information
 */
const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Footer sections with links
  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Product',
      links: [
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Use Cases', path: '/use-cases' },
        { name: 'Resources', path: '/resources' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Data Security', path: '/security' },
        { name: 'Accessibility', path: '/accessibility' },
      ],
    },
  ];
  
  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              NewVision AI
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Precision eyewear measurement and recommendations powered by AR and AI.
            </Typography>
            
            {/* Social Media Links */}
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
          
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <Grid item xs={6} sm={4} md={3} key={section.title}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Bottom Footer */}
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} NewVision AI. All rights reserved.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  English
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MailIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Link
                  href="mailto:info@newvision-ai.com"
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  info@newvision-ai.com
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 