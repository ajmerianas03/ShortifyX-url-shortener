import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiCopy, FiCheck, FiBarChart2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineAdsClick } from 'react-icons/md';
import toast from 'react-hot-toast';

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Component Imports
import api from '../../api/api';
import { useStoreContext } from '../../contextApi/ContextApi';
import Graph from './Graph';
import Loader from '../Loader';

// Styled Components
const ItemWrapper = styled(motion.div)(({ theme, isExpanded }) => ({
  backgroundColor: isExpanded ? theme.palette.grey[50] : theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: isExpanded ? theme.shadows[8] : theme.shadows[2],
  border: `1px solid ${isExpanded ? theme.palette.primary.light : theme.palette.grey[200]}`,
  padding: theme.spacing(2.5),
  transition: 'all 300ms ease-in-out',
  '&:hover': {
    boxShadow: isExpanded ? theme.shadows[8] : theme.shadows[4],
  },
}));

const ActionButton = styled(motion(Button))(({ theme, colorType }) => {
  const colorMap = {
    copy: theme.palette.success.main,
    analytics: theme.palette.primary.main,
    delete: theme.palette.error.main,
  };

  return {
    borderRadius: '10px',
    padding: theme.spacing(1, 2),
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 600,
    color: colorType === 'delete' ? 'white' : colorMap[colorType],
    backgroundColor: colorType === 'delete' ? colorMap[colorType] : colorMap[colorType] + '1A',
    '&:hover': {
      backgroundColor: colorMap[colorType],
      color: 'white',
      boxShadow: theme.shadows[4],
    },
    transition: 'all 200ms ease-in-out',
  };
});

// Framer Motion Variants
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Helper to aggregate click data
const aggregateClickData = (clickEvents) => {
  if (!clickEvents || clickEvents.length === 0) return [];

  const dailyCounts = clickEvents.reduce((acc, event) => {
    const dateKey = dayjs(event.clickDate).format('YYYY-MM-DD');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(dailyCounts).map(dateKey => ({
    clickDate: dateKey,
    count: dailyCounts[dateKey],
  }));
};

// Main Component
const ShortenItem = ({ shortUrl, originalUrl, clickCount, createdDate }) => {
  const { token } = useStoreContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isCopied, setIsCopied] = useState(false);
  const [analyticToggle, setAnalyticToggle] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aggregatedGraphData, setAggregatedGraphData] = useState([]);

  const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(/(^\w+:|^)\/\//, '');
  const fullShortUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${shortUrl}`;

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setIsCopied(true);
      toast.success('Link copied!', { duration: 1500 });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const analyticsHandler = async () => {
    if (!analyticToggle && !analyticsData) {
      await fetchAnalyticsData(shortUrl);
    }
    setAnalyticToggle(!analyticToggle);
  };

  const deleteHandler = async () => {
    if (!window.confirm(`Are you sure you want to delete the link: ${shortUrl}?`)) return;

    try {
      toast.success(`Link '${shortUrl}' deleted.`);
    } catch {
      toast.error('Failed to delete link.');
    }
  };

  const fetchAnalyticsData = async (urlAlias) => {
    setAnalyticsLoading(true);
    setAnalyticsData(null);
    setAggregatedGraphData([]);

    const endDateTime = dayjs().toISOString();
    const startDateTime = dayjs().subtract(30, 'day').toISOString();

    try {
      const { data } = await api.get(
        `/api/urls/analytics/${urlAlias}?startDate=${startDateTime}&endDate=${endDateTime}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

       console.log('API response data:', data);
      setAnalyticsData(data);
      const aggregated = aggregateClickData(data);
      setAggregatedGraphData(aggregated);
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        navigate('/error?status=401');
      } else {
        toast.error('Failed to load analytics data.');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <ItemWrapper isExpanded={analyticToggle} elevation={analyticToggle ? 8 : 2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 2, sm: 3 }}
        >
          <Box sx={{ width: { xs: '100%', md: '40%' }, overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Typography
                component={RouterLink}
                to={fullShortUrl}
                target="_blank"
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {subDomain + '/s/' + shortUrl}
              </Typography>
              <FiExternalLink size={14} color={theme.palette.primary.main} />
            </Stack>
            <Tooltip title={originalUrl} placement="bottom-start">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {originalUrl}
              </Typography>
            </Tooltip>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', md: 'none' } }}>
                Created:
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {dayjs(createdDate).format('MMM DD, YYYY')}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '15%' } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MdOutlineAdsClick size={20} color={theme.palette.secondary.main} />
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {clickCount}
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ width: { xs: '100%', md: '15%' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
          >
            <Tooltip title={isCopied ? 'Copied!' : 'Copy Short Link'}>
              <ActionButton
                onClick={copyHandler}
                colorType="copy"
                startIcon={isCopied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                variant="contained"
                size="small"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCopied ? '' : 'Copy'}
              </ActionButton>
            </Tooltip>

            <Tooltip title={analyticToggle ? 'Hide Analytics' : 'View Analytics'}>
              <ActionButton
                onClick={analyticsHandler}
                colorType="analytics"
                startIcon={<FiBarChart2 size={18} />}
                variant={analyticToggle ? 'contained' : 'text'}
                size="small"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  backgroundColor: analyticToggle ? theme.palette.primary.main : theme.palette.primary.main + '1A',
                  color: analyticToggle ? 'white' : theme.palette.primary.main,
                }}
              >
                {analyticToggle ? '' : 'Data'}
              </ActionButton>
            </Tooltip>

            <Tooltip title="Delete Link">
              <IconButton
                onClick={deleteHandler}
                size="small"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  color: theme.palette.error.main,
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: theme.palette.error.main + '1A' },
                }}
              >
                <FiTrash2 size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Collapse in={analyticToggle} timeout="auto" unmountOnExit>
          <Box sx={{ pt: 3, mt: 3, borderTop: `1px solid ${theme.palette.grey[300]}` }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Link Performance Details
            </Typography>
            {analyticsLoading ? (
              <Loader fullPage={false} message="Fetching detailed analytics..." size={40} />
            ) : aggregatedGraphData && aggregatedGraphData.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Graph graphData={aggregatedGraphData} />
              </Box>
            ) : (
              <Stack alignItems="center" spacing={1} sx={{ p: 4, backgroundColor: theme.palette.grey[100], borderRadius: '12px' }}>
                <FiBarChart2 size={32} color={theme.palette.error.main} />
                <Typography variant="body1" fontWeight={500} color="text.primary">
                  No detailed click data available.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share the link and check back soon!
                </Typography>
              </Stack>
            )}
          </Box>
        </Collapse>
      </ItemWrapper>
    </motion.div>
  );
};

export default ShortenItem;
