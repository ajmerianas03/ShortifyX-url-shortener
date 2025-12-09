import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import dayjs from "dayjs"; // Import dayjs for date handling

// --- Hook 1: Fetch My Short URLs (/api/urls/myurls) ---
export const useFetchMyShortUrls = (token, onError) => {
  return useQuery({
    queryKey: ["my-shortenurls"],
    queryFn: async () => {
      const response = await api.get("/api/urls/myurls", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Backend returns List<UrlMappingDTO> directly in the response body
      return response.data;
    },
    select: (data) => {
      // Data is already the list of URLs (List<UrlMappingDTO>)
      const sortedData = data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      return sortedData;
    },
    onError,
    staleTime: 5000,
  });
};

// --- Hook 2: Fetch Total Clicks (/api/urls/totalClicks) ---
export const useFetchTotalClicks = (token, onError) => {
  const startDate = dayjs().subtract(1, "year").format("YYYY-MM-DD");
  const endDate = dayjs().format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["url-totalclick", startDate, endDate], // Added dates to queryKey for refetching
    queryFn: async () => {
      const response = await api.get(
        `/api/urls/totalClicks?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Backend returns Map<LocalDate, Long> directly in the response body
      return response.data;
    },
    select: (data) => {
      // Backend response: { "2025-10-26": 5, "2025-10-27": 10, ... }
      const convertToArray = Object.keys(data).map((key) => ({
        clickDate: key,
        count: data[key],
      }));

      // Sort the dates for correct graph display
      convertToArray.sort((a, b) => new Date(a.clickDate) - new Date(b.clickDate));

      return convertToArray;
    },
    onError,
    staleTime: 5000,
  });
};
