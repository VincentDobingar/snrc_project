import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/ui/PageLoader";

export default function GuestRoute() {
  const { isAuthenticated, bootLoading } = useAuth();

  if (bootLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snrc-light">
        <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
          <p className="font-medium text-snrc-blue">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}