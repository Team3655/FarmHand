import { useContext } from "react";
import { ScoutDataContext } from "../context/ScoutDataContext";

export default function useScoutData() {
  const context = useContext(ScoutDataContext);
  if (!context)
    throw new Error(
      "Scout data context must be used within a ScoutDataProvider"
    );
  return context;
}
