"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { CustomInput } from "@/components/custom-components/custom-input";
import { useSignupForm } from "@/modules/auth/hooks/use-signup-form";
import type { SignupFormType } from "@/modules/auth/utils/validations";

type SignupFormProps = {
  onSubmit?: (data: SignupFormType) => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const { form } = useSignupForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleDefaultSubmit = React.useCallback(
    (data: SignupFormType) => {
      console.log("Signup:", data);
      navigate("/dashboard");
    },
    [navigate],
  );

  const handleSubmit = onSubmit ?? handleDefaultSubmit;

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
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
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
            onKeyDown={(event) => handleToggleKeyDown(togglePassword, event)}
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
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />
      <CustomButton
        type="submit"
        variant="primary"
        fullWidth
        size={"lg"}
        className="mt-1"
      >
        Create account
      </CustomButton>
    </form>
  );
};

export default SignupForm;
