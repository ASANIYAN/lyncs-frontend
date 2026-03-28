import * as React from "react";

import { cn } from "@/lib/utils";

interface CountryFlagProps {
  countryCode?: string | null;
  className?: string;
}

const normalizeCountryCode = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(normalized)) return null;
  return normalized;
};

const getFlagSvgUrl = (countryCode: string) => {
  return `https://flagcdn.com/${countryCode}.svg`;
};

const CountryFlag = ({ countryCode, className }: CountryFlagProps) => {
  const normalizedCode = normalizeCountryCode(countryCode);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [normalizedCode]);

  if (!normalizedCode || hasError) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex items-center justify-center", className)}
      >
        🌐
      </span>
    );
  }

  return (
    <img
      src={getFlagSvgUrl(normalizedCode)}
      alt={`${normalizedCode.toUpperCase()} flag`}
      width={18}
      height={14}
      loading="lazy"
      className={cn(
        "inline-block rounded-[2px] border border-lyncs-border object-cover",
        className,
      )}
      onError={() => setHasError(true)}
    />
  );
};

export default CountryFlag;

