import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { IoIosMenu, IoMdClose } from 'react-icons/io';
import { FiLogIn, FiLogOut, FiHome, FiInfo, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

// MUI Imports
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  Link,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Context (Assuming useStoreContext is imported correctly)
import { useStoreContext } from '../contextApi/ContextApi';

// --- Styled Components ---

// 1. Google/ChatGPT-style Nav Link
const NavLink = styled(Link)(({ theme, isActive }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  fontWeight: isActive ? 600 : 500,
  position: 'relative',
  padding: '8px 4px',
  transition: 'color 150ms ease-in-out',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '1rem',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  // Active link Material You underline style
  ...(isActive && {
    color: theme.palette.primary.main,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '3px',
      borderRadius: '2px',
      backgroundColor: theme.palette.primary.main,
      transition: 'width 250ms ease-in-out',
    },
  }),
}));

// 2. Primary CTA Button (Google Blue)
const PrimaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 16px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
  transition: 'all 250ms ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8], // Soft hover shadow
    transform: 'translateY(-1px)',
  },
}));

// --- Main Component ---

const NavBar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  const [drawerOpen, setDrawerOpen] = useState(false); // Used for mobile drawer
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Define navigation links based on authentication status
  const navLinks = token
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
      ]
    : [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
      ];

  // Handle logout logic
  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem('JWT_TOKEN');
    navigate('/login');
    setDrawerOpen(false);
  };

  // Handle website name click
  const handleWebsiteNameClick = () => {
    navigate(token ? '/dashboard' : '/');
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Framer Motion initial/animate variants for the entire bar
  const navBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Framer Motion variants for mobile menu list
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };


  // --- JSX Structure ---
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navBarVariants}
    >
      <AppBar
        position="sticky"
        // MUI Box Shadow: theme.shadows[4] is a good soft shadow (like Google Search)
        sx={{
          backgroundColor: 'white',
          boxShadow: theme.shadows[2], // Light bottom shadow
          zIndex: theme.zIndex.appBar,
          py: { xs: 0, md: 0.5 },
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: '100%', margin: '0 auto', px: { xs: 2, sm: 3, md: 4 } }}>
          {/* 1. Logo / Website Name */}
          <Typography
            variant="h5"
            component={RouterLink}
            onClick={handleWebsiteNameClick}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-1px',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
          >
            Shortify<Box component="span" sx={{ color: theme.palette.secondary.main }}>X</Box>
          </Typography>

          {/* 2. Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={3} alignItems="center">
              {/* Regular Links */}
              {navLinks.map((item) => (
                <NavLink
                  component={RouterLink}
                  key={item.path}
                  to={item.path}
                  isActive={path === item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}

              {/* CTA/Auth Button */}
              {token ? (
                <PrimaryCtaButton
                  onClick={onLogOutHandler}
                  color="error" // Use the red error color for LogOut
                  variant="contained"
                  whileHover={{ scale: 1.02, boxShadow: theme.shadows[8] }}
                  whileTap={{ scale: 0.98 }}
                  startIcon={<FiLogOut />}
                  sx={{ backgroundColor: theme.palette.error.main }}
                >
                  Log Out
                </PrimaryCtaButton>
              ) : (
                <PrimaryCtaButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  whileHover={{ scale: 1.02, boxShadow: theme.shadows[8] }}
                  whileTap={{ scale: 0.98 }}
                  startIcon={<FiLogIn />}
                >
                  Sign Up
                </PrimaryCtaButton>
              )}
            </Stack>
          )}

          {/* 3. Mobile Menu Toggle */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="primary"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ p: 1 }}
            >
              <IoIosMenu style={{ fontSize: '28px' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* 4. Mobile Drawer (Collapsible Menu) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        // Apply ChatGPT/Material You styling to the drawer itself
        PaperProps={{
          sx: {
            width: 250,
            borderRadius: '16px 0 0 16px', // Rounded right corners
            boxShadow: theme.shadows[10],
            backgroundColor: theme.palette.background.paper, // Clean white/light
          },
        }}
      >
        <Box
          sx={{ width: 'auto', p: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {/* Close Button */}
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={toggleDrawer(false)} color="primary">
              <IoMdClose style={{ fontSize: '24px' }} />
            </IconButton>
          </Box>
          
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            <List>
              {/* Navigation Links */}
              {navLinks.map((item) => (
                <motion.div key={item.path} variants={itemVariants}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={RouterLink}
                      to={item.path}
                      selected={path === item.path}
                      sx={{
                        borderRadius: '10px',
                        my: 1,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.light + '20', // Light blue background
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: path === item.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}

              {/* CTA/Auth Button in Mobile Menu */}
              <motion.div variants={itemVariants} style={{ marginTop: theme.spacing(2) }}>
                {token ? (
                  <Button
                    fullWidth
                    onClick={onLogOutHandler}
                    variant="contained"
                    color="error"
                    startIcon={<FiLogOut />}
                    sx={{ borderRadius: '10px', py: 1.5 }}
                  >
                    Log Out
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    startIcon={<FiLogIn />}
                    sx={{ borderRadius: '10px', py: 1.5 }}
                  >
                    Sign Up
                  </Button>
                )}
              </motion.div>
            </List>
          </motion.div>
        </Box>
      </Drawer>
    </motion.div>
  );
};

export default NavBar;