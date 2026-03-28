"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { CustomInput } from "@/components/custom-components/custom-input";
import AuthOtpDialog from "@/modules/auth/components/auth-otp-dialog";
import { useSignupForm } from "@/modules/auth/hooks/use-signup-form";

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    form,
    step,
    rootError,
    successMessage,
    isSubmittingCredentials,
    otpDialog,
    otpTitle,
    otpDescription,
    setOtpDialog,
    closeOtpDialog,
    handleCredentialsSubmit,
    handleVerifyOtp,
    handleResendOtp,
  } = useSignupForm();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleToggleKeyDown = (
    toggle: () => void,
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <>
      {step === "success" ? (
        <section className="space-y-4 text-center py-1">
          <div className="space-y-1.5">
            <h2 className="text-xvi font-semibold text-lyncs-text tracking-[-0.3px]">
              Account created
            </h2>
            <p className="text-xiii text-lyncs-text-muted">{successMessage}</p>
          </div>
          <div className="">
            <CustomButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => navigate("/login")}
            >
              Continue to sign in
            </CustomButton>
          </div>
        </section>
      ) : (
        <form
          onSubmit={form.handleSubmit(handleCredentialsSubmit)}
          className="space-y-3.5"
          noValidate
        >
          <CustomInput
            control={form.control}
            name="email"
            label="Email address"
            requiredMark
            placeholder="you@example.com"
            type="email"
          />
          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            requiredMark
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            description="At least 8 characters, with uppercase, lowercase, number, and special character."
            rightIcon={
              <button
                type="button"
                onClick={togglePassword}
                onKeyDown={(event) =>
                  handleToggleKeyDown(togglePassword, event)
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
            control={form.control}
            name="confirmPassword"
            label="Confirm password"
            requiredMark
            placeholder="Re-enter your password"
            type={showConfirmPassword ? "text" : "password"}
            rightIcon={
              <button
                type="button"
                onClick={toggleConfirmPassword}
                onKeyDown={(event) =>
                  handleToggleKeyDown(toggleConfirmPassword, event)
                }
                tabIndex={0}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          {rootError ? (
            <p className="text-xs text-lyncs-danger">{rootError}</p>
          ) : null}
          <CustomButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={isSubmittingCredentials}
            className="mt-1"
          >
            Signup
          </CustomButton>
          <p className="text-[11.5px] text-center text-lyncs-text-muted">
            Already have a code?{" "}
            <Link
              to="/login"
              className="text-lyncs-text-subtle hover:text-lyncs-text transition-colors"
            >
              Sign in instead
            </Link>
          </p>
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

export default SignupForm;
