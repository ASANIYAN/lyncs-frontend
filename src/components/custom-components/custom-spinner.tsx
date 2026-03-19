import * as React from "react"

import { Spinner } from "../ui/spinner"
import { cn } from "@/lib/utils"

interface LyncsSpinnerProps extends React.ComponentProps<typeof Spinner> {
  size?: "sm" | "default" | "lg"
}

const LyncsSpinner = ({
  size = "default",
  className,
  ...props
}: LyncsSpinnerProps) => {
  const sizeClassName =
    size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4"

  return (
    <Spinner
      data-slot="lyncs-spinner"
      className={cn("text-lyncs-accent", sizeClassName, className)}
      {...props}
    />
  )
}

export { Spinner, LyncsSpinner }
