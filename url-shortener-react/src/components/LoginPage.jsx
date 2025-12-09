import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';
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
import { useStoreContext } from '../contextApi/ContextApi'; // Assuming this import is correct

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

// Primary Login Button (Google Blue)
const PrimaryLoginButton = styled(motion(Button))(({ theme }) => ({
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { setToken } = useStoreContext();
  const theme = useTheme();

  // Initialize react-hook-form methods
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });
  
  const { handleSubmit, reset } = methods;

  const loginHandler = async (data) => {
    setLoader(true);
    try {
      const { data: response } = await api.post(
        "/api/auth/public/login",
        data
      );
      
      setToken(response.token);
      localStorage.setItem("JWT_TOKEN", response.token); // Store as plain string
      
      toast.success("Welcome back! Login Successful.");
      reset();
      navigate("/dashboard");

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
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
        // Optional: Subtle background color to make the Paper pop
        backgroundColor: theme.palette.grey[50], 
        p: { xs: 2, sm: 4 }
      }}
    >
      <FormContainer 
        initial="hidden"
        animate="visible"
        variants={formVariants}
        component="form"
        onSubmit={handleSubmit(loginHandler)}
      >
        {/* Header */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <FiLogIn size={36} color={theme.palette.primary.main} />
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={700}
            color="text.primary"
            sx={{ letterSpacing: '-0.5px' }}
          >
            Sign In to ShortifyX
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your dashboard and manage your short links.
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
              message="Username is required for login."
              placeholder="Your username"
              startIcon={<FiUser />} // Example of adding suggested icon
            />
            
            <TextField
              label="Password"
              id="password"
              type="password"
              required={true}
              message="Password is required."
              placeholder="Your password"
              min={6}
              startIcon={<FiLock />} // Example of adding suggested icon
            />
          </Stack>
        </FormProvider>

        {/* Action Button */}
        <PrimaryLoginButton
          type='submit'
          fullWidth
          disabled={loader}
          variant='contained'
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          startIcon={loader ? <CircularProgress color="inherit" size={20} /> : <FiLogIn />}
        >
          {loader ? "Logging in..." : "Login"}
        </PrimaryLoginButton>

        {/* Footer Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant='body2' color='text.secondary'>
            Don't have an account yet? 
            <Link
              component={RouterLink}
              to="/register"
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
              Sign Up
            </Link>
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
};

export default LoginPage;