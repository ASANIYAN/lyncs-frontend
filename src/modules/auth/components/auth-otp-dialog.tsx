import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LyncsDialog } from "@/components/custom-components/custom-dialog";
import { CustomButton } from "@/components/custom-components/custom-button";

interface AuthOtpDialogProps {
  open: boolean;
  title: string;
  description: string;
  otpCode: string;
  otpError?: string | null;
  isVerifying: boolean;
  isResending: boolean;
  resendCooldown: number;
  onOpenChange: (open: boolean) => void;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
}

const AuthOtpDialog = ({
  open,
  title,
  description,
  otpCode,
  otpError,
  isVerifying,
  isResending,
  resendCooldown,
  onOpenChange,
  onOtpChange,
  onVerify,
  onResend,
}: AuthOtpDialogProps) => {
  const isResendDisabled = resendCooldown > 0 || isResending || isVerifying;

  return (
    <LyncsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      maxWidth="sm:max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isVerifying || isResending}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="primary"
            loading={isVerifying}
            onClick={onVerify}
            disabled={otpCode.length !== 6 || isResending}
          >
            Verify code
          </CustomButton>
        </div>
      }
    >
      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <p className="text-[10.5px] font-bold text-lyncs-text-muted uppercase tracking-[0.5px]">
            One-time passcode
          </p>
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={onOtpChange}
            containerClassName="w-full justify-center"
            aria-invalid={otpError ? true : undefined}
            disabled={isVerifying}
          >
            <InputOTPGroup className="rounded-md overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-10 border-lyncs-border bg-lyncs-card text-lyncs-text text-sm font-medium"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {otpError ? (
            <p className="text-xs text-lyncs-danger">{otpError}</p>
          ) : (
            <p className="text-xs text-lyncs-text-muted">
              Enter the 6-digit code sent to your email.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-lyncs-text-muted">
            {resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "Didn't get the code?"}
          </span>
          <CustomButton
            variant="ghost"
            size="sm"
            loading={isResending}
            onClick={onResend}
            disabled={isResendDisabled}
          >
            Resend code
          </CustomButton>
        </div>
      </div>
    </LyncsDialog>
  );
};

export default AuthOtpDialog;
