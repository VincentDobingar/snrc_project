import api from "./axios";

export async function getAdminPages() {
  const response = await api.get("/admin/pages");
  return response.data?.data?.pages || [];
}

export async function getAdminNews() {
  const response = await api.get("/admin/news");
  return response.data?.data?.news || [];
}

export async function getAdminPublications() {
  const response = await api.get("/admin/publications");
  return response.data?.data?.publications || [];
}

export async function getAdminFaqs() {
  const response = await api.get("/admin/faqs");
  return response.data?.data?.faqs || [];
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data?.data?.users || [];
}

export async function updateAdminSettings(payload) {
  const response = await api.put("/admin/settings", payload);
  return response.data;
}

export async function createAdminPage(payload) {
  const response = await api.post("/admin/pages", payload);
  return response.data;
}

export async function updateAdminPage(id, payload) {
  const response = await api.put(`/admin/pages/${id}`, payload);
  return response.data;
}

export async function deleteAdminPage(id) {
  const response = await api.delete(`/admin/pages/${id}`);
  return response.data;
}

export async function createAdminNews(payload) {
  const response = await api.post("/admin/news", payload);
  return response.data;
}

export async function updateAdminNews(id, payload) {
  const response = await api.put(`/admin/news/${id}`, payload);
  return response.data;
}

export async function deleteAdminNews(id) {
  const response = await api.delete(`/admin/news/${id}`);
  return response.data;
}

export async function createAdminPublication(payload) {
  const response = await api.post("/admin/publications", payload);
  return response.data;
}

export async function updateAdminPublication(id, payload) {
  const response = await api.put(`/admin/publications/${id}`, payload);
  return response.data;
}

export async function deleteAdminPublication(id) {
  const response = await api.delete(`/admin/publications/${id}`);
  return response.data;
}

export async function getPublicationCategories() {
  const response = await api.get("/publication-categories");
  return response.data?.data?.categories || [];
}

export async function createAdminFaq(payload) {
  const response = await api.post("/admin/faqs", payload);
  return response.data;
}

export async function updateAdminFaq(id, payload) {
  const response = await api.put(`/admin/faqs/${id}`, payload);
  return response.data;
}

export async function deleteAdminFaq(id) {
  const response = await api.delete(`/admin/faqs/${id}`);
  return response.data;
}

export async function createAdminUser(payload) {
  const response = await api.post("/admin/users", payload);
  return response.data;
}

export async function updateAdminUser(id, payload) {
  const response = await api.put(`/admin/users/${id}`, payload);
  return response.data;
}

export async function updateAdminUserStatus(id, status) {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data;
}

export async function updateAdminUserPassword(id, password) {
  const response = await api.patch(`/admin/users/${id}/password`, { password });
  return response.data;
}

export async function getAdminMessages() {
  const response = await api.get("/admin/messages");
  return response.data?.data?.messages || [];
}

export async function getAdminMessageById(id) {
  const response = await api.get(`/admin/messages/${id}`);
  return response.data?.data?.message;
}

export async function markAdminMessageRead(id) {
  const response = await api.patch(`/admin/messages/${id}/read`, {});
  return response.data;
}

export async function deleteAdminMessage(id) {
  const response = await api.delete(`/admin/messages/${id}`);
  return response.data;
}

export async function getAdminSettings() {
  const response = await api.get("/admin/settings");
  return response.data?.data?.settings || null;
}

export async function getAdminJobs() {
  const response = await api.get("/admin/jobs");
  return response.data?.data?.jobs || [];
}

export async function createAdminJob(payload) {
  const response = await api.post("/admin/jobs", payload);
  return response.data;
}

export async function updateAdminJob(id, payload) {
  const response = await api.put(`/admin/jobs/${id}`, payload);
  return response.data;
}

export async function deleteAdminJob(id) {
  const response = await api.delete(`/admin/jobs/${id}`);
  return response.data;
}

export async function getAdminJobApplications() {
  const response = await api.get("/admin/job-applications");
  return response.data?.data?.applications || [];
}

export async function getAdminJobApplicationById(id) {
  const response = await api.get(`/admin/job-applications/${id}`);
  return response.data?.data?.application;
}

export async function markAdminJobApplicationRead(id) {
  const response = await api.patch(`/admin/job-applications/${id}/read`, {});
  return response.data;
}

export async function deleteAdminJobApplication(id) {
  const response = await api.delete(`/admin/job-applications/${id}`);
  return response.data;
}

