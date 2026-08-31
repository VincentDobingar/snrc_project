import { useContext } from "react";
import { SettingsContext } from "../contexts/settingsContextObject";

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings doit être utilisé dans SettingsProvider.");
  }

  return context;
}
