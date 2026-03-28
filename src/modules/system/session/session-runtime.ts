import type { QueryClient } from "@tanstack/react-query";

let sessionQueryClient: QueryClient | null = null;
type SessionNavigator = (
  to: string,
  options?: {
    replace?: boolean;
  },
) => void | Promise<void>;
let sessionNavigator: SessionNavigator | null = null;

export const registerSessionQueryClient = (queryClient: QueryClient) => {
  sessionQueryClient = queryClient;
};

export const getSessionQueryClient = () => sessionQueryClient;

export const registerSessionNavigator = (navigate: SessionNavigator) => {
  sessionNavigator = navigate;
};

export const getSessionNavigator = () => sessionNavigator;
