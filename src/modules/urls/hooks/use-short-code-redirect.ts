import * as React from "react";

const SHORT_CODE_PATTERN = /^[A-Za-z0-9]{6,10}$/;

const getApiBaseUrl = () => {
  const value = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

interface UseShortCodeRedirectResult {
  hasError: boolean;
  message: string;
}

export const useShortCodeRedirect = (
  shortCode: string | undefined,
): UseShortCodeRedirectResult => {
  const [message, setMessage] = React.useState("Redirecting you now...");
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const trimmedCode = (shortCode || "").trim();

    if (!SHORT_CODE_PATTERN.test(trimmedCode)) {
      setHasError(true);
      setMessage("This short link looks invalid.");
      return;
    }

    const apiBaseUrl = getApiBaseUrl();
    if (!apiBaseUrl) {
      setHasError(true);
      setMessage("We could not process this short link right now.");
      return;
    }

    window.location.replace(`${apiBaseUrl}/${encodeURIComponent(trimmedCode)}`);
  }, [shortCode]);

  return {
    hasError,
    message,
  };
};

