import React from "react";
import { motion } from "framer-motion";
import { FiLink, FiShare2, FiEdit, FiBarChart2, FiUsers, FiSettings } from "react-icons/fi";

// MUI Imports
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from '@mui/material/styles';

// --- Feature Data (Updated Icons and Colors) ---
const featuresData = [
  {
    title: "Simple URL Shortening",
    desc: "Experience the ease of creating short, memorable URLs in just a few clicks. Our intuitive interface ensures quick setup without any hassle.",
    icon: FiLink,
    color: '#1A73E8', // Primary Blue
  },
  {
    title: "Powerful Analytics Dashboard",
    desc: "Gain deep insights into your link performance. Track clicks, geographical data, and referral sources to optimize your marketing strategies effectively.",
    icon: FiBarChart2,
    color: '#34A853', // Secondary Green
  },
  {
    title: "Customizable Links",
    desc: "Personalize your shortened URLs with custom back-halves. Brand your links and increase user trust and click-through rates.",
    icon: FiEdit,
    color: '#FBBC04', // Accent Yellow
  },
  {
    title: "Fast & Reliable Infrastructure",
    desc: "Enjoy lightning-fast redirects and guaranteed high uptime with our robust, global infrastructure. Your links are always responsive.",
    icon: FiShare2,
    color: '#EA4335', // Danger Red
  },
  {
    title: "Team Collaboration Ready",
    desc: "Share links and analytics across your team. Our platform is built for growth, scaling easily from individual use to large business teams.",
    icon: FiUsers,
    color: '#5B37B7', // A new purple accent
  },
  {
    title: "Advanced Link Management",
    desc: "Edit destination URLs, set expiry dates, and manage link metadata all from one centralized, easy-to-use dashboard.",
    icon: FiSettings,
    color: '#00B8D9', // A new cyan accent
  },
];

// --- Styled Components ---

const FeatureIconWrapper = styled(Box)(({ theme, accentColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '16px', // Large rounding
  backgroundColor: accentColor + '1A', // Light, transparent background
  color: accentColor,
  flexShrink: 0, // Prevents icon from shrinking on small screens
  '& svg': {
    fontSize: '32px',
  },
}));

// --- Framer Motion Variants ---
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- Main Component ---

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ minHeight: 'calc(100vh - 120px)' }}>

        {/* ======================= 1. Header Section ======================= */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: { xs: 6, md: 10 } }}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary"
                sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                Our Mission
              </Typography>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                component="h1"
                fontWeight={700}
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 3,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Empowering You with Smarter, <Box component="span" sx={{ color: theme.palette.secondary.main }}>Trackable Links</Box>.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                ShortifyX (formerly Linklytics) is built on the philosophy that link sharing shouldn't be cumbersome. We provide a **clean, fast, and powerful platform** for generating, managing, and gaining valuable analytics from every shortened URL. Our commitment is to efficiency and data security, empowering individuals and businesses to share content more effectively.
              </Typography>
            </motion.div>
          </Grid>
          
          {/* Decorative Image/Illustration Placeholder */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              
            </motion.div>
          </Grid>
        </Grid>

        {/* --- Divider --- */}
        <Box sx={{ my: { xs: 6, md: 8 } }}>
          <motion.div 
            initial={{ opacity: 0, width: '0%' }}
            whileInView={{ opacity: 1, width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <hr style={{ border: `1px solid ${theme.palette.grey[200]}`, borderRadius: '1px' }} />
          </motion.div>
        </Box>


        {/* ======================= 2. Key Features Section ======================= */}
        <Typography
          variant="h4"
          component="h2"
          fontWeight={700}
          align="center"
          sx={{ color: 'text.primary', mb: { xs: 4, md: 6 } }}
        >
          Core Features Built for Success
        </Typography>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <Grid container spacing={{ xs: 3, md: 5 }}>
            {featuresData.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Stack direction="row" spacing={2} sx={{ p: 2, borderRadius: '16px', transition: 'background-color 200ms', '&:hover': { backgroundColor: theme.palette.grey[50] } }}>
                    <FeatureIconWrapper accentColor={feature.color}>
                      <feature.icon />
                    </FeatureIconWrapper>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AboutPage;