import * as React from "react";
import { toast } from "sonner";

import SessionTimeoutWarningModal from "@/modules/system/components/session-timeout-warning-modal";
import { runCentralizedLogout } from "@/modules/system/session/centralized-logout";
import {
  SESSION_TIMEOUT_CONFIG,
  sessionTimeoutManager,
} from "@/modules/system/session/session-timeout-manager";
import { subscribeToSessionEvents } from "@/modules/system/session/session-sync";
import { useAuthStore } from "@/store/auth-store";

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
}

const SessionTimeoutProvider = ({ children }: SessionTimeoutProviderProps) => {
  const { isAuthenticated } = useAuthStore();
  const [warningOpen, setWarningOpen] = React.useState(false);
  const [remainingTimeMs, setRemainingTimeMs] = React.useState(0);

  React.useEffect(() => {
    if (!isAuthenticated) {
      sessionTimeoutManager.cleanup();
      setWarningOpen(false);
      return;
    }

    sessionTimeoutManager.init({
      inactivityTimeoutMs: SESSION_TIMEOUT_CONFIG.inactivityTimeoutMs,
      warningBeforeExpiryMs: SESSION_TIMEOUT_CONFIG.warningBeforeExpiryMs,
      checkIntervalMs: SESSION_TIMEOUT_CONFIG.checkIntervalMs,
      onWarning: () => {
        setRemainingTimeMs(sessionTimeoutManager.getRemainingTimeMs());
        setWarningOpen(true);
      },
      onTimeout: () => {
        setWarningOpen(false);
        runCentralizedLogout({
          reason: "timeout",
          shouldBroadcast: true,
        });
      },
    });

    const unsubscribe = subscribeToSessionEvents((event) => {
      if (event.type !== "logout") return;
      setWarningOpen(false);
      runCentralizedLogout({
        reason: "sync",
        shouldBroadcast: false,
      });
    });

    return () => {
      unsubscribe();
      sessionTimeoutManager.cleanup();
    };
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!isAuthenticated || !warningOpen) return;

    const timer = window.setInterval(() => {
      setRemainingTimeMs(sessionTimeoutManager.getRemainingTimeMs());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isAuthenticated, warningOpen]);

  const handleStayLoggedIn = () => {
    sessionTimeoutManager.extendSession();
    setWarningOpen(false);
    toast.success("Session extended.");
  };

  const handleLogoutNow = () => {
    setWarningOpen(false);
    runCentralizedLogout({
      reason: "logout_now",
      shouldBroadcast: true,
    });
  };

  return (
    <>
      {children}
      <SessionTimeoutWarningModal
        open={isAuthenticated && warningOpen}
        remainingTimeMs={remainingTimeMs}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogoutNow}
      />
    </>
  );
};

export default SessionTimeoutProvider;

