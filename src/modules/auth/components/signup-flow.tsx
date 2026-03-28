"use client";

import AuthOtpDialog from "@/modules/auth/components/auth-otp-dialog";
import SignupForm from "@/modules/auth/components/signup-form";
import SignupSuccessView from "@/modules/auth/components/signup-success-view";
import { useSignupForm } from "@/modules/auth/hooks/use-signup-form";

const SignupFlow = () => {
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

  return (
    <>
      {step === "success" ? (
        <SignupSuccessView successMessage={successMessage} />
      ) : (
        <SignupForm
          form={form}
          rootError={rootError}
          isSubmittingCredentials={isSubmittingCredentials}
          onSubmit={handleCredentialsSubmit}
        />
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

export default SignupFlow;

