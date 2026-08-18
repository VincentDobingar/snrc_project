import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminMessage,
  getAdminMessageById,
  getAdminMessages,
  markAdminMessageRead,
} from "../../api/adminApi";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR");
}

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await getAdminMessages();
      setMessages(data);

      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les messages."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectMessage(message) {
    try {
      const detail = await getAdminMessageById(message.id);
      setSelectedMessage(detail || message);

      if (!message.is_read) {
        await markAdminMessageRead(message.id);
        await loadMessages();
      }
    } catch {
      setSelectedMessage(message);
    }
  }

  async function handleDelete(message) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le message de "${message.full_name}" ?`
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminMessage(message.id);
      setFeedback(result?.message || "Message supprimé avec succès.");
      await loadMessages();

      setSelectedMessage((current) =>
        current?.id === message.id ? null : current
      );
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression du message."
      );
    }
  }

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
  }, [messages]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Messages
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Messages de contact
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Consultez les messages envoyés depuis le formulaire de contact du site.
        </p>
      </div>

      {feedback ? (
        <div className="rounded-xl border border-snrc-blue/10 bg-snrc-light px-4 py-3 text-sm font-medium text-snrc-blue">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-snrc overflow-hidden">
          <div className="border-b border-snrc-blue/10 px-6 py-5">
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              Liste des messages
            </h3>
          </div>

          {loading ? (
            <div className="p-6">
              <p className="font-medium text-snrc-blue">
                Chargement des messages...
              </p>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="p-6">
              <p className="font-medium text-snrc-blue/80">
                Aucun message disponible.
              </p>
            </div>
          ) : (
            <div className="max-h-[720px] overflow-y-auto">
              {sortedMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full border-b border-snrc-blue/10 px-6 py-5 text-left transition ${
                    selectedMessage?.id === message.id
                      ? "bg-snrc-light"
                      : "hover:bg-snrc-light/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-snrc-blue">
                        {message.full_name}
                      </p>
                      <p className="mt-1 text-sm text-snrc-blue/70">
                        {message.subject}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        message.is_read
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message.is_read ? "Lu" : "Nouveau"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-snrc-blue/75">
                    {message.message}
                  </p>

                  <p className="mt-3 text-xs text-snrc-blue/60">
                    {formatDate(message.created_at)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Détail du message
          </h3>

          {!selectedMessage ? (
            <p className="mt-4 text-snrc-blue/75">
              Sélectionnez un message dans la liste.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Nom complet
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selectedMessage.full_name}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">Email</p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selectedMessage.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Téléphone
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selectedMessage.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">Sujet</p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Date d’envoi
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Message
                </p>
                <div className="mt-2 rounded-2xl bg-snrc-light p-4 leading-7 text-snrc-blue/85">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    "Réponse à votre message"
                  )}`}
                  className="btn-snrc-primary"
                >
                  Répondre par email
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage)}
                  className="rounded-xl border border-snrc-red/20 px-5 py-3 font-medium text-snrc-red transition hover:bg-snrc-red hover:text-white"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}