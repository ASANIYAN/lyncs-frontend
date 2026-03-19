import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const customButtonVariants = cva(
  "group/custom-button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border border-transparent text-[13px] transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-lyncs-accent text-lyncs-bg border-lyncs-accent-border hover:bg-lyncs-accent-hover font-medium rounded-lg",
        secondary:
          "bg-transparent text-lyncs-text-subtle border-lyncs-border hover:border-lyncs-border-hover hover:text-lyncs-text hover:bg-lyncs-elevated rounded-lg",
        ghost:
          "bg-transparent border-none text-lyncs-text-muted hover:text-lyncs-text hover:bg-lyncs-overlay rounded-lg",
        danger:
          "bg-transparent text-lyncs-danger border-lyncs-danger-dim hover:bg-lyncs-danger-dim hover:border-lyncs-danger rounded-lg",
        icon: "bg-transparent border-none text-lyncs-text-muted hover:bg-lyncs-overlay hover:text-lyncs-text rounded-sm p-1.5",
      },
      size: {
        sm: "h-7 px-3",
        default: "h-8 px-3.5",
        lg: "h-9 px-4",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

interface CustomButtonProps
  extends ButtonPrimitive.Props, VariantProps<typeof customButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLElement, CustomButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const resolvedSize = variant === "icon" ? null : size;
    const content = (
      <>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          leftIcon && (
            <span data-icon="inline-start" className="flex items-center">
              {leftIcon}
            </span>
          )
        )}
        <span data-slot="custom-button-text">{children}</span>
        {rightIcon && !loading && (
          <span data-icon="inline-end" className="flex items-center">
            {rightIcon}
          </span>
        )}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      return (
        <ButtonPrimitive
          ref={ref}
          data-slot="custom-button"
          className={cn(
            customButtonVariants({
              variant,
              size: resolvedSize,
              fullWidth,
              className,
            }),
          )}
          render={(renderProps) =>
            React.cloneElement(children, renderProps, content)
          }
          disabled={disabled || loading}
          {...props}
        />
      );
    }

    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="custom-button"
        className={cn(
          customButtonVariants({
            variant,
            size: resolvedSize,
            fullWidth,
            className,
          }),
          "cursor-pointer",
        )}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </ButtonPrimitive>
    );
  },
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
