import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';

// MUI Imports
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Divider,
  useTheme,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components ---

const FooterWrapper = styled(Box)(({ theme }) => ({
  // Clean, minimal light background (like a subtle card)
  backgroundColor: theme.palette.background.paper, 
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(6, 0, 4, 0), // Generous padding for breathing room
  marginTop: theme.spacing(4), // Separates it from page content
}));

// Social Icon with hover effect
const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'all 250ms ease-in-out',
  borderRadius: '10px', // Soft rounded corners
  '&:hover': {
    color: theme.palette.primary.main, // Material You primary blue on hover
    backgroundColor: theme.palette.primary.light + '20', // Light accent background
    transform: 'translateY(-2px)',
  },
}));

// --- Main Component ---

const Footer = () => {
  const theme = useTheme();

  // Framer Motion variants for subtle fade-up
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  // Social Media Data (using FaFacebookF, etc., for cleaner look)
  const socialLinks = [
    { icon: FaFacebookF, url: '#', label: 'Facebook' },
    { icon: FaTwitter, url: '#', label: 'Twitter' },
    { icon: FaInstagram, url: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={footerVariants}
    >
      <FooterWrapper component="footer">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* 1. Logo / Name */}
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: theme.palette.primary.main,
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-1px',
                }}
                gutterBottom
              >
                Shortify
                <Box component="span" sx={{ color: theme.palette.secondary.main }}>X</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simplifying URL shortening for efficient sharing and tracking.
              </Typography>
            </Grid>

            {/* 2. Navigation Links (Placeholder for structure) */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack
                direction="row"
                spacing={{ xs: 2, sm: 4 }}
                divider={<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}
              >
                {/* Router Links should replace these text links */}
                <Typography variant="body2" component="a" href="/about" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  About
                </Typography>
                <Typography variant="body2" component="a" href="/contact" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Contact
                </Typography>
                <Typography variant="body2" component="a" href="/privacy" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Privacy
                </Typography>
              </Stack>
            </Grid>

            {/* 3. Social Icons */}
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                {socialLinks.map((item) => (
                  <SocialIconButton
                    key={item.label}
                    href={item.url}
                    aria-label={item.label}
                    size="large"
                  >
                    <item.icon size={20} />
                  </SocialIconButton>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Copyright and Bottom Divider */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              &copy; 2025 ShortifyX. All rights reserved. Built with love using React & MUI.
            </Typography>
          </Box>
        </Container>
      </FooterWrapper>
    </motion.div>
  );
};

export default Footer;