import { CardContent, CardHeader, CardTitle, LyncsCard } from "@/components/custom-components/custom-card";

interface CountryListProps {
  countries: { country: string; clicks: number }[];
}

const toFlagEmoji = (code: string) => {
  try {
    return String.fromCodePoint(
      ...code
        .toUpperCase()
        .split("")
        .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
    );
  } catch {
    return "🌐";
  }
};

const CountryList = ({ countries }: CountryListProps) => {
  return (
    <LyncsCard>
      <CardHeader className="border-b border-lyncs-border">
        <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
          Top countries
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {countries.slice(0, 6).map((country) => (
          <div
            key={country.country}
            className="flex items-center justify-between text-[12px] text-lyncs-text-muted"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                {country.country ? toFlagEmoji(country.country) : "🌐"}
              </span>
              <span>{country.country || "—"}</span>
            </div>
            <span className="text-lyncs-text tabular-nums">
              {country.clicks}
            </span>
          </div>
        ))}
      </CardContent>
    </LyncsCard>
  );
};

export default CountryList;
