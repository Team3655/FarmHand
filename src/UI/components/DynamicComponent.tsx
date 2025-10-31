import { Typography } from "@mui/material";
import CounterInput from "./CounterInput";
import InputCard from "../InputCard";
import DropdownInput from "./DropdownInput";
import CheckboxInput from "./CheckboxInput";
import TextInput from "./TextInput";
import useValidation from "../../hooks/useValidation";

/**
 * Component that renders a component based on its type
 *
 */
export default function DynamicComponent({
  component,
}: {
  component: Component;
}) {
  const { updateValidation } = useValidation();
  const handleChange = (newValue: any) => {
    if (!newValue && component.required) {
      updateValidation(false);
    } else {
      updateValidation(true);
    }

    // TODO: Add logic for handling specific invalid operations
  };

  const renderInput = () => {
    switch (component.type) {
      case "counter":
        return (
          <CounterInput
            defaultValue={component.props?.default as number}
            max={component.props?.max!}
            min={component.props?.min!}
            onChange={handleChange}
          />
        );

      case "dropdown":
        return (
          <DropdownInput
            options={component.props?.options!}
            onChange={handleChange}
            label={component.props?.label}
          />
        );

      case "checkbox":
        return <CheckboxInput onChange={handleChange} />;

      case "text":
        return (
          <TextInput
            onChange={handleChange}
            multiline={component.props?.multiline!}
            label={component.props?.label}
          />
        );

      default:
        return <Typography>Unknown component type</Typography>;
    }
  };

  return (
    <InputCard label={component.name} required={component.required ?? false}>
      {renderInput()}
    </InputCard>
  );
}
