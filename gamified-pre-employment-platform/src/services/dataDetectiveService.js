const API_BASE_URL = "http://localhost:8080/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("skillquest_token");
  const response = await fetch(`${API_BASE_URL}/data-detective${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try { const body = await response.json(); message = body.message || body.error || message; } catch { /* use status message */ }
    throw new Error(message);
  }
  return response.json();
}

export const listDataInvestigations = () => request("/investigations");
export const getDataInvestigation = (id) => request(`/${encodeURIComponent(id)}`);
export const startDataInvestigation = (id) => request(`/${encodeURIComponent(id)}/start`, { method: "POST" });
export const getDataInvestigationSession = (id, key) => request(`/${encodeURIComponent(id)}/session?submissionKey=${encodeURIComponent(key)}`);
export const submitDataInvestigation = (id, payload) => request(`/${encodeURIComponent(id)}/submit`, { method: "POST", body: JSON.stringify(payload) });
export const getDataDetectiveProgress = () => request("/progress");
export const getDataDetectiveAttempt = (id) => request(`/attempt/${encodeURIComponent(id)}`);
