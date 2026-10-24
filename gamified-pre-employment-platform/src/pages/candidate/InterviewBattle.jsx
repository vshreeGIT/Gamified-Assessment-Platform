import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getChallengeProgress, getInterviewAccess } from "../../services/challengeProgressService";
import { getInterviewAttempt, getInterviewSession, saveInterviewDraft, startInterviewAssessment, submitInterviewAssessment } from "../../services/interviewBattleService";
import { isAuthenticated, logoutUser } from "../../services/authService";
import "../../styles/CandidateDashboard.css";
import "../../styles/TeamworkMission.css";
import "../../styles/InterviewBattle.css";

const draftKey = (sessionKey) => `skillquest_interview_draft_${sessionKey}`;

function InterviewBattle() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const [progress, setProgress] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expiredNotice, setExpiredNotice] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [mode, setMode] = useState("available");
  const [result, setResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [answerModes, setAnswerModes] = useState({});
  const [speechListening, setSpeechListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const speechCaptureRef = useRef(null);
  const answerTextareaRef = useRef(null);

  // Derived from state — declared here so the useEffects below can safely reference it.
  const question = quiz?.questions?.[questionIndex];

  useEffect(() => {
    setSpeechSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  useEffect(() => () => {
    recognitionRef.current?.abort();
  }, []);

  useEffect(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    speechCaptureRef.current = null;
    setSpeechListening(false);
    setSpeechError("");
  }, [question?.id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError("");
      if (!isAuthenticated()) { navigate("/login"); return; }
      try {
        if (attemptId) {
          const saved = await getInterviewAttempt(attemptId);
          if (!cancelled) { setResult(saved); setSelectedRole(saved.role || ""); setMode("results"); }
          return;
        }
        const current = await getChallengeProgress();
        if (cancelled) return;
        setProgress(current);
        await getInterviewAccess();
        if (cancelled) return;
        setUnlocked(true);
        const session = await getInterviewSession();
        if (!cancelled && session) {
          if (session.status === "EXPIRED") setExpiredNotice(true);
          else {
            setActiveSession(session);
            setSelectedRole(session.role || "");
            const fromStorage = localStorage.getItem(draftKey(session.sessionKey));
            let localAnswers = {};
            try { localAnswers = fromStorage ? JSON.parse(fromStorage) : {}; } catch { localAnswers = {}; }
            setAnswers({ ...(session.draftAnswers || {}), ...localAnswers });
            setRemaining(Math.max(0, Math.ceil((new Date(session.deadlineAt).getTime() - Date.now()) / 1000)));
          }
        }
      } catch (err) {
        if (err.message?.toLowerCase().includes("unauthorized")) { logoutUser(); navigate("/login"); }
        else if (!cancelled) setError(err.message || "Unable to load Interview Battle.");
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [attemptId, navigate]);

  useEffect(() => {
    if (mode !== "assessment" || !quiz?.deadlineAt) return undefined;
    const tick = () => setRemaining(Math.max(0, Math.ceil((new Date(quiz.deadlineAt).getTime() - Date.now()) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [mode, quiz]);

  useEffect(() => {
    if (mode !== "assessment" || !quiz?.sessionKey) return undefined;
    const timeout = window.setTimeout(() => {
      saveInterviewDraft({ sessionKey: quiz.sessionKey, answers }).catch(() => {});
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [answers, mode, quiz]);

  const answeredCount = useMemo(() => quiz?.questions?.filter((item) => Boolean(String(answers[item.id] || "").trim())).length || 0, [answers, quiz]);
  const formatTime = useCallback((seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`, []);

  const begin = async () => {
    setError(""); setLoading(true);
    try {
      const session = await startInterviewAssessment(selectedRole);
      setSelectedRole(session.role || selectedRole);
      setActiveSession(session); setQuiz(session); setAnswers(session.draftAnswers || {});
      localStorage.setItem(draftKey(session.sessionKey), JSON.stringify(session.draftAnswers || {}));
      setQuestionIndex(0); setMode("assessment"); setExpiredNotice(false);
      setRemaining(Math.max(0, Math.ceil((new Date(session.deadlineAt).getTime() - Date.now()) / 1000)));
    } catch (err) { setError(err.message || "Unable to start Interview Battle."); }
    finally { setLoading(false); }
  };

  const resume = () => {
    if (!activeSession) return;
    setSelectedRole(activeSession.role || "");
    setQuiz(activeSession); setQuestionIndex(0); setMode("assessment");
  };

  const updateAnswer = (id, value) => {
    setAnswers((previous) => {
      const next = { ...previous, [id]: value };
      if (quiz?.sessionKey) localStorage.setItem(draftKey(quiz.sessionKey), JSON.stringify(next));
      return next;
    });
  };

  const stopSpeech = () => {
    recognitionRef.current?.stop();
    setSpeechListening(false);
  };

  const startSpeech = ({ retry = false } = {}) => {
    if (!question) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechError("Speech recognition is not supported in this browser. You can still type your answer below.");
      return;
    }

    recognitionRef.current?.abort();
    const currentAnswer = String(answers[question.id] || "");
    const previousCapture = speechCaptureRef.current;
    const base = retry && previousCapture
      ? (currentAnswer === previousCapture.displayed ? previousCapture.base : currentAnswer)
      : currentAnswer;
    const capture = { base, transcript: "", displayed: base };
    speechCaptureRef.current = capture;
    setSpeechError("");

    try {
      const recognition = new Recognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        let added = "";
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          if (event.results[index].isFinal) added += event.results[index][0].transcript;
        }
        if (!added.trim()) return;
        capture.transcript = `${capture.transcript}${capture.transcript ? " " : ""}${added.trim()}`;
        capture.displayed = `${capture.base}${capture.base && capture.transcript ? " " : ""}${capture.transcript}`;
        updateAnswer(question.id, capture.displayed);
      };
      recognition.onerror = (event) => {
        const messages = {
          "not-allowed": "Microphone access was denied. Allow microphone access or type your answer below.",
          "service-not-allowed": "Speech recognition is unavailable. You can still type your answer below.",
          "no-speech": "No speech was detected. Try again or type your answer below.",
          "audio-capture": "No microphone was found. Connect a microphone or type your answer below.",
          network: "Speech recognition could not connect. Your answer is still available to edit or type.",
        };
        setSpeechError(messages[event.error] || "Speech recognition stopped unexpectedly. You can retry or type your answer.");
        setSpeechListening(false);
      };
      recognition.onend = () => {
        setSpeechListening(false);
        if (recognitionRef.current === recognition) recognitionRef.current = null;
      };
      recognition.start();
      setSpeechListening(true);
    } catch {
      setSpeechListening(false);
      setSpeechError("Could not start speech recognition. Check microphone permission or type your answer below.");
    }
  };

  const setAnswerMode = (nextMode) => {
    if (nextMode === "writing") stopSpeech();
    setAnswerModes((previous) => ({ ...previous, [question.id]: nextMode }));
    if (nextMode === "writing") window.setTimeout(() => answerTextareaRef.current?.focus(), 0);
  };

  const openReview = async () => {
    if (quiz?.sessionKey) {
      try { await saveInterviewDraft({ sessionKey: quiz.sessionKey, answers }); }
      catch (err) { setError(err.message || "Draft save failed. Your browser copy is retained."); }
    }
    setMode("review");
  };

  const submit = async () => {
    if (!quiz || submitting || remaining <= 0) return;
    setSubmitting(true); setError("");
    try {
      const saved = await submitInterviewAssessment({ sessionKey: quiz.sessionKey, answers });
      localStorage.removeItem(draftKey(quiz.sessionKey));
      setShowConfirmation(false);
      setSearchParams({ attemptId: saved.attemptId }, { replace: true });
      setResult(saved); setMode("results"); setQuiz(null); setActiveSession(null);
      getChallengeProgress().then(setProgress).catch(() => {});
    } catch (err) {
      setError(err.message || "Unable to submit Interview Battle.");
      if (err.message?.toLowerCase().includes("deadline")) { setRemaining(0); setMode("assessment"); }
    } finally { setSubmitting(false); }
  };

  const returnToChallenges = () => navigate("/challenges");

  if (loading) return <div className="dashboard-page teamwork-page interview-page"><main className="dashboard-main"><p>Loading Interview Battle…</p></main></div>;

  return <div className="dashboard-page teamwork-page interview-page">
    <aside className="sidebar"><div className="side-logo">🛡️ Skill<span>Quest</span></div><nav className="side-menu"><Link to="/candidate-dashboard">🏠 Dashboard</Link><Link to="/challenges">🎯 Challenges</Link><Link to="/badges">🛡️ My Badges</Link><Link to="/leaderboard">🏆 Leaderboard</Link><Link to="/job-matches">💼 Job Matches</Link><Link to="/candidate-profile">👤 Profile</Link></nav></aside>
    <main className="dashboard-main"><div className="teamwork-back"><Link to="/challenges">← Back to Challenges</Link></div>
      {error && <div className="teamwork-error" role="alert">{error}</div>}

      {!result && !quiz && <section className="dashboard-panel interview-panel">
        <p className="header-small">FINAL QUEST · CAREER SIMULATOR</p><h1>Interview Battle</h1>
        <p className="interview-intro">Practice realistic entry-level technology interviews across introductions, technical fundamentals, workplace situations, problem-solving, and customer communication.</p>
        {!unlocked ? <div className="teamwork-locked"><strong>🔒 Quest Locked</strong><p>Interview Battle requires both 750 XP and at least one saved submitted assessment in each of the five earlier quests.</p>
          <p>XP: {progress?.totalXp ?? 0} / {progress?.requiredXp ?? 750}</p><p>Completed quests: {progress?.completedRequiredQuests ?? 0} / {progress?.requiredQuestCount ?? 5}</p>
          <ul>{(progress?.quests?.interview?.missingPrerequisites || []).filter((item) => !item.startsWith("XP:") && !item.startsWith("Completed quests:")).map((item) => <li key={item}>{item.replace("Incomplete quests: ", "")}</li>)}</ul>
          {error && <p>{error}</p>}
        </div> : <>
          <div className="teamwork-status passed">Available · eligibility verified by the server</div>
          {progress?.interviewProgressionBypassed && <p className="interview-note">Temporary local testing mode is active. The normal XP and quest completion gate is bypassed for Interview Battle only.</p>}
          <div className="interview-results-grid"><div className="interview-result-stat"><strong>10</strong><span>Questions · 2 in each category</span></div><div className="interview-result-stat"><strong>20 min</strong><span>Server-enforced duration</span></div><div className="interview-result-stat"><strong>130 XP</strong><span>Maximum reward · 70% pass threshold</span></div></div>
          <p className="interview-note">The assessment combines multiple-choice questions and written responses. Open-ended scoring uses a transparent text rubric; it does not assess tone, intent, or speaking delivery.</p>
          {expiredNotice && <div className="interview-expired" role="status">Your previous session expired. It was not scored and earned no XP. You can start a new attempt.</div>}
          <div className="interview-role-selector">
            <label htmlFor="interview-role">Select your target role</label>
            <select id="interview-role" value={selectedRole} disabled={Boolean(activeSession)} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">— choose a role —</option>
              <option>Python Developer</option>
              <option value="Software Development Engineer">Software Development Engineer (SDE)</option>
              <option>Frontend Developer</option>
              <option>Full-Stack Developer</option>
              <option>Java Developer</option>
              <option>Data Analyst</option>
              <option>Customer Support Engineer</option>
              <option value="Business Development Representative">Business Development Representative (BDR)</option>
            </select>
            {activeSession && <p className="interview-role-note">This active assessment will resume with its saved role and question set.</p>}
          </div>
          {activeSession ? <button className="interview-primary" onClick={resume}>Resume Assessment</button> : <button className="interview-primary" disabled={!selectedRole} onClick={begin}>Start Assessment</button>}
        </>}
        <div className="interview-actions"><button className="interview-secondary" onClick={returnToChallenges}>Return to Challenges</button></div>
      </section>}

      {quiz && mode === "assessment" && question && <section className="dashboard-panel interview-panel">
        <p className="header-small">INTERVIEW BATTLE · LIVE ASSESSMENT</p><h1>Think it through. Explain your approach.</h1><p className="interview-role-badge">Target role · {quiz.role || "General interview"}</p>
        <div className="interview-toolbar"><span className={`interview-countdown ${remaining <= 60 ? "urgent" : ""}`} aria-live="polite">Time remaining · {formatTime(remaining)}</span><span className="interview-question-index">{answeredCount} of {quiz.questions.length} answered</span></div>
        <div className="interview-progress-meta"><span>Question {questionIndex + 1} of {quiz.questions.length}</span><span>{Math.round(((questionIndex + 1) / quiz.questions.length) * 100)}%</span></div>
        <div className="interview-progress-track"><div className="interview-progress-fill" style={{ width: `${((questionIndex + 1) / quiz.questions.length) * 100}%` }} /></div>
        <article className="interview-question-card"><div className="interview-question-tags"><span>{question.category}</span><span>{question.type === "MULTIPLE_CHOICE" ? "Choose one" : "Written response"}</span></div><h2>{question.prompt}</h2>
          {question.type === "MULTIPLE_CHOICE" ? <div className="interview-options" role="radiogroup" aria-label="Answer choices">{question.choices.map((choice) => <button key={choice.id} role="radio" aria-checked={answers[question.id] === choice.id} className={answers[question.id] === choice.id ? "selected" : ""} onClick={() => updateAnswer(question.id, choice.id)}>{choice.text}</button>)}</div>
            : <div className="interview-response-editor">
              <div className="interview-mode-switch" role="group" aria-label="Answer mode">
                <button type="button" className={(answerModes[question.id] || "writing") === "writing" ? "active" : ""} aria-pressed={(answerModes[question.id] || "writing") === "writing"} onClick={() => setAnswerMode("writing")}>Writing Mode</button>
                <button type="button" className={answerModes[question.id] === "speaking" ? "active" : ""} aria-pressed={answerModes[question.id] === "speaking"} onClick={() => setAnswerMode("speaking")}>Speaking Mode</button>
              </div>
              {answerModes[question.id] === "speaking" && <div className="interview-speech-controls">
                <p className="interview-speech-help">Speak your answer. Where supported, your browser's speech-recognition provider converts it to text. SkillQuest receives and saves only the editable transcript, not audio. You can edit or type in the answer box at any time.</p>
                {!speechSupported && <p className="interview-speech-status" role="status">Speech recognition is not available in this browser. Typed answers are fully supported.</p>}
                {speechListening && <p className="interview-speech-status" role="status" aria-live="polite">Listening… speak clearly, then select Stop.</p>}
                {speechError && <p className="interview-speech-error" role="alert">{speechError}</p>}
                <div className="interview-speech-buttons">
                  <button type="button" className="interview-primary" disabled={!speechSupported || speechListening} onClick={() => startSpeech()}>Start</button>
                  <button type="button" className="interview-secondary" disabled={!speechListening} onClick={stopSpeech}>Stop</button>
                  <button type="button" className="interview-secondary" disabled={!speechSupported || speechListening} onClick={() => startSpeech({ retry: true })}>Retry</button>
                  <button type="button" className="interview-secondary" onClick={() => setAnswerMode("writing")}>Edit Transcript</button>
                </div>
              </div>}
              <textarea ref={answerTextareaRef} className="interview-answer" value={answers[question.id] || ""} onChange={(event) => updateAnswer(question.id, event.target.value)} maxLength={4000} placeholder="Write a concise answer. Include your reasoning and practical next steps." aria-label="Your answer"/><div className="interview-answer-meta"><span>{answerModes[question.id] === "speaking" ? "Review and edit the transcript, or type directly here." : "Be specific and explain your reasoning."}</span><span>{(answers[question.id] || "").length}/4000</span></div>
            </div>}
        </article>
        {remaining <= 0 && <div className="interview-expired" role="alert">Time expired. The server will reject a late submission. Your draft remains available for review. <button className="interview-primary" onClick={begin}>Start a New Attempt</button></div>}
        <div className="interview-navigation"><button className="interview-secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}>Previous</button><span className="interview-question-index">Answers save to this session and browser while active.</span>{questionIndex < quiz.questions.length - 1 ? <button className="interview-primary" onClick={() => setQuestionIndex((index) => Math.min(quiz.questions.length - 1, index + 1))}>Next</button> : <button className="interview-primary" onClick={openReview}>Review Answers</button>}</div>
      </section>}

      {quiz && mode === "review" && <section className="dashboard-panel interview-panel">
        <p className="header-small">FINAL REVIEW</p><h1>Review before submission</h1><p className="interview-role-badge">Target role · {quiz.role || "General interview"}</p><p className="interview-intro">Check each response. You can return to any question before submitting.</p>
        <div className="interview-toolbar"><span className={`interview-countdown ${remaining <= 60 ? "urgent" : ""}`}>Time remaining · {formatTime(remaining)}</span><span className="interview-question-index">{answeredCount} of {quiz.questions.length} answered</span></div>
        <div className="interview-review-list">{quiz.questions.map((item, index) => <article className="interview-review-item" key={item.id}><h3>{index + 1}. {item.category} · {item.type === "MULTIPLE_CHOICE" ? "Choice" : "Written"}</h3><p>{item.prompt}</p><p><strong>Your response:</strong> {item.type === "MULTIPLE_CHOICE" ? item.choices.find((choice) => choice.id === answers[item.id])?.text || "Not answered" : (answers[item.id] || "Not answered")}</p><button onClick={() => { setQuestionIndex(index); setMode("assessment"); }}>Edit this response</button></article>)}</div>
        {remaining <= 0 && <div className="interview-expired" role="alert">The assessment deadline has passed. This attempt cannot be submitted. <button className="interview-primary" onClick={begin}>Start a New Attempt</button></div>}
        <div className="interview-navigation"><button className="interview-secondary" onClick={() => { setQuestionIndex(quiz.questions.length - 1); setMode("assessment"); }}>Return to Questions</button><button className="interview-primary" disabled={remaining <= 0} onClick={() => setShowConfirmation(true)}>Submit Assessment</button></div>
      </section>}

      {result && <section className="dashboard-panel interview-panel">
        <p className="header-small">INTERVIEW BATTLE · SAVED RESULT</p><h1>{result.passed ? "Interview Ready" : "Keep Practicing"}</h1><p className="interview-role-badge">Role assessed · {result.role || "General interview"}</p>
        <div className={`teamwork-result-state ${result.passed ? "passed" : "needs-practice"}`}>{result.passed ? "PASSED" : "NOT PASSED"} · {result.accuracy}%</div>
        <div className="interview-results-grid"><div className="interview-result-stat"><strong>{result.score}/{result.maxScore}</strong><span>Score</span></div><div className="interview-result-stat"><strong>{result.accuracy}%</strong><span>Accuracy</span></div><div className="interview-result-stat"><strong>+{result.earnedXp} XP</strong><span>Earned for this attempt</span></div></div>
        <h2>Category performance</h2><div className="interview-category-results">{result.categoryResults?.map((category) => <article className="interview-category-card" key={category.category}><h3>{category.category}</h3><strong>{category.score}/{category.maxScore} · {category.accuracy}%</strong><h4>Strengths</h4><ul>{category.strengths?.map((item) => <li key={item}>{item}</li>)}</ul><h4>Improve next</h4><ul>{category.areasToImprove?.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
        <h2>Answer feedback</h2><ul className="interview-feedback-list">{result.feedback?.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="interview-note">{result.automatedScoringNote}</p><div className="interview-actions"><button className="interview-primary" onClick={() => { setSearchParams({}, { replace: true }); setResult(null); setSelectedRole(""); setMode("available"); }}>Start a New Attempt</button><button className="interview-secondary" onClick={returnToChallenges}>Return to Challenges</button></div>
      </section>}

      {showConfirmation && <div className="interview-confirm-backdrop" role="presentation"><section className="interview-confirm" role="dialog" aria-modal="true" aria-labelledby="interview-submit-title"><h2 id="interview-submit-title">Submit this assessment?</h2><p>Your answers will be scored and saved. This submission can only be recorded once. The server checks the deadline and awards XP once for this attempt.</p><div className="interview-actions"><button className="interview-secondary" disabled={submitting} onClick={() => setShowConfirmation(false)}>Keep Reviewing</button><button className="interview-primary" disabled={submitting || remaining <= 0} onClick={submit}>{submitting ? "Submitting…" : "Confirm Submission"}</button></div></section></div>}
    </main>
  </div>;
}

export default InterviewBattle;
