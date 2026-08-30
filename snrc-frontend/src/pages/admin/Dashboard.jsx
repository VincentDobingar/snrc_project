import { useEffect, useMemo, useState } from "react";
import { FileText, Newspaper, Shield, Users } from "lucide-react";
import {
  getAdminFaqs,
  getAdminNews,
  getAdminPages,
  getAdminPublications,
  getAdminUsers,
} from "../../api/adminApi";

const statCards = [
  {
    key: "pages",
    title: "Pages",
    subtitle: "Pages institutionnelles",
    icon: FileText,
  },
  {
    key: "news",
    title: "Actualités",
    subtitle: "Contenus publiés ou brouillons",
    icon: Newspaper,
  },
  {
    key: "publications",
    title: "Publications",
    subtitle: "Documents et ressources",
    icon: Shield,
  },
  {
    key: "users",
    title: "Administrateurs",
    subtitle: "Comptes d’accès au back-office",
    icon: Users,
  },
];

export default function Dashboard() {
  const [pages, setPages] = useState([]);
  const [news, setNews] = useState([]);
  const [publications, setPublications] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [pagesData, newsData, publicationsData, faqData, usersData] =
          await Promise.all([
            getAdminPages(),
            getAdminNews(),
            getAdminPublications(),
            getAdminFaqs(),
            getAdminUsers(),
          ]);

        setPages(pagesData || []);
        setNews(newsData || []);
        setPublications(publicationsData || []);
        setFaqs(faqData || []);
        setUsers(usersData || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Erreur chargement dashboard :", error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = useMemo(
    () => ({
      pages: pages.length,
      news: news.length,
      publications: publications.length,
      faqs: faqs.length,
      users: users.length,
    }),
    [pages, news, publications, faqs, users]
  );

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Dashboard
        </span>

        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-snrc-blue">
          Bienvenue dans l’administration SNRC
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-snrc-blue/75">
          Bonjour Admin SNRC, voici un aperçu rapide de l’état actuel du site institutionnel.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.key} className="card-snrc p-8">
              <div className="inline-flex rounded-2xl bg-snrc-blue/10 p-4 text-snrc-blue">
                <Icon size={28} />
              </div>

              <p className="mt-6 text-lg text-snrc-blue/80">{item.title}</p>

              <p className="mt-3 text-5xl font-bold tracking-tight text-snrc-blue">
                {loading ? "..." : stats[item.key]}
              </p>

              <p className="mt-4 max-w-xs text-lg leading-8 text-snrc-blue/70">
                {item.subtitle}
              </p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="card-snrc p-8">
          <h2 className="font-display text-3xl font-bold text-snrc-blue">
            État rapide du contenu
          </h2>

          <div className="mt-6 space-y-4 text-snrc-blue/80">
            <p>
              <span className="font-semibold text-snrc-blue">Pages :</span>{" "}
              {loading ? "..." : stats.pages}
            </p>
            <p>
              <span className="font-semibold text-snrc-blue">Actualités :</span>{" "}
              {loading ? "..." : stats.news}
            </p>
            <p>
              <span className="font-semibold text-snrc-blue">Publications :</span>{" "}
              {loading ? "..." : stats.publications}
            </p>
            <p>
              <span className="font-semibold text-snrc-blue">FAQ :</span>{" "}
              {loading ? "..." : stats.faqs}
            </p>
            <p>
              <span className="font-semibold text-snrc-blue">Administrateurs :</span>{" "}
              {loading ? "..." : stats.users}
            </p>
          </div>
        </article>

        <article className="card-snrc p-8">
          <h2 className="font-display text-3xl font-bold text-snrc-blue">
            Gestion de la FAQ
          </h2>

          <p className="mt-4 text-lg leading-8 text-snrc-blue/75">
            Le module FAQ est maintenant connecté au back-office. Vous pouvez
            créer, modifier, organiser et publier les questions fréquentes depuis
            le menu FAQ.
          </p>

          <div className="mt-6 rounded-2xl bg-snrc-light p-5 text-snrc-blue">
            <p className="font-semibold">Nombre actuel de questions FAQ</p>
            <p className="mt-2 text-4xl font-bold">
              {loading ? "..." : stats.faqs}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}