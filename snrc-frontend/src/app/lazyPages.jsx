import { lazy } from "react";

// Regroupe tous les composants lazy-loadés utilisés par router.jsx. Séparé de
// router.jsx car ce fichier-ci exporte aussi `router` (un objet, pas un
// composant) : react-refresh/only-export-components exige qu'un fichier
// contenant des déclarations "composant" (comme ces lazy()) n'exporte que
// des composants, sans quoi le Fast Refresh de Vite ne fonctionne pas
// correctement en développement sur ce fichier.

export const Home = lazy(() => import("../pages/public/Home"));
export const About = lazy(() => import("../pages/public/About"));
export const Missions = lazy(() => import("../pages/public/Missions"));
export const Services = lazy(() => import("../pages/public/Services"));
export const NewsList = lazy(() => import("../pages/public/NewsList"));
export const NewsDetail = lazy(() => import("../pages/public/NewsDetail"));
export const Publications = lazy(() => import("../pages/public/Publications"));
export const Jobs = lazy(() => import("../pages/public/Jobs"));
export const JobDetail = lazy(() => import("../pages/public/JobDetail"));
export const FAQ = lazy(() => import("../pages/public/FAQ"));
export const Contact = lazy(() => import("../pages/public/Contact"));
export const NotFound = lazy(() => import("../pages/public/NotFound"));

export const Login = lazy(() => import("../pages/admin/Login"));
export const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
export const PagesManager = lazy(() => import("../pages/admin/PagesManager"));
export const NewsManager = lazy(() => import("../pages/admin/NewsManager"));
export const PublicationsManager = lazy(() =>
  import("../pages/admin/PublicationsManager")
);
export const FAQManager = lazy(() => import("../pages/admin/FAQManager"));
export const AdminUsersManager = lazy(() => import("../pages/admin/AdminUsersManager"));
export const SettingsManager = lazy(() => import("../pages/admin/SettingsManager"));
export const MessagesManager = lazy(() => import("../pages/admin/MessagesManager"));
export const JobsManager = lazy(() => import("../pages/admin/JobsManager"));
export const JobApplicationsManager = lazy(() =>
  import("../pages/admin/JobApplicationsManager")
);
