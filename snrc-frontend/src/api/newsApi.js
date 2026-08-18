import api from "./axios";

export async function getNews() {
  const response = await api.get("/news");
  return response.data?.data?.news || [];
}

export async function getNewsBySlug(slug) {
  const response = await api.get(`/news/${slug}`);
  return response.data?.data?.news;
}