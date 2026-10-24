const API_BASE_URL = "http://localhost:8080/api/challenges";

async function request(path, options = {}) {
  const token = localStorage.getItem("skillquest_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try { const body = await response.json(); message = body.message || body.error || message; } catch { /* use status message */ }
    throw new Error(message);
  }
  return response.json();
}

export const getChallengeProgress = () => request("/progress");
export const startTeamworkAssessment = () => request("/teamwork/start", { method: "POST" });
export const getTeamworkSession = (key) => request(`/teamwork/session?submissionKey=${encodeURIComponent(key)}`);
export const submitTeamworkAssessment = (payload) => request("/teamwork/submit", { method: "POST", body: JSON.stringify(payload) });
export const getTeamworkAttempt = (id) => request(`/teamwork/attempt/${encodeURIComponent(id)}`);
export const getInterviewAccess = () => request("/interview/access");
