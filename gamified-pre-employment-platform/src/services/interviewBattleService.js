const API = "http://localhost:8080/api/interview";

async function request(path, options = {}) {
  const token = localStorage.getItem("skillquest_token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || `Request failed: ${response.status}`);
  return body;
}

export const startInterviewAssessment = () => request("/start", { method: "POST" });
export const getInterviewSession = () => request("/session");
export const saveInterviewDraft = (payload) => request("/session/answers", { method: "PUT", body: JSON.stringify(payload) });
export const submitInterviewAssessment = (payload) => request("/submit", { method: "POST", body: JSON.stringify(payload) });
export const getInterviewAttempt = (attemptId) => request(`/attempt/${encodeURIComponent(attemptId)}`);
