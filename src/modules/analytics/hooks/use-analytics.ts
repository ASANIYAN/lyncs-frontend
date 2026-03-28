import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";

export interface AnalyticsData {
  shortCode: string;
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
  clicksByDay: { date: string; clicks: number }[];
  topReferrers: { referrer: string; clicks: number; percentage: number }[];
  topCountries: { country: string; clicks: number }[];
  deviceTypes: { type: string; clicks: number; percentage: number }[];
  browsers: { browser: string; clicks: number }[];
  operatingSystems: { os: string; clicks: number }[];
  recentClicks: {
    clickedAt: string;
    country: string;
    referrer: string;
    deviceType: string;
  }[];
}

export const useAnalytics = (shortCode: string, timeRange: string) => {
  const query = useQuery({
    queryKey: ["analytics", shortCode, timeRange],
    queryFn: async () => {
      try {
        const { data } = await authApi.get<AnalyticsData>(
          `/urls/${shortCode}/analytics`,
          {
            params: {
              timeRange,
            },
          },
        );
        return data;
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to load analytics.");
        toast.error(message);
        throw new Error(message);
      }
    },
    enabled: Boolean(shortCode),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

