import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { primeSessionActivityTimestamp } from "@/modules/system/session/session-timeout-manager";
import { unauthApi } from "@/services/api-service";
import { setAuthSession } from "@/store/auth-store";
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
        const { data } = await unauthApi.post<
          AuthTokens | { otpRequired: true; message: string }
        >("/auth/login", values);

        if (isOtpRequiredResponse(data)) {
          setPendingPayload(values);
          setStep("otp");
          setOtpDescription(data.message);
          toast.success(data.message);
          setOtpDialog({
            ...defaultOtpDialogState,
            isOpen: true,
            resendCooldown: RESEND_COOLDOWN_SECONDS,
          });
          return;
        }

        setAuthSession({
          ...data,
          email: values.email,
        });
        primeSessionActivityTimestamp();
        setStep("authenticated");
        toast.success("Signed in successfully.");
        options?.onAuthenticated?.(data);
      } catch (error) {
        const message = getApiErrorMessage(error, "Unable to sign in now.");
        form.setError("root", {
          type: "manual",
          message,
        });
        toast.error(message);
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
      const { data } = await unauthApi.post<AuthTokens>("/auth/login/verify-otp", {
        email: pendingPayload.email,
        otp: otpDialog.otpCode,
      });
      setAuthSession({
        ...data,
        email: pendingPayload.email,
      });
      primeSessionActivityTimestamp();
      setStep("authenticated");
      setOtpDialog(defaultOtpDialogState);
      toast.success("Signed in successfully.");
      options?.onAuthenticated?.(data);
    } catch (error) {
      const message = getApiErrorMessage(error, "Invalid code. Please try again.");
      setOtpDialog((prev) => ({
        ...prev,
        otpError: message,
      }));
      toast.error(message);
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
      const { data } = await unauthApi.post<
        AuthTokens | { otpRequired: true; message: string }
      >("/auth/login", pendingPayload);

      if (isOtpRequiredResponse(data)) {
        setOtpDescription(data.message);
        toast.success(data.message);
      } else {
        setAuthSession({
          ...data,
          email: pendingPayload.email,
        });
        primeSessionActivityTimestamp();
        setStep("authenticated");
        setOtpDialog(defaultOtpDialogState);
        toast.success("Signed in successfully.");
        options?.onAuthenticated?.(data);
        return;
      }

      setOtpDialog((prev) => ({
        ...prev,
        resendCooldown: RESEND_COOLDOWN_SECONDS,
      }));
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not resend OTP now.");
      setOtpDialog((prev) => ({
        ...prev,
        otpError: message,
      }));
      toast.error(message);
    } finally {
      setOtpDialog((prev) => ({
        ...prev,
        isResending: false,
      }));
    }
  }, [options, otpDialog.resendCooldown, pendingPayload]);

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
