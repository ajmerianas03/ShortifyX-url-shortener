import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';

// MUI Imports
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Component Imports
// Assuming VITE_BACKEND_URL is the base URL for redirects (e.g., 'https://shortifyx.com')

// --- Styled Components ---

const RedirectWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50], // Light, clean background
  textAlign: 'center',
  padding: theme.spacing(4),
}));

// --- Framer Motion Variants ---
const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.5,
      when: "beforeChildren", // Load content before children animation
      staggerChildren: 0.2,
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// --- Main Component ---

const ShortenUrlPage = () => {
  const { url } = useParams();
  const theme = useTheme();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (url) {
      const fullRedirectUrl = import.meta.env.VITE_BACKEND_URL + `/${url}`;
      
      // Simulate a slight delay for animation visibility (UX enhancement)
      const redirectTimer = setTimeout(() => {
        setRedirecting(false); // Update state before redirect (optional, but good for feedback)
        window.location.href = fullRedirectUrl;
      }, 500); // 500ms delay

      // Cleanup on component unmount
      return () => clearTimeout(redirectTimer);
    }
  }, [url]);

  return (
    <RedirectWrapper
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      <Container maxWidth="sm">
        <motion.div variants={itemVariants}>
          <CircularProgress
            size={60}
            thickness={5}
            sx={{ 
              color: theme.palette.primary.main, 
              mb: 3,
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={600} 
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Redirecting Your Link...
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please wait while we securely send you to:
          </Typography>
        </motion.div>

        {url && (
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: theme.palette.background.paper, // Clean white card
                boxShadow: theme.shadows[2], // Subtle lift
                border: `1px solid ${theme.palette.grey[200]}`
              }}
            >
              <FiExternalLink size={20} style={{ marginRight: theme.spacing(1), color: theme.palette.secondary.main }} />
              <Typography 
                variant="subtitle1" 
                fontWeight={500}
                color="text.primary"
              >
                shortifyx.com/{url}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </RedirectWrapper>
  );
};

export default ShortenUrlPage;