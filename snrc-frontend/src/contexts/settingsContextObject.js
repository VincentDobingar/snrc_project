import { createContext } from "react";

// Isolated in its own module (separate from SettingsContext.jsx) so that
// SettingsContext.jsx only exports the SettingsProvider component. Mixing a
// component export with a non-component export in the same file breaks
// Vite's Fast Refresh (react-refresh/only-export-components).
export const SettingsContext = createContext(null);
