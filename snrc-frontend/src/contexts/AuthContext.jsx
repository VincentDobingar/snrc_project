import { useEffect, useMemo, useState } from "react";
import { getMe, loginAdmin, logoutAdmin } from "../api/authApi";
import { AuthContext } from "./authContextObject";

const isAdminPath = () =>
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Les pages publiques n'ont jamais besoin de l'état d'authentification
  // admin : on évite donc un appel réseau /me systématique à chaque
  // chargement du site, et on ne le déclenche que sous /admin.
  const [bootLoading, setBootLoading] = useState(isAdminPath);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!isAdminPath()) return;

    async function bootstrapAuth() {
      try {
        const currentUser = await getMe();
        setUser(currentUser || null);
      } catch {
        setUser(null);
      } finally {
        setBootLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  async function login(credentials) {
    setAuthLoading(true);
    try {
      await loginAdmin(credentials);
      const currentUser = await getMe();
      setUser(currentUser || null);
      return { success: true, user: currentUser };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Erreur lors de la connexion administrateur.",
        errors: error?.response?.data?.errors || [],
      };
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    try {
      await logoutAdmin();
    } catch {
      // ignorer l'erreur, on vide quand même la session frontend
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      bootLoading,
      authLoading,
      login,
      logout,
    }),
    [user, bootLoading, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}