import axios from "axios";

type ApiErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  policy?: string;
  retryAfterSeconds?: number;
};

const joinMessage = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message.filter(Boolean).join(", ");
  }
  return message;
};

const toFriendlyMessage = (message: string) => {
  const normalized = message.trim();
  const lower = normalized.toLowerCase();

  if (
    lower.includes("invalid or expired token") ||
    lower.includes("jwt expired") ||
    lower.includes("jwt malformed")
  ) {
    return "Your session has expired. Please sign in again.";
  }

  if (lower.includes("internal server error")) {
    return "Something went wrong on our side. Please try again.";
  }

  if (lower.includes("validation failed")) {
    return "Please check your input and try again.";
  }

  if (lower.includes("rate limit exceeded")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return normalized;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const message =
      payload?.message !== undefined ? joinMessage(payload.message) : null;

    if (typeof message === "string" && message.trim().length > 0) {
      if (
        payload?.statusCode === 429 &&
        typeof payload.retryAfterSeconds === "number"
      ) {
        return `${toFriendlyMessage(message)} Retry in ${payload.retryAfterSeconds}s.`;
      }
      return toFriendlyMessage(message);
    }

    if (typeof payload?.error === "string" && payload.error.trim().length > 0) {
      return toFriendlyMessage(payload.error);
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return toFriendlyMessage(error.message);
  }

  return fallback;
};
