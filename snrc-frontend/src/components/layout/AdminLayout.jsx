import { Suspense } from "react";
import {
  Link,
  matchPath,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import PageLoader from "../ui/PageLoader";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { to: "/admin/publications", label: "Publications", icon: FileText },
  { to: "/admin/faq", label: "FAQ", icon: Shield },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/recrutements", label: "Recrutements", icon: Briefcase },
  { to: "/admin/candidatures", label: "Candidatures", icon: UserCheck },
  {
    to: "/admin/administrateurs",
    label: "Administrateurs",
    icon: Users,
    roles: ["superadmin"],
  },
  {
    to: "/admin/parametres",
    label: "Paramètres",
    icon: Settings,
    roles: ["superadmin"],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const activeNavItem = navItems.find((item) =>
    matchPath({ path: item.to, end: item.end ?? false }, location.pathname)
  );
  const pageTitle = activeNavItem?.label || "Tableau de bord";

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-snrc-light">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-snrc-blue/10 bg-white">
          <div className="flex h-20 items-center border-b border-snrc-blue/10 px-6">
            <Link to="/admin" className="flex items-center gap-3">
              <img
                src="/images/logo-snrc.png"
                alt="Logo SNRC"
                className="h-11 w-auto object-contain"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-snrc-blue">
                  Administration
                </p>
                <p className="text-xs text-snrc-blue/70">SNRC</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-2xl bg-snrc-light p-4">
              <p className="text-sm font-semibold text-snrc-blue">
                {user?.full_name || "Administrateur"}
              </p>
              <p className="mt-1 text-sm text-snrc-blue/70">{user?.email}</p>
              <p className="mt-2 inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-xs font-semibold text-snrc-blue">
                {user?.role || "admin"}
              </p>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                        isActive
                          ? "bg-snrc-blue text-white"
                          : "text-snrc-blue hover:bg-snrc-light",
                      ].join(" ")
                    }
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-snrc-red/20 bg-snrc-red/5 px-4 py-3 font-medium text-snrc-red transition hover:bg-snrc-red hover:text-white"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-snrc-blue/10 bg-white">
            <div className="flex h-20 items-center justify-between px-6 lg:px-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-snrc-blue">
                  {pageTitle}
                </h1>
                <p className="text-sm text-snrc-blue/70">
                  Espace d’administration SNRC
                </p>
              </div>
            </div>
          </header>

          <main className="p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}