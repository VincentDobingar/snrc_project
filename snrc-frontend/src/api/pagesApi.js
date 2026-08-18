import api from "./axios";

export async function getPageBySlug(slug) {
  const response = await api.get(`/pages/${slug}`);
  return response.data?.data?.page;
}