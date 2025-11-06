import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";

/**
 * Props for the Checkbox input
 */
interface CheckboxInputProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

/**
 * A checkbox input for the scout page
 *
 * @param props {@link CheckboxInputProps}
 * @returns a checkbox component
 */
export default function CheckboxInput(props: CheckboxInputProps) {
  const { value, onChange } = props;

  return (
    <Button
      onClick={() => {
        const newValue = !value;
        if (onChange) onChange(newValue);
      }}
      variant="contained"
      color={value ? "secondary" : "inherit"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "70%",
        height: "100%",
      }}
      disableElevation
    >
      {value ? <CheckIcon /> : <CloseIcon />}
    </Button>
  );
}
