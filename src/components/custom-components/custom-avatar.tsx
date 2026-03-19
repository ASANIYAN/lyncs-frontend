import * as React from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../ui/avatar";
import { cn } from "@/lib/utils";

interface LyncsAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "default" | "lg";
}

const LyncsAvatar = ({
  src,
  alt,
  fallback,
  size = "default",
  className,
  ...props
}: LyncsAvatarProps) => {
  return (
    <Avatar
      data-slot="lyncs-avatar"
      size={size}
      className={cn(className)}
      {...props}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={alt ?? fallback}
          className="aspect-square object-cover"
        />
      )}
      <AvatarFallback className="bg-lyncs-elevated text-lyncs-text-subtle text-xs font-medium">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  LyncsAvatar,
};
