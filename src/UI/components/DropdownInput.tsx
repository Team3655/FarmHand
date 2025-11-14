import {
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";

/**
 * Props for the dropdown input
 */
interface DropdownInputProps {
  label?: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

/**
 * @param props {@link DropdownInputProps}
 * @returns Dropdown input for the page
 */
export default function DropdownInput(props: DropdownInputProps) {
  const { label, options, onChange, value, error, disabled } = props;

  const handleChange = (e: SelectChangeEvent) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel color={error ? "error" : "secondary"}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
        disabled={disabled}
        color="secondary"
        error={error}
        sx={{
          "& legend": {
            transition: "unset",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem value={option} key={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
