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
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export function startCommunicationAssessment() {
  return request("/communication/start", { method: "POST" });
}

export function getCommunicationAssessment(submissionKey) {
  const keyParam = submissionKey
    ? `?submissionKey=${encodeURIComponent(submissionKey)}`
    : "";
  return request(`/communication/quiz${keyParam}`);
}

export function submitCommunicationAssessment(payload) {
  return request("/communication/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCommunicationHubProgress() {
  return request("/communication/hub/progress");
}

export function getCommunicationSubdivisionActivities(subdivisionId) {
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/activities`);
}

export function startCommunicationSubdivision(subdivisionId) {
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/start`, { method: "POST" });
}

export function getCommunicationSubdivisionSession(subdivisionId, submissionKey) {
  const key = submissionKey ? `?submissionKey=${encodeURIComponent(submissionKey)}` : "";
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/session${key}`);
}

export function submitCommunicationRoleplayTurn(subdivisionId, payload) {
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/roleplay-turn`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitCommunicationSubdivision(subdivisionId, payload) {
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCommunicationSubdivisionAttempt(subdivisionId, attemptId) {
  return request(`/communication/hub/${encodeURIComponent(subdivisionId)}/attempt/${encodeURIComponent(attemptId)}`);
}
