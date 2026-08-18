import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, bootLoading } = useAuth();
  const location = useLocation();

  if (bootLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snrc-light">
        <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
          <p className="font-medium text-snrc-blue">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}