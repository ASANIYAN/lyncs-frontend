"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { CustomInput } from "@/components/custom-components/custom-input";
import AuthOtpDialog from "@/modules/auth/components/auth-otp-dialog";
import { useForgotPasswordFlow } from "@/modules/auth/hooks/use-forgot-password-flow";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    step,
    email,
    requestForm,
    resetForm,
    isSubmittingRequest,
    isSubmittingReset,
    otpDialog,
    otpTitle,
    otpDescription,
    setOtpDialog,
    closeOtpDialog,
    handleRequestOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
  } = useForgotPasswordFlow();

  const handleToggleKeyDown = (
    toggle: () => void,
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  if (step === "success") {
    return (
      <section className="space-y-4 text-center py-1">
        <div className="space-y-1.5">
          <h2 className="text-xvi font-semibold text-lyncs-text tracking-[-0.3px]">
            Password reset complete
          </h2>
          <p className="text-xiii text-lyncs-text-muted">
            Your new password is set. You can now sign in with it.
          </p>
        </div>
        <CustomButton
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => navigate("/login")}
        >
          Back to login
        </CustomButton>
      </section>
    );
  }

  return (
    <>
      {step === "request-otp" ? (
        <form
          onSubmit={requestForm.handleSubmit(handleRequestOtp)}
          className="space-y-3.5"
          noValidate
        >
          <CustomInput
            control={requestForm.control}
            name="email"
            label="Email"
            requiredMark
            placeholder="you@example.com"
            type="email"
          />
          {requestForm.formState.errors.root?.message ? (
            <p className="text-xs text-lyncs-danger">
              {requestForm.formState.errors.root.message}
            </p>
          ) : null}
          <CustomButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={isSubmittingRequest}
          >
            Request OTP
          </CustomButton>
          <CustomButton
            type="button"
            variant="secondary"
            fullWidth
            size="lg"
            onClick={() => navigate("/login")}
          >
            Back to login
          </CustomButton>
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(handleResetPassword)}
          className="space-y-3.5"
          noValidate
        >
          <div className="text-xs text-lyncs-text-muted">
            Resetting password for{" "}
            <span className="text-lyncs-text font-medium">{email}</span>
          </div>
          <CustomInput
            control={resetForm.control}
            name="password"
            label="New password"
            requiredMark
            placeholder="Enter a new password"
            type={showPassword ? "text" : "password"}
            description="At least 8 characters, with uppercase, lowercase, number, and special character."
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={(event) =>
                  handleToggleKeyDown(
                    () => setShowPassword((prev) => !prev),
                    event,
                  )
                }
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <CustomInput
            control={resetForm.control}
            name="confirmPassword"
            label="Confirm password"
            requiredMark
            placeholder="Re-enter your new password"
            type={showConfirmPassword ? "text" : "password"}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                onKeyDown={(event) =>
                  handleToggleKeyDown(
                    () => setShowConfirmPassword((prev) => !prev),
                    event,
                  )
                }
                tabIndex={0}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          {resetForm.formState.errors.root?.message ? (
            <p className="text-xs text-lyncs-danger">
              {resetForm.formState.errors.root.message}
            </p>
          ) : null}
          <CustomButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={isSubmittingReset}
          >
            Reset password
          </CustomButton>
        </form>
      )}

      <AuthOtpDialog
        open={otpDialog.isOpen}
        title={otpTitle}
        description={otpDescription}
        otpCode={otpDialog.otpCode}
        otpError={otpDialog.otpError}
        isVerifying={otpDialog.isVerifying}
        isResending={otpDialog.isResending}
        resendCooldown={otpDialog.resendCooldown}
        onOpenChange={(open) => {
          if (!open) {
            closeOtpDialog();
            return;
          }
          setOtpDialog((prev) => ({ ...prev, isOpen: open }));
        }}
        onOtpChange={(value) =>
          setOtpDialog((prev) => ({
            ...prev,
            otpCode: value,
            otpError: null,
          }))
        }
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </>
  );
};

export default ForgotPasswordForm;
