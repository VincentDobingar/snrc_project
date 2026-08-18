import api from "./axios";

export async function getPublications() {
  const response = await api.get("/publications");
  return response.data?.data?.publications || [];
}