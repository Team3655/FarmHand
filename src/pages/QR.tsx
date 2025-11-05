import { Box, Card, Fab, Grid, Typography, useTheme } from "@mui/material";
import QrScanIcon from "@mui/icons-material/QrCodeScannerRounded";
import { useEffect, useState } from "react";
import {
  exists,
  BaseDirectory,
  readDir,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import QrScannerPopup from "../UI/QrScannerPopup";

export default function QRPage() {
  const theme = useTheme();
  const [qrCodes, setQrCodes] = useState<Image[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  const fetchQrCodes = async () => {
    const folderExists = await exists("saved-matches", {
      baseDir: BaseDirectory.AppLocalData,
    });

    if (!folderExists) {
      console.log("saved matches folder does not exist");
      return;
    }

    const files = await readDir("saved-matches", {
      baseDir: BaseDirectory.AppLocalData,
    });

    const images = await Promise.all(
      files
        .filter((file) => file.name.endsWith(".svg"))
        .map(async (file) => {
          console.log(file.name);
          const contents = await readTextFile(`saved-matches/${file.name}`, {
            baseDir: BaseDirectory.AppLocalData,
          });
          return {
            name: file.name,
            image: contents,
          };
        })
    );
    setQrCodes(images);
    console.log(files);
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  return (
    <>
      <Fab
        color="secondary"
        size="large"
        variant="extended"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setScannerOpen(true)}
      >
        <QrScanIcon sx={{ mr: 1 }} />
        Scan
      </Fab>
      <Box sx={{ px: 3, pt: 2, justifyContent: "center" }}>
        <Grid container spacing={2}>
          {qrCodes.map((qr, i) => {
            console.log(qr);
            return (
              <Grid size={{ xs: 6, sm: 3, md: 2, lg: 1 }} key={i}>
                <Card
                  sx={{
                    borderColor: theme.palette.divider,
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderRadius: 2,
                    p: 2,
                    maxWidth: "fit-content",
                    height: "100%",
                    backgroundColor: theme.palette.background.paper,
                    transition:
                      "border-color 0.2s ease, background-color 0.2s ease",
                    alignContent: "center",
                  }}
                >
                  <img
                    src={`data:image/svg+xml;base64,${btoa(qr.image)}`}
                    alt="QR Code"
                    style={{ borderRadius: 8, maxWidth: "100%" }}
                  />
                  <Typography>{qr.name}</Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <QrScannerPopup
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanListUpdate={() => {}}
      />
    </>
  );
}
