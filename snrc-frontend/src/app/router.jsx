import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import {
  Home,
  About,
  Missions,
  Services,
  NewsList,
  NewsDetail,
  Publications,
  Jobs,
  JobDetail,
  FAQ,
  Contact,
  NotFound,
  Login,
  Dashboard,
  PagesManager,
  NewsManager,
  PublicationsManager,
  FAQManager,
  AdminUsersManager,
  SettingsManager,
  MessagesManager,
  JobsManager,
  JobApplicationsManager,
} from "./lazyPages";

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
