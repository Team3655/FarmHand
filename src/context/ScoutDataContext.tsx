import { createContext, ReactNode, useCallback, useState } from "react";

interface ScoutDataContextType {
  matchData: Map<string, any>;
  addMatchData: (key: string, val: any) => void;
  getMatchData: (key: string) => any;
  clearMatchData: () => void;
  errors: string[];
  addError: (error: string) => void;
  removeError: (error: string) => void;
  clearErrors: () => void;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
}

interface ScoutDataProviderProps {
  children: ReactNode;
}

export const ScoutDataContext = createContext<ScoutDataContextType | null>(
  null
);

export default function ScoutDataProvider(props: ScoutDataProviderProps) {
  const [matchData, setMatchData] = useState<Map<string, any>>(
    new Map<string, any>()
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { children } = props;

  const addMatchData = useCallback((key: string, val: any) => {
    setMatchData((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(key, val);
      return newMap;
    });
  }, []);

  const getMatchData = useCallback(
    (key: string) => {
      return matchData.get(key);
    },
    [matchData]
  );

  const clearMatchData = () => {
    setMatchData(new Map<string, any>());
    setSubmitted(false);
  };

  const addError = useCallback((error: string) => {
    setErrors((prev) => [...prev, error]);
  }, []);

  const removeError = useCallback((error: string) => {
    setErrors((prevErrors) => prevErrors.filter((e) => e !== error));
  }, []);

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ScoutDataContext.Provider
      value={{
        matchData,
        addMatchData,
        getMatchData,
        clearMatchData,
        errors,
        addError,
        removeError,
        clearErrors,
        submitted,
        setSubmitted,
      }}
    >
      {children}
    </ScoutDataContext.Provider>
  );
}
