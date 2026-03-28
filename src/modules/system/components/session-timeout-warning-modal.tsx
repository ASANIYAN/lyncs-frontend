import { CustomButton } from "@/components/custom-components/custom-button";
import { LyncsDialog } from "@/components/custom-components/custom-dialog";

interface SessionTimeoutWarningModalProps {
  open: boolean;
  remainingTimeMs: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

const formatCountdown = (remainingTimeMs: number) => {
  const totalSeconds = Math.max(0, Math.ceil(remainingTimeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const SessionTimeoutWarningModal = ({
  open,
  remainingTimeMs,
  onStayLoggedIn,
  onLogoutNow,
}: SessionTimeoutWarningModalProps) => {
  return (
    <LyncsDialog
      open={open}
      onOpenChange={() => {
        // Non-dismissable by outside click/escape to prevent accidental bypass.
      }}
      showCloseButton={false}
      title="Session expiring soon"
      description="For your security, you will be signed out if there is no activity."
      maxWidth="sm:max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant="secondary"
            size="lg"
            onClick={onLogoutNow}
            aria-label="Logout now"
          >
            Logout now
          </CustomButton>
          <CustomButton
            variant="primary"
            size="lg"
            onClick={onStayLoggedIn}
            aria-label="Stay logged in"
          >
            Stay logged in
          </CustomButton>
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-xiii text-lyncs-text-muted">
          You will be logged out in:
        </p>
        <p
          className="font-mono text-[28px] leading-none text-lyncs-accent"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatCountdown(remainingTimeMs)}
        </p>
      </div>
    </LyncsDialog>
  );
};

export default SessionTimeoutWarningModal;

