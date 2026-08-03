import { useContext } from "react";
import { AppContext } from "./appState";

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
};
