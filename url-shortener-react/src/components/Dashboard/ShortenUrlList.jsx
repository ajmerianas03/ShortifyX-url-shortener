import React from 'react';
import ShortenItem from './ShortenItem';
import { motion } from 'framer-motion';

// MUI Imports
import { Box, Stack, Typography, useTheme, Divider } from '@mui/material';
import { FiHash, FiLink, FiCalendar, FiBarChart2 } from 'react-icons/fi';

// --- Framer Motion Variants ---

// Container for staggered list animation
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Subtle delay between each item
    },
  },
};

// Item variant is handled inside ShortenItem.jsx for independent animation

// --- Main Component ---

/**
 * Renders a clean, responsive list of ShortenItem components.
 * @param {Array<Object>} data - Array of short URL objects.
 */
const ShortenUrlList = ({ data }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 3 }}>
      {/* List Header - Visible on large screens for context */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          mb: 1.5,
          px: 2,
          py: 1,
          backgroundColor: theme.palette.grey[50], // Light background for header row
          borderRadius: '8px',
          fontWeight: 600,
          color: theme.palette.text.secondary,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="caption" sx={{ width: '40%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiLink size={12} /> SHORT URL / ALIAS
          </Typography>
          <Typography variant="caption" sx={{ width: '30%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiCalendar size={12} /> CREATED ON
          </Typography>
          <Typography variant="caption" sx={{ width: '15%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiBarChart2 size={12} /> CLICKS
          </Typography>
          <Box sx={{ width: '15%' }}></Box> {/* Actions column placeholder */}
        </Stack>
      </Box>

      {/* List Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={listContainerVariants}
      >
        <Stack spacing={{ xs: 2, md: 1 }}>
          {data.map((item) => (
            // The ShortenItem will handle its own motion.div wrapping for stagger effect
            <ShortenItem key={item.id} {...item} />
          ))}
        </Stack>
      </motion.div>
    </Box>
  );
};

export default ShortenUrlList;