
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLink, FiPlus, FiBarChart2, FiGlobe } from "react-icons/fi";

// MUI Imports
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  useTheme,
  Skeleton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Component Imports
import { useStoreContext } from "../../contextApi/ContextApi";
import { useFetchMyShortUrls, useFetchTotalClicks } from "../../hooks/useQuery";
import ShortenPopUp from "./ShortenPopUp";
import ShortenUrlList from "./ShortenUrlList";
import Graph from "./Graph";
import Loader from "../Loader";

// --- Styled Components ---
const DashboardCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  height: "100%",
  boxShadow: theme.shadows[4],
  transition: "box-shadow 300ms ease-in-out",
}));

const PrimaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  backgroundColor: theme.palette.secondary.main,
  transition: "all 250ms ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    boxShadow: theme.shadows[8],
    transform: "translateY(-1px)",
  },
}));

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// --- Helper Components ---
const StatCard = ({ icon, title, value, isLoading, accentColor }) => (
  <DashboardCard elevation={2}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ color: accentColor, fontSize: "32px" }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {isLoading ? <Skeleton width={80} /> : value}
        </Typography>
      </Box>
    </Stack>
  </DashboardCard>
);

// --- Main Component ---
const DashboardLayout = () => {
  const { token } = useStoreContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const [shortenPopUp, setShortenPopUp] = useState(false);

  // Date state for filtering clicks
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "year"));
  const [endDate, setEndDate] = useState(dayjs());

  function onError() {
    navigate("/error?status=401");
  }

  // Fetch short URLs
  const { isLoading: urlsLoading, data: myShortenUrls = [], refetch } =
    useFetchMyShortUrls(token, onError);

  // Fetch clicks based on selected date range
  const { isLoading: clicksLoading, data: totalClicks = [] } =
    useFetchTotalClicks(token, onError, startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));

  const totalLinks = myShortenUrls.length;
  const totalClickCount = totalClicks.reduce((sum, item) => sum + (item.count || 0), 0);

  const overallLoading = urlsLoading || clicksLoading;

  if (overallLoading) {
    return <Loader fullPage message="Loading Dashboard Data..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, minHeight: "calc(100vh - 64px)" }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header and CTA */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h3" fontWeight={700} color="text.primary">
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your link performance and create new short URLs.
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <PrimaryCtaButton
              onClick={() => setShortenPopUp(true)}
              startIcon={<FiPlus />}
              variant="contained"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Create New Short URL
            </PrimaryCtaButton>
          </motion.div>
        </Stack>

        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<FiLink />}
                title="Total Short Links"
                value={totalLinks}
                accentColor={theme.palette.primary.main}
                isLoading={urlsLoading}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<FiBarChart2 />}
                title="Total Clicks Tracked"
                value={totalClickCount}
                accentColor={theme.palette.secondary.main}
                isLoading={clicksLoading}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<FiGlobe />}
                title="Unique Visitors (Approx.)"
                value={"95%"}
                accentColor={theme.palette.accent}
                isLoading={clicksLoading}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Graph & Links Section */}
        <Grid container spacing={4}>
          {/* Graph Section */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <DashboardCard elevation={8} sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Link Clicks Over Time
                </Typography>
                <Box sx={{ height: 350, pt: 2 }}>
                  {totalClickCount === 0 ? (
                    <Stack
                      height="100%"
                      justifyContent="center"
                      alignItems="center"
                      textAlign="center"
                      sx={{ backgroundColor: theme.palette.grey[50], borderRadius: "12px", p: 3 }}
                    >
                      <Typography variant="h6" color="text.primary" fontWeight={600}>
                        No Click Data Available
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                        Share your short links to start visualizing engagement data here.
                      </Typography>
                    </Stack>
                  ) : (
                    <Graph graphData={totalClicks} />
                  )}
                </Box>
              </DashboardCard>
            </motion.div>
          </Grid>

          {/* Short Links List */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <DashboardCard elevation={8} sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Your Short Links
                </Typography>
                {myShortenUrls.length === 0 ? (
                  <Stack
                    alignItems="center"
                    spacing={2}
                    sx={{ py: 5, backgroundColor: theme.palette.grey[50], borderRadius: "12px" }}
                  >
                    <FiLink size={32} color={theme.palette.primary.main} />
                    <PrimaryCtaButton
                      onClick={() => setShortenPopUp(true)}
                      size="small"
                      startIcon={<FiPlus />}
                      sx={{ mt: 2 }}
                    >
                      Create New Short URL
                    </PrimaryCtaButton>
                  </Stack>
                ) : (
                  <ShortenUrlList data={myShortenUrls} />
                )}
              </DashboardCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* PopUp Modal */}
      <ShortenPopUp refetch={refetch} open={shortenPopUp} setOpen={setShortenPopUp} />
    </Container>
  );
};

export default DashboardLayout;
