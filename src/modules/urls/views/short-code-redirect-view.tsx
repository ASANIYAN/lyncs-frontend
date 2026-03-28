import { Link2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";
import { useShortCodeRedirect } from "../hooks/use-short-code-redirect";

const ShortCodeRedirectView = () => {
  const { shortCode = "" } = useParams();
  const { hasError, message } = useShortCodeRedirect(shortCode);

  return (
    <section className="font-geist min-h-dvh bg-lyncs-bg flex items-center justify-center px-5">
      <section className="w-full max-w-sm rounded-xl border border-lyncs-border bg-lyncs-card p-6 text-center space-y-4">
        <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-lyncs-accent-dim">
          <Link2 className="size-4 text-lyncs-accent" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xv font-semibold text-lyncs-text">
            {hasError ? "Link unavailable" : "Opening short link"}
          </h1>
          <p className="text-xiii text-lyncs-text-muted">{message}</p>
        </div>

        {hasError ? (
          <CustomButton asChild variant="primary" fullWidth size="lg">
            <Link to="/signup">Back to app</Link>
          </CustomButton>
        ) : (
          <p className="text-xs text-lyncs-text-muted">
            This should only take a second.
          </p>
        )}
      </section>
    </section>
  );
};

export default ShortCodeRedirectView;
