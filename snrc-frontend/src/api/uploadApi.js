import api from "./axios";

function extractUploadedPath(payload) {
  return (
    payload?.data?.file?.url ||
    payload?.data?.url ||
    payload?.url ||
    payload?.data?.file_url ||
    payload?.data?.file?.file_url ||
    payload?.data?.file_path ||
    payload?.file_path ||
    payload?.data?.path ||
    payload?.path ||
    ""
  );
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const path = extractUploadedPath(response.data);

  if (!path) {
    throw new Error("Chemin de l’image introuvable dans la réponse serveur.");
  }

  return path;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/uploads/document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const path = extractUploadedPath(response.data);

  if (!path) {
    throw new Error("Chemin du document introuvable dans la réponse serveur.");
  }

  return path;
}