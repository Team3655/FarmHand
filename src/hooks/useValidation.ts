import { useContext } from "react";
import { ValidationContext } from "../context/ValidationContext";

export default function useValidation() {
  const context = useContext(ValidationContext);
  if (!context)
    throw new Error(
      "Validation context must be used within a ValidationProvider"
    );
  return context;
}
