import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { cn } from "@/lib/utils"

interface LyncsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  maxWidth?: string
  showHeaderDivider?: boolean
  showFooterDivider?: boolean
}

const LyncsDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  maxWidth = "sm:max-w-2xl",
  showHeaderDivider = true,
  showFooterDivider = true,
}: LyncsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/75" />
        <DialogPrimitive.Popup
          data-slot="lyncs-dialog"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-xl border border-lyncs-border bg-lyncs-surface text-lyncs-text outline-none",
            maxWidth
          )}
        >
          <DialogHeader
            data-slot="lyncs-dialog-header"
            className={cn(
              "px-6 py-4",
              showHeaderDivider && "border-b border-lyncs-border"
            )}
          >
            <DialogTitle className="text-[15px] font-medium text-lyncs-text">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-[13px] text-lyncs-text-muted">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div data-slot="lyncs-dialog-body" className="p-6">
            {children}
          </div>
          {footer && (
            <div
              data-slot="lyncs-dialog-footer"
              className={cn(
                "px-6 py-4 bg-transparent",
                showFooterDivider && "border-t border-lyncs-border"
              )}
            >
              {footer}
            </div>
          )}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-3 right-3"
                />
              }
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  LyncsDialog,
}
