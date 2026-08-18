import api from "./axios";

export async function loginAdmin(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data?.data?.user;
}

export async function logoutAdmin() {
  const response = await api.post("/auth/logout");
  return response.data;
}