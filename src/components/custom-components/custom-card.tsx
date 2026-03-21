import * as React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

interface LyncsCardProps extends React.ComponentProps<typeof Card> {
  className?: string;
}

const LyncsCard = ({ className, ...props }: LyncsCardProps) => {
  return (
    <Card
      data-slot="lyncs-card"
      className={cn(
        "bg-lyncs-card border border-lyncs-border rounded-xl text-lyncs-text",
        className,
      )}
      {...props}
    />
  );
};

interface LyncsStatCardProps extends React.ComponentProps<"div"> {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}

const LyncsStatCard = ({
  label,
  value,
  icon,
  accent = false,
  className,
  ...props
}: LyncsStatCardProps) => {
  return (
    <LyncsCard
      data-slot="lyncs-stat-card"
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      <div
        data-slot="lyncs-stat-card-icon"
        className={cn(
          "flex size-9 items-center justify-center rounded-md",
          accent ? "bg-lyncs-accent-dim" : "bg-lyncs-elevated",
        )}
      >
        {icon}
      </div>
      <div data-slot="lyncs-stat-card-body" className="flex flex-col">
        <div
          data-slot="lyncs-stat-card-value"
          className="text-xxii font-semibold tracking-tight leading-none"
        >
          {value}
        </div>
        <div
          data-slot="lyncs-stat-card-label"
          className="mt-1 text-[12px] text-lyncs-text-muted"
        >
          {label}
        </div>
      </div>
    </LyncsCard>
  );
};

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  LyncsCard,
  LyncsStatCard,
};
