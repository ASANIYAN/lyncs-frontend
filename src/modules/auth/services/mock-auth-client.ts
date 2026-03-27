import type {
  AuthOtpIntent,
  AuthTokens,
  ForgotPasswordOtpRequestPayload,
  ForgotPasswordResetPayload,
  ForgotPasswordVerifyOtpPayload,
  LoginRequestPayload,
  LoginResponse,
  OtpActionResponse,
  SignupOtpRequestPayload,
  SignupVerifyPayload,
  VerifyLoginOtpPayload,
} from "@/modules/auth/types";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const buildMockTokens = (): AuthTokens => ({
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresIn: 3600,
});

class MockAuthClient {
  async login(payload: LoginRequestPayload): Promise<LoginResponse> {
    await wait(850);

    if (payload.email.includes("otp")) {
      return {
        otpRequired: true,
        message: "We sent a 6-digit code to your email.",
      };
    }

    return buildMockTokens();
  }

  async verifyLoginOtp(payload: VerifyLoginOtpPayload): Promise<AuthTokens> {
    await wait(900);

    if (payload.otp !== "123456") {
      throw new Error("Invalid OTP code. Please try again.");
    }

    return buildMockTokens();
  }

  async requestSignupOtp(
    payload: SignupOtpRequestPayload,
  ): Promise<OtpActionResponse> {
    await wait(900);

    if (payload.email.includes("taken")) {
      throw new Error("An account already exists with this email.");
    }

    return {
      message: "Verification code sent. Enter it to complete your signup.",
    };
  }

  async verifySignupOtp(payload: SignupVerifyPayload): Promise<OtpActionResponse> {
    await wait(900);

    if (payload.otp !== "123456") {
      throw new Error("Invalid OTP code. Please check and try again.");
    }

    return {
      message: "Your account has been created successfully.",
    };
  }

  async requestForgotPasswordOtp(
    payload: ForgotPasswordOtpRequestPayload,
  ): Promise<OtpActionResponse> {
    await wait(800);

    if (payload.email.includes("unknown")) {
      throw new Error("We could not find an account with that email.");
    }

    return {
      message: "A reset code has been sent to your email.",
    };
  }

  async verifyForgotPasswordOtp(
    payload: ForgotPasswordVerifyOtpPayload,
  ): Promise<OtpActionResponse> {
    await wait(800);

    if (payload.otp === "000000") {
      throw new Error("OTP has expired. Please request a new code.");
    }

    if (payload.otp !== "123456") {
      throw new Error("Invalid OTP code. Please try again.");
    }

    return {
      message: "Code verified. You can now set a new password.",
    };
  }

  async resetPassword(
    payload: ForgotPasswordResetPayload,
  ): Promise<OtpActionResponse> {
    await wait(850);

    if (payload.otp === "000000") {
      throw new Error("OTP has expired. Please request a new code.");
    }

    return {
      message: "Password reset successful.",
    };
  }

  async resendOtp(
    _intent: AuthOtpIntent,
    _email: string,
  ): Promise<OtpActionResponse> {
    await wait(700);

    return {
      message: "A new verification code has been sent.",
    };
  }
}

export const mockAuthClient = new MockAuthClient();
