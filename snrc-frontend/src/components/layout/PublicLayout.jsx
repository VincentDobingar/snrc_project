import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageLoader from "../ui/PageLoader";
import { SettingsProvider } from "../../contexts/SettingsContext";

export default function PublicLayout() {
  return (
    <SettingsProvider>
      <div className="flex min-h-screen flex-col bg-white text-snrc-blue">
        <Header />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </SettingsProvider>
  );
}