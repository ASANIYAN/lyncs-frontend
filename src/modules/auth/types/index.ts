export type AuthOtpIntent = "login" | "signup" | "forgot-password";

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface LoginOtpRequiredResponse {
  otpRequired: true;
  message: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type LoginResponse = LoginOtpRequiredResponse | LoginSuccessResponse;

export const isOtpRequiredResponse = (
  res: LoginResponse,
): res is LoginOtpRequiredResponse => {
  return "otpRequired" in res && res.otpRequired === true;
};

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
}

export interface SignupOtpRequestPayload {
  email: string;
  password: string;
}

export interface SignupVerifyPayload extends SignupOtpRequestPayload {
  otp: string;
}

export interface ForgotPasswordOtpRequestPayload {
  email: string;
}

export interface ForgotPasswordVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordResetPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface OtpActionResponse {
  message: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type LoginFlowStep = "credentials" | "otp" | "authenticated";
export type SignupFlowStep = "credentials" | "otp" | "success";
export type ForgotPasswordFlowStep = "request-otp" | "set-password" | "success";

export interface ResendState {
  isResending: boolean;
  resendCooldown: number;
}

export interface OtpDialogState extends ResendState {
  isOpen: boolean;
  otpCode: string;
  otpError: string | null;
  isVerifying: boolean;
}
