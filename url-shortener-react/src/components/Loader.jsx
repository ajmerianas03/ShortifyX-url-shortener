import React from 'react';

// MUI Imports
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Component (Optional, for full-page centered loader) ---

const FullPageLoaderWrapper = styled(Box)(({ theme }) => ({
  // Center the content both vertically and horizontally
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  // Default height large enough for main content areas
  minHeight: '40vh', 
  // Fluid padding for responsiveness
  padding: theme.spacing(4),
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// --- Main Component ---

/**
 * Modern, Material You inspired Loader component.
 * @param {boolean} fullPage - If true, renders a large, centered loader for main content.
 * @param {number} size - Size of the spinner (in px).
 * @param {string} message - Optional message to display below the spinner.
 */
const Loader = ({ fullPage = true, size = 65, message }) => {
  const theme = useTheme();
  
  // Choose the component wrapper based on the fullPage prop
  const WrapperComponent = fullPage ? FullPageLoaderWrapper : Box;

  // Use the Primary Google Blue for the spinner color
  const loaderColor = theme.palette.primary.main;
  
  // Render based on the WrapperComponent
  return (
    <WrapperComponent>
      <CircularProgress
        size={size}
        // Use the primary color from the MUI theme
        sx={{ color: loaderColor }} 
        // Use 'indeterminate' for a continuous, general loading state
        thickness={4} 
        aria-label="Content loading"
      />
      
      {/* Optional Loading Message */}
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          fontWeight={500}
        >
          {message}
        </Typography>
      )}
    </WrapperComponent>
  );
};

export default Loader;