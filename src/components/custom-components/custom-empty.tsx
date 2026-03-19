import * as React from "react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty"
import { cn } from "@/lib/utils"

interface LyncsEmptyProps extends React.ComponentProps<"div"> {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const LyncsEmpty = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: LyncsEmptyProps) => {
  return (
    <Empty data-slot="lyncs-empty" className={cn(className)} {...props}>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-lyncs-elevated text-lyncs-text-muted size-10 rounded-lg"
        >
          {icon}
        </EmptyMedia>
        <EmptyTitle className="text-[14px] font-medium text-lyncs-text">
          {title}
        </EmptyTitle>
        {description && (
          <EmptyDescription className="text-[13px] text-lyncs-text-muted">
            {description}
          </EmptyDescription>
        )}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  LyncsEmpty,
}
