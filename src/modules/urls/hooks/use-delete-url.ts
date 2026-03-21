import { useMutation, useQueryClient } from "@tanstack/react-query";

import { __urlsStore } from "./use-urls";

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (shortCode: string) => {
      const nextUrls = __urlsStore
        .get()
        .filter((url) => url.short_code !== shortCode);
      __urlsStore.set(nextUrls);
      return shortCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    variables: mutation.variables,
  };
};
