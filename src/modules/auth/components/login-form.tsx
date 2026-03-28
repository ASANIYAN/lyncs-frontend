"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { CustomInput } from "@/components/custom-components/custom-input";
import AuthOtpDialog from "@/modules/auth/components/auth-otp-dialog";
import { useLoginForm } from "@/modules/auth/hooks/use-login-form";
import type { AuthTokens } from "@/modules/auth/types";

type LoginFormProps = {
  onAuthenticated?: (tokens: AuthTokens) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    form,
    isSubmittingCredentials,
    rootError,
    otpDialog,
    otpTitle,
    otpDescription,
    handleCredentialsSubmit,
    handleOtpVerify,
    handleResendOtp,
    setOtpDialog,
    closeOtpDialog,
  } = useLoginForm({
    onAuthenticated: (tokens) => {
      onAuthenticated?.(tokens);
      navigate("/dashboard");
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleToggleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePassword();
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleCredentialsSubmit)}
        className="space-y-3.5"
        noValidate
      >
        <CustomInput
          control={form.control}
          name="email"
          label="Email"
          requiredMark
          placeholder="you@example.com"
          type="email"
        />
        <CustomInput
          control={form.control}
          name="password"
          label="Password"
          requiredMark
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          rightIcon={
            <button
              type="button"
              onClick={togglePassword}
              onKeyDown={handleToggleKeyDown}
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {rootError ? <p className="text-xs text-lyncs-danger">{rootError}</p> : null}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-[11.5px] text-lyncs-text-muted hover:text-lyncs-text-subtle transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <CustomButton
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={isSubmittingCredentials}
          className="mt-1"
        >
          Sign in
        </CustomButton>
      </form>

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
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
      />
    </>
  );
};

export default LoginForm;
