import { useSyncExternalStore } from "react";

import { getToken, removeToken, setToken } from "@/lib/token";

const AUTH_SESSION_STORAGE_KEY = "lyncs-auth-session";

type AuthState = {
  accessToken: string;
  refreshToken: string;
  email: string;
};

export type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  email: string;
};

interface PersistedAuthState {
  refreshToken: string;
  email: string;
}

export interface AuthStore extends AuthState {
  isAuthenticated: boolean;
  setSession: (payload: SessionPayload) => void;
  logout: () => void;
}

const listeners = new Set<() => void>();

const readPersistedState = (): PersistedAuthState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuthState;
  } catch {
    return null;
  }
};

const persistState = (data: PersistedAuthState | null) => {
  if (typeof window === "undefined") return;
  if (!data) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(data));
};

const persisted = readPersistedState();

let authState: AuthState = {
  accessToken: getToken() ?? "",
  refreshToken: persisted?.refreshToken ?? "",
  email: persisted?.email ?? "",
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => authState;

export const setAuthSession = (payload: SessionPayload) => {
  setToken(payload.accessToken, payload.expiresIn);
  authState = {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    email: payload.email,
  };
  persistState({
    email: payload.email,
    refreshToken: payload.refreshToken,
  });
  emitChange();
};

export const updateAuthTokens = (payload: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  if (!authState.email) return;
  setAuthSession({
    ...payload,
    email: authState.email,
  });
};

export const setAuthEmail = (email: string) => {
  authState = {
    ...authState,
    email,
  };
  if (authState.refreshToken) {
    persistState({
      email,
      refreshToken: authState.refreshToken,
    });
  }
  emitChange();
};

export const getRefreshToken = () => authState.refreshToken;

export const clearAuthSession = () => {
  removeToken();
  authState = {
    accessToken: "",
    refreshToken: "",
    email: "",
  };
  persistState(null);
  emitChange();
};

export const useAuthStore = (): AuthStore => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...snapshot,
    isAuthenticated: Boolean(snapshot.accessToken),
    setSession: setAuthSession,
    logout: clearAuthSession,
  };
};
