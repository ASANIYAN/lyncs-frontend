"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { CustomInput } from "@/components/custom-components/custom-input";
import { useLoginForm } from "@/modules/auth/hooks/use-login-form";
import type { LoginFormType } from "@/modules/auth/utils/validations";

type LoginFormProps = {
  onSubmit?: (data: LoginFormType) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { form } = useLoginForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleDefaultSubmit = React.useCallback(
    (data: LoginFormType) => {
      console.log("Login:", data);
      navigate("/dashboard");
    },
    [navigate],
  );

  const handleSubmit = onSubmit ?? handleDefaultSubmit;

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
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
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
      <div className="flex items-center justify-end">
        <a
          href="#"
          className="text-[11.5px] text-lyncs-text-muted hover:text-lyncs-text-subtle transition-colors"
        >
          Forgot password?
        </a>
      </div>
      <CustomButton
        type="submit"
        variant="primary"
        fullWidth
        size={"lg"}
        className="mt-1"
      >
        Sign in
      </CustomButton>
    </form>
  );
};

export default LoginForm;
