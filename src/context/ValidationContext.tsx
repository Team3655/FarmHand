import { createContext, ReactNode, useState } from "react";

interface ValidationContextType {
  valid: boolean;
  updateValidation: (valid: boolean) => void;
}

export const ValidationContext = createContext<ValidationContextType | null>(null);

export default function ValidationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [valid, setValid] = useState(true);

  const updateValidation = (valid: boolean) => {
    setValid(valid);
  };

  return (
    <ValidationContext.Provider value={{ valid, updateValidation }}>
      {children}
    </ValidationContext.Provider>
  );
}
