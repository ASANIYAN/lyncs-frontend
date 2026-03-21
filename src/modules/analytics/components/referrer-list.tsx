import { CardContent, CardHeader, CardTitle, LyncsCard } from "@/components/custom-components/custom-card";
import { ReferrerBar } from "@/components/custom-components/custom-progress";

interface ReferrerListProps {
  referrers: { referrer: string; clicks: number; percentage: number }[];
}

const getReferrerLabel = (referrer: string) => {
  try {
    return new URL(referrer).hostname;
  } catch {
    return "Direct";
  }
};

const ReferrerList = ({ referrers }: ReferrerListProps) => {
  return (
    <LyncsCard>
      <CardHeader className="border-b border-lyncs-border">
        <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
          Top referrers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {referrers.slice(0, 5).map((referrer) => (
          <ReferrerBar
            key={referrer.referrer || "direct"}
            label={getReferrerLabel(referrer.referrer)}
            value={referrer.clicks}
            percentage={referrer.percentage}
          />
        ))}
      </CardContent>
    </LyncsCard>
  );
};

export default ReferrerList;
