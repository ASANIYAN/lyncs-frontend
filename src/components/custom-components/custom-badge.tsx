import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const lyncsBadgeVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      active:
        "bg-lyncs-accent-dim text-lyncs-accent border border-lyncs-accent-border text-[11px] font-medium px-2 py-0.5 rounded-xs",
      inactive:
        "bg-lyncs-elevated text-lyncs-text-muted border border-lyncs-border text-[11px] font-medium px-2 py-0.5 rounded-xs",
      danger:
        "bg-lyncs-danger-dim text-lyncs-danger border border-lyncs-danger-border text-[11px] font-medium px-2 py-0.5 rounded-xs",
      warning:
        "bg-lyncs-warning-dim text-lyncs-warning border border-lyncs-warning-dim text-[11px] font-medium px-2 py-0.5 rounded-xs",
      info: "bg-lyncs-info-dim text-lyncs-info border border-lyncs-info-dim text-[11px] font-medium px-2 py-0.5 rounded-xs",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

interface LyncsBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant">,
    VariantProps<typeof lyncsBadgeVariants> {
  className?: string;
}

const LyncsBadge = ({ className, variant, ...props }: LyncsBadgeProps) => {
  return (
    <Badge
      data-slot="lyncs-badge"
      className={cn(lyncsBadgeVariants({ variant }), className)}
      {...props}
    />
  );
};

interface ShortCodePillProps extends React.ComponentProps<"span"> {
  code: string;
}

const ShortCodePill = ({ code, className, ...props }: ShortCodePillProps) => {
  return (
    <span
      data-slot="short-code-pill"
      className={cn(
        "font-mono text-xii text-lyncs-accent bg-lyncs-accent-dim px-2 py-0.5 rounded-xs",
        className,
      )}
      {...props}
    >
      /{code}
    </span>
  );
};

export { Badge, LyncsBadge, ShortCodePill };
