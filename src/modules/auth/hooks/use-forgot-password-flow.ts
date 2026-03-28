import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { unauthApi } from "@/services/api-service";
import type { ForgotPasswordFlowStep } from "@/modules/auth/types";
import {
  ForgotPasswordRequestSchema,
  type ForgotPasswordRequestFormType,
  ResetPasswordSchema,
  type ResetPasswordFormType,
} from "@/modules/auth/utils/validations";

const RESEND_COOLDOWN_SECONDS = 30;

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
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [step, setStep] = React.useState<ForgotPasswordFlowStep>("request-otp");
  const [email, setEmail] = React.useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = React.useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = React.useState(false);
  const [isResendingOtp, setIsResendingOtp] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = React.useCallback(
    async (values: ForgotPasswordRequestFormType) => {
      setIsSubmittingRequest(true);
      requestForm.clearErrors("root");

      try {
        const { data } = await unauthApi.post<{ message: string }>(
          "/auth/forgot-password/request-otp",
          values,
        );
        setEmail(values.email);
        setStep("set-password");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        resetForm.reset((prev) => ({
          ...prev,
          otp: "",
        }));
        toast.success(data.message);
      } catch (error) {
        const message = getApiErrorMessage(error, "Could not request OTP right now.");
        requestForm.setError("root", {
          type: "manual",
          message,
        });
        toast.error(message);
      } finally {
        setIsSubmittingRequest(false);
      }
    },
    [requestForm, resetForm],
  );

  const handleResendOtp = React.useCallback(async () => {
    if (!email || resendCooldown > 0) return;
    setIsResendingOtp(true);

    try {
      const { data } = await unauthApi.post<{ message: string }>(
        "/auth/forgot-password/request-otp",
        { email },
      );
      toast.success(data.message);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not resend OTP now.");
      resetForm.setError("otp", {
        type: "manual",
        message,
      });
      toast.error(message);
    } finally {
      setIsResendingOtp(false);
    }
  }, [email, resendCooldown, resetForm]);

  const handleResetPassword = React.useCallback(
    async (values: ResetPasswordFormType) => {
      if (!email) return;

      setIsSubmittingReset(true);
      resetForm.clearErrors("root");

      try {
        await unauthApi.post("/auth/forgot-password/confirm", {
          email,
          otp: values.otp,
          newPassword: values.password,
        });
        setStep("success");
        toast.success("Password reset successful. You can now sign in.");
      } catch (error) {
        const message = getApiErrorMessage(error, "Could not reset password right now.");
        resetForm.setError("root", {
          type: "manual",
          message,
        });
        toast.error(message);
      } finally {
        setIsSubmittingReset(false);
      }
    },
    [email, resetForm],
  );

  return {
    step,
    email,
    requestForm,
    resetForm,
    isSubmittingRequest,
    isSubmittingReset,
    isResendingOtp,
    resendCooldown,
    handleRequestOtp,
    handleResendOtp,
    handleResetPassword,
  };
};
