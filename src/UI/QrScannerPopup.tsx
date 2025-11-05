import {
  Dialog,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Result } from "@zxing/library";
import { useEffect, useRef, useState } from "react";

/**
 * Props for the qr scanner
 */
interface QrScannerPopupProps {
  open: boolean;
  onClose: () => void;
  onScanListUpdate: (list: string[]) => void;
}

async function getCameraDevices(): Promise<MediaDeviceInfo[]> {
  
  // Request permission so device labels become available
  await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => {});

  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "videoinput");
}

export default function QrScannerPopup(props: QrScannerPopupProps) {
  const { open, onClose, onScanListUpdate } = props;
  const [activeCameraId, setActiveCameraId] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrCodeReader = new BrowserQRCodeReader();

  const addToList = (result: Result) => {
    const newResults = [...results, result.getText()];
    setResults(newResults);
    onScanListUpdate(newResults);
  };

  useEffect(() => {
    if (!open) return;

    async function initCamera() {
      const devices = await getCameraDevices();
      if (devices.length === 0) {
        setHasCamera(false);
        return;
      }
      setHasCamera(true);
      setActiveCameraId(devices[0].deviceId);
    }

    initCamera();
  }, [open]);

  useEffect(() => {
    if (!open || !hasCamera || !activeCameraId || !videoRef.current) {
      return;
    }

    // Start scanning
    qrCodeReader.decodeFromVideoDevice(
      activeCameraId,
      videoRef.current,
      (result) => {
        if (result) addToList(result);
      }
    );
  }, [open, hasCamera, activeCameraId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="xs"
      sx={{}}
    >
      <Box sx={{ p: 2 }}>
        {!hasCamera ? (
          <Typography
            color="error"
            variant="subtitle1"
            sx={{ textAlign: "center", mt: 2 }}
          >
            No camera found on this device.
          </Typography>
        ) : (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxHeight: "50vh",
              borderRadius: 12,
              objectFit: "cover",
              background: "#000",
              aspectRatio: "1/2",
            }}
          />
        )}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Scanned Codes ({results.length})
        </Typography>

        <List dense sx={{ maxHeight: "35vh", overflow: "auto" }}>
          {results.map((code, i) => (
            <ListItem key={i}>
              <ListItemText primary={code} />
            </ListItem>
          ))}
        </List>

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Import all
        </Button>
      </Box>
    </Dialog>
  );
}
