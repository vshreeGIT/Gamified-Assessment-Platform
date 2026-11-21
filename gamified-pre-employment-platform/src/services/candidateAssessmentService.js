import { getToken } from "./authService";

const baseUrl = () => import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${baseUrl().replace(/\/$/, "")}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export function getCandidateAssessment(assessmentId) {
  return request(`/api/candidate/assessments/${encodeURIComponent(assessmentId)}`);
}

export function submitCandidateAssessment(assessmentId, payload) {
  return request(`/api/candidate/assessments/${encodeURIComponent(assessmentId)}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}