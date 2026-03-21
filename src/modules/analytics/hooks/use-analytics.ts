import { useQuery } from "@tanstack/react-query";

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

const getRangeDays = (timeRange: string) => {
  switch (timeRange) {
    case "24h":
      return 1;
    case "30d":
      return 30;
    case "90d":
      return 90;
    default:
      return 7;
  }
};

const buildAnalytics = (shortCode: string, timeRange: string): AnalyticsData => {
  const days = getRangeDays(timeRange);
  const now = new Date();
  const seed = shortCode
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const clicksByDay = Array.from({ length: days }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - index));
    const clicks = ((seed + index * 11) % 45) + 6;
    return {
      date: date.toISOString(),
      clicks,
    };
  });

  const totalClicks = clicksByDay.reduce((sum, entry) => sum + entry.clicks, 0);
  const uniqueVisitors = Math.max(1, Math.round(totalClicks * 0.62));

  return {
    shortCode,
    totalClicks,
    uniqueVisitors,
    createdAt: "2025-12-12T09:00:00.000Z",
    clicksByDay,
    topReferrers: [
      {
        referrer: "https://twitter.com/lyncsapp",
        clicks: Math.round(totalClicks * 0.32),
        percentage: 32,
      },
      {
        referrer: "https://www.producthunt.com",
        clicks: Math.round(totalClicks * 0.22),
        percentage: 22,
      },
      {
        referrer: "https://dev.to",
        clicks: Math.round(totalClicks * 0.16),
        percentage: 16,
      },
      {
        referrer: "",
        clicks: Math.round(totalClicks * 0.14),
        percentage: 14,
      },
      {
        referrer: "https://linkedin.com",
        clicks: Math.round(totalClicks * 0.12),
        percentage: 12,
      },
    ],
    topCountries: [
      { country: "US", clicks: Math.round(totalClicks * 0.34) },
      { country: "GB", clicks: Math.round(totalClicks * 0.18) },
      { country: "NG", clicks: Math.round(totalClicks * 0.16) },
      { country: "DE", clicks: Math.round(totalClicks * 0.12) },
      { country: "IN", clicks: Math.round(totalClicks * 0.1) },
      { country: "BR", clicks: Math.round(totalClicks * 0.1) },
    ],
    deviceTypes: [
      { type: "Mobile", clicks: Math.round(totalClicks * 0.52), percentage: 52 },
      { type: "Desktop", clicks: Math.round(totalClicks * 0.34), percentage: 34 },
      { type: "Tablet", clicks: Math.round(totalClicks * 0.1), percentage: 10 },
      { type: "Other", clicks: Math.round(totalClicks * 0.04), percentage: 4 },
    ],
    browsers: [
      { browser: "Chrome", clicks: Math.round(totalClicks * 0.55) },
      { browser: "Safari", clicks: Math.round(totalClicks * 0.22) },
      { browser: "Firefox", clicks: Math.round(totalClicks * 0.13) },
      { browser: "Edge", clicks: Math.round(totalClicks * 0.1) },
    ],
    operatingSystems: [
      { os: "iOS", clicks: Math.round(totalClicks * 0.31) },
      { os: "Android", clicks: Math.round(totalClicks * 0.27) },
      { os: "Windows", clicks: Math.round(totalClicks * 0.24) },
      { os: "macOS", clicks: Math.round(totalClicks * 0.12) },
      { os: "Linux", clicks: Math.round(totalClicks * 0.06) },
    ],
    recentClicks: Array.from({ length: 8 }).map((_, index) => {
      const clickDate = new Date(now);
      clickDate.setMinutes(now.getMinutes() - index * 9);
      return {
        clickedAt: clickDate.toISOString(),
        country: ["US", "GB", "NG", "DE", "IN"][index % 5],
        referrer: [
          "https://twitter.com/lyncsapp",
          "https://www.producthunt.com",
          "https://news.ycombinator.com",
          "",
          "https://linkedin.com",
        ][index % 5],
        deviceType: ["Mobile", "Desktop", "Mobile", "Tablet", "Desktop"][index % 5],
      };
    }),
  };
};

export const useAnalytics = (shortCode: string, timeRange: string) => {
  const query = useQuery({
    queryKey: ["analytics", shortCode, timeRange],
    queryFn: async () => buildAnalytics(shortCode, timeRange),
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
