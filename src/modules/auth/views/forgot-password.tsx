import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "@/components/layouts/auth-layout";
import ForgotPasswordForm from "@/modules/auth/components/forgot-password-form";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <section className="min-h-screen flex items-center justify-center px-5">
        <section className="w-full max-w-sm">
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-lyncs-accent rounded-lg size-7 flex items-center justify-center">
                <Link2 size={14} color="#0a0a0a" />
              </div>
              <span className="font-semibold text-xv text-lyncs-text tracking-[-0.3px]">
                Lyncs
              </span>
            </div>
            <h1 className="text-xxii font-semibold text-lyncs-text tracking-[-0.5px] mb-1.5">
              Reset your password
            </h1>
            <p className="text-xiii text-lyncs-text-muted">
              Request an OTP and set a new password
            </p>
          </div>

          <section className="bg-lyncs-card border border-lyncs-border rounded-xl p-7">
            <ForgotPasswordForm />
          </section>

          <p className="text-center text-xs text-lyncs-text-muted pt-4">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-lyncs-text-subtle hover:text-lyncs-text font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </section>
      </section>
    </AuthLayout>
  );
};

export default ForgotPassword;
