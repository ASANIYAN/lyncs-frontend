import { Globe, Monitor, MousePointerClick, Users } from "lucide-react";

import { LyncsStatCard } from "@/components/custom-components/custom-card";
import { getCountryNameFromIso2 } from "@/lib/country";
import type { AnalyticsData } from "../hooks/use-analytics";

interface AnalyticsStatCardsProps {
  data: AnalyticsData;
}

const AnalyticsStatCards = ({ data }: AnalyticsStatCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <LyncsStatCard
        label="Total clicks"
        value={data.totalClicks}
        icon={<MousePointerClick className="size-4 text-lyncs-accent" />}
        accent
      />
      <LyncsStatCard
        label="Unique visitors"
        value={data.uniqueVisitors}
        icon={<Users className="size-4 text-lyncs-text" />}
      />
      <LyncsStatCard
        label="Top country"
        value={getCountryNameFromIso2(data.topCountries?.[0]?.country, "—")}
        icon={<Globe className="size-4 text-lyncs-text" />}
      />
      <LyncsStatCard
        label="Top device"
        value={data.deviceTypes?.[0]?.type ?? "—"}
        icon={<Monitor className="size-4 text-lyncs-text" />}
      />
    </div>
  );
};

export default AnalyticsStatCards;
