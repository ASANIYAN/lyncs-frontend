import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";
import { clearAuthSession } from "@/store/auth-store";

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      await authApi.post("/auth/logout");
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Could not sign out from server. Ending local session.",
      );
      toast.error(message);
    },
    onSettled: () => {
      clearAuthSession();
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoggingOut: mutation.isPending,
  };
};

