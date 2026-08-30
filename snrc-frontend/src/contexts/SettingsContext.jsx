import { createContext, useEffect, useMemo, useState } from "react";
import { getSettings } from "../api/settingsApi";

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getSettings()
      .then((data) => {
        if (cancelled) return;
        setSettings(data || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setSettings(null);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ settings, loading, error }),
    [settings, loading, error]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
