import { LyncsDialog } from "@/components/custom-components/custom-dialog";
import { CustomButton } from "@/components/custom-components/custom-button";

interface DeleteUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortCode: string | null;
  onConfirm: () => void;
  isPending: boolean;
}

const DeleteUrlDialog = ({
  open,
  onOpenChange,
  shortCode,
  onConfirm,
  isPending,
}: DeleteUrlDialogProps) => {
  return (
    <LyncsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete short URL"
      description={`This will permanently delete /${shortCode ?? ""} and all its click data. This action cannot be undone.`}
      footer={
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton variant="danger" loading={isPending} onClick={onConfirm}>
            Delete
          </CustomButton>
        </div>
      }
    >
      <div className="text-[13px] text-lyncs-text-muted">
        Confirm you want to remove this short URL.
      </div>
    </LyncsDialog>
  );
};

export default DeleteUrlDialog;
