import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Component Imports (for consistency)
import Loader from './Loader';

// --- Styled Components ---

const ErrorCard = styled(motion(Paper))(({ theme }) => ({
  // Material You / ChatGPT Card Style
  padding: theme.spacing(6, 4),
  borderRadius: '24px', // Large rounding
  boxShadow: theme.shadows[10], // Strong, soft elevation
  maxWidth: 450,
  width: '100%',
  textAlign: 'center',
  borderTop: `6px solid ${theme.palette.error.main}`, // Red accent line
}));

// Primary CTA Button (Google Blue for recovery)
const PrimaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[4],
  transition: 'all 250ms ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8],
    transform: 'translateY(-1px)',
  },
}));

// --- Framer Motion Variants ---
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    } 
  },
};

// --- Main Component ---

/**
 * Universal Error Page with Material You Aesthetics.
 * @param {string} message - Optional error message to display.
 * @param {string} homePath - Path to navigate back to (defaults to '/').
 */
const ErrorPage = ({ message, homePath = "/" }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Determine the default message
  const defaultMessage = "An unexpected error has occurred. Please try navigating home.";

  const handleNavigateHome = () => {
    navigate(homePath);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.grey[50],
        p: { xs: 2, sm: 4 },
      }}
    >
      <ErrorCard
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Stack alignItems="center" spacing={2}>
          {/* Danger Icon with Error Color */}
          <FaExclamationTriangle 
            size={60} 
            color={theme.palette.error.main} 
          />
          
          {/* Main Title */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={{ mt: 2, letterSpacing: '-0.5px' }}
          >
            Oops! Error Encountered
          </Typography>

          {/* Error Message */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 2, px: { xs: 0, sm: 2 } }}
          >
            {message ? message : defaultMessage}
          </Typography>

          {/* Recovery Action Button (Primary Blue) */}
          <PrimaryCtaButton
            onClick={handleNavigateHome}
            variant='contained'
            startIcon={<FaHome />}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go Back to Home
          </PrimaryCtaButton>
          
          {/* Optional: Secondary Action (e.g., Reload) */}
          <Button
            onClick={() => window.location.reload()}
            sx={{ color: theme.palette.text.secondary, textTransform: 'none', mt: 1 }}
          >
            Or, try reloading the page
          </Button>
        </Stack>
      </ErrorCard>
    </Box>
  );
};

export default ErrorPage;