const baseUrl = () => import.meta.env.VITE_API_BASE_URL;
export const RECRUITER_MOCK_MODE = import.meta.env.DEV && import.meta.env.VITE_RECRUITER_MOCK_MODE === "true";
export const RECRUITER_API_READY = Boolean(baseUrl()) || RECRUITER_MOCK_MODE;

const mockSessionKey = "skillquest-recruiter-demo-user";
const mockAssessments = [
  { id: "demo-assessment-1", title: "JavaScript Fundamentals", type: "coding", technology: "JavaScript", questionCount: 8, assignedCandidates: 12, completedAttempts: 9, averageScore: 82, status: "published", createdAt: "2026-10-12T10:00:00Z", durationMinutes: 45, passingScore: 70, allowedAttempts: 1, description: "A sample coding assessment for frontend preview.", questions: [] },
  { id: "demo-assessment-2", title: "React UI Patterns", type: "coding", technology: "React", questionCount: 6, assignedCandidates: 8, completedAttempts: 5, averageScore: 76, status: "draft", createdAt: "2026-10-19T10:00:00Z", durationMinutes: 30, passingScore: 65, allowedAttempts: 1, description: "A sample draft assessment for frontend preview.", questions: [] },
];
const mockCandidates = [
  { id: "demo-candidate-1", candidateId: "demo-candidate-1", name: "Alex Morgan", email: "alex.morgan@example.test", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", technology: "JavaScript", score: 91, status: "completed", completedAt: "2026-10-23T14:30:00Z", decision: "shortlisted", headline: "Frontend developer", assessments: [{ id: "demo-attempt-1", attemptId: "demo-attempt-1", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", completedAt: "2026-10-23T14:30:00Z", status: "completed", score: 91, durationSeconds: 1620, attempts: 1, outcome: "passed" }], skillBreakdown: [{ language: "JavaScript", concept: "Arrays", difficulty: "medium", score: 91 }], proctoringEvents: [] },
  { id: "demo-candidate-2", candidateId: "demo-candidate-2", name: "Jamie Patel", email: "jamie.patel@example.test", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", technology: "JavaScript", score: 74, status: "completed", completedAt: "2026-10-22T11:15:00Z", decision: "review", headline: "Software engineer", assessments: [{ id: "demo-attempt-2", attemptId: "demo-attempt-2", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", completedAt: "2026-10-22T11:15:00Z", status: "completed", score: 74, durationSeconds: 1830, attempts: 1, outcome: "passed" }], skillBreakdown: [{ language: "JavaScript", concept: "Functions", difficulty: "medium", score: 74 }], proctoringEvents: [] },
  { id: "demo-candidate-3", candidateId: "demo-candidate-3", name: "Taylor Kim", email: "taylor.kim@example.test", assessmentId: "demo-assessment-2", assessmentName: "React UI Patterns", technology: "React", score: 63, status: "in_progress", completedAt: null, decision: "", headline: "UI developer", assessments: [], skillBreakdown: [], proctoringEvents: [] },
];
const mockResults = [
  { id: "demo-attempt-1", attemptId: "demo-attempt-1", candidateId: "demo-candidate-1", candidateName: "Alex Morgan", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", technology: "JavaScript", score: 91, percentage: 91, passedTests: 9, totalTests: 10, durationSeconds: 1620, status: "completed", rank: 1, decision: "shortlisted", completedAt: "2026-10-23T14:30:00Z" },
  { id: "demo-attempt-2", attemptId: "demo-attempt-2", candidateId: "demo-candidate-2", candidateName: "Jamie Patel", assessmentId: "demo-assessment-1", assessmentName: "JavaScript Fundamentals", technology: "JavaScript", score: 74, percentage: 74, passedTests: 7, totalTests: 10, durationSeconds: 1830, status: "completed", rank: 2, decision: "review", completedAt: "2026-10-22T11:15:00Z" },
];
const mockSettings = { name: "SkillQuest Demo Recruiter", email: "recruiter@example.test", notificationsEnabled: true };

function getMockUser() {
  const serialized = window.sessionStorage.getItem(mockSessionKey);
  return serialized ? JSON.parse(serialized) : null;
}

function requireMockUser() {
  const user = getMockUser();
  if (!user) {
    const error = new Error("Sign in to the local recruiter demo to continue.");
    error.status = 401;
    throw error;
  }
}

function matchesQuery(record, query) {
  const search = (query.get("search") || "").toLowerCase();
  const assessment = (query.get("assessment") || "").toLowerCase();
  const technology = (query.get("technology") || "").toLowerCase();
  const status = query.get("status") || "";
  const minimum = Number(query.get("minScore") || 0);
  const maximum = Number(query.get("maxScore") || 100);
  return (!search || `${record.name || ""} ${record.email || ""} ${record.title || ""}`.toLowerCase().includes(search))
    && (!assessment || `${record.assessmentId || ""} ${record.assessmentName || ""} ${record.title || ""}`.toLowerCase().includes(assessment))
    && (!technology || `${record.technology || ""} ${record.language || ""}`.toLowerCase().includes(technology))
    && (!status || record.status === status)
    && (record.score === undefined || (record.score >= minimum && record.score <= maximum));
}

async function mockApiRequest(path, options = {}) {
  const url = new URL(path, window.location.origin);
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const route = url.pathname;

  if (route === "/api/auth/login" && method === "POST") {
    if (!body.email || !body.password) throw new Error("Enter an email address and password to use the local demo.");
    const user = { id: "demo-recruiter", name: "Demo Recruiter", email: body.email, role: "recruiter" };
    window.sessionStorage.setItem(mockSessionKey, JSON.stringify(user));
    return { user };
  }
  if (route === "/api/auth/me" && method === "GET") {
    requireMockUser();
    return { user: getMockUser() };
  }
  if (route === "/api/auth/logout" && method === "POST") {
    window.sessionStorage.removeItem(mockSessionKey);
    return { success: true };
  }

  requireMockUser();
  if (route === "/api/recruiter/dashboard" && method === "GET") {
    return { metrics: { totalAssessments: 2, activeAssessments: 1, totalCandidates: 3, completedAttempts: 2, completionRate: 67, averageScore: 83 }, recentAssessments: mockAssessments, recentActivity: mockResults.map((item) => ({ ...item, candidateName: item.candidateName, assessmentName: item.assessmentName })), scoreDistribution: [{ label: "0–59%", count: 0 }, { label: "60–79%", count: 1 }, { label: "80–100%", count: 1 }] };
  }
  if (route === "/api/recruiter/assessments" && method === "GET") {
    return { items: mockAssessments.filter((item) => matchesQuery(item, url.searchParams)) };
  }
  const assessmentMatch = route.match(/^\/api\/recruiter\/assessments\/([^/]+)$/);
  if (assessmentMatch) {
    const index = mockAssessments.findIndex((item) => item.id === decodeURIComponent(assessmentMatch[1]));
    if (method === "GET") {
      if (index < 0) throw new Error("Demo assessment not found.");
      return mockAssessments[index];
    }
    if (method === "DELETE") {
      if (index >= 0) mockAssessments.splice(index, 1);
      return { success: true };
    }
    if (method === "POST" && route.endsWith("/duplicate")) {
      const original = mockAssessments[index];
      if (!original) throw new Error("Demo assessment not found.");
      const copy = { ...original, id: `demo-assessment-${Date.now()}`, title: `${original.title} (copy)`, status: "draft" };
      mockAssessments.push(copy);
      return copy;
    }
    if (method === "PUT" && index >= 0) {
      mockAssessments[index] = { ...mockAssessments[index], ...body };
      return mockAssessments[index];
    }
  }
  const assessmentActionMatch = route.match(/^\/api\/recruiter\/assessments\/([^/]+)\/(publish|close|duplicate)$/);
  if (assessmentActionMatch && method === "POST") {
    const id = decodeURIComponent(assessmentActionMatch[1]);
    const action = assessmentActionMatch[2];
    const index = mockAssessments.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Demo assessment not found.");
    if (action === "duplicate") {
      const copy = { ...mockAssessments[index], id: `demo-assessment-${Date.now()}`, title: `${mockAssessments[index].title} (copy)`, status: "draft" };
      mockAssessments.push(copy);
      return copy;
    }
    mockAssessments[index] = { ...mockAssessments[index], status: action === "publish" ? "published" : "closed" };
    return mockAssessments[index];
  }
  if (route === "/api/recruiter/assessments" && method === "POST") {
    const assessment = { ...body, id: `demo-assessment-${Date.now()}`, questionCount: body.questionIds?.length || 0, assignedCandidates: 0, completedAttempts: 0, createdAt: new Date().toISOString() };
    mockAssessments.push(assessment);
    return assessment;
  }
  if (route === "/api/recruiter/candidates" && method === "GET") {
    return { items: mockCandidates.filter((item) => matchesQuery(item, url.searchParams)) };
  }
  const candidateMatch = route.match(/^\/api\/recruiter\/candidates\/([^/]+)(?:\/decision)?$/);
  if (candidateMatch) {
    const candidate = mockCandidates.find((item) => item.id === decodeURIComponent(candidateMatch[1]));
    if (!candidate) throw new Error("Demo candidate not found.");
    if (method === "PATCH") {
      candidate.decision = body.decision || "";
      candidate.recruiterNotes = body.notes || candidate.recruiterNotes || "";
      return candidate;
    }
    if (method === "GET") return candidate;
  }
  if (route === "/api/recruiter/results" && method === "GET") {
    const items = mockResults.filter((item) => matchesQuery(item, url.searchParams));
    return { items, totalPages: 1 };
  }
  if (route === "/api/recruiter/analytics" && method === "GET") {
    return { totalAssessments: 2, assignedCandidates: 20, completionRate: 70, averageScore: 83, highestScore: 91, lowestScore: 74, scoreDistribution: [{ label: "0–59%", count: 0 }, { label: "60–79%", count: 1 }, { label: "80–100%", count: 1 }], technologyPerformance: [{ technology: "JavaScript", averageScore: 83 }], assessmentActivity: mockAssessments.map((item) => ({ assessmentName: item.title, technology: item.technology, assigned: item.assignedCandidates, completed: item.completedAttempts, averageScore: item.averageScore })) };
  }
  if (route === "/api/recruiter/settings" && method === "GET") return mockSettings;
  if (route === "/api/recruiter/settings" && method === "PUT") {
    Object.assign(mockSettings, body);
    return mockSettings;
  }
  throw new Error(`The local recruiter demo does not support ${method} ${route}.`);
}

export async function apiRequest(path, options = {}) {
  if (RECRUITER_MOCK_MODE) return mockApiRequest(path, options);
  const base = baseUrl();
  if (!base) throw new Error("Recruiter services are unavailable because VITE_API_BASE_URL is not configured.");
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    ...options,
    credentials: "include",
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export const recruiterApi = {
  me: () => apiRequest("/api/auth/me"),
  login: (credentials) => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: () => apiRequest("/api/auth/logout", { method: "POST" }),
  dashboard: () => apiRequest("/api/recruiter/dashboard"),
  assessments: (query = "") => apiRequest(`/api/recruiter/assessments${query}`),
  assessment: (id) => apiRequest(`/api/recruiter/assessments/${encodeURIComponent(id)}`),
  createAssessment: (payload) => apiRequest("/api/recruiter/assessments", { method: "POST", body: JSON.stringify(payload) }),
  updateAssessment: (id, payload) => apiRequest(`/api/recruiter/assessments/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }),
  assessmentAction: (id, action) => apiRequest(`/api/recruiter/assessments/${encodeURIComponent(id)}/${action}`, { method: "POST" }),
  deleteAssessment: (id) => apiRequest(`/api/recruiter/assessments/${encodeURIComponent(id)}`, { method: "DELETE" }),
  candidates: (query = "") => apiRequest(`/api/recruiter/candidates${query}`),
  candidate: (id) => apiRequest(`/api/recruiter/candidates/${encodeURIComponent(id)}`),
  decision: (id, payload) => apiRequest(`/api/recruiter/candidates/${encodeURIComponent(id)}/decision`, { method: "PATCH", body: JSON.stringify(payload) }),
  results: (query = "") => apiRequest(`/api/recruiter/results${query}`),
  analytics: (query = "") => apiRequest(`/api/recruiter/analytics${query}`),
  settings: () => apiRequest("/api/recruiter/settings"),
  updateSettings: (payload) => apiRequest("/api/recruiter/settings", { method: "PUT", body: JSON.stringify(payload) }),
};

export function queryString(values) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}
