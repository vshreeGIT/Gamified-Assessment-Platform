import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getChallengeProgress, getTeamworkAttempt, getTeamworkSession, startTeamworkAssessment, submitTeamworkAssessment } from "../../services/challengeProgressService";
import { isAuthenticated, logoutUser } from "../../services/authService";
import "../../styles/CandidateDashboard.css";
import "../../styles/TeamworkMission.css";

const keyName = "skillquest_teamwork_submission_key";
const answersKey = (key) => `${keyName}_${key}_answers`;

function TeamworkMission() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const attemptId = params.get("attemptId");
  const [progress, setProgress] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (!isAuthenticated()) { navigate("/login"); return; }
      try {
        const currentProgress = await getChallengeProgress();
        if (cancelled) return;
        setProgress(currentProgress);
        if (attemptId) {
          setResult(await getTeamworkAttempt(attemptId));
        } else {
          const key = sessionStorage.getItem(keyName);
          if (key && currentProgress.quests?.teamwork?.status === "IN_PROGRESS") {
            const active = await getTeamworkSession(key);
            const saved = sessionStorage.getItem(answersKey(key));
            setAnswers(saved ? JSON.parse(saved) : {});
            setQuiz(active);
          }
        }
      } catch (err) {
        if (err.message?.toLowerCase().includes("unauthorized")) { logoutUser(); navigate("/login"); }
        else if (!cancelled) setError(err.message || "Unable to load Teamwork Mission.");
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [attemptId, navigate]);

  const start = async () => {
    setError("");
    setLoading(true);
    try {
      const active = await startTeamworkAssessment();
      sessionStorage.setItem(keyName, active.submissionKey);
      setAnswers({});
      setQuiz(active);
      setResult(null);
    } catch (err) { setError(err.message || "Unable to start Teamwork Mission."); }
    finally { setLoading(false); }
  };

  const selectAnswer = (questionId, choiceId) => {
    setAnswers((current) => {
      const next = { ...current, [questionId]: choiceId };
      if (quiz) sessionStorage.setItem(answersKey(quiz.submissionKey), JSON.stringify(next));
      return next;
    });
  };

  const submit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const saved = await submitTeamworkAssessment({ submissionKey: quiz.submissionKey, answers });
      setResult(saved);
      sessionStorage.removeItem(keyName);
      sessionStorage.removeItem(answersKey(quiz.submissionKey));
      navigate(`/teamwork?attemptId=${encodeURIComponent(saved.attemptId)}`, { replace: true });
      setProgress(await getChallengeProgress());
    } catch (err) { setError(err.message || "Unable to submit this attempt."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="dashboard-page teamwork-page"><main className="dashboard-main"><p>Loading Teamwork Mission…</p></main></div>;
  const state = progress?.quests?.teamwork;

  return <div className="dashboard-page teamwork-page">
    <aside className="sidebar">
      <div className="side-logo">🛡️ Skill<span>Quest</span></div>
      <nav className="side-menu"><Link to="/candidate-dashboard">🏠 Dashboard</Link><Link to="/challenges">🎯 Challenges</Link><Link to="/badges">🛡️ My Badges</Link><Link to="/leaderboard">🏆 Leaderboard</Link><Link to="/job-matches">💼 Job Matches</Link><Link to="/candidate-profile">👤 Profile</Link></nav>
    </aside>
    <main className="dashboard-main">
      <div className="teamwork-back"><Link to="/challenges">← Back to Challenges</Link></div>
      {error && <div className="teamwork-error" role="alert">{error}</div>}
      {!quiz && !result && <section className="dashboard-panel teamwork-panel">
        <p className="header-small">SOFT SKILLS QUEST</p><h1>Teamwork Mission</h1>
        <p className="teamwork-intro">Work through five realistic team situations. Choose the response that supports clear ownership, constructive discussion, and coordinated delivery.</p>
        <div className="teamwork-status">{state?.passed ? "Passed previously" : state?.status === "ATTEMPTED" ? "Previous attempt saved · pass threshold 70%" : "Pass threshold: 70%"}</div><button className="teamwork-primary" onClick={start}>{state?.status === "PASSED" ? "Try Again" : state?.status === "ATTEMPTED" ? "Retry Mission" : "Start Teamwork Mission"}</button>
      </section>}

      {quiz && !result && <section className="dashboard-panel teamwork-panel">
        <p className="header-small">TEAMWORK MISSION · FIVE SCENARIOS</p><h1>Choose a collaborative response</h1>
        <p className="teamwork-intro">Your selections are saved in this browser until submission. The backend scores and records the attempt. XP rules are unchanged.</p>
        <div className="teamwork-question-list">{quiz.questions.map((question, index) => <article className="teamwork-question" key={question.id}>
          <span className="teamwork-question-number">SCENARIO {index + 1}</span><h2>{question.title}</h2><p className="teamwork-scenario">{question.scenario}</p><p className="teamwork-prompt">{question.prompt}</p>
          <div className="teamwork-choices">{question.choices.map((choice) => <button key={choice.id} className={answers[question.id] === choice.id ? "selected" : ""} onClick={() => selectAnswer(question.id, choice.id)}>{choice.text}</button>)}</div>
        </article>)}</div>
        <footer className="teamwork-submit"><span>{Object.keys(answers).length} of {quiz.questions.length} answered</span><button className="teamwork-primary" disabled={submitting} onClick={submit}>{submitting ? "Saving…" : "Submit Mission"}</button></footer>
      </section>}

      {result && <section className="dashboard-panel teamwork-panel teamwork-result">
        <p className="header-small">TEAMWORK ATTEMPT SAVED</p><h1>{result.passed ? "Teamwork Mission Passed" : "Keep Practicing"}</h1>
        <div className={`teamwork-result-state ${result.passed ? "passed" : "needs-practice"}`}>{result.passed ? "PASSED" : "ATTEMPTED"} · {result.accuracy}%</div>
        <div className="communication-result-metrics"><div><strong>{result.score}/{result.totalQuestions}</strong><span>Scenarios</span></div><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div></div>
        <p className="teamwork-intro">Complete the Teamwork Mission assessment. A saved attempt contributes to Interview Battle eligibility.</p>
        <div className="teamwork-actions"><button className="teamwork-primary" onClick={start}>Try Again</button><button className="teamwork-secondary" onClick={() => navigate("/challenges")}>Return to Challenges</button></div>
      </section>}
    </main>
  </div>;
}

export default TeamworkMission;
