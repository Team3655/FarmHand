import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import QrShareDialog from "../ui/dialog/QrShareDialog";
import QrCodeIcon from "@mui/icons-material/QrCodeRounded";
import FilterIcon from "@mui/icons-material/FilterAltRounded";
import SortIcon from "@mui/icons-material/SortRounded";
import ArchiveIcon from "@mui/icons-material/ArchiveRounded";
import UnarchiveIcon from "@mui/icons-material/UnarchiveRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PageHeader from "../ui/PageHeader";
import QrGrid from "../ui/qr/QrGrid";
import { useMemo, useState } from "react";
import { useAsyncFetch } from "../hooks/useAsyncFetch";
import useDialog from "../hooks/useDialog";
import { useQrSelection } from "../hooks/useQrSelection";
import { fetchQrCodes, unarchiveQrCode, deleteQrCode } from "../utils/QrUtils";

export default function ArchivePage() {
  const theme = useTheme();
  const [allQrCodes, loading, error, refetch] = useAsyncFetch(fetchQrCodes);
  const qrCodes = useMemo(
    () => allQrCodes?.filter((code) => code.archived) || [],
    [allQrCodes]
  );
  const selection = useQrSelection(qrCodes);
  const [qrDialogOpen, openQrDialog, closeQrDialog] = useDialog();
  const [unarchiveDialogOpen, openUnarchiveDialog, closeUnarchiveDialog] =
    useDialog();
  const [deleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useDialog();
  const [activeQrCode, setActiveQrCode] = useState<QrCode | null>(null);

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error fetching QR codes</Typography>;

  const toggleSelectionMode = () => {
    if (selection.selecting) {
      selection.resetSelection();
    }
    selection.toggleSelecting();
  };

  const handleMassUnarchive = async () => {
    await Promise.all(
      selection.selectedCodes.map(async (c) => await unarchiveQrCode(c))
    );
    selection.resetSelection();
    closeUnarchiveDialog();
    toggleSelectionMode();
    refetch();
  };

  const handleMassDelete = async () => {
    await Promise.all(
      selection.selectedCodes.map(async (c) => await deleteQrCode(c))
    );
    selection.resetSelection();
    closeDeleteDialog();
    toggleSelectionMode();
    refetch();
  };

  return (
    <>
      {!qrCodes || qrCodes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}10 0%, ${theme.palette.secondary.main}05 100%)`,
              border: `2px dashed ${theme.palette.divider}`,
              maxWidth: 400,
            }}
          >
            <QrCodeIcon
              sx={{
                fontSize: 80,
                mb: 2,
                color: theme.palette.secondary.main,
                opacity: 0.5,
              }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Archive Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add saved codes to the archive to see them here
            </Typography>
          </Paper>
        </Box>
      ) : (
        <>
          <Box px={3} pt={2}>
            {/* Header */}
            <PageHeader
              icon={<ArchiveIcon sx={{ fontSize: 28 }} />}
              title="QR Archive"
              subtitle={`${qrCodes.length} code${
                qrCodes.length !== 1 ? "s" : ""
              } archived`}
              trailingComponent={
                selection.selecting &&
                selection.selectedCodes.length > 0 && (
                  <Chip
                    label={`${selection.selectedCodes.length} selected`}
                    color="primary"
                    sx={{ fontWeight: 600, fontFamily: theme.typography.body1 }}
                  />
                )
              }
            />

            {/* Action Bar */}
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<FilterIcon />}
                  sx={{
                    borderRadius: 2,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<SortIcon />}
                  sx={{
                    borderRadius: 2,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Sort
                </Button>
              </Stack>
              <Button
                variant={selection.selecting ? "outlined" : "contained"}
                color="secondary"
                onClick={selection.toggleSelecting}
                sx={{
                  borderRadius: 2,
                  ...(selection.selecting && {
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }),
                }}
              >
                {selection.selecting ? "Cancel" : "Select"}
              </Button>
            </Stack>

            <QrGrid
              validQrCodes={selection.validQrCodes}
              invalidQrCodes={selection.invalidQrCodes}
              selecting={selection.selecting}
              codeIsSelected={selection.codeIsSelected}
              onSelect={selection.updateSelectedCodes}
              onClickQr={(c) => {
                openQrDialog();
                setActiveQrCode(c);
              }}
              toggleSelectMode={toggleSelectionMode}
            />
          </Box>

          {/* Floating Action Buttons */}
          <Zoom in={selection.selecting} unmountOnExit>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{
                position: "fixed",
                bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
                left: 0,
                right: 0,
                paddingLeft: "calc(16px + env(safe-area-inset-left, 0px))",
                paddingRight: "calc(16px + env(safe-area-inset-right, 0px))",
              }}
            >
              <Fab
                color="error"
                variant="extended"
                size="large"
                disabled={selection.noCodesSelected}
                onClick={openDeleteDialog}
              >
                <DeleteIcon sx={{ mr: 1 }} /> Delete
              </Fab>
              <Fab
                color="secondary"
                variant="extended"
                size="large"
                disabled={selection.noCodesSelected}
                onClick={openUnarchiveDialog}
              >
                <UnarchiveIcon sx={{ mr: 1 }} /> Unarchive
              </Fab>
            </Stack>
          </Zoom>
        </>
      )}

      <QrShareDialog
        qrCodeData={activeQrCode!}
        open={qrDialogOpen}
        onClose={closeQrDialog}
        forQrPage
        isArchived
        onDelete={refetch}
        onUnarchive={refetch}
        canDelete
      />

      {/* Unarchive Confirmation Dialog */}
      <Dialog
        open={unarchiveDialogOpen}
        onClose={closeUnarchiveDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <UnarchiveIcon sx={{ mr: 1 }} />
          Unarchive QR Codes
        </DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to unarchive {selection.selectedCodes.length} code
            {selection.selectedCodes.length !== 1 ? "s" : ""}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeUnarchiveDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMassUnarchive}
            color="secondary"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Unarchive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete QR Codes
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete{" "}
            {selection.selectedCodes.length} code
            {selection.selectedCodes.length !== 1 ? "s" : ""}? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMassDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
