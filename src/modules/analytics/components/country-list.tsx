import { CardContent, CardHeader, CardTitle, LyncsCard } from "@/components/custom-components/custom-card";
import CountryFlag from "@/components/custom-components/country-flag";
import { getCountryNameFromIso2 } from "@/lib/country";

interface CountryListProps {
  countries: { country: string; clicks: number }[];
}

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
              <CountryFlag countryCode={country.country} className="size-4" />
              <span>{getCountryNameFromIso2(country.country, "—")}</span>
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
