import * as React from "react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { CustomButton } from "@/components/custom-components/custom-button";
import { LyncsEmpty } from "@/components/custom-components/custom-empty";
import { LyncsSpinner } from "@/components/custom-components/custom-spinner";
import { ShortCodePill } from "@/components/custom-components/custom-badge";
import { useAnalytics } from "../hooks/use-analytics";
import AnalyticsStatCards from "../components/analytics-stat-cards";
import ClicksChart from "../components/clicks-chart";
import DeviceBreakdown from "../components/device-breakdown";
import ReferrerList from "../components/referrer-list";
import CountryList from "../components/country-list";
import RecentClicksTable from "../components/recent-clicks-table";

const TIME_RANGES = ["24h", "7d", "30d", "90d"] as const;

const AnalyticsView = () => {
  const navigate = useNavigate();
  const { shortCode = "" } = useParams();
  const [timeRange, setTimeRange] =
    React.useState<(typeof TIME_RANGES)[number]>("7d");

  const { data, isLoading, isError, error, refetch } = useAnalytics(
    shortCode,
    timeRange,
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CustomButton
            variant="ghost"
            size="sm"
            leftIcon={<ChevronLeft className="size-4" />}
            onClick={() => navigate(-1)}
          >
            Back
          </CustomButton>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold tracking-[-0.4px] text-lyncs-text">
              Analytics
            </h1>
            {shortCode && <ShortCodePill code={shortCode} />}
          </div>
        </div>

        <div className="flex gap-1 rounded-[--radius-md] border border-lyncs-border bg-lyncs-card p-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-[12px] rounded-[--radius-md] transition-colors",
                range === timeRange
                  ? "bg-lyncs-elevated text-lyncs-text border border-lyncs-border"
                  : "text-lyncs-text-muted hover:text-lyncs-text",
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <LyncsSpinner size="lg" />
          <span className="mt-3 text-xiii text-lyncs-text-muted">
            Loading analytics…
          </span>
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <LyncsEmpty
            icon={<AlertCircle className="size-5" />}
            title="Failed to load"
            description={
              error instanceof Error
                ? error.message
                : "We could not load analytics data."
            }
            action={
              <CustomButton variant="secondary" onClick={() => refetch()}>
                Retry
              </CustomButton>
            }
          />
        </div>
      )}

      {data && !isLoading && !isError && (
        <div className="mt-6 space-y-4">
          <AnalyticsStatCards data={data} />
          <ClicksChart data={data.clicksByDay} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DeviceBreakdown deviceTypes={data.deviceTypes} />
            <ReferrerList referrers={data.topReferrers} />
            <CountryList countries={data.topCountries} />
          </div>
          <RecentClicksTable clicks={data.recentClicks} />
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
