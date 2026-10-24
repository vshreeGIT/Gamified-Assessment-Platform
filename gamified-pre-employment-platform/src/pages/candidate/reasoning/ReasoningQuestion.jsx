import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReasoningQuiz,
  submitReasoningQuiz,
} from "../../../services/assessmentService";
import "./ReasoningQuestion.css";

function ReasoningQuestion() {
  const navigate = useNavigate();
  const { difficulty: routeDifficulty } = useParams();

  const difficulty = (routeDifficulty || "BEGINNER").toUpperCase();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");

  const answersRef = useRef({});
  const submittingRef = useRef(false);
  const startedAtRef = useRef(null);
  const submissionKeyRef = useRef(null);
  const timeoutSubmissionRef = useRef(false);

  // Fetch the question set for the selected difficulty.
  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      setLoading(true);
      setError("");

      try {
        const storageKey = `skillquest_reasoning_${difficulty.toLowerCase()}`;
        const data = await getReasoningQuiz(
          difficulty,
          sessionStorage.getItem(storageKey)
        );

        if (cancelled) return;

        if (!data.questions || data.questions.length === 0) {
          throw new Error("No questions were returned for this difficulty.");
        }

        const deadlineMilliseconds = new Date(data.deadlineAt).getTime();
        const durationSeconds = Math.ceil((deadlineMilliseconds - Date.now()) / 1000);
        if (!data.submissionKey || !Number.isFinite(durationSeconds)
            || !Number.isFinite(Number(data.durationMinutes)) || Number(data.durationMinutes) <= 0) {
          throw new Error("The server returned an invalid assessment session.");
        }

        setQuiz(data);
        setCurrentQuestion(0);
        setAnswers({});
        answersRef.current = {};
        submittingRef.current = false;
        timeoutSubmissionRef.current = false;
        submissionKeyRef.current = data.submissionKey;
        sessionStorage.setItem(storageKey, data.submissionKey);

        setTimeLeft(Math.max(0, durationSeconds));
        startedAtRef.current = deadlineMilliseconds - Number(data.durationMinutes) * 60 * 1000;
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load the quiz.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [difficulty]);

  // Submit answers to the backend. The backend calculates the score.
  const submitQuiz = useCallback(async (timedOut = false) => {
    if (!quiz || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setShowConfirmModal(false);
    setError("");

    const timeTakenSeconds = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : 0;

    try {
      const result = await submitReasoningQuiz({
        difficulty,
        answers: answersRef.current,
        timeTakenSeconds,
        submissionKey: submissionKeyRef.current,
      });

      navigate("/reasoning/result", {
        replace: true,
        state: {
          result,
          timedOut,
        },
      });
    } catch (err) {
      submittingRef.current = false;
      setSubmitting(false);
      setError(err.message || "Unable to submit your quiz. Please try again.");
    }
  }, [quiz, difficulty, navigate]);

  // Countdown timer.
  useEffect(() => {
    if (!quiz || loading || submitting) return;

    if (timeLeft <= 0) {
      if (!timeoutSubmissionRef.current) {
        timeoutSubmissionRef.current = true;
        submitQuiz(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [quiz, loading, submitting, timeLeft, submitQuiz]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((previous) => {
      const updated = {
        ...previous,
        [questionId]: option,
      };

      answersRef.current = updated;
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="reasoning-question-page">
        <div className="question-container">
          <p>⏳ Loading your {difficulty.toLowerCase()} reasoning quest...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="reasoning-question-page">
        <div className="question-container">
          <h2>Unable to load your quest</h2>
          <p role="alert" style={{ color: "#ef4444", margin: "1rem 0" }}>{error}</p>
          <button className="start-btn" onClick={() => navigate("/reasoning")}>
            Back to Reasoning
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const questions = quiz.questions;
  const question = questions[currentQuestion];
  const options = question.options || [];
  const questionId = question.id;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="reasoning-question-page">
      <div className="question-container">
        <div className="question-header">
          <div>
            <h1>🧠 Logical Reasoning Quest</h1>
            <p>Difficulty: {difficulty} • Base XP: +{quiz.baseXP}</p>
          </div>

          <div className="timer" aria-live="polite">
            ⏱ {formatTime()}
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>
            Question {currentQuestion + 1} of {questions.length} • ({answeredCount} answered)
          </p>
        </div>

        <div className="question-card">
          <h2>{question.question}</h2>
          {question.statement && (
            <p style={{ fontWeight: 600, color: "#93c5fd", margin: "0.5rem 0 1rem 0" }}>
              {question.statement}
            </p>
          )}

          <div className="options">
            {options.map((option, index) => (
              <label
                key={index}
                className={`option ${
                  answers[questionId] === option ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  checked={answers[questionId] === option}
                  disabled={submitting}
                  onChange={() => handleAnswer(questionId, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="error-message">
            ⚠️ {error}
          </p>
        )}

        <div className="navigation">
          <button
            onClick={() => setCurrentQuestion((index) => index - 1)}
            disabled={currentQuestion === 0 || submitting}
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              className="submit-btn"
              onClick={() => setShowConfirmModal(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "🏁 Submit Quest"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((index) => index + 1)}
              disabled={submitting}
            >
              Next →
            </button>
          )}
        </div>

        <div className="question-navigator">
          <h3>Question Navigator</h3>

          <div className="navigator-grid">
            {questions.map((item, index) => (
              <button
                key={item.id}
                className={`nav-btn ${
                  currentQuestion === index ? "active" : ""
                } ${answers[item.id] !== undefined ? "answered" : ""}`}
                disabled={submitting}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#1e1e2f",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "480px",
                width: "90%",
                color: "#fff",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                Ready to Submit Your Quest? 🏁
              </h2>
              <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
                You have answered <b>{answeredCount}</b> of <b>{questions.length}</b> questions.
                {answeredCount < questions.length && (
                  <span style={{ display: "block", color: "#f59e0b", marginTop: "0.5rem" }}>
                    ⚠️ You have {questions.length - answeredCount} unanswered questions!
                  </span>
                )}
              </p>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #4b5563",
                    color: "#e5e7eb",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Review Answers
                </button>
                <button
                  type="button"
                  onClick={() => submitQuiz(false)}
                  disabled={submitting}
                  style={{
                    backgroundColor: "#6366f1",
                    border: "none",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {submitting ? "Submitting..." : "Yes, Submit Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReasoningQuestion;
