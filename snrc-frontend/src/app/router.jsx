import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";

const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const Missions = lazy(() => import("../pages/public/Missions"));
const Services = lazy(() => import("../pages/public/Services"));
const NewsList = lazy(() => import("../pages/public/NewsList"));
const NewsDetail = lazy(() => import("../pages/public/NewsDetail"));
const Publications = lazy(() => import("../pages/public/Publications"));
const Jobs = lazy(() => import("../pages/public/Jobs"));
const JobDetail = lazy(() => import("../pages/public/JobDetail"));
const FAQ = lazy(() => import("../pages/public/FAQ"));
const Contact = lazy(() => import("../pages/public/Contact"));
const NotFound = lazy(() => import("../pages/public/NotFound"));

const Login = lazy(() => import("../pages/admin/Login"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const PagesManager = lazy(() => import("../pages/admin/PagesManager"));
const NewsManager = lazy(() => import("../pages/admin/NewsManager"));
const PublicationsManager = lazy(() =>
  import("../pages/admin/PublicationsManager")
);
const FAQManager = lazy(() => import("../pages/admin/FAQManager"));
const AdminUsersManager = lazy(() => import("../pages/admin/AdminUsersManager"));
const SettingsManager = lazy(() => import("../pages/admin/SettingsManager"));
const MessagesManager = lazy(() => import("../pages/admin/MessagesManager"));
const JobsManager = lazy(() => import("../pages/admin/JobsManager"));
const JobApplicationsManager = lazy(() =>
  import("../pages/admin/JobApplicationsManager")
);

import ProtectedRoute from "../routes/ProtectedRoute";
import GuestRoute from "../routes/GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "la-snrc", element: <About /> },
      { path: "missions", element: <Missions /> },
      { path: "services", element: <Services /> },
      { path: "actualites", element: <NewsList /> },
      { path: "actualites/:slug", element: <NewsDetail /> },
      { path: "publications", element: <Publications /> },
      { path: "carrieres", element: <Jobs /> },
      { path: "carrieres/:slug", element: <JobDetail /> },
      { path: "faq", element: <FAQ /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    element: <GuestRoute />,
    children: [{ path: "/admin/login", element: <Login /> }],
  },

  {
    element: <ProtectedRoute allowedRoles={["superadmin", "admin_editeur"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "pages", element: <PagesManager /> },
          { path: "actualites", element: <NewsManager /> },
          { path: "publications", element: <PublicationsManager /> },
          { path: "faq", element: <FAQManager /> },
          { path: "messages", element: <MessagesManager /> },
          { path: "recrutements", element: <JobsManager /> },
          { path: "candidatures", element: <JobApplicationsManager /> },
          {
            element: <ProtectedRoute allowedRoles={["superadmin"]} />,
            children: [
              { path: "administrateurs", element: <AdminUsersManager /> },
              { path: "parametres", element: <SettingsManager /> },
            ],
          },
          { path: "*", element: <Navigate to="/admin" replace /> },
        ],
      },
    ],
  },
]);

export default router;
