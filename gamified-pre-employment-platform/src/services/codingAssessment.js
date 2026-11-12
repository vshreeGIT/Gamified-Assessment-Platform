import codingQuestions from "../data/codingQuestions";
import codingConcepts from "../data/codingConcepts";

const aliases = {
  "data-types": "datatypes",
  "conditional-statements": "conditionalStatements",
  "exception-handling": "exceptionHandling",
  "file-handling": "fileHandling",
  "async-await": "asyncAwait",
  "group-by": "groupBy",
  "sub-queries": "subqueries",
  "stored-procedures": "storedProcedures",
};

export const conceptDataKey = (slug = "") => aliases[slug] || slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export function questionsFor(language, concept) {
  const key = conceptDataKey(concept);
  const rows = codingQuestions[key];
  if (!Array.isArray(rows)) return [];
  return rows.filter((question) => {
    if (question.language) return question.language === language;
    if (key === "variables") {
      return codingConcepts[language]?.some((item) => item.toLowerCase() === "variables") || false;
    }
    return Boolean(question.starterCode?.[language]);
  });
}

export function questionById(language, concept, id) {
  return questionsFor(language, concept).find((question) => String(question.id) === String(id));
}

export const assessmentStorageKey = (language, concept) => `skillquest-assessment:${language}:${concept}`;

export async function assessmentRequest(path, options = {}) {
  const base = import.meta.env.VITE_ASSESSMENT_API_URL;
  if (!base) throw new Error("Assessment backend is not configured. Set VITE_ASSESSMENT_API_URL to a secured SkillQuest assessment API.");
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Assessment request failed (${response.status}).`);
  return body;
}

export function formatDuration(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}
