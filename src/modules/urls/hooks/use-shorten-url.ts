import { useMutation, useQueryClient } from "@tanstack/react-query";

import { __urlsStore, type UrlRow } from "./use-urls";

const createShortCode = () =>
  Math.random().toString(36).replace(/[^a-z0-9]+/g, "").slice(2, 8);

export const useShortenUrl = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: { url: string }) => {
      const now = new Date().toISOString();
      const newUrl: UrlRow = {
        id: `${Date.now()}`,
        original_url: payload.url,
        short_code: createShortCode(),
        click_count: "0",
        created_at: now,
        is_active: true,
      };

      const nextUrls = [newUrl, ...__urlsStore.get()];
      __urlsStore.set(nextUrls);
      return newUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
