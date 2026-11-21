import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/authService";
import {
  getCandidateAssessment,
  submitCandidateAssessment,
} from "../../services/candidateAssessmentService";
import "../../styles/CandidateDashboard.css";
import "../../styles/RecruiterAssessment.css";

function choiceValue(choice) {
  return typeof choice === "string" ? choice : choice?.id;
}

function choiceLabel(choice) {
  return typeof choice === "string" ? choice : choice?.text;
}

function isQuestionSupported(question) {
  if (["SHORT_ANSWER"].includes(question?.type)) return true;
  return ["MCQ", "MULTIPLE_SELECT", "MULTIPLE_CHOICE"].includes(question?.type)
    && Array.isArray(question.choices)
    && question.choices.length >= 2
    && question.choices.every((choice) => typeof choice === "string"
      || (typeof choice?.id === "string" && typeof choice?.text === "string"));
}

function formatDeadline(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Deadline unavailable" : date.toLocaleString();
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((part) => String(part).padStart(2, "0")).join(":");
}

function RecruiterAssessment() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(() => {
    const stored = window.sessionStorage.getItem(`skillquest-assessment-start-${assessmentId}`);
    const timestamp = stored ? Number(stored) : NaN;
    return Number.isFinite(timestamp) ? timestamp : null;
  });
  const [submissionKey, setSubmissionKey] = useState(() =>
    window.sessionStorage.getItem(`skillquest-assessment-key-${assessmentId}`) || ""
  );
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const submitLock = useRef(false);
  const autoSubmitTriggered = useRef(false);

  useEffect(() => {
    const storedStart = window.sessionStorage.getItem(`skillquest-assessment-start-${assessmentId}`);
    const timestamp = storedStart ? Number(storedStart) : NaN;
    setStartedAt(Number.isFinite(timestamp) ? timestamp : null);
    setSubmissionKey(window.sessionStorage.getItem(`skillquest-assessment-key-${assessmentId}`) || "");
    setAssessment(null);
    setAnswers({});
    setSubmitted(null);
    setError("");
    setRemainingSeconds(0);
    setLoading(true);
    submitLock.current = false;
    autoSubmitTriggered.current = false;
  }, [assessmentId]);

  useEffect(() => {
    let active = true;
    const user = getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "candidate") {
      navigate("/login", { replace: true });
      return () => { active = false; };
    }

    async function loadAssessment() {
      try {
        setLoading(true);
        setError("");
        const result = await getCandidateAssessment(assessmentId);
        if (active) setAssessment(result);
      } catch (requestError) {
        if (!active) return;
        if (requestError.status === 401) {
          logoutUser();
          navigate("/login", { replace: true });
        } else {
          setError(requestError.message || "Unable to load this assessment.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAssessment();
    return () => { active = false; };
  }, [assessmentId, navigate]);

  const questions = assessment?.questions || [];
  const questionsSupported = questions.length > 0 && questions.every(isQuestionSupported);
  const answeredCount = questions.filter((question) => {
    const answer = answers[question.id];
    return Array.isArray(answer) ? answer.length > 0 : typeof answer === "string" && answer.trim().length > 0;
  }).length;
  const startTime = assessment?.startDate ? new Date(assessment.startDate).getTime() : null;
  const deadlineTime = assessment?.deadline ? new Date(assessment.deadline).getTime() : null;
  const beforeStart = startTime !== null && Number.isFinite(startTime) && Date.now() < startTime;
  const pastDeadline = deadlineTime !== null && Number.isFinite(deadlineTime) && Date.now() > deadlineTime;
  const noAttempts = (assessment?.remainingAttempts ?? 0) <= 0;
  const unavailable = !assessment || !questionsSupported || Boolean(assessment.unsupportedType)
    || noAttempts || beforeStart || pastDeadline;
  const durationSeconds = Math.max(0, (assessment?.durationMinutes || 0) * 60);
  const begun = startedAt !== null && !unavailable;

  useEffect(() => {
    if (!startedAt || !assessment || submitted) return undefined;
    const updateRemaining = () => {
      const durationEnd = startedAt + durationSeconds * 1000;
      const endTime = deadlineTime && Number.isFinite(deadlineTime)
        ? Math.min(durationEnd, deadlineTime)
        : durationEnd;
      setRemainingSeconds(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));
    };
    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(intervalId);
  }, [startedAt, assessment, deadlineTime, durationSeconds, submitted]);

  const submitAttempt = useCallback(async (confirmSubmission = true) => {
    if (submitLock.current || submitted) return;
    if (confirmSubmission && !window.confirm("Submit this assessment now? You may not be able to change your answers.")) {
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    setError("");
    try {
      const duration = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
      const currentSubmissionKey = submissionKey || window.crypto.randomUUID();
      window.sessionStorage.setItem(`skillquest-assessment-key-${assessmentId}`, currentSubmissionKey);
      const result = await submitCandidateAssessment(assessmentId, {
        answers,
        durationSeconds: duration,
        startedAtEpochMillis: startedAt,
        submissionKey: currentSubmissionKey,
      });
      window.sessionStorage.removeItem(`skillquest-assessment-start-${assessmentId}`);
      window.sessionStorage.removeItem(`skillquest-assessment-key-${assessmentId}`);
      setSubmissionKey("");
      setSubmitted(result);
    } catch (requestError) {
      setError(requestError.message || "Your assessment could not be submitted. Please try again.");
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [assessmentId, answers, startedAt, submissionKey, submitted]);

  useEffect(() => {
    const durationEnd = startedAt === null ? null : startedAt + durationSeconds * 1000;
    const endTime = deadlineTime && Number.isFinite(deadlineTime)
      ? Math.min(durationEnd, deadlineTime)
      : durationEnd;
    const durationElapsed = endTime !== null && Date.now() >= endTime;
    if (assessment && begun && remainingSeconds === 0 && durationElapsed
        && !submitted && !submitting && !autoSubmitTriggered.current) {
      autoSubmitTriggered.current = true;
      submitAttempt(false);
    }
  }, [assessment, begun, deadlineTime, durationSeconds, remainingSeconds, startedAt, submitted, submitting, submitAttempt]);

  function beginAssessment() {
    if (unavailable) return;
    const timestamp = Date.now();
    const key = window.crypto.randomUUID();
    window.sessionStorage.setItem(`skillquest-assessment-start-${assessmentId}`, String(timestamp));
    window.sessionStorage.setItem(`skillquest-assessment-key-${assessmentId}`, key);
    setStartedAt(timestamp);
    setSubmissionKey(key);
    setRemainingSeconds(durationSeconds);
  }

  function handleLogout(event) {
    event.preventDefault();
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="dashboard-page assessment-dashboard-page">
      <aside className="sidebar">
        <div className="side-logo">🛡️ Skill<span>Quest</span></div>
        <nav className="side-menu" aria-label="Candidate navigation">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>
        <a href="#logout" onClick={handleLogout} className="logout-btn">🚪 Logout</a>
      </aside>

      <main className="dashboard-main assessment-main">
        <header className="dashboard-header assessment-header">
          <div>
            <p className="header-small">RECRUITER ASSESSMENT</p>
            <h1>{loading ? "Loading assessment..." : assessment?.title || "Assessment"}</h1>
            <p>{assessment?.technology || "Complete your assigned assessment."}</p>
          </div>
          <div className="header-profile">
            <Link to="/candidate-dashboard" className="assessment-dashboard-link">Back to dashboard</Link>
          </div>
        </header>

        <div className="assessment-content">
          {loading && <section className="dashboard-panel assessment-result"><p className="assessment-loading">Loading assessment...</p></section>}
        {error && <div className="assessment-alert" role="alert">{error}</div>}

        {!loading && submitted ? (
          <section className="dashboard-panel assessment-result" aria-live="polite">
            <p className="assessment-eyebrow">SUBMISSION RECEIVED</p>
            <h1>Assessment submitted</h1>
            <p>Your responses have been saved and sent to the recruiter.</p>
            <div className="assessment-score">
              <span>Score</span>
              <strong>{submitted.score ?? 0}%</strong>
              <b className={submitted.score >= assessment.passingScore ? "assessment-passed" : "assessment-not-passed"}>
                {submitted.score >= assessment.passingScore ? "Passing score achieved" : "Passing score not achieved"}
              </b>
              <small>{submitted.passedTests ?? 0} of {submitted.totalTests ?? questions.length} questions passed</small>
            </div>
            <button type="button" onClick={() => navigate("/candidate-dashboard", { replace: true })}>
              Return to dashboard
            </button>
          </section>
        ) : !loading && assessment ? (
          <>
            <section className="dashboard-panel assessment-overview">
              <p className="assessment-eyebrow">ASSESSMENT DETAILS</p>
              <h1>{assessment.title}</h1>
              <p className="assessment-description">{assessment.description || "Complete the questions below before the deadline."}</p>
              <div className="assessment-facts">
                <div><span>Technology</span><strong>{assessment.technology || "General"}</strong></div>
                <div><span>Duration</span><strong>{assessment.durationMinutes} min</strong></div>
                <div><span>Passing score</span><strong>{assessment.passingScore}%</strong></div>
                <div><span>Attempts left</span><strong>{assessment.remainingAttempts}</strong></div>
                <div className="assessment-deadline"><span>Deadline</span><strong>{formatDeadline(assessment.deadline)}</strong></div>
              </div>
              {assessment.instructions && (
                <div className="assessment-instructions">
                  <h2>Instructions</h2>
                  <p>{assessment.instructions}</p>
                </div>
              )}
              {assessment.unsupportedType && <div className="assessment-alert" role="status">{assessment.unsupportedType}</div>}
              {!assessment.unsupportedType && !questionsSupported && (
                <div className="assessment-alert" role="status">This assessment contains no supported multiple-choice questions.</div>
              )}
              {noAttempts && <div className="assessment-alert" role="status">You have used all allowed attempts for this assessment.</div>}
              {beforeStart && <div className="assessment-alert" role="status">This assessment opens on {formatDeadline(assessment.startDate)}.</div>}
              {pastDeadline && <div className="assessment-alert" role="status">The submission deadline has passed.</div>}
              <div className="assessment-start-row">
                <span>{questions.length} questions · {assessment.allowedAttempts} allowed attempt(s)</span>
                {!begun ? (
                  <button type="button" onClick={beginAssessment} disabled={unavailable}>Begin Assessment</button>
                ) : (
                  <div className={`assessment-timer ${remainingSeconds <= 60 ? "is-low" : ""}`} aria-live="off">
                    <span>Time remaining</span><strong>{formatTime(remainingSeconds)}</strong>
                  </div>
                )}
              </div>
            </section>

            {begun && (
              <section className="assessment-question-list" aria-label="Assessment questions">
                {questions.map((question, index) => (
                  <fieldset className="dashboard-panel assessment-question" key={question.id} disabled={submitting || remainingSeconds === 0}>
                    <legend>
                      <span>QUESTION {index + 1} · {question.marks || 1} mark{question.marks === 1 ? "" : "s"}</span>
                      {question.statement && <p>{question.statement}</p>}
                      {question.prompt}
                    </legend>
                    {question.type === "SHORT_ANSWER" ? (
                      <label className="assessment-short-answer">
                        Your answer
                        <textarea
                          value={answers[question.id] || ""}
                          maxLength="2000"
                          rows="3"
                          onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                        />
                      </label>
                    ) : (question.choices || []).map((choice) => {
                      const value = choiceValue(choice);
                      const multiple = question.type === "MULTIPLE_SELECT";
                      const selectedAnswers = Array.isArray(answers[question.id]) ? answers[question.id] : [];
                      return (
                        <label className="assessment-choice" key={value}>
                          <input
                            type={multiple ? "checkbox" : "radio"}
                            name={`question-${question.id}`}
                            value={value}
                            checked={multiple ? selectedAnswers.includes(value) : answers[question.id] === value}
                            onChange={(event) => {
                              if (multiple) {
                                const nextAnswers = event.target.checked
                                  ? [...selectedAnswers, value]
                                  : selectedAnswers.filter((answer) => answer !== value);
                                setAnswers((current) => ({ ...current, [question.id]: nextAnswers }));
                              } else {
                                setAnswers((current) => ({ ...current, [question.id]: value }));
                              }
                            }}
                          />
                          <span>{choiceLabel(choice)}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                ))}
                <div className="assessment-submit-row">
                  <p>{answeredCount} of {questions.length} answered</p>
                  <button type="button" onClick={() => submitAttempt(true)} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Assessment"}
                  </button>
                </div>
              </section>
            )}
          </>
        ) : (
          !loading && <section className="dashboard-panel assessment-result">
            <h1>Assessment unavailable</h1>
            <p>{error || "This assessment could not be found or is no longer available."}</p>
            <Link to="/candidate-dashboard">Return to dashboard</Link>
          </section>
        )}
        </div>
      </main>
    </div>
  );
}

export default RecruiterAssessment;