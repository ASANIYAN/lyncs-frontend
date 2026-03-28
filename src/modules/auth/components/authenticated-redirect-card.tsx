import { Link2 } from "lucide-react";

import { CustomButton } from "@/components/custom-components/custom-button";
import { LyncsSpinner } from "@/components/custom-components/custom-spinner";

interface AuthenticatedRedirectCardProps {
  onContinue: () => void;
}

const AuthenticatedRedirectCard = ({
  onContinue,
}: AuthenticatedRedirectCardProps) => {
  return (
    <section className="font-geist bg-lyncs-bg w-full h-dvh overflow-hidden flex items-center justify-center px-5">
      <section className="w-full max-w-sm rounded-xl border border-lyncs-border bg-lyncs-card p-6 text-center space-y-4">
        <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-lyncs-accent-dim border border-lyncs-accent-border">
          <Link2 className="size-4 text-lyncs-accent" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xv font-semibold text-lyncs-text">
            You are already signed in
          </h2>
          <p className="text-xiii text-lyncs-text-muted">
            Taking you to your dashboard now...
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-[12px] text-lyncs-text-muted">
          <LyncsSpinner size="sm" />
          Redirecting
        </div>
        <CustomButton variant="primary" fullWidth size="lg" onClick={onContinue}>
          Go to dashboard
        </CustomButton>
      </section>
    </section>
  );
};

export default AuthenticatedRedirectCard;

