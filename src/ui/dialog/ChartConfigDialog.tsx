import { Dialog, DialogTitle, DialogContent, Stack, TextField, FormControl, InputLabel, Select, MenuItem, DialogActions, Button } from "@mui/material";
import { useState, useEffect, useMemo } from "react";

export default function ChartConfigDialog({
  open,
  onClose,
  chartType,
  existingChart,
  onSave,
  schema,
}: {
  open: boolean;
  onClose: () => void;
  chartType: Chart["type"] | null;
  existingChart: Chart | null;
  onSave: (config: Partial<Chart>) => void;
  schema?: Schema;
}) {
  const [name, setName] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [aggregation, setAggregation] = useState<Chart["aggregation"]>("sum");
  const [sortMode, setSortMode] = useState<Chart["sortMode"]>("none");

  useEffect(() => {
    if (open) {
      setName(existingChart?.name || "");
      setXAxis(existingChart?.xAxis || "");
      setYAxis(existingChart?.yAxis || "");
      setAggregation(existingChart?.aggregation || "sum");
      setSortMode(existingChart?.sortMode || "none");
    }
  }, [open, existingChart]);

  const handleSave = () => {
    onSave({ name, xAxis, yAxis, aggregation, sortMode });
    onClose();
  };

  // Get grid fields for heatmap
  const gridFields = useMemo(() => {
    if (chartType !== "heatmap" || !schema) return [];
    const fields: Array<{ section: string; field: Component }> = [];
    schema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === "grid") {
          fields.push({ section: section.title, field });
        }
      });
    });
    return fields;
  }, [chartType, schema]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {existingChart ? "Edit Chart" : `Add ${chartType} Chart`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Chart Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {chartType === "heatmap" ? (
            <>
              <FormControl fullWidth>
                <InputLabel>Group By</InputLabel>
                <Select
                  value={xAxis}
                  label="Group By"
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  {schema?.sections.map((section) => [
                    <MenuItem
                      key={`${section.title}-header-heatmap`}
                      disabled
                      sx={{ fontWeight: 600 }}
                    >
                      {section.title}
                    </MenuItem>,
                    ...section.fields.map((field) => (
                      <MenuItem
                        key={`${section.title} - ${field.name}-heatmap`}
                        value={`${section.title} - ${field.name}`}
                        sx={{ pl: 4 }}
                      >
                        {field.name}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Grid Field</InputLabel>
                <Select
                  value={yAxis}
                  label="Grid Field"
                  onChange={(e) => setYAxis(e.target.value)}
                >
                  {gridFields.length === 0 ? (
                    <MenuItem disabled>
                      No compatible fields found in schema
                    </MenuItem>
                  ) : (
                    gridFields.map(({ section, field }) => (
                      <MenuItem
                        key={`${section} - ${field.name}`}
                        value={`${section} - ${field.name}`}
                      >
                        {field.name} ({section})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel>X-Axis Field</InputLabel>
                <Select
                  value={xAxis}
                  label="X-Axis Field"
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  {schema?.sections.map((section) => [
                    <MenuItem
                      key={`${section.title}-header`}
                      disabled
                      sx={{ fontWeight: 600 }}
                    >
                      {section.title}
                    </MenuItem>,
                    ...section.fields.map((field) => (
                      <MenuItem
                        key={`${section.title} - ${field.name}`}
                        value={`${section.title} - ${field.name}`}
                        sx={{ pl: 4 }}
                      >
                        {field.name}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>

              {chartType !== "pie" && (
                <FormControl fullWidth>
                  <InputLabel>Y-Axis Field</InputLabel>
                  <Select
                    value={yAxis}
                    label="Y-Axis Field"
                    onChange={(e) => setYAxis(e.target.value)}
                  >
                    {schema?.sections.map((section) => [
                      <MenuItem
                        key={`${section.title}-header-y`}
                        disabled
                        sx={{ fontWeight: 600 }}
                      >
                        {section.title}
                      </MenuItem>,
                      ...section.fields.map((field) => (
                        <MenuItem
                          key={`${section.title} - ${field.name}-y`}
                          value={`${section.title} - ${field.name}`}
                          sx={{ pl: 4 }}
                        >
                          {field.name}
                        </MenuItem>
                      )),
                    ])}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {chartType !== "heatmap" && (
            <FormControl fullWidth>
              <InputLabel>Aggregation</InputLabel>
              <Select
                value={aggregation}
                label="Aggregation"
                onChange={(e) =>
                  setAggregation(e.target.value as Chart["aggregation"])
                }
              >
                <MenuItem value="sum">Sum</MenuItem>
                <MenuItem value="average">Average</MenuItem>
                <MenuItem value="count">Count</MenuItem>
                <MenuItem value="min">Minimum</MenuItem>
                <MenuItem value="max">Maximum</MenuItem>
              </Select>
            </FormControl>
          )}

          {(chartType === "bar" || chartType === "boxplot") && (
            <FormControl fullWidth>
              <InputLabel>Sort Mode</InputLabel>
              <Select
                value={sortMode}
                label="Sort Mode"
                onChange={(e) =>
                  setSortMode(e.target.value as Chart["sortMode"])
                }
              >
                <MenuItem value="none">None (Natural Order)</MenuItem>
                <MenuItem value="ascending">Ascending (Low to High)</MenuItem>
                <MenuItem value="descending">Descending (High to Low)</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name || (chartType === "heatmap" ? (!xAxis || !yAxis) : !xAxis)}
        >
          {existingChart ? "Save" : "Add Chart"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
