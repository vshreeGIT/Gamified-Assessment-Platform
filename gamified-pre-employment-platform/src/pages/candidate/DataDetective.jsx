import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../../services/authService";
import {
  getDataDetectiveAttempt,
  getDataDetectiveProgress,
  getDataInvestigation,
  getDataInvestigationSession,
  listDataInvestigations,
  startDataInvestigation,
  submitDataInvestigation,
} from "../../services/dataDetectiveService";
import "../../styles/CandidateDashboard.css";
import "../../styles/DataDetective.css";

const sessionStorageKey = (id) => `skillquest_data_detective_${id}`;
const responseStorageKey = (id, key) => `${sessionStorageKey(id)}_${key}_answers`;

function DataDetective() {
  const navigate = useNavigate();
  const { investigationId } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const [investigations, setInvestigations] = useState([]);
  const [progress, setProgress] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitLock = useRef(false);
  const timeoutSubmitted = useRef(false);

  const refreshProgress = useCallback(async () => {
    const data = await getDataDetectiveProgress();
    setProgress(data);
    return data;
  }, []);

  const submit = useCallback(async (timedOut = false) => {
    if (!quiz || submitLock.current || result) return;
    submitLock.current = true;
    setSubmitting(true);
    setError("");
    try {
      const saved = await submitDataInvestigation(quiz.id, { submissionKey: quiz.submissionKey, answers });
      setResult(saved);
      sessionStorage.removeItem(sessionStorageKey(quiz.id));
      sessionStorage.removeItem(responseStorageKey(quiz.id, quiz.submissionKey));
      navigate(`/data-detective/${quiz.id}?attemptId=${encodeURIComponent(saved.attemptId)}`, { replace: true });
      await refreshProgress();
    } catch (err) {
      setError(timedOut ? "Time is up. The server did not accept a late submission." : (err.message || "Unable to submit this investigation."));
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [answers, navigate, quiz, refreshProgress, result]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      setInvestigation(null);
      setQuiz(null);
      setResult(null);
      if (!isAuthenticated()) { navigate("/login"); return; }
      try {
        const [list, savedProgress] = await Promise.all([listDataInvestigations(), refreshProgress()]);
        if (cancelled) return;
        setInvestigations(list);
        setProgress(savedProgress);
        if (investigationId) {
          const details = await getDataInvestigation(investigationId);
          if (cancelled) return;
          setInvestigation(details);
          if (attemptId) {
            setResult(await getDataDetectiveAttempt(attemptId));
          } else {
            const key = sessionStorage.getItem(sessionStorageKey(investigationId));
            if (key) {
              const active = await getDataInvestigationSession(investigationId, key);
              const savedAnswers = sessionStorage.getItem(responseStorageKey(investigationId, key));
              const restored = savedAnswers ? JSON.parse(savedAnswers) : {};
              setAnswers(restored);
              setQuiz(active);
              setTimeLeft(Math.max(0, Math.ceil((new Date(active.deadlineAt).getTime() - Date.now()) / 1000)));
            }
          }
        }
      } catch (err) {
        if (err.message?.toLowerCase().includes("unauthorized")) { logoutUser(); navigate("/login"); }
        else if (!cancelled) setError(err.message || "Unable to load Data Detective.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [attemptId, investigationId, navigate, refreshProgress]);

  useEffect(() => {
    if (!quiz || result || submitting) return undefined;
    if (timeLeft <= 0) {
      if (!timeoutSubmitted.current) {
        timeoutSubmitted.current = true;
        submit(true);
      }
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setTimeLeft(Math.max(0, Math.ceil((new Date(quiz.deadlineAt).getTime() - Date.now()) / 1000)));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [quiz, result, submitting, submit, timeLeft]);

  const start = async () => {
    setLoading(true);
    setError("");
    submitLock.current = false;
    timeoutSubmitted.current = false;
    try {
      const active = await startDataInvestigation(investigationId);
      sessionStorage.setItem(sessionStorageKey(investigationId), active.submissionKey);
      setAnswers({});
      setQuiz(active);
      setResult(null);
      setTimeLeft(Math.max(0, Math.ceil((new Date(active.deadlineAt).getTime() - Date.now()) / 1000)));
      navigate(`/data-detective/${investigationId}`, { replace: true });
    } catch (err) { setError(err.message || "Unable to start the investigation."); }
    finally { setLoading(false); }
  };

  const updateAnswer = (taskId, value) => {
    setAnswers((current) => {
      const updated = { ...current, [taskId]: value };
      if (quiz) sessionStorage.setItem(responseStorageKey(quiz.id, quiz.submissionKey), JSON.stringify(updated));
      return updated;
    });
  };

  const formatTime = () => `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
  const currentProgress = progress?.investigationProgress?.[investigationId] ?? 0;

  if (loading) return <div className="dashboard-page data-detective-page"><main className="dashboard-main"><p>Loading Data Detective…</p></main></div>;

  return (
    <div className="dashboard-page data-detective-page">
      <aside className="sidebar">
        <div className="side-logo">🛡️ Skill<span>Quest</span></div>
        <nav className="side-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="data-detective-topline"><Link className="data-detective-back" to="/challenges">← Back to Challenges</Link></div>
        {error && <div className="data-detective-error" role="alert">{error}</div>}

        {!investigationId && (
          <>
            <header className="dashboard-header data-detective-hero">
              <div><p className="header-small">ANALYTICS QUEST</p><h1>Data Detective</h1><p>Explore real business data, spot patterns, and make evidence-based decisions.</p></div>
              <div className="data-detective-xp">⚡ Up to 360 XP</div>
            </header>
            <section className="stats-grid data-detective-stats">
              <div className="stat-card"><span className="stat-icon">📈</span><div><p>Overall Progress</p><h2>{progress?.progress ?? 0}%</h2></div></div>
              <div className="stat-card"><span className="stat-icon">✅</span><div><p>Investigations Completed</p><h2>{progress?.completedInvestigations ?? 0} / 3</h2></div></div>
              <div className="stat-card"><span className="stat-icon">⚡</span><div><p>Data Detective XP</p><h2>{progress?.totalXpEarned ?? 0} XP</h2></div></div>
              <div className="stat-card"><span className="stat-icon">🗂️</span><div><p>Saved Attempts</p><h2>{progress?.attemptCount ?? 0}</h2></div></div>
            </section>
            <section className="data-investigation-grid">
              {investigations.map((item) => {
                const itemProgress = progress?.investigationProgress?.[item.id] ?? 0;
                return <article className="dashboard-panel data-investigation-card" key={item.id}>
                  <span className="data-investigation-icon">{item.id === "sales-revenue" ? "💹" : item.id === "customer-behaviour" ? "👥" : "📦"}</span>
                  <h2>{item.title}</h2><p>{item.description}</p>
                  <div className="data-investigation-meta"><span>⏱ 10 minutes</span><span>5 analysis tasks</span></div>
                  <div className="data-investigation-progress"><div className="xp-progress"><div className="xp-filled" style={{ width: `${itemProgress}%` }} /></div><b>{itemProgress}%</b></div>
                  <button className="data-detective-primary" onClick={() => navigate(`/data-detective/${item.id}`)}>{itemProgress ? "Review or Continue" : "Start Investigation"} →</button>
                </article>;
              })}
            </section>
          </>
        )}

        {investigation && !quiz && !result && (
          <section className="dashboard-panel data-investigation-detail">
            <header className="data-investigation-header"><div><p className="header-small">10-MINUTE INVESTIGATION</p><h1>{investigation.title}</h1><p>{investigation.description}</p></div><span className="level-badge">⚡ Up to 120 XP</span></header>
            <DatasetExplorer investigation={investigation} />
            <div className="data-task-preview"><h2>What you will investigate</h2>{investigation.tasks.map((task, index) => <div key={task.id}><b>{String(index + 1).padStart(2, "0")}</b><span>{task.title} — {task.prompt}</span></div>)}</div>
            <footer className="data-investigation-start"><span>70% to pass · XP is based on your scored answers.</span><button className="data-detective-primary" onClick={start}>Start 10-Minute Assessment</button></footer>
          </section>
        )}

        {quiz && !result && (
          <section className="dashboard-panel data-investigation-detail">
            <header className="data-investigation-header"><div><p className="header-small">LIVE INVESTIGATION</p><h1>{quiz.title}</h1><p>Use the dataset to answer each analysis task. Your deadline is enforced by the server.</p></div><div className="timer data-detective-timer" aria-live="polite">⏱ {formatTime()}</div></header>
            <DatasetExplorer investigation={quiz} />
            <div className="data-task-list">{quiz.tasks.map((task, index) => <article className="data-task-card" key={task.id}>
              <div className="data-task-title"><span>Analysis {index + 1}</span><b>{task.title}</b></div><p>{task.prompt}</p>
              {task.inputType === "SELECT" ? <select value={answers[task.id] || ""} onChange={(event) => updateAnswer(task.id, event.target.value)}><option value="">Choose your analysis</option>{task.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                : <input type={task.inputType === "NUMBER" ? "number" : "text"} value={answers[task.id] || ""} onChange={(event) => updateAnswer(task.id, event.target.value)} placeholder={task.inputType === "NUMBER" ? "Enter a number" : "Enter your finding"} />}
            </article>)}</div>
            <footer className="data-investigation-start"><span>{Object.values(answers).filter(Boolean).length} of {quiz.tasks.length} responses entered</span><button className="data-detective-primary" disabled={submitting} onClick={() => submit(false)}>{submitting ? "Submitting…" : "Submit Investigation"}</button></footer>
          </section>
        )}

        {result && (
          <section className="dashboard-panel data-detective-result">
            <p className="header-small">INVESTIGATION SAVED</p><h1>{result.investigationName}</h1>
            <div className={`communication-pass-state ${result.passed ? "passed" : "needs-practice"}`}>{result.passed ? "PASSED" : "KEEP INVESTIGATING"} · {result.accuracy}%</div>
            <div className="communication-result-metrics"><div><strong>{result.score}/{result.maxScore}</strong><span>Analysis tasks</span></div><div><strong>+{result.earnedXp} XP</strong><span>XP earned</span></div><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div></div>
            <div className="data-result-feedback"><h2>Evidence review</h2>{result.feedback?.map((item, index) => <p key={`${index}-${item}`}>{item}</p>)}</div>
            <div className="communication-result-actions"><button className="data-detective-primary" onClick={start}>Try Again</button><button className="communication-hub-secondary" onClick={() => navigate("/data-detective")}>Return to Investigations</button></div>
          </section>
        )}
      </main>
    </div>
  );
}

function DatasetExplorer({ investigation }) {
  const metricNames = investigation.columns.slice(1);
  return <section className="dataset-explorer" aria-label="Investigation dataset">
    <div className="dataset-explorer-title"><div><p className="header-small">BUSINESS DATASET</p><h2>Explore the numbers</h2></div><span>{investigation.rows.length} records</span></div>
    <div className="dataset-chart" role="img" aria-label={`Bar chart showing ${metricNames[0]} by ${investigation.columns[0]}`}>
      {investigation.rows.map((row) => {
        const value = Number(row.metricA) || 0;
        const max = Math.max(...investigation.rows.map((entry) => Number(entry.metricA) || 0), 1);
        return <div className="dataset-bar-column" key={row.label}><b>{value.toLocaleString()}</b><div className="dataset-bar-track"><div className="dataset-bar" style={{ height: `${Math.max(4, value / max * 100)}%` }} /></div><span>{row.label}</span></div>;
      })}
    </div>
    <p className="dataset-chart-caption">{metricNames[0]} by {investigation.columns[0]} · chart uses the first numeric column; inspect the table for the full dataset.</p>
    <div className="dataset-table-wrap"><table className="dataset-table"><thead><tr>{investigation.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{investigation.rows.map((row) => <tr key={row.label}><td>{row.label}</td>{metricNames.map((_, index) => <td key={index}>{Number(row[`metric${String.fromCharCode(65 + index)}`]).toLocaleString()}</td>)}</tr>)}</tbody></table></div>
  </section>;
}

export default DataDetective;
