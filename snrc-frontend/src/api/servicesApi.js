import api from "./axios";

export async function getServices() {
  const response = await api.get("/services");
  return response.data?.data?.services || [];
}