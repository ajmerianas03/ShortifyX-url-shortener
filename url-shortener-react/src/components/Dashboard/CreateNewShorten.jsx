import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiLink,
  FiCheckCircle,
  FiPlus,
  FiArrowRight,
  FiClock,
  FiLock,
  FiTag,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  useTheme,
  InputAdornment,
  Collapse,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Component Imports
import TextField from "../TextField";
import { useStoreContext } from "../../contextApi/ContextApi";
import api from "../../api/api";

// --- Styled Components (Retained from previous design) ---

const PrimaryCtaButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
  transition: "all 250ms ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8],
    transform: "translateY(-1px)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600],
    boxShadow: "none",
  },
}));

// --- Main Component ---

const CreateNewShorten = ({ setOpen, refetch }) => {
  const { token } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const theme = useTheme();
  const frontEndUrl =
    import.meta.env.VITE_REACT_FRONT_END_URL || "https://shortifyx.com"; // Initialize react-hook-form methods, including all optional backend fields

  const methods = useForm({
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: "", // Date string, will be converted to ISO string
      isProtected: false,
      password: "",
      category: "",
    },
    mode: "onTouched",
  });

  const { handleSubmit, reset, watch, setValue } = methods; // Watch for password protection toggle

  const isProtected = watch("isProtected");
  const customAlias = watch("customAlias");

  const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
      // Map frontend form fields to backend DTO fields (UrlMappingCreateRequestDTO)
      const payload = {
        originalUrl: data.originalUrl, // Rename 'alias' to 'customAlias' for backend compatibility
        ...(data.customAlias && { customAlias: data.customAlias }), // Format expiresAt to ISO string if provided
        ...(data.expiresAt && {
          expiresAt: dayjs(data.expiresAt).toISOString(),
        }),
        isProtected: data.isProtected, // Only send password if protection is enabled and password is set
        ...(data.isProtected && data.password && { password: data.password }), // Only send category if provided
        ...(data.category && { category: data.category }),
      }; // API call matches the backend: POST to /api/urls/shorten

      const { data: res } = await api.post("/api/urls/shorten", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }); // Response structure is UrlMappingDTO, using 'shortUrl' field for construction

      const shortenUrl = `${frontEndUrl}/s/${res.shortUrl}`;
      await navigator.clipboard.writeText(shortenUrl);
      toast.success(
        <Box>
                   {" "}
          <Typography fontWeight={600}>Link Created & Copied!</Typography>     
              <Typography variant="caption">{shortenUrl}</Typography>       {" "}
        </Box>,
        {
          icon: <FiCheckCircle size={24} color={theme.palette.success.main} />,
          duration: 3000,
        }
      );
      refetch();
      reset();
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create short URL. Alias may be taken or URL is invalid.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
           {" "}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit(createShortUrlHandler)}
        style={{ width: "100%", maxWidth: "450px", padding: theme.spacing(3) }}
      >
        {" "}
        <Stack spacing={3}>
          {/* Header */}{" "}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <FiPlus size={24} color={theme.palette.primary.main} />           {" "}
            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
              color="text.primary"
            >
                            Shorten a New URL            {" "}
            </Typography>
                     {" "}
          </Stack>
                             {" "}
          <Typography variant="body2" color="text.secondary">
                        Paste your long link below and configure advanced
            options.          {" "}
          </Typography>
                    {/* 1. Original URL Field */}         {" "}
          <TextField
            label="Original URL"
            required={true}
            id="originalUrl"
            placeholder="https://your-long-website.com/page-data"
            type="url"
            message="A valid URL is required."
            startIcon={<FiLink />}
          />
                    {/* 2. Custom Alias Field (Optional) */}         {" "}
          <TextField
            label="Custom Alias (Optional)"
            id="customAlias" // Renamed ID to match DTO
            placeholder="your-custom-name"
            type="text"
            message="Alias must be alphanumeric (a-z, 0-9) and dash."
            startIcon={<FiArrowRight />} // Add Adornment to show the base URL prefix
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                                   {" "}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={500}
                  >
                                       {" "}
                    {frontEndUrl.replace(/(^\w+:|^)\/\//, "")}/s/              
                       {" "}
                  </Typography>
                                 {" "}
                </InputAdornment>
              ),
            }}
          />
          {/* --- ADVANCED OPTIONS TOGGLE --- */}
          <Button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            color="primary"
            sx={{
              justifyContent: "flex-start",
              py: 1,
              px: 0,
              fontWeight: 600,
            }}
            startIcon={advancedOpen ? <FiChevronUp /> : <FiChevronDown />}
          >
            Advanced Link Options
          </Button>
                    {/* --- ADVANCED OPTIONS COLLAPSIBLE SECTION --- */}
          <Collapse in={advancedOpen}>
            <Stack
              spacing={3}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: `1px dashed ${theme.palette.grey[300]}`,
              }}
            >
              {/* 3. Expiration Date Field */}
              <TextField
                label="Expiration Date (Optional)"
                id="expiresAt"
                type="datetime-local" // HTML input type for date/time selection
                startIcon={<FiClock />}
                // Set minimum date to today
                inputProps={{ min: dayjs().format("YYYY-MM-DDTHH:mm") }}
              />

              {/* 4. Password Protection Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    id="isProtected"
                    checked={isProtected}
                    onChange={(e) => setValue("isProtected", e.target.checked)}
                    color="primary"
                    icon={<FiLock size={20} />}
                    checkedIcon={<FiLock size={20} />}
                  />
                }
                label={
                  <Typography fontWeight={500} color="text.primary">
                    Password Protection
                  </Typography>
                }
              />

              {/* 5. Password Field (Conditionally Rendered) */}
              {isProtected && (
                <TextField
                  label="Password"
                  id="password"
                  type="password"
                  required={isProtected}
                  message="Password is required for protected links."
                  placeholder="Set a password"
                  min={6}
                  startIcon={<FiLock />}
                />
              )}

              {/* 6. Category Field */}
              <TextField
                label="Category/Tag (Optional)"
                id="category"
                type="text"
                placeholder="e.g., Marketing, Social, Internal"
                startIcon={<FiTag />}
              />
            </Stack>
          </Collapse>
          {/* Action Button */}         {" "}
          <PrimaryCtaButton
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <FiCheckCircle />
              )
            }
          >
                        {loading ? "Creating..." : "Shorten Link"}         {" "}
          </PrimaryCtaButton>
                    {/* Cancel/Close Button - Secondary action */}         {" "}
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            variant="text"
            sx={{ borderRadius: "12px", color: theme.palette.text.secondary }}
          >
                        Cancel          {" "}
          </Button>
                 {" "}
        </Stack>
             {" "}
      </motion.form>
         {" "}
    </FormProvider>
  );
};

export default CreateNewShorten;
