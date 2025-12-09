import React from 'react';
import { motion } from 'framer-motion';

// MUI Imports
import {
  Modal,
  Box,
  useTheme,
  Backdrop,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Component Imports
import CreateNewShorten from './CreateNewShorten';

// --- Styled Components ---

// Wrapper Box to contain the modal content and apply custom styling
const ModalContentWrapper = styled(Box)(({ theme }) => ({
  // Center the box manually within the Modal component
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  
  // Material You / ChatGPT Card Styling
  backgroundColor: theme.palette.background.paper,
  borderRadius: '24px', // Extra large rounding for high-fidelity look
  boxShadow: theme.shadows[10], // Strong, soft elevation
  maxWidth: 480, // Constrain width for focused experience
  width: '90%', // Responsive width
  outline: 'none', // Remove default focus outline
  
  // Custom padding is handled by the inner CreateNewShorten component
}));

// --- Framer Motion Variants ---

// Modal entrance animation (Scale up and fade in)
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
    } 
  },
};

// --- Main Component ---

/**
 * Modal wrapper for the Shorten URL creation form.
 * @param {boolean} open - Controls the visibility of the modal.
 * @param {function} setOpen - Function to toggle the modal state.
 * @param {function} refetch - Function to trigger list refetch in parent dashboard.
 */
const ShortenPopUp = ({ open, setOpen, refetch }) => {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition // Better performance/animation control
      aria-labelledby="shorten-url-title"
      slots={{ backdrop: motion(Backdrop) }} // Use Framer Motion for backdrop
      slotProps={{
        backdrop: {
          // Backdrop uses opacity transition
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
          timeout: 500, // Ensure MUI waits for transition
          sx: { backdropFilter: 'blur(3px)' }, // Subtle blur effect
        },
      }}
    >
      <ModalContentWrapper
        component={motion.div}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
      >
        {/*
          The CreateNewShorten component renders the form fields and buttons.
          We pass setOpen and refetch directly for form submission handlers.
        */}
        <CreateNewShorten setOpen={setOpen} refetch={refetch} />
      </ModalContentWrapper>
    </Modal>
  );
}

export default ShortenPopUp;