import { Card, Grid, Typography } from "@mui/material";
import DynamicComponent from "./components/DynamicComponent";
import ValidationProvider from "../context/ValidationContext";

/**
 * Props for the section component
 */
interface SectionProps {
  section: SectionData;
}

export default function Section(props: SectionProps) {
  const { section } = props;

  return (
    <Card
      sx={{
        p: 3,
        minWidth: "fit-content",
        height: "100%",
        display: "flex",
        alignContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" sx={{ my: 2, mx: 1 }}>
        {section.title}
      </Typography>
      <Grid container spacing={2}>
        {section.fields.map((component, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <ValidationProvider>
              <DynamicComponent component={component} />
            </ValidationProvider>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
