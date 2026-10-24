import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getCommunicationHubProgress,
  getCommunicationSubdivisionActivities,
  getCommunicationSubdivisionAttempt,
  getCommunicationSubdivisionSession,
  getCommunicationAssessment,
  startCommunicationSubdivision,
  submitCommunicationAssessment,
  submitCommunicationRoleplayTurn,
  submitCommunicationSubdivision,
} from "../../../services/communicationService";
import { isAuthenticated, logoutUser } from "../../../services/authService";
import "../../../styles/CandidateDashboard.css";
import "../../../styles/CommunicationHome.css";

const domains = [
  { id: "office-team", icon: "🤝", description: "Share clear updates and work through team handoffs." },
  { id: "customer-relations", icon: "💬", description: "Respond to customer concerns with clarity and care." },
  { id: "interview-career", icon: "💼", description: "Present your experience with professional confidence." },
  { id: "presentations", icon: "🎤", description: "Make ideas understandable and project pitches concise." },
  { id: "conflict-etiquette", icon: "🧭", description: "Give useful feedback and handle workplace tension respectfully." },
];

const filters = [
  { id: "ALL", label: "All activities" },
  { id: "SPEAKING", label: "Speaking" },
  { id: "WRITING", label: "Writing" },
  { id: "ROLEPLAY", label: "Roleplay" },
];

const storageKey = (subdivisionId) => `skillquest_communication_hub_${subdivisionId}`;

