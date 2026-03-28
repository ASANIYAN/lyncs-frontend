import { getToken } from "@/lib/token";
import { runCentralizedLogout } from "@/modules/system/session/centralized-logout";
import { unauthApi } from "@/services/api-service";

export const useLogout = () => {
  const logout = () => {
    const accessToken = getToken();
    runCentralizedLogout({
      reason: "manual_logout",
      shouldBroadcast: true,
    });

    if (!accessToken) return;

    void unauthApi.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  return {
    logout,
    isLoggingOut: false,
  };
};
