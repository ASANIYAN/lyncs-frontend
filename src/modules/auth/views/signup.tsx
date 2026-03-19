import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "@/components/layouts/auth-layout";
import SignupForm from "@/modules/auth/components/signup-form";

const Signup = () => {
  return (
    <AuthLayout>
      <section className="min-h-screen flex items-center justify-center px-5">
        <section className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-lyncs-accent rounded-lg size-7 flex items-center justify-center">
                <Link2 size={14} color="#0a0a0a" />
              </div>
              <span className="font-semibold text-xv text-lyncs-text tracking-[-0.3px]">
                Lyncs
              </span>
            </div>
            <h1 className="text-xxii font-semibold text-lyncs-text tracking-[-0.5px] mb-1.5">
              Create your account
            </h1>
            <p className="text-xiii text-lyncs-text-muted">
              Start shortening links in seconds
            </p>
          </div>

          <section className="bg-lyncs-card border border-lyncs-border rounded-xl p-7">
            <SignupForm />
          </section>

          <p className="text-center text-xii text-lyncs-text-muted mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-lyncs-text-subtle hover:text-lyncs-text font-medium transitions"
            >
              Sign in
            </Link>
          </p>
        </section>
      </section>
    </AuthLayout>
  );
};

export default Signup;
