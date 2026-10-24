const API_BASE_URL = "http://localhost:8080/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("skillquest_token");
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let msg = `Request failed: ${response.status}`;
    try {
      const j = await response.json();
      msg = j.message || j.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getJobMatches() {
  return request("/jobs");
}

export function getJobById(jobId) {
  return request(`/jobs/${jobId}`);
}

export function getProfileStrength() {
  return request("/jobs/profile-strength");
}

export function saveJob(jobId) {
  return request(`/jobs/${jobId}/save`, { method: "POST" });
}

export function unsaveJob(jobId) {
  return request(`/jobs/${jobId}/save`, { method: "DELETE" });
}
