import api from "./axios";

export async function getJobs() {
  const response = await api.get("/jobs");
  return response.data?.data?.jobs || [];
}

export async function getJobBySlug(slug) {
  const response = await api.get(`/jobs/${slug}`);
  return response.data?.data?.job;
}

export async function applyToJob(jobId, formData) {
  const response = await api.post(`/jobs/${jobId}/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
