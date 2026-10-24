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
    let errorMsg = `Request failed: ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch {
      try {
        const text = await response.text();
        if (text) errorMsg = text;
      } catch {
        // ignore
      }
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export function getReasoningQuiz(difficulty = "BEGINNER", submissionKey) {
  const sessionParam = submissionKey
    ? `&submissionKey=${encodeURIComponent(submissionKey)}`
    : "";
  return request(
    `/reasoning/quiz?difficulty=${encodeURIComponent(
      difficulty.toUpperCase()
    )}${sessionParam}`
  );
}

export function startReasoningQuiz(difficulty = "BEGINNER") {
  return request(`/reasoning/start?difficulty=${encodeURIComponent(difficulty.toUpperCase())}`, {
    method: "POST",
  });
}

export function submitReasoningQuiz(payload) {
  return request("/reasoning/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
