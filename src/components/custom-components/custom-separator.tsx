import * as React from "react";

import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface LyncsSeparatorProps extends React.ComponentProps<typeof Separator> {
  className?: string;
}

const LyncsSeparator = ({
  className,
  orientation = "horizontal",
  ...props
}: LyncsSeparatorProps) => {
  return (
    <Separator
      data-slot="lyncs-separator"
      orientation={orientation}
      className={cn(
        "bg-color-lyncs-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  );
};

export { Separator, LyncsSeparator };
