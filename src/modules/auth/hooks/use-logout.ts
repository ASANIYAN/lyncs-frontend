import { useMutation } from "@tanstack/react-query";

import { getToken } from "@/lib/token";
import { unauthApi } from "@/services/api-service";
import { clearAuthSession } from "@/store/auth-store";

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: async (accessToken?: string) => {
      if (!accessToken) return;

      await unauthApi.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    },
    retry: 0,
  });

  const logout = () => {
    const accessToken = getToken();
    clearAuthSession();
    mutation.mutate(accessToken);
  };

  return {
    logout,
    isLoggingOut: mutation.isPending,
  };
};
