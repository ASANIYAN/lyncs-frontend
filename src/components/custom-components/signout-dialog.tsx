import { LogOut } from "lucide-react";

import { LyncsDialog } from "@/components/custom-components/custom-dialog";
import { CustomButton } from "@/components/custom-components/custom-button";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const SignOutDialog = ({ open, onOpenChange, onConfirm }: SignOutDialogProps) => {
  return (
    <LyncsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out?"
      description="You will need to sign in again to access your dashboard."
      maxWidth="sm:max-w-sm"
      showHeaderDivider
      showFooterDivider={false}
      footer={
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant="secondary"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="danger"
            size="lg"
            leftIcon={<LogOut className="size-4" />}
            className="bg-lyncs-danger text-white border-lyncs-danger hover:bg-lyncs-danger/90"
            onClick={onConfirm}
          >
            Sign out
          </CustomButton>
        </div>
      }
    >
      <p className="text-xiii text-lyncs-text-muted">
        Your current session will end on this device.
      </p>
    </LyncsDialog>
  );
};

export default SignOutDialog;