function CommunicationHome() {
  const navigate = useNavigate();
  const { subdivisionId } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const [progress, setProgress] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [legacyQuiz, setLegacyQuiz] = useState(null);
  const [legacyAnswers, setLegacyAnswers] = useState({});
  const [hasLegacySession, setHasLegacySession] = useState(false);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [turnSubmitting, setTurnSubmitting] = useState("");
  const [error, setError] = useState("");
  const [recordingActivity, setRecordingActivity] = useState("");
  const [speechSeconds, setSpeechSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const submittingRef = useRef(false);

  const loadProgress = useCallback(async () => {
    const data = await getCommunicationHubProgress();
    setProgress(data);
    return data;
  }, []);

  const loadSession = useCallback(async (forceNew = false) => {
    if (!subdivisionId) return;
    setLoading(true);
    setError("");
    try {
      const keyName = storageKey(subdivisionId);
      if (forceNew) sessionStorage.removeItem(keyName);
      const key = sessionStorage.getItem(keyName);
      const data = key
        ? await getCommunicationSubdivisionSession(subdivisionId, key)
        : await startCommunicationSubdivision(subdivisionId);
      sessionStorage.setItem(keyName, data.submissionKey);
      const saved = sessionStorage.getItem(`${keyName}_${data.submissionKey}_responses`);
      const parsedResponses = saved ? JSON.parse(saved) : {};
      setResponses(parsedResponses);
      setQuiz(data);
      setTimeLeft(Math.max(0, Math.ceil((new Date(data.deadlineAt).getTime() - Date.now()) / 1000)));
      setResult(null);
    } catch (err) {
      setError(err.message || "Unable to load this assessment.");
    } finally {
      setLoading(false);
    }
  }, [subdivisionId]);

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      setLoading(true);
      setError("");
      setQuiz(null);
      setResult(null);
      setResponses({});
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }
      try {
        await loadProgress();
        if (cancelled) return;
        if (!subdivisionId) {
          setHasLegacySession(Boolean(sessionStorage.getItem("skillquest_communication_submission_key")));
        }
        if (subdivisionId) {
          const activities = await getCommunicationSubdivisionActivities(subdivisionId);
          if (cancelled) return;
          setCatalog(activities);
          if (attemptId) {
            setResult(await getCommunicationSubdivisionAttempt(subdivisionId, attemptId));
            setLoading(false);
            return;
          }
          if (sessionStorage.getItem(storageKey(subdivisionId))) await loadSession();
        }
      } catch (err) {
        if (err.message?.toLowerCase().includes("unauthorized")) {
          logoutUser();
          navigate("/login");
        } else if (!cancelled) {
          setError(err.message || "Unable to load Communication Hub.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    initialize();
    return () => { cancelled = true; };
  }, [attemptId, loadProgress, loadSession, navigate, subdivisionId]);

  useEffect(() => {
    const activeAssessment = quiz || legacyQuiz;
    if (!activeAssessment || result || submitting) return undefined;
    if (timeLeft <= 0) {
      if (legacyQuiz) submitLegacyAssessment(true);
      else submitAssessment(true);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setTimeLeft(Math.max(0, Math.ceil((new Date(activeAssessment.deadlineAt).getTime() - Date.now()) / 1000)));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [quiz, legacyQuiz, timeLeft, result, submitting]);

  useEffect(() => {
    if (!recordingActivity) return undefined;
    const timer = window.setInterval(() => setSpeechSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recordingActivity]);

  useEffect(() => () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const submitAssessment = async (timedOut = false) => {
    if (!quiz || submittingRef.current || result) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const savedResult = await submitCommunicationSubdivision(quiz.subdivisionId, {
        submissionKey: quiz.submissionKey,
        responses,
      });
      setResult(savedResult);
      sessionStorage.removeItem(storageKey(quiz.subdivisionId));
      sessionStorage.removeItem(`${storageKey(quiz.subdivisionId)}_${quiz.submissionKey}_responses`);
      navigate(`/communication/${quiz.subdivisionId}?attemptId=${encodeURIComponent(savedResult.attemptId)}`, { replace: true });
      await loadProgress();
    } catch (err) {
      setError(timedOut ? "Time is up. The server did not accept a late submission." : (err.message || "Unable to submit this assessment."));
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateResponse = (activityId, value) => {
    setResponses((current) => {
      const updated = { ...current, [activityId]: value };
      if (quiz) sessionStorage.setItem(`${storageKey(quiz.subdivisionId)}_${quiz.submissionKey}_responses`, JSON.stringify(updated));
      return updated;
    });
  };

  const resumeLegacyAssessment = async () => {
    const key = sessionStorage.getItem("skillquest_communication_submission_key");
    if (!key) return;
    setLoading(true);
    try {
      const data = await getCommunicationAssessment(key);
      const saved = sessionStorage.getItem("skillquest_communication_answers");
      setLegacyAnswers(saved ? JSON.parse(saved) : {});
      setLegacyQuiz(data);
      setTimeLeft(Math.max(0, Math.ceil((new Date(data.deadlineAt).getTime() - Date.now()) / 1000)));
      setHasLegacySession(false);
    } catch (err) {
      setError(err.message || "Unable to resume the earlier assessment.");
    } finally {
      setLoading(false);
    }
  };

  const submitLegacyAssessment = async (timedOut = false) => {
    if (!legacyQuiz || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const savedResult = await submitCommunicationAssessment({
        submissionKey: legacyQuiz.submissionKey,
        answers: legacyAnswers,
        timeTakenSeconds: 0,
      });
      setResult({ ...savedResult, subdivisionName: "Communication Quest" });
      setLegacyQuiz(null);
      sessionStorage.removeItem("skillquest_communication_submission_key");
      sessionStorage.removeItem("skillquest_communication_answers");
      setHasLegacySession(false);
      await loadProgress();
    } catch (err) {
      setError(timedOut ? "Time is up. The server did not accept a late submission." : (err.message || "Unable to submit the earlier assessment."));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const updateLegacyAnswer = (questionId, optionId) => {
    setLegacyAnswers((current) => {
      const updated = { ...current, [questionId]: optionId };
      sessionStorage.setItem("skillquest_communication_answers", JSON.stringify(updated));
      return updated;
    });
  };

  const beginSpeech = (activity) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not available in this browser. Type your response in the transcript box.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((item) => item[0].transcript).join(" ").trim();
        updateResponse(activity.id, transcript);
      };
      recognition.onerror = (event) => {
        setError(event.error === "not-allowed"
          ? "Microphone permission was denied. Type your response in the transcript box."
          : "Speech recognition stopped. You can continue by editing or typing in the transcript box.");
        setRecordingActivity("");
      };
      recognition.onend = () => setRecordingActivity("");
      recognitionRef.current = recognition;
      setError("");
      setSpeechSeconds(0);
      setRecordingActivity(activity.id);
      recognition.start();
    } catch {
      setError("Microphone capture could not start. Type your response in the transcript box.");
      setRecordingActivity("");
    }
  };

  const stopSpeech = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setRecordingActivity("");
  };

  const replyRoleplay = async (activity, choice) => {
    if (!quiz || turnSubmitting) return;
    setTurnSubmitting(activity.id);
    setError("");
    try {
      const nextTurn = await submitCommunicationRoleplayTurn(quiz.subdivisionId, {
        submissionKey: quiz.submissionKey,
        activityId: activity.id,
        choiceId: choice.id,
      });
      setQuiz((current) => ({
        ...current,
        activities: current.activities.map((item) => item.id !== activity.id ? item : ({
          ...item,
          currentTurn: nextTurn,
          roleplayComplete: nextTurn.complete,
          conversationHistory: [
            ...(item.conversationHistory || []),
            { speaker: "You", message: choice.text },
            ...(nextTurn.message ? [{ speaker: "Other person", message: nextTurn.message }] : []),
          ],
        })),
      }));
    } catch (err) {
      setError(err.message || "Unable to continue this conversation.");
    } finally {
      setTurnSubmitting("");
    }
  };

  const refreshAfterAttempt = async () => {
    await loadProgress();
    setQuiz(null);
    setResult(null);
    setResponses({});
  };

  const progressFor = (id) => progress?.subdivisions?.find((item) => item.subdivisionId === id);
  const formatTime = () => `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
  const currentDomain = domains.find((domain) => domain.id === subdivisionId);

  if (loading) return <div className="dashboard-page communication-hub-page"><main className="dashboard-main"><p>Loading Communication Hub…</p></main></div>;

  return (
    <div className="dashboard-page communication-hub-page">
      <main className="dashboard-main">
        <div className="communication-page-nav">
          <button className="communication-back-button" onClick={() => navigate("/challenges")}>← Back to Challenges</button>
        </div>
        {error && <div className="communication-hub-error" role="alert">{error}</div>}

        {!subdivisionId && !legacyQuiz && !result && (
          <>
            <header className="dashboard-header communication-hero">
              <div>
                <p className="header-small">COMMUNICATION QUEST</p>
                <h1>Communication Hub</h1>
                <p>Build practical workplace communication skills, one focused assessment at a time.</p>
              </div>
            </header>

            {hasLegacySession && <div className="communication-legacy-resume"><span>An earlier Communication Quest is still active.</span><button className="communication-hub-primary" onClick={resumeLegacyAssessment}>Resume earlier assessment</button></div>}

            <section className="stats-grid communication-stats">
              <div className="stat-card"><span className="stat-icon">📈</span><div><p>Hub Progress</p><h2>{progress?.progress ?? 0}%</h2></div></div>
              <div className="stat-card"><span className="stat-icon">✅</span><div><p>Subdivisions Completed</p><h2>{progress?.completedSubdivisions ?? 0} / 5</h2></div></div>
              <div className="stat-card"><span className="stat-icon">⚡</span><div><p>Communication XP</p><h2>{progress?.totalXpEarned ?? 0} XP</h2></div></div>
              <div className="stat-card"><span className="stat-icon">📝</span><div><p>Saved Attempts</p><h2>{progress?.attemptCount ?? 0}</h2></div></div>
            </section>

            <section className="communication-domain-section">
              <div className="communication-filter-row">
                <div><p className="header-small">CHOOSE A SUBDIVISION</p><h2>Workplace communication, in practice</h2></div>
                <div className="communication-filters" aria-label="Filter activities">
                  {filters.map((item) => <button key={item.id} className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}
                </div>
              </div>
              <div className="communication-domain-grid">
                {domains.map((domain) => {
                  const domainProgress = progressFor(domain.id);
                  const hasActiveSession = Boolean(sessionStorage.getItem(storageKey(domain.id)));
                  const activities = domainCatalog(domain.id, catalogForDomain(domain.id));
                  const visible = filter === "ALL" ? activities : activities.filter((activity) => activity.type === filter);
                  const action = hasActiveSession ? "Continue" : domainProgress?.attempted ? "Review" : "Start";
                  const reviewAttemptId = domainProgress?.passed ? domainProgress.bestAttemptId : domainProgress?.latestAttemptId;
                  const reviewQuery = !hasActiveSession && reviewAttemptId
                    ? `?attemptId=${encodeURIComponent(reviewAttemptId)}` : "";
                  return (
                    <article className="dashboard-panel communication-domain-card" key={domain.id}>
                      <div className="communication-domain-heading">
                        <div className="challenge-icon">{domain.icon}</div>
                        <span className="communication-domain-state">{domainProgress?.passed ? "PASSED" : domainProgress?.attempted ? "ATTEMPTED" : "READY"}</span>
                      </div>
                      <h3>{domainProgress?.subdivisionName || domainTitle(domain.id)}</h3>
                      <p className="communication-domain-description">{domain.description}</p>
                      <div className="communication-domain-meta"><span>⏱ 5 minutes</span><span>{activities.length || domainActivityCount(domain.id)} activities</span></div>
                      <div className="communication-domain-progress"><div className="xp-progress"><div className="xp-filled" style={{ width: `${domainProgress?.progress ?? 0}%` }} /></div><span>{domainProgress?.progress ?? 0}%</span></div>
                      <div className="communication-activity-tags">
                        {(filter === "ALL" ? activities : visible).length
                          ? (filter === "ALL" ? activities : visible).map((activity) => <span className={`communication-type-tag type-${activity.type.toLowerCase()}`} key={activity.id}>{typeLabel(activity.type)}</span>)
                          : <span className="communication-no-filter-results">No {filter.toLowerCase()} activities</span>}
                      </div>
                      <div className="communication-domain-footer">
                        <span>{domainProgress?.attemptCount ? `${domainProgress.attemptCount} attempt${domainProgress.attemptCount === 1 ? "" : "s"} · best ${domainProgress.bestAccuracy}%` : "No saved attempt yet"}</span>
                        <button className="communication-domain-action" onClick={() => navigate(`/communication/${domain.id}${reviewQuery}`)}>{action} →</button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <p className="communication-scoring-note">Speaking transcripts and written responses are checked only against the visible content checklist. The system does not assess vocal delivery, pronunciation, tone, or writing quality beyond those listed items.</p>
            </section>
          </>
        )}

        {!subdivisionId && legacyQuiz && (
          <section className="dashboard-panel communication-assessment-panel">
            <header className="communication-assessment-header"><div><p className="header-small">LEGACY COMMUNICATION QUEST</p><h1>Resume assessment</h1><p>This session keeps its original server deadline and saved attempt behavior.</p></div><div className="timer communication-server-timer">⏱ {formatTime()}</div></header>
            <div className="communication-assessment-activities">
              {legacyQuiz.questions.map((question, index) => <article className="communication-live-activity" key={question.id}>
                <div className="communication-live-activity-title"><span>Question {index + 1}</span><span className="communication-type-tag">Workplace scenario</span></div>
                <p className="communication-scenario-copy">{question.scenario}</p><h2>{question.prompt}</h2>
                <div className="communication-roleplay-replies">{question.options.map((option) => <button key={option.id} className={legacyAnswers[question.id] === option.id ? "legacy-option-selected" : ""} onClick={() => updateLegacyAnswer(question.id, option.id)}>{option.text}</button>)}</div>
              </article>)}
            </div>
            <footer className="communication-submit-row"><button className="communication-hub-primary" disabled={submitting || timeLeft <= 0} onClick={() => submitLegacyAssessment(false)}>{submitting ? "Submitting…" : "Submit earlier assessment"}</button></footer>
          </section>
        )}

        {!subdivisionId && result && (
          <section className="dashboard-panel communication-result-panel">
            <p className="header-small">SAVED COMMUNICATION QUEST RESULT</p><h1>{result.passed ? "Assessment passed" : "Assessment complete"}</h1>
            <div className="communication-result-metrics"><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div><div><strong>+{result.earnedXp} XP</strong><span>XP earned</span></div></div>
            <button className="communication-hub-primary" onClick={() => { setResult(null); loadProgress(); }}>Return to Communication Hub</button>
          </section>
        )}

        {subdivisionId && result && (
          <section className="dashboard-panel communication-result-panel">
            <p className="header-small">SUBDIVISION RESULTS</p>
            <h1>{result.subdivisionName}</h1>
            <div className={`communication-pass-state ${result.passed ? "passed" : "needs-practice"}`}>{result.passed ? "PASSED" : "KEEP PRACTICING"} · {result.accuracy}%</div>
            <div className="communication-result-metrics">
              <div><strong>{result.score}/{result.maxScore}</strong><span>Checklist score</span></div>
              <div><strong>+{result.earnedXp} XP</strong><span>XP earned</span></div>
              <div><strong>{result.activitiesCompleted}</strong><span>Activities completed</span></div>
            </div>
            <div className="communication-feedback-grid">
              <div><h3>Strengths</h3>{result.strengths?.length ? <ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No checklist items met on this attempt.</p>}</div>
              <div><h3>Areas to improve</h3>{result.areasToImprove?.length ? <ul>{result.areasToImprove.map((item) => <li key={item}>{item}</li>)}</ul> : <p>All checklist items were met.</p>}</div>
            </div>
            <p className="communication-scoring-note">This score reflects visible content checks and selected roleplay approaches only. It does not assess speaking delivery or overall writing quality.</p>
            <div className="communication-result-actions">
              <button className="communication-hub-primary" onClick={() => { refreshAfterAttempt(); navigate(`/communication/${subdivisionId}`); }}>Retry subdivision</button>
              <button className="communication-hub-secondary" onClick={() => navigate("/communication")}>Return to Communication Hub</button>
            </div>
          </section>
        )}

        {subdivisionId && !result && !quiz && (
          <section className="dashboard-panel communication-detail-panel">
            <button className="communication-text-link" onClick={() => navigate("/communication")}>← Back to Communication Hub</button>
            <header className="communication-detail-header">
              <div><p className="header-small">FIVE-MINUTE ASSESSMENT</p><h1>{currentDomain?.icon} {domainTitle(subdivisionId)}</h1><p>Each subdivision has its own timer and saved result. Opening this page does not start the clock.</p></div>
              <span className="level-badge">⏱ 05:00</span>
            </header>
            {catalog.length === 0 ? <p>No activities are currently available for this subdivision.</p> : (
              <div className="communication-detail-activities">
                {catalog.map((activity) => (
                  <article className="communication-activity-preview" key={activity.id}>
                    <div className="communication-preview-top"><span className={`communication-type-tag type-${activity.type.toLowerCase()}`}>{typeLabel(activity.type)}</span><span>Included in this assessment</span></div>
                    <h2>{activity.title}</h2><p>{activity.objective}</p><p className="communication-scenario-copy">{activity.scenario}</p>
                    {activity.audience && <small>Audience: {activity.audience}</small>}
                  </article>
                ))}
              </div>
            )}
            <div className="communication-start-row">
              <span>Responses are scored by the server. XP is awarded once per saved attempt.</span>
              <button className="communication-hub-primary" onClick={() => loadSession(true)}>Start Assessment</button>
            </div>
          </section>
        )}

        {subdivisionId && quiz && !result && (
          <section className="dashboard-panel communication-assessment-panel">
            <header className="communication-assessment-header">
              <div><p className="header-small">{quiz.subdivisionName.toUpperCase()}</p><h1>Communication Assessment</h1><p>Share your response to each activity. Your answers are saved in this browser while the server timer continues.</p></div>
              <div className="timer communication-server-timer" aria-live="polite">⏱ {formatTime()}</div>
            </header>
            <div className="communication-assessment-progress"><div className="xp-progress"><div className="xp-filled" style={{ width: `${Math.round((Object.keys(responses).filter((id) => responses[id]?.trim()).length / Math.max(1, quiz.activities.filter((activity) => activity.type !== "ROLEPLAY").length)) * 100)}%` }} /></div><span>{Object.keys(responses).filter((id) => responses[id]?.trim()).length} written/speaking responses saved</span></div>
            <div className="communication-assessment-activities">
              {quiz.activities.map((activity, index) => (
                <article className="communication-live-activity" key={activity.id}>
                  <div className="communication-live-activity-title"><span>Activity {index + 1}</span><span className={`communication-type-tag type-${activity.type.toLowerCase()}`}>{typeLabel(activity.type)}</span></div>
                  <h2>{activity.title}</h2><p className="communication-objective">{activity.objective}</p>
                  <div className="communication-scenario-box"><b>Scenario</b><p>{activity.scenario}</p></div>
                  <p className="communication-instructions">{activity.instructions}</p>
                  {activity.audience && <p className="communication-audience">Audience: {activity.audience}</p>}
                  {activity.type !== "ROLEPLAY" && (
                    <>
                      <p className="communication-prompt">{activity.prompt}</p>
                      <div className="communication-rubric"><b>Content checklist</b><ul>{activity.rubricCriteria?.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div>
                      {activity.type === "SPEAKING" && (
                        <div className="communication-speaking-tools">
                          {recordingActivity === activity.id
                            ? <button className="communication-hub-secondary" onClick={stopSpeech}>■ Stop recording · {speechSeconds}s</button>
                            : <button className="communication-hub-secondary" onClick={() => beginSpeech(activity)}>🎙 Start speaking</button>}
                          <span>{recordingActivity === activity.id ? "Listening…" : "Review and edit the transcript before submitting."}</span>
                        </div>
                      )}
                      <label className="communication-response-label">{activity.type === "SPEAKING" ? "Transcript / typed response" : "Your written response"}
                        <textarea value={responses[activity.id] || ""} maxLength={8000} disabled={submitting} onChange={(event) => updateResponse(activity.id, event.target.value)} placeholder={activity.type === "SPEAKING" ? "Your speech transcript appears here. You can edit it or type your response." : "Write your response here…"} />
                      </label>
                      {activity.type === "SPEAKING" && <small className="communication-limit-note">Checklist scoring only; pronunciation, tone, confidence, and vocal delivery are not assessed.</small>}
                    </>
                  )}
                  {activity.type === "ROLEPLAY" && (
                    <div className="communication-roleplay">
                      <div className="communication-rubric"><b>Conversation checklist</b><ul>{activity.rubricCriteria?.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div>
                      <div className="communication-conversation" aria-live="polite">
                        {activity.conversationHistory?.map((message, messageIndex) => <div key={`${messageIndex}-${message.speaker}`} className={`communication-chat-message ${message.speaker === "You" ? "from-user" : "from-other"}`}><small>{message.speaker}</small><p>{message.message}</p></div>)}
                      </div>
                      {activity.roleplayComplete ? <p className="communication-roleplay-done">Conversation complete.</p> : <div className="communication-roleplay-replies"><b>Your reply</b>{activity.currentTurn?.choices?.map((choice) => <button key={choice.id} disabled={Boolean(turnSubmitting)} onClick={() => replyRoleplay(activity, choice)}>{choice.text}</button>)}</div>}
                      <small>Each reply changes the next conversation turn. The server validates the turn and scores the selected approach.</small>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <footer className="communication-submit-row"><span>Pass: 70% · XP follows the existing accuracy tiers.</span><button className="communication-hub-primary" disabled={submitting || timeLeft <= 0} onClick={() => submitAssessment(false)}>{submitting ? "Submitting…" : "Submit Subdivision"}</button></footer>
          </section>
        )}

        {subdivisionId && error && !result && (
          <div className="communication-expired-actions"><button className="communication-hub-secondary" onClick={() => navigate("/communication")}>Return to Hub</button><button className="communication-hub-primary" onClick={() => loadSession(true)}>Start a new attempt</button></div>
        )}
      </main>
    </div>
  );
}

function domainTitle(id) {
  return domains.find((domain) => domain.id === id)?.title || ({
    "office-team": "Office & Team Communication",
    "customer-relations": "Customer Relations",
    "interview-career": "Interview & Career Communication",
    presentations: "Presentations & Public Speaking",
    "conflict-etiquette": "Conflict Resolution & Workplace Etiquette",
  }[id] || "Communication Subdivision");
}

function domainActivityCount(id) {
  return { "office-team": 3, "customer-relations": 2, "interview-career": 2, presentations: 2, "conflict-etiquette": 1 }[id] || 0;
}

function typeLabel(type) { return type === "SPEAKING" ? "Speaking" : type === "WRITING" ? "Writing" : "Roleplay"; }

function catalogForDomain(id) {
  const activityTypes = {
    "office-team": ["SPEAKING", "WRITING", "ROLEPLAY"],
    "customer-relations": ["SPEAKING", "ROLEPLAY"],
    "interview-career": ["SPEAKING", "WRITING"],
    presentations: ["SPEAKING", "SPEAKING"],
    "conflict-etiquette": ["WRITING"],
  }[id] || [];
  return activityTypes.map((type, index) => ({ id: `${id}-${index}`, type }));
}

function domainCatalog(id, activities) {
  return activities.length ? activities : catalogForDomain(id);
}

export default CommunicationHome;
