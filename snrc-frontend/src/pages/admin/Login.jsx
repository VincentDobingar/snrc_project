import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login, authLoading, isAuthenticated, bootLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo = location.state?.from?.pathname || "/admin";

  if (!bootLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const result = await login(form);

    if (!result.success) {
      const fieldErrors = result.errors?.map((e) => e.message).join(" • ");
      setErrorMessage(fieldErrors || result.message || "Connexion impossible.");
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-snrc-light px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-snrc-blue via-snrc-blue to-blue-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              Administration SNRC
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
              Connectez-vous à l’espace administrateur
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/85">
              Accédez au tableau de bord pour gérer les pages, les actualités,
              les publications, les messages et les paramètres du site.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-white/80">Accès sécurisé</p>
            <p className="mt-3 text-lg font-semibold">
              Authentification administrateur SNRC
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-snrc.png"
                alt="Logo SNRC"
                className="h-12 w-auto object-contain"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-snrc-blue">
                  Société Nationale de
                </p>
                <p className="text-sm font-semibold text-snrc-blue">
                  Recouvrement des Créances
                </p>
              </div>
            </div>

            <h2 className="mt-8 font-display text-3xl font-bold text-snrc-blue">
              Connexion administrateur
            </h2>

            <p className="mt-3 text-base leading-7 text-snrc-blue/75">
              Entrez vos identifiants pour accéder à l’administration.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-medium text-snrc-blue"
                >
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-snrc-blue/15 px-4 transition focus-within:border-snrc-blue focus-within:ring-4 focus-within:ring-snrc-blue/10">
                  <Mail size={18} className="text-snrc-blue/60" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="admin@snrc.td"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-medium text-snrc-blue"
                >
                  Mot de passe
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-snrc-blue/15 px-4 transition focus-within:border-snrc-blue focus-within:ring-4 focus-within:ring-snrc-blue/10">
                  <LockKeyhole size={18} className="text-snrc-blue/60" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-lg p-2 text-snrc-blue/60 transition hover:bg-snrc-blue/5 hover:text-snrc-blue"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    title={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-snrc-red/15 bg-snrc-red/5 px-4 py-3 text-sm font-medium text-snrc-red">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={authLoading}
                className="btn-snrc-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {authLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}