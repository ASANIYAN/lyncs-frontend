import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";

interface ShortenPayload {
  url: string;
}

interface ShortenUrlResponse {
  id: string;
  short_code: string;
  original_url: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  safety_checked: boolean;
  safety_checked_at: string | null;
  click_count: number;
  safety_status: string;
  normalized_url: string;
  url_hash: string;
  last_checked_at: string | null;
  isNew: boolean;
  message: string;
}

export const useShortenUrl = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ShortenPayload) => {
      try {
        const { data } = await authApi.post<ShortenUrlResponse>(
          "/urls/shorten",
          payload,
        );
        return data;
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to shorten URL.");
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

