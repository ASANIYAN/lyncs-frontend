import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError } from "react-hook-form";

import { mockAuthClient } from "@/modules/auth/services/mock-auth-client";
import type {
  OtpDialogState,
  SignupFlowStep,
  SignupOtpRequestPayload,
} from "@/modules/auth/types";
import { SignupSchema, type SignupFormType } from "../utils/validations";

const RESEND_COOLDOWN_SECONDS = 30;

const defaultOtpDialogState: OtpDialogState = {
  isOpen: false,
  otpCode: "",
  otpError: null,
  isVerifying: false,
  isResending: false,
  resendCooldown: 0,
};

type UseSignupFormReturn = {
  form: ReturnType<typeof useForm<SignupFormType>>;
  step: SignupFlowStep;
  isSubmittingCredentials: boolean;
  rootError: string | null;
  successMessage: string;
  otpDialog: OtpDialogState;
  otpTitle: string;
  otpDescription: string;
  setOtpDialog: React.Dispatch<React.SetStateAction<OtpDialogState>>;
  closeOtpDialog: () => void;
  handleCredentialsSubmit: (values: SignupFormType) => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleResendOtp: () => Promise<void>;
};

export const useSignupForm = (): UseSignupFormReturn => {
  const form = useForm<SignupFormType>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [step, setStep] = React.useState<SignupFlowStep>("credentials");
  const [isSubmittingCredentials, setIsSubmittingCredentials] =
    React.useState(false);
  const [otpDescription, setOtpDescription] = React.useState(
    "Enter the code we sent to complete your account setup.",
  );
  const [successMessage, setSuccessMessage] = React.useState(
    "Your account has been created successfully.",
  );
  const [pendingPayload, setPendingPayload] =
    React.useState<SignupOtpRequestPayload | null>(null);
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
    async (values: SignupFormType) => {
      setIsSubmittingCredentials(true);
      form.clearErrors("root");

      const payload: SignupOtpRequestPayload = {
        email: values.email,
        password: values.password,
      };

      try {
        // TODO(auth-api): Replace mock auth client with real signup OTP request endpoint.
        const response = await mockAuthClient.requestSignupOtp(payload);
        setPendingPayload(payload);
        setStep("otp");
        setOtpDescription(response.message);
        setOtpDialog({
          ...defaultOtpDialogState,
          isOpen: true,
          resendCooldown: RESEND_COOLDOWN_SECONDS,
        });
      } catch (error) {
        form.setError("root", {
          type: "manual",
          message:
            error instanceof Error
              ? error.message
              : "Could not start signup flow.",
        });
      } finally {
        setIsSubmittingCredentials(false);
      }
    },
    [form],
  );

  const handleVerifyOtp = React.useCallback(async () => {
    if (!pendingPayload || otpDialog.otpCode.length !== 6) return;

    setOtpDialog((prev) => ({
      ...prev,
      isVerifying: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real signup OTP verify endpoint.
      const response = await mockAuthClient.verifySignupOtp({
        ...pendingPayload,
        otp: otpDialog.otpCode,
      });
      setSuccessMessage(response.message);
      setStep("success");
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
  }, [otpDialog.otpCode, pendingPayload]);

  const handleResendOtp = React.useCallback(async () => {
    if (!pendingPayload || otpDialog.resendCooldown > 0) return;
    setOtpDialog((prev) => ({
      ...prev,
      isResending: true,
      otpError: null,
    }));

    try {
      // TODO(auth-api): Replace mock auth client with real resend-otp endpoint.
      const response = await mockAuthClient.resendOtp(
        "signup",
        pendingPayload.email,
      );
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
  }, [otpDialog.resendCooldown, pendingPayload]);

  const rootError = form.formState.errors.root as FieldError | undefined;

  return {
    form,
    step,
    isSubmittingCredentials,
    rootError: rootError?.message ?? null,
    successMessage,
    otpDialog,
    otpTitle: "Verify your email",
    otpDescription,
    setOtpDialog,
    closeOtpDialog,
    handleCredentialsSubmit,
    handleVerifyOtp,
    handleResendOtp,
  };
};
