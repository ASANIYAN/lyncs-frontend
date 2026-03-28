import * as React from "react";
import { useNavigate } from "react-router-dom";

import AuthenticatedRedirectCard from "@/modules/auth/components/authenticated-redirect-card";
import { useAuthStore } from "@/store/auth-store";

import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const timer = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <AuthenticatedRedirectCard
        onContinue={() => navigate("/dashboard", { replace: true })}
      />
    );
  }

  return (
    <section className="font-geist bg-lyncs-bg w-full h-dvh overflow-hidden">
      {children}
    </section>
  );
};

export default AuthLayout;
