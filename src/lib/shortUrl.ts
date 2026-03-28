const FALLBACK_BASE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://lyncs.app";

const normalizeBaseUrl = (value?: string) => {
  const base = (value || FALLBACK_BASE_URL).trim();
  return base.replace(/\/+$/, "");
};

export const getShortUrl = (shortCode: string) => {
  return `${normalizeBaseUrl(import.meta.env.VITE_SHORT_URL_BASE)}/${shortCode}`;
};
