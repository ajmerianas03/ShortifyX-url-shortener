import React from 'react';
import { useFormContext } from 'react-hook-form';

// MUI Imports
import { TextField as MuiTextField, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// --- Styled Components ---

const StyledTextField = styled(MuiTextField)(({ theme, errors, name }) => ({
  // 1. General Container Styling
  width: '100%',
  
  // 2. Custom Input Styles (Material You/ChatGPT Look)
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', // Strong rounding
    transition: 'all 250ms ease-in-out',
    backgroundColor: theme.palette.grey[50], // Very light background for contrast
    
    // Default Border
    '& fieldset': {
      borderColor: theme.palette.grey[300], // Light grey border
    },
    
    // Hover State
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light, // Subtle blue hint on hover
    },
    
    // Focus State (Material You Primary Blue)
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px', // Slightly thicker border on focus
      boxShadow: `0 0 0 3px ${theme.palette.primary.main}1A`, // Subtle inner shadow glow
    },

    // Error State (Google Red)
    ...(errors[name]?.message && {
      '& fieldset': {
        borderColor: theme.palette.error.main,
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.error.main,
        boxShadow: `0 0 0 3px ${theme.palette.error.main}1A`,
      },
    }),
  },
  
  // 3. Label and Helper Text
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  '& .MuiFormHelperText-root': {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: '0.8rem',
  },
}));

// --- Main Component ---

/**
 * Modern, responsive TextField component integrated with react-hook-form.
 * @param {string} label - The visible label for the field.
 * @param {string} id - The unique ID and register name for react-hook-form.
 * @param {string} type - HTML input type (e.g., 'text', 'email', 'password').
 * @param {string} message - Required message for validation.
 * @param {boolean} required - If the field is required.
 * @param {number} min - Minimum length validation (optional).
 * @param {string} placeholder - Placeholder text.
 */
const TextField = ({
  label,
  id,
  type = 'text',
  message = 'This field is required',
  required = false,
  min,
  placeholder,
  // Removed unnecessary className, value, errors, and register props. 
  // We use useFormContext() for better component encapsulation.
}) => {
  const { register, formState: { errors } } = useFormContext();
  const theme = useTheme();

  // Custom validation patterns (moved from JSX to component logic)
  const validationPatterns = {
    email: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Improved email regex
      message: 'Please enter a valid email address.',
    },
    url: {
      // Improved, more robust URL regex (can be made even simpler depending on requirements)
      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 
      message: 'Please enter a valid URL (e.g., https://example.com).',
    },
  };

  // Build the validation rules object
  const validationRules = {
    ...(required && { required: { value: true, message } }),
    ...(min && { minLength: { value: min, message: `Minimum ${min} characters required.` } }),
    ...(validationPatterns[type] && { pattern: validationPatterns[type] }),
  };

  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      <StyledTextField
        errors={errors} // Pass errors to styled component for dynamic styling
        name={id}      // Pass name to styled component for dynamic styling
        label={label}
        id={id}
        type={type}
        placeholder={placeholder}
        variant="outlined"
        fullWidth // Ensures responsiveness by taking full width of parent
        // Integrate react-hook-form register
        {...register(id, validationRules)}
        
        // Show error message via helperText
        error={!!errors[id]}
        helperText={errors[id]?.message}
      />
    </Box>
  );
};

export default TextField;