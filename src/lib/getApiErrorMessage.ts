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
        return `${message} Retry in ${payload.retryAfterSeconds}s.`;
      }
      return message;
    }

    if (typeof payload?.error === "string" && payload.error.trim().length > 0) {
      return payload.error;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

