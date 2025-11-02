import { Box, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import useValidation from "../../hooks/useValidation";
import useScoutData from "../../hooks/useScoutData";

/**
 * Props for the text input component
 */
interface TextInputProps {
  label?: string;
  multiline?: boolean;
  onChange?: (value: string) => void;
}

/**
 * An input for text
 *
 * @param props {@link TextInputProps}
 * @returns A multiline text input
 */
export default function TextInput(props: TextInputProps) {
  const [text, setText] = useState("");
  const { valid, touched } = useValidation();
  const { submitted } = useScoutData();
  const showError = !valid && (touched || submitted);

  const { label, multiline, onChange } = props;

  const updateText = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    if (onChange) onChange(value);
  };

  return (
    <Box width={"70%"}>
      <TextField
        variant="outlined"
        multiline={multiline ?? false}
        color="secondary"
        fullWidth
        label={label}
        onChange={updateText}
        value={text}
        error={showError}
        sx={{
          "& legend": {
            transition: "unset",
          },
        }}
      />
    </Box>
  );
}
