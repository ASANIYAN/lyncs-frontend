import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";

interface DeleteUrlResponse {
  success: boolean;
  message: string;
}

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (shortCode: string) => {
      try {
        const { data } = await authApi.delete<DeleteUrlResponse>(
          `/urls/${shortCode}`,
        );
        return data;
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to delete URL.");
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
    variables: mutation.variables,
  };
};

