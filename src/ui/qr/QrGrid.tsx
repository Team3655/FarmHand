import { Card, Grid, Stack, Typography, useTheme } from "@mui/material";

interface QrGridProps {
  validQrCodes: QrCode[];
  invalidQrCodes: QrCode[];
  selecting: boolean;
  codeIsSelected: (c: QrCode) => boolean;
  onSelect: (c: QrCode) => void;
  onClickQr: (c: QrCode) => void;
}

export default function QrGrid({
  validQrCodes,
  invalidQrCodes,
  selecting,
  codeIsSelected,
  onSelect,
  onClickQr,
}: QrGridProps) {
  const theme = useTheme();

  const getDataFromQrName = (name: string) => {
    const [teamNumber, matchNumber, timestamp] = name
      .replace(".svg", "")
      .split("-");

    return {
      TeamNumber: teamNumber,
      MatchNumber: matchNumber,
      Timestamp: timestamp,
    };
  };

  const renderCard = (qr: QrCode, disabled = false) => (
    <Card
      elevation={disabled ? 1 : 2}
      onClick={() =>
        selecting && !disabled ? onSelect(qr) : !disabled && onClickQr(qr)
      }
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: disabled ? "default" : "pointer",
        border: `1px solid ${
          codeIsSelected(qr) && selecting
            ? theme.palette.info.main
            : theme.palette.divider
        }`,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <img
          src={`data:image/svg+xml,${encodeURIComponent(qr.image)}`}
          alt={`Team: ${getDataFromQrName(qr.name).TeamNumber}, Match: ${
            getDataFromQrName(qr.name).MatchNumber
          }`}
          style={{
            borderRadius: 8,
            width: "clamp(60px, 30%, 100px)",
            height: "auto",
            aspectRatio: "1/1",
            flexShrink: 0,
          }}
        />
        <Stack direction={"column"} spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" noWrap>
            Team: {getDataFromQrName(qr.name).TeamNumber}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Match: {getDataFromQrName(qr.name).MatchNumber}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <>
      <Grid container spacing={2}>
        {validQrCodes.map((qr, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            {renderCard(qr)}
          </Grid>
        ))}
      </Grid>

      {selecting && invalidQrCodes.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ mt: 4, mb: 2, color: "text.secondary" }}
          >
            Incompatible Codes
          </Typography>
          <Grid container spacing={2}>
            {invalidQrCodes.map((qr, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={i}>
                {renderCard(qr, true)}
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
