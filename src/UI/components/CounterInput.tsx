import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/RemoveRounded";

/**
 * Props for the counter
 */
interface CounterInputProps {
  max?: number;
  min?: number;
  value: number;
  onChange?: (value: number) => void;
}

/**
 *
 * @param props {@link CounterInputProps}
 * @returns A component that functions similarly to an HTML native number input
 */
export default function CounterInput(props: CounterInputProps) {
  const { max, min, value, onChange } = props;

  const increment = () => {
    const newCount = Math.min(value + 1, max ?? Number.POSITIVE_INFINITY);
    if (onChange) {
      onChange(newCount);
    }
  };
  const decrement = () => {
    const newCount = Math.max(value - 1, min ?? Number.NEGATIVE_INFINITY);
    if (onChange) onChange(newCount);
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"70%"}
    >
      <Button
        onClick={decrement}
        variant="contained"
        color="inherit"
        sx={{
          aspectRatio: "1/1",
        }}
        disableElevation
      >
        <RemoveIcon />
      </Button>
      <Typography variant="h5" sx={{ mx: 2 }}>{value}</Typography>
      <Button
        onClick={increment}
        variant="contained"
        color="inherit"
        sx={{ aspectRatio: "1/1" }}
        disableElevation
      >
        <AddIcon />
      </Button>
    </Stack>
  );
}
