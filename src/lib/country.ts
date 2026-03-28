const isIso2 = (value: string) => /^[A-Za-z]{2}$/.test(value);

export const getCountryNameFromIso2 = (
  countryCode?: string | null,
  fallback = "Unknown",
) => {
  const code = countryCode?.trim();
  if (!code) return fallback;

  const normalizedCode = code.toUpperCase();
  if (!isIso2(normalizedCode)) return normalizedCode;

  try {
    const display = new Intl.DisplayNames(["en"], { type: "region" });
    return display.of(normalizedCode) || normalizedCode;
  } catch {
    return normalizedCode;
  }
};

