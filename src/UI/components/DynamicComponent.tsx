import { Typography } from "@mui/material";
import { useValidation } from "../../context/ValidationContext";
import { useScoutData } from "../../context/ScoutDataContext";
import { useEffect, useState } from "react";
import CounterInput from "./CounterInput";
import DropdownInput from "./DropdownInput";
import CheckboxInput from "./CheckboxInput";
import TextInput from "./TextInput";
import InputCard from "../InputCard";
import { isFieldInvalid } from "../../utils/FormUtils";

/**
 * Props for the dynamic component
 */
interface DynamicComponentProps {
  component: Component;
}

/**
 * Component that renders a component based on its type
 *
 */
export default function DynamicComponent(props: DynamicComponentProps) {
  const { setValid, setTouched } = useValidation();
  const { addMatchData, addError, removeError, getMatchData } =
    useScoutData();
  const { component } = props;

  const [value, setValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeComponent = async () => {
      try {
        const storedValue = await getMatchData(component.name);

        console.log("Stored value", storedValue);

        let initial;
        if (storedValue !== undefined && storedValue !== null) {
          initial = storedValue;
        } else {
          switch (component.type) {
            case "checkbox":
              initial = component.props?.default ?? false;
              break;
            case "text":
            case "dropdown":
              initial = component.props?.default ?? "";
              break;
            case "counter":
              initial = component.props?.default ?? 0;
              break;
            default:
              initial = undefined;
          }
        }

        const isInvalid = isFieldInvalid(
          component.required!,
          component.type,
          component.props?.default!,
          initial
        );

        if (isMounted) {
          setValue(initial);

          if (component.required) {
            setValid(!isInvalid);
            if (isInvalid) {
              addError(component.name);
            }
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeComponent();

    return () => {
      isMounted = false;
      if (component.required) {
        removeError(component.name);
      }
    };
  }, [component, getMatchData, setValid, addError, removeError]);

  const handleChange = (newValue: any) => {
    setValue(newValue);
    setTouched(true);

    const isInvalid = isFieldInvalid(
      component.required!,
      component.type,
      component.props?.default!,
      newValue
    );

    setValid(!isInvalid);
    if (isInvalid) {
      addError(component.name);
    } else {
      removeError(component.name);
    }

    addMatchData(component.name, newValue);
  };

  const renderInput = () => {
    if (loading) {
      return (
        <Typography variant="h6" color="info">
          Loading...
        </Typography>
      );
    }
    if (error) {
      return (
        <Typography variant="h6" color="error">
          Error loading data
        </Typography>
      );
    }

    switch (component.type) {
      case "counter":
        return (
          <CounterInput
            value={Number(value)}
            max={component.props?.max!}
            min={component.props?.min!}
            onChange={handleChange}
          />
        );

      case "dropdown":
        return (
          <DropdownInput
            value={String(value)}
            options={component.props?.options!}
            onChange={handleChange}
            label={component.props?.label}
          />
        );

      case "checkbox":
        return <CheckboxInput value={Boolean(value)} onChange={handleChange} />;

      case "text":
        return (
          <TextInput
            value={String(value)}
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
