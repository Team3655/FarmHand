import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteSchemaDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  schemaName: string | null;
}

export default function DeleteSchemaDialog({
  open,
  onClose,
  onDelete,
  schemaName,
}: DeleteSchemaDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 400 } } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Delete Schema "{schemaName}"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this schema? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onDelete}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
        >
          Delete
        </Button>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
