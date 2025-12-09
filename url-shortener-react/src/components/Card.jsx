import React from 'react';
import { motion } from 'framer-motion';

// MUI Imports
import {
  Card as MuiCard,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components ---

const StyledCard = styled(MuiCard)(({ theme, customColor }) => ({
  // Core Material You / ChatGPT styling
  borderRadius: '16px', // Large, noticeable rounding
  padding: theme.spacing(2), // Internal padding for CardContent
  transition: 'all 250ms ease-in-out',
  
  // Soft, elevated shadow (ChatGPT/Google Material You style)
  boxShadow: theme.shadows[4], 
  backgroundColor: theme.palette.background.paper, 
  
  // Optional Hover Effect for interactivity
  '&:hover': {
    boxShadow: theme.shadows[8], // Lifted shadow
    transform: 'translateY(-2px)',
  },

  // Custom accent color application (optional, for decorative icons/borders)
  ...(customColor && {
    borderLeft: `5px solid ${customColor}`,
  }),
}));

const IconWrapper = styled(Box)(({ theme, customColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  // Use a very light, desaturated color for the background, like Material You chips
  backgroundColor: customColor ? customColor + '1A' : theme.palette.grey[50], 
  color: customColor || theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '28px',
  },
}));

// --- Main Component ---

/**
 * Modern, responsive Card component with Material You/ChatGPT aesthetics.
 * @param {string} title - The card title.
 * @param {string} desc - The card description or body text.
 * @param {React.ReactNode} icon - A react-icon element.
 * @param {string} accentColor - Optional color for icon/border accent (e.g., theme.palette.primary.main).
 * @param {string} className - Optional className for custom styles.
 */
const Card = ({ title, desc, icon, accentColor, className }) => {
  const theme = useTheme();

  // Framer Motion variants for subtle fade-up animation on view
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        type: 'spring',
        stiffness: 100 
      }
    },
  };
  
  // Fallback accent color if none is provided
  const cardAccentColor = accentColor || theme.palette.primary.main;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className={className} // Allows Grid or other wrappers to apply layout styles
    >
      <StyledCard customColor={cardAccentColor}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          {/* Icon Section */}
          {icon && (
            <IconWrapper customColor={cardAccentColor}>
              {icon}
            </IconWrapper>
          )}

          {/* Title */}
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            color="text.primary"
            gutterBottom
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ lineHeight: 1.5 }}
          >
            {desc}
          </Typography>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default Card;