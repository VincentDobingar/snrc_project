import { useEffect, useMemo, useState } from "react";
import {
  createAdminUser,
  getAdminUsers,
  updateAdminUser,
  updateAdminUserPassword,
  updateAdminUserStatus,
} from "../../api/adminApi";

const initialForm = {
  full_name: "",
  email: "",
  role: "admin_editeur",
  status: "active",
  password: "",
};

export default function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les administrateurs."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      role: user.role || "admin_editeur",
      status: user.status || "active",
      password: "",
    });
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      if (editingId) {
        const result = await updateAdminUser(editingId, {
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          status: form.status,
        });
        setFeedback(result?.message || "Administrateur mis à jour avec succès.");
      } else {
        const result = await createAdminUser(form);
        setFeedback(result?.message || "Administrateur créé avec succès.");
      }

      await loadUsers();
      resetForm();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(validationErrors.map((item) => item.message).join(" • "));
      } else {
        setFeedback(
          error?.response?.data?.message ||
            "Erreur lors de l’enregistrement."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(user) {
    const nextStatus = user.status === "active" ? "inactive" : "active";

    try {
      const result = await updateAdminUserStatus(user.id, nextStatus);
      setFeedback(result?.message || "Statut mis à jour avec succès.");
      await loadUsers();
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors du changement de statut."
      );
    }
  }

  async function handlePasswordUpdate(user) {
    if (!newPassword.trim()) {
      setFeedback("Veuillez saisir un nouveau mot de passe.");
      return;
    }

    try {
      const result = await updateAdminUserPassword(user.id, newPassword);
      setFeedback(result?.message || "Mot de passe mis à jour avec succès.");
      setPasswordTarget(null);
      setNewPassword("");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la mise à jour du mot de passe."
      );
    }
  }

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [users]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Administrateurs
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion des administrateurs
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Créez et gérez les comptes d’accès au back-office SNRC.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId ? "Modifier un administrateur" : "Créer un administrateur"}
            </h3>
            <p className="mt-1 text-sm text-snrc-blue/70">
              Renseignez les champs puis enregistrez.
            </p>
          </div>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-snrc-blue/15 px-4 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
            >
              Annuler la modification
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Nom complet
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Nom complet"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="admin@snrc.td"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Rôle
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="superadmin">Superadmin</option>
              <option value="admin_editeur">Admin éditeur</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Statut
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          {!editingId ? (
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-snrc-blue">
                Mot de passe initial
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="Mot de passe"
              />
            </div>
          ) : null}
        </div>

        {feedback ? (
          <div className="mt-6 rounded-xl border border-snrc-blue/10 bg-snrc-light px-4 py-3 text-sm font-medium text-snrc-blue">
            {feedback}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-snrc-blue/15 px-5 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
          >
            Réinitialiser
          </button>

          <button type="submit" className="btn-snrc-primary" disabled={saving}>
            {saving
              ? "Enregistrement..."
              : editingId
              ? "Mettre à jour"
              : "Créer l’administrateur"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des administrateurs
          </h3>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">
              Chargement des administrateurs...
            </p>
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucun administrateur disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Nom</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Rôle</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-snrc-blue/10 text-sm"
                  >
                    <td className="px-6 py-4 font-semibold text-snrc-blue">
                      {user.full_name}
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {user.role}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                        >
                          {user.status === "active" ? "Désactiver" : "Activer"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPasswordTarget(user)}
                          className="rounded-lg border border-snrc-red/20 px-3 py-2 font-medium text-snrc-red transition hover:bg-snrc-red hover:text-white"
                        >
                          Mot de passe
                        </button>
                      </div>

                      {passwordTarget?.id === user.id ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-lg border border-snrc-blue/15 px-3 py-2 outline-none"
                            placeholder="Nouveau mot de passe"
                          />
                          <button
                            type="button"
                            onClick={() => handlePasswordUpdate(user)}
                            className="rounded-lg bg-snrc-blue px-3 py-2 font-medium text-white"
                          >
                            Enregistrer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPasswordTarget(null);
                              setNewPassword("");
                            }}
                            className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}