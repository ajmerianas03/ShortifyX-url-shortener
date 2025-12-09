import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLink, FiBarChart, FiShield, FiZap } from 'react-icons/fi';

// MUI Imports
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Component Imports
import Card from './Card'; // Ensure Card.jsx is updated as previously designed

// --- Data ---
const cardsData = [
  {
    title: "Simple Shortening",
    desc: "Create short, memorable URLs quickly and easily with our intuitive, clutter-free interface.",
    icon: <FiLink />,
    color: '#1A73E8', // Primary Blue
  },
  {
    title: "Powerful Analytics",
    desc: "Track clicks, geographical data, and referral sources to optimize your marketing strategies.",
    icon: <FiBarChart />,
    color: '#34A853', // Secondary Green
  },
  {
    title: "Enhanced Security",
    desc: "All links are protected with advanced encryption and fraud detection, keeping your data safe.",
    icon: <FiShield />,
    color: '#FBBC04', // Accent Yellow
  },
  {
    title: "Lightning Fast",
    desc: "Experience lightning-fast redirects with guaranteed high uptime for a seamless user experience.",
    icon: <FiZap />,
    color: '#EA4335', // Danger Red (used for speed/attention)
  },
];

// --- Styled Components ---

// Primary CTA Button (Google Blue)
const PrimaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
  transition: 'all 250ms ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
}));

// Secondary CTA Button (Light Border/Text)
const SecondaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  border: `2px solid ${theme.palette.grey[300]}`,
  transition: 'all 250ms ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}));


// --- Framer Motion Variants ---

// Global slide-up animation for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.4, 0.0, 0.2, 1] // Material Design standard easing
    } 
  },
};

// --- Main Component ---

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        
        {/* ======================= 1. Hero Section ======================= */}
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
          
          {/* A. Hero Text and CTA */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial="hidden"
              animate="visible" // Use 'animate' on the main page hero
              variants={sectionVariants}
            >
              <Typography
                variant={isMobile ? "h4" : "h2"}
                component="h1"
                fontWeight={700}
                sx={{
                  color: 'text.primary',
                  lineHeight: { xs: 1.2, md: 1.15 },
                  mb: 3,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                ShortifyX: <Box component="span" sx={{ color: theme.palette.primary.main }}>Simplify</Box> URL Shortening for Efficient Sharing.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                ShortifyX streamlines the process of URL shortening, making sharing links effortless and efficient. Generate concise, easy-to-share, and trackable URLs in seconds.
              </Typography>

              {/* CTA Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 5 }} justifyContent={isMobile ? 'center' : 'flex-start'}>
                <PrimaryCtaButton
                  onClick={handleNavigate('/shorten')} // Navigate to a page for anonymous short link creation
                  variant="contained"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Short Link
                </PrimaryCtaButton>
                <SecondaryCtaButton
                  onClick={handleNavigate('/login')}
                  variant="outlined"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Manage Links
                </SecondaryCtaButton>
              </Stack>
            </motion.div>
          </Grid>

          
        </Grid>
        
        <Box sx={{ my: { xs: 8, md: 12 } }}>
          {/* ======================= 2. Features/Trusted Section ======================= */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <Typography
              variant="h5"
              component="p"
              fontWeight={600}
              color="text.secondary"
              align="center"
              gutterBottom
              sx={{ mb: 1, color: theme.palette.accent }} // Use a subtle accent color
            >
              Built for speed and reliability.
            </Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h2"
              fontWeight={700}
              align="center"
              sx={{
                color: 'text.primary',
                mb: { xs: 6, md: 8 },
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              Trusted by professionals for features that drive success.
            </Typography>

            {/* Feature Cards Grid */}
            <Grid container spacing={4}>
              {cardsData.map((card, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    title={card.title}
                    desc={card.desc}
                    icon={card.icon}
                    accentColor={card.color} // Apply dynamic colors based on data
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;