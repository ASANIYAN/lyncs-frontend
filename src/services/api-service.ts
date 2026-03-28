import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { status401, status403 } from "@/lib/domain";
import { getToken } from "@/lib/token";
import {
  clearAuthSession,
  getRefreshToken,
  updateAuthTokens,
} from "@/store/auth-store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const unauthApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls for unauthenticated routes
unauthApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls for unauthenticated routes
unauthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error: AxiosError) {
    // if (error.response?.status === 403) {
    // }
    return Promise.reject(error);
  },
);

/**
 * Axios instances for authenticated API calls
 *
 * @authApi - For JSON API calls with authentication
 * @formAuthApi - For multipart/form-data uploads with authentication
 */

const authApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

interface AuthRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor for API calls for authenticated routes
authApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    } else {
      status401();
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls for authenticated routes
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthSession();
        status401();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { data } = await unauthApi.post<AuthRefreshResponse>(
          "/auth/refresh",
          { refreshToken },
        );
        updateAuthTokens(data);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        status401();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      status403();
    } else if (error.response?.status === 401) {
      clearAuthSession();
      status401();
    }
    return Promise.reject(error);
  },
);

const formAuthApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request interceptor for API calls for authenticated routes using form-data content type
formAuthApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls for authenticated routes using form-data content type
formAuthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error: AxiosError) {
    if (error.response?.status === 403) {
      status403();
    } else if (error.response?.status === 401) {
      status401();
    }
    return Promise.reject(error);
  },
);

export { unauthApi, authApi, formAuthApi };
