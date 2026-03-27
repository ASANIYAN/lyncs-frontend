import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { mockAuthClient } from "@/modules/auth/services/mock-auth-client";
import type {
  ForgotPasswordFlowStep,
  OtpDialogState,
} from "@/modules/auth/types";
import {
  ForgotPasswordRequestSchema,
  type ForgotPasswordRequestFormType,
  ResetPasswordSchema,
  type ResetPasswordFormType,
} from "@/modules/auth/utils/validations";

const RESEND_COOLDOWN_SECONDS = 30;

const defaultOtpDialogState: OtpDialogState = {
  isOpen: false,
  otpCode: "",
  otpError: null,
  isVerifying: false,
  isResending: false,
  resendCooldown: 0,
};

export const useForgotPasswordFlow = () => {
  const requestForm = useForm<ForgotPasswordRequestFormType>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const resetForm = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [step, setStep] = React.useState<ForgotPasswordFlowStep>("request-otp");
  const [email, setEmail] = React.useState("");
  const [verifiedOtp, setVerifiedOtp] = React.useState("");
  const [otpDescription, setOtpDescription] = React.useState(
    "Enter the verification code sent to your email.",
  );
  const [isSubmittingRequest, setIsSubmittingRequest] = React.useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = React.useState(false);
  const [otpDialog, setOtpDialog] = React.useState<OtpDialogState>(
    defaultOtpDialogState,
  );

  React.useEffect(() => {
    if (otpDialog.resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpDialog((prev) => ({
        ...prev,
        resendCooldown: Math.max(0, prev.resendCooldown - 1),
      }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpDialog.resendCooldown]);

  const closeOtpDialog = React.useCallback(() => {
    setOtpDialog(defaultOtpDialogState);
  }, []);

  const handleRequestOtp = React.useCallback(
    async (values: ForgotPasswordRequestFormType) => {
      setIsSubmittingRequest(true);
      requestForm.clearErrors("root");

      try {
        // TODO(auth-api): Replace mock auth client with real forgot-password OTP request endpoint.
        const response = await mockAuthClient.requestForgotPasswordOtp(values);
        setEmail(values.email);
        setOtpDescription(response.message);
        setOtpDialog({
          ...defaultOtpDialogState,
          isOpen: true,
          resendCooldown: RESEND_COOLDOWN_SECONDS,
        });
      } catch (error) {
        requestForm.setError("root", {
          type: "manual",
          message:
            error instanceof Error
              ? error.message
              : "Could not request OTP right now.",
        });
      } finally {
        setIsSubmittingRequest(false);
      }
    },
    [requestForm],
  );

  const handleVerifyOtp = React.useCallback(async () => {
    if (!email || otpDialog.otpCode.length !== 6) return;

    setOtpDialog((prev) => ({
      ...prev,
      isVerifying: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real forgot-password OTP verify endpoint.
      await mockAuthClient.verifyForgotPasswordOtp({
        email,
        otp: otpDialog.otpCode,
      });
      setVerifiedOtp(otpDialog.otpCode);
      setStep("set-password");
      setOtpDialog(defaultOtpDialogState);
    } catch (error) {
      setOtpDialog((prev) => ({
        ...prev,
        otpError:
          error instanceof Error
            ? error.message
            : "Could not verify your OTP code.",
      }));
    } finally {
      setOtpDialog((prev) => ({
        ...prev,
        isVerifying: false,
      }));
    }
  }, [email, otpDialog.otpCode]);

  const handleResendOtp = React.useCallback(async () => {
    if (!email || otpDialog.resendCooldown > 0) return;
    setOtpDialog((prev) => ({
      ...prev,
      isResending: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real resend-otp endpoint.
      const response = await mockAuthClient.resendOtp("forgot-password", email);
      setOtpDescription(response.message);
      setOtpDialog((prev) => ({
        ...prev,
        resendCooldown: RESEND_COOLDOWN_SECONDS,
      }));
    } catch (error) {
      setOtpDialog((prev) => ({
        ...prev,
        otpError:
          error instanceof Error ? error.message : "Could not resend OTP now.",
      }));
    } finally {
      setOtpDialog((prev) => ({
        ...prev,
        isResending: false,
      }));
    }
  }, [email, otpDialog.resendCooldown]);

  const handleResetPassword = React.useCallback(
    async (values: ResetPasswordFormType) => {
      if (!email || !verifiedOtp) return;

      setIsSubmittingReset(true);
      resetForm.clearErrors("root");

      try {
        // TODO(auth-api): Replace mock auth client with real reset-password endpoint.
        await mockAuthClient.resetPassword({
          email,
          otp: verifiedOtp,
          newPassword: values.password,
        });
        setStep("success");
      } catch (error) {
        resetForm.setError("root", {
          type: "manual",
          message:
            error instanceof Error
              ? error.message
              : "Could not reset password right now.",
        });
      } finally {
        setIsSubmittingReset(false);
      }
    },
    [email, resetForm, verifiedOtp],
  );

  return {
    step,
    email,
    requestForm,
    resetForm,
    isSubmittingRequest,
    isSubmittingReset,
    otpDialog,
    otpTitle: "Verify reset code",
    otpDescription,
    setOtpDialog,
    closeOtpDialog,
    handleRequestOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
  };
};
