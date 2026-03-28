import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  Loader2Icon,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position={props.position ?? "top-right"}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Check className="size-4" />,
        error: <AlertCircle className="size-4" />,
        info: <Info className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-lyncs-card)",
          "--normal-border": "var(--color-lyncs-border)",
          "--normal-text": "var(--color-lyncs-text)",
          "--success-bg": "var(--color-lyncs-accent-dim)",
          "--success-border": "var(--color-lyncs-accent-border)",
          "--success-text": "var(--color-lyncs-accent)",
          "--error-bg": "var(--color-lyncs-danger)",
          "--error-border": "var(--color-lyncs-danger-border)",
          "--error-text": "var(--color-lyncs-bg)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border shadow-lg backdrop-blur-sm font-geist data-[swipe=move]:transition-none",
          success:
            "border-lyncs-accent-border! bg-lyncs-accent-dim! text-lyncs-accent!",
          error: "border-lyncs-danger-borde!r bg-lyncs-danger! text-white",
          title: "text-[13px] font-medium",
          description: "text-[12px] opacity-90",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
