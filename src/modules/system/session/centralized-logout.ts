import { clearAuthSession } from "@/store/auth-store";
import { sessionTimeoutManager } from "@/modules/system/session/session-timeout-manager";
import { broadcastLogoutEvent } from "@/modules/system/session/session-sync";
import { getSessionQueryClient } from "@/modules/system/session/session-runtime";

type LogoutReason =
  | "manual_logout"
  | "timeout"
  | "logout_now"
  | "unauthorized"
  | "forbidden"
  | "missing_token"
  | "sync";

interface CentralizedLogoutOptions {
  reason: LogoutReason;
  shouldBroadcast?: boolean;
  shouldRedirect?: boolean;
}

let logoutInProgress = false;

const LOGIN_PATH = "/login";

export const runCentralizedLogout = ({
  reason,
  shouldBroadcast = true,
  shouldRedirect = true,
}: CentralizedLogoutOptions) => {
  if (logoutInProgress) return;

  logoutInProgress = true;

  try {
    clearAuthSession();
    sessionTimeoutManager.cleanup();
    getSessionQueryClient()?.clear();

    if (shouldBroadcast) {
      broadcastLogoutEvent(reason);
    }

    if (shouldRedirect && typeof window !== "undefined") {
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.replace(LOGIN_PATH);
      }
    }
  } finally {
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        logoutInProgress = false;
      }, 100);
    } else {
      logoutInProgress = false;
    }
  }
};
