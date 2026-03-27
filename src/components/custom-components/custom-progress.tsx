import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import {
  Progress as BaseProgress,
  ProgressIndicator as BaseProgressIndicator,
  ProgressLabel as BaseProgressLabel,
  ProgressTrack as BaseProgressTrack,
  ProgressValue as BaseProgressValue,
} from "../ui/progress"
import { cn } from "@/lib/utils"

const Progress = BaseProgress

const ProgressTrack = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgressTrack>) => {
  return (
    <BaseProgressTrack
      className={cn(
        "h-[3px] bg-lyncs-elevated rounded-full w-full",
        className
      )}
      {...props}
    />
  )
}

const ProgressIndicator = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgressIndicator>) => {
  return (
    <BaseProgressIndicator
      className={cn(
        "bg-lyncs-accent rounded-full transition-all",
        className
      )}
      {...props}
    />
  )
}

const ProgressLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgressLabel>) => {
  return (
    <BaseProgressLabel
      className={cn("text-[12px] text-lyncs-text-muted", className)}
      {...props}
    />
  )
}

const ProgressValue = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgressValue>) => {
  return (
    <BaseProgressValue
      className={cn("text-[12px] text-lyncs-text tabular-nums", className)}
      {...props}
    />
  )
}

interface LyncsProgressProps extends React.ComponentProps<"div"> {
  value: number
  label?: string
  showValue?: boolean
}

const LyncsProgress = ({
  value,
  label,
  showValue = true,
  className,
  ...props
}: LyncsProgressProps) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <ProgressPrimitive.Root
      value={clampedValue}
      data-slot="lyncs-progress"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-center gap-2">
          {label && <ProgressLabel>{label}</ProgressLabel>}
          {showValue && (
            <ProgressValue>
              {(_formattedValue, resolvedValue) =>
                `${resolvedValue ?? clampedValue}%`
              }
            </ProgressValue>
          )}
        </div>
      )}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

interface ReferrerBarProps extends React.ComponentProps<"div"> {
  label: string
  value: number
  percentage: number
}

const ReferrerBar = ({
  label,
  value,
  percentage,
  className,
  ...props
}: ReferrerBarProps) => {
  return (
    <div
      data-slot="referrer-bar"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-lyncs-text-muted">
          {label}
        </span>
        <span className="text-[12px] text-lyncs-text tabular-nums">
          {value}
        </span>
      </div>
      <LyncsProgress value={percentage} showValue={false} />
    </div>
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  LyncsProgress,
  ReferrerBar,
}
