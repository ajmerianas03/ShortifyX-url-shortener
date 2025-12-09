import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';
import api from '../api/api';
import toast from 'react-hot-toast';

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Link,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Component Imports
import TextField from './TextField';

// --- Styled Components ---

const FormContainer = styled(motion(Paper))(({ theme }) => ({
  // ChatGPT/Material You Card Styling
  padding: theme.spacing(5, 4),
  borderRadius: '20px', // High rounding
  boxShadow: theme.shadows[10], // Strong, soft shadow for elevation
  maxWidth: 450,
  width: '100%',
  margin: theme.spacing(3), // Responsive margin
}));

// Primary Register Button (Google Blue)
const PrimaryRegisterButton = styled(motion(Button))(({ theme }) => ({
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
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600],
    boxShadow: 'none',
  },
}));

// --- Framer Motion Variants ---
const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    } 
  },
};

// --- Main Component ---

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const theme = useTheme();

  // Initialize react-hook-form methods
  const methods = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  
  const { handleSubmit, reset } = methods;

  const registerHandler = async (data) => {
    setLoader(true);
    try {
      await api.post("/api/auth/public/register", data);
      
      toast.success("Registration Successful! Please log in.");
      reset();
      navigate("/login");

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.palette.grey[50], 
        p: { xs: 2, sm: 4 }
      }}
    >
      <FormContainer 
        initial="hidden"
        animate="visible"
        variants={formVariants}
        component="form"
        onSubmit={handleSubmit(registerHandler)}
      >
        {/* Header */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <FiUserPlus size={36} color={theme.palette.secondary.main} /> {/* Secondary color accent */}
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={700}
            color="text.primary"
            sx={{ letterSpacing: '-0.5px' }}
          >
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start shortening links and tracking your data today!
          </Typography>
        </Stack>

        {/* Form Fields (Using FormProvider) */}
        <FormProvider {...methods}>
          <Stack spacing={3}>
            <TextField
              label="Username"
              id="username"
              type="text"
              required={true}
              message="A unique username is required."
              placeholder="Choose a username"
              startIcon={<FiUser />}
            />

            <TextField
              label="Email Address"
              id="email"
              type="email"
              required={true}
              message="A valid email address is required."
              placeholder="Your professional email"
              startIcon={<FiMail />}
            />
            
            <TextField
              label="Password"
              id="password"
              type="password"
              required={true}
              message="Password must be at least 6 characters."
              placeholder="Create a strong password"
              min={6}
              startIcon={<FiLock />}
            />
          </Stack>
        </FormProvider>

        {/* Action Button */}
        <PrimaryRegisterButton
          type='submit'
          fullWidth
          disabled={loader}
          variant='contained'
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          startIcon={loader ? <CircularProgress color="inherit" size={20} /> : <FiUserPlus />}
        >
          {loader ? "Registering..." : "Register"}
        </PrimaryRegisterButton>

        {/* Footer Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant='body2' color='text.secondary'>
            Already have an account? 
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                ml: 1,
                fontWeight: 600,
                color: theme.palette.primary.main,
                '&:hover': {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
};

export default RegisterPage;