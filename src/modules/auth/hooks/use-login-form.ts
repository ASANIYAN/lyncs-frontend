import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError } from "react-hook-form";

import { mockAuthClient } from "@/modules/auth/services/mock-auth-client";
import {
  isOtpRequiredResponse,
  type AuthTokens,
  type LoginFlowStep,
  type LoginRequestPayload,
  type OtpDialogState,
} from "@/modules/auth/types";
import { LoginSchema, type LoginFormType } from "../utils/validations";

const RESEND_COOLDOWN_SECONDS = 30;

const defaultOtpDialogState: OtpDialogState = {
  isOpen: false,
  otpCode: "",
  otpError: null,
  isVerifying: false,
  isResending: false,
  resendCooldown: 0,
};

interface UseLoginFormOptions {
  onAuthenticated?: (tokens: AuthTokens) => void;
}

type UseLoginFormReturn = {
  form: ReturnType<typeof useForm<LoginFormType>>;
  step: LoginFlowStep;
  isSubmittingCredentials: boolean;
  rootError: string | null;
  otpDialog: OtpDialogState;
  otpTitle: string;
  otpDescription: string;
  handleCredentialsSubmit: (values: LoginFormType) => Promise<void>;
  handleOtpVerify: () => Promise<void>;
  handleResendOtp: () => Promise<void>;
  closeOtpDialog: () => void;
  setOtpDialog: React.Dispatch<React.SetStateAction<OtpDialogState>>;
};

export const useLoginForm = (
  options?: UseLoginFormOptions,
): UseLoginFormReturn => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [step, setStep] = React.useState<LoginFlowStep>("credentials");
  const [isSubmittingCredentials, setIsSubmittingCredentials] =
    React.useState(false);
  const [otpDescription, setOtpDescription] = React.useState(
    "Confirm your sign-in with your one-time passcode.",
  );
  const [pendingPayload, setPendingPayload] =
    React.useState<LoginRequestPayload | null>(null);
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
    setStep("credentials");
  }, []);

  const handleCredentialsSubmit = React.useCallback(
    async (values: LoginFormType) => {
      setIsSubmittingCredentials(true);
      form.clearErrors("root");

      try {
        // TODO(auth-api): Replace mock auth client with real POST /auth/login call.
        const response = await mockAuthClient.login(values);
        if (isOtpRequiredResponse(response)) {
          setPendingPayload(values);
          setStep("otp");
          setOtpDescription(response.message);
          setOtpDialog({
            ...defaultOtpDialogState,
            isOpen: true,
            resendCooldown: RESEND_COOLDOWN_SECONDS,
          });
          return;
        }

        setStep("authenticated");
        options?.onAuthenticated?.(response);
      } catch (error) {
        form.setError("root", {
          type: "manual",
          message:
            error instanceof Error ? error.message : "Unable to sign in now.",
        });
      } finally {
        setIsSubmittingCredentials(false);
      }
    },
    [form, options],
  );

  const handleOtpVerify = React.useCallback(async () => {
    if (!pendingPayload || otpDialog.otpCode.length !== 6) return;

    setOtpDialog((prev) => ({
      ...prev,
      isVerifying: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real verify-login-otp endpoint.
      const tokens = await mockAuthClient.verifyLoginOtp({
        ...pendingPayload,
        otp: otpDialog.otpCode,
      });
      setStep("authenticated");
      setOtpDialog(defaultOtpDialogState);
      options?.onAuthenticated?.(tokens);
    } catch (error) {
      setOtpDialog((prev) => ({
        ...prev,
        otpError:
          error instanceof Error
            ? error.message
            : "Invalid code. Please try again.",
      }));
    } finally {
      setOtpDialog((prev) => ({
        ...prev,
        isVerifying: false,
      }));
    }
  }, [options, otpDialog.otpCode, pendingPayload]);

  const handleResendOtp = React.useCallback(async () => {
    if (!pendingPayload || otpDialog.resendCooldown > 0) return;
    setOtpDialog((prev) => ({
      ...prev,
      isResending: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real resend-otp endpoint.
      await mockAuthClient.resendOtp("login", pendingPayload.email);
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
  }, [otpDialog.resendCooldown, pendingPayload]);

  const rootError = form.formState.errors.root as FieldError | undefined;

  return {
    form,
    step,
    isSubmittingCredentials,
    rootError: rootError?.message ?? null,
    otpDialog,
    otpTitle: "Verify sign in",
    otpDescription,
    handleCredentialsSubmit,
    handleOtpVerify,
    handleResendOtp,
    closeOtpDialog,
    setOtpDialog,
  };
};
