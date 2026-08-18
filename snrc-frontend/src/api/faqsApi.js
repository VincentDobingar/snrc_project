import api from "./axios";

export async function getFaqs() {
  const response = await api.get("/faqs");
  return response.data?.data?.faqs || [];
}