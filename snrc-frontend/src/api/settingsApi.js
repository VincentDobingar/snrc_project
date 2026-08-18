import api from "./axios";

export async function getSettings() {
  const response = await api.get("/settings");
  return response.data?.data?.settings;
}