import type { QueryClient } from "@tanstack/react-query";

let sessionQueryClient: QueryClient | null = null;

export const registerSessionQueryClient = (queryClient: QueryClient) => {
  sessionQueryClient = queryClient;
};

export const getSessionQueryClient = () => sessionQueryClient;

