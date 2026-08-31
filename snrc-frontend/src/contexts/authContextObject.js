import { createContext } from "react";

// Isolated in its own module (separate from AuthContext.jsx) so that
// AuthContext.jsx only exports the AuthProvider component. Mixing a
// component export with a non-component export in the same file breaks
// Vite's Fast Refresh (react-refresh/only-export-components).
export const AuthContext = createContext(null);
