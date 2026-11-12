import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { questionsFor } from "../../../services/codingAssessment";
import "../../../styles/CodingQuestionList.css";

const label = (value = "") => value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

function CodingQuestionList() {
  const navigate = useNavigate();
  const { language, concept } = useParams();
  const [difficulty, setDifficulty] = useState("all");
  const allQuestions = useMemo(() => questionsFor(language, concept), [language, concept]);
  const difficulties = [...new Set(allQuestions.map((question) => question.difficulty).filter(Boolean))];
  const questions = difficulty === "all" ? allQuestions : allQuestions.filter((question) => question.difficulty === difficulty);

  return (
    <main className="question-list-page">
      <header className="question-list-header">
        <button className="question-list-back" onClick={() => navigate(`/coding/${language}`)}>Back to concepts</button>
        <p className="assessment-eyebrow">{label(language)} · Coding Assessment</p>
        <h1>{label(concept)} Challenges</h1>
        <p>Choose a difficulty, then open a question from the existing SkillQuest bank.</p>
        <label className="difficulty-filter">Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="all">All difficulties</option>
            {difficulties.map((item) => <option key={item} value={item}>{label(item)}</option>)}
          </select>
        </label>
      </header>

      <section className="question-list-grid" aria-label="Coding challenges">
        {questions.length ? questions.map((question) => (
          <article className="question-list-card" key={`${question.language || language}-${question.id}`}>
            <span className={`difficulty-badge ${question.difficulty || ""}`}>{label(question.difficulty || "Unrated")}</span>
            <h2>{question.title}</h2>
            <p>{question.statement}</p>
            <button onClick={() => navigate(`/coding/${language}/${concept}/question/${question.id}`)}>Open assessment</button>
          </article>
        )) : <p className="no-questions">No {difficulty === "all" ? "supported" : label(difficulty)} questions are available for this language and concept.</p>}
      </section>
    </main>
  );
}

export default CodingQuestionList;
