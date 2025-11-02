import { Typography } from "@mui/material";
import CounterInput from "./CounterInput";
import InputCard from "../InputCard";
import DropdownInput from "./DropdownInput";
import CheckboxInput from "./CheckboxInput";
import TextInput from "./TextInput";
import useValidation from "../../hooks/useValidation";
import useScoutData from "../../hooks/useScoutData";
import { useEffect } from "react";

/**
 * Component that renders a component based on its type
 *
 */
export default function DynamicComponent({
  component,
}: {
  component: Component;
}) {
  const { setValid, setTouched } = useValidation();
  const { addMatchData, addError, removeError } = useScoutData();

  const handleChange = (newValue: any) => {
    setTouched(true);
    const isInvalid =
      component.required &&
      (newValue === "" ||
        (component.type === "checkbox" && !newValue) ||
        (component.type === "counter" &&
          newValue === component.props?.default));

    setValid(!isInvalid);
    if (isInvalid) {
      addError(component.name);
    } else {
      removeError(component.name);
    }

    addMatchData(component.name, newValue);
  };

  useEffect(() => {
    let initialValue: any;

    switch (component.type) {
      case "checkbox":
        initialValue = component.props?.default ?? false;
        break;
      case "text":
      case "dropdown":
        initialValue = component.props?.default ?? "";
        break;
      case "counter":
        initialValue = component.props?.default ?? 0;
        break;
      default:
        break;
    }

    addMatchData(component.name, initialValue);

    if (component.required) {
      const isInvalid =
        initialValue === "" ||
        (component.type === "checkbox" && initialValue === false) ||
        (component.type === "counter" &&
          initialValue === component.props?.default) ||
        initialValue === 0;

      setValid(!isInvalid);
      if (isInvalid) {
        addError(component.name);
      }
    }

    return () => {
      if (component.required!) {
        removeError(component.name);
      }
    };
  }, []);

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
