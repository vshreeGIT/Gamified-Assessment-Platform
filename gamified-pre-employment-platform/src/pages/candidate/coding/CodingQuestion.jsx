import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import QuestionNavigator from "../../../components/coding/QuestionNavigator";
import { assessmentRequest, assessmentStorageKey, formatDuration, questionsFor, questionById } from "../../../services/codingAssessment";
import "../../../styles/CodingQuestion.css";

const QUESTION_SECONDS = Number(import.meta.env.VITE_QUESTION_DURATION_SECONDS) || 1200;
const TOTAL_SECONDS = Number(import.meta.env.VITE_ASSESSMENT_DURATION_SECONDS) || 0;
const CAMERA_REQUIRED = import.meta.env.VITE_CAMERA_REQUIRED === "true";
const FULLSCREEN_REQUIRED = import.meta.env.VITE_FULLSCREEN_REQUIRED === "true";
const displayText = (value = "") => value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const starterCodeFor = (question, language, concept) => {
  if (concept === "variables") {
    return typeof question.starterCode === "string" ? question.starterCode : question.starterCode?.[language] ?? "";
  }
  return question.starterCode?.[language] ?? question.starterCode ?? "";
};
const readSession = (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };

function CodingQuestion() {
  const navigate = useNavigate();
  const { language, concept, id } = useParams();
  const questions = useMemo(() => questionsFor(language, concept), [language, concept]);
  const question = useMemo(() => questionById(language, concept, id), [language, concept, id]);
  const key = assessmentStorageKey(language, concept);
  const [session, setSession] = useState(() => readSession(key) || { startedAt: null, questionStarts: {}, answers: {}, submissions: {}, events: [], status: "instructions" });
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("stopped");
  const [cameraError, setCameraError] = useState("");
  const [focusWarning, setFocusWarning] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [fullscreenStatus, setFullscreenStatus] = useState("inactive");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const endedRef = useRef(false);
  const endingRef = useRef(false);
  const workspaceRef = useRef(null);
  const questionIndex = questions.findIndex((item) => String(item.id) === String(id));
  const currentNumber = questionIndex + 1;
  const isFinished = session.status === "finished" || session.status === "expired";

  const updateSession = useCallback((update) => {
    setSession((current) => {
      const next = typeof update === "function" ? update(current) : update;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  const persistEvent = useCallback((type, detail = "") => {
    updateSession((current) => ({ ...current, events: [...current.events, { type, detail, occurredAt: new Date().toISOString() }] }));
    if (import.meta.env.VITE_ASSESSMENT_API_URL) assessmentRequest("/api/assessments/events", { method: "POST", body: JSON.stringify({ language, concept, questionId: question?.id, type, detail }) }).catch(() => {});
  }, [concept, language, question?.id, updateSession]);

  useEffect(() => {
    if (session.status !== "active" || !question || isFinished) return;
    if (!session.questionStarts[question.id]) {
      updateSession((current) => ({ ...current, questionStarts: { ...current.questionStarts, [question.id]: Date.now() } }));
    }
    setCode(session.answers[question.id]?.code ?? starterCodeFor(question, language, concept));
    setCustomInput("");
    setOutput("");
  }, [id, language, concept, question, session.status, session.answers, session.questionStarts, isFinished, updateSession]); // question entry restores its saved draft and start time

  useEffect(() => {
    if (!session.startedAt || isFinished) return undefined;
    const tick = () => {
      const qStart = session.questionStarts[question?.id];
      const qRemaining = qStart ? QUESTION_SECONDS - Math.floor((Date.now() - qStart) / 1000) : QUESTION_SECONDS;
      const totalRemaining = TOTAL_SECONDS ? TOTAL_SECONDS - Math.floor((Date.now() - session.startedAt) / 1000) : Infinity;
      const seconds = Math.max(0, Math.min(qRemaining, totalRemaining));
      setRemaining(seconds);
      if (seconds <= 0 && !endedRef.current) {
        endedRef.current = true;
        endingRef.current = true;
        updateSession((current) => ({ ...current, status: "expired", finishedAt: Date.now() }));
        exitWorkspaceFullscreen();
        persistEvent("timeout", "Assessment timer expired; late submissions are disabled.");
        if (import.meta.env.VITE_ASSESSMENT_API_URL) assessmentRequest("/api/assessments/end", { method: "POST", body: JSON.stringify({ language, concept, reason: "timeout" }) }).then((finalResult) => updateSession((current) => ({ ...current, finalResult }))).catch(() => {});
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [session.startedAt, session.questionStarts, question?.id, isFinished, updateSession, persistEvent, language, concept]);

  useEffect(() => {
    if (session.status !== "active" || isFinished) return undefined;
    let lastRecordedAt = 0;
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      if (Date.now() - lastRecordedAt < 1200) return;
      lastRecordedAt = Date.now();
      setFocusWarning(true);
      persistEvent("focus-loss", "Assessment page became hidden.");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [session.status, isFinished, persistEvent]);

  useEffect(() => {
    if (session.status !== "active" || isFinished) return undefined;
    let wasFullscreen = Boolean(document.fullscreenElement);
    if (!wasFullscreen) setFullscreenWarning(true);
    const onFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setFullscreenStatus(active ? "active" : "inactive");
      if (active) {
        wasFullscreen = true;
        setFullscreenWarning(false);
      } else if (wasFullscreen && !endingRef.current) {
        wasFullscreen = false;
        setFullscreenWarning(true);
        persistEvent("fullscreen-exit", "Candidate exited browser fullscreen during the assessment.");
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [session.status, isFinished, persistEvent]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraStatus("stopped");
  }, []);
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  useEffect(() => { if (isFinished) stopCamera(); }, [isFinished, stopCamera]);
  useEffect(() => {
    if (session.status !== "active" || cameraStatus !== "active" || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
  }, [cameraStatus, session.status]);
  useEffect(() => {
    const stream = streamRef.current;
    const track = stream?.getVideoTracks()[0];
    if (!track) return undefined;
    const onEnded = () => {
      setCameraStatus("unavailable");
      setCameraError("Camera monitoring stopped because the camera disconnected.");
      persistEvent("camera-unavailable", "Camera video track ended.");
    };
    track.addEventListener("ended", onEnded);
    return () => track.removeEventListener("ended", onEnded);
  }, [cameraStatus, session.status, persistEvent]);

  useEffect(() => () => {
    if (document.fullscreenElement === workspaceRef.current) document.exitFullscreen?.().catch(() => {});
  }, []);

  const requestWorkspaceFullscreen = async () => {
    setFullscreenError("");
    if (!document.fullscreenEnabled || !workspaceRef.current?.requestFullscreen) {
      setFullscreenStatus("unsupported");
      setFullscreenError("Fullscreen is unavailable in this browser. The workspace can continue in the current window.");
      return false;
    }
    try {
      await workspaceRef.current.requestFullscreen();
      setFullscreenStatus("active");
      setFullscreenWarning(false);
      return true;
    } catch {
      setFullscreenStatus("denied");
      setFullscreenError("Fullscreen could not be activated. You can continue in this window; fullscreen was not enabled.");
      return false;
    }
  };

  const exitWorkspaceFullscreen = () => {
    if (document.fullscreenElement === workspaceRef.current) document.exitFullscreen?.().catch(() => {});
  };

  const beginAssessment = async () => {
    const fullscreenEntered = await requestWorkspaceFullscreen();
    if (FULLSCREEN_REQUIRED && !fullscreenEntered) return;
    if (CAMERA_REQUIRED) {
      if (!navigator.mediaDevices?.getUserMedia) { setCameraStatus("unavailable"); setCameraError("This browser does not provide camera access. This assessment requires a camera."); return; }
      setCameraStatus("requesting"); setCameraError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraStatus("active");
      } catch (error) {
        setCameraStatus(error.name === "NotAllowedError" ? "denied" : "unavailable");
        setCameraError(error.name === "NotAllowedError" ? "Camera permission was denied. This assessment requires camera permission, so it cannot start." : "The camera is unavailable. This assessment requires a working camera.");
        return;
      }
    } else if (navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraStatus("active");
      } catch (error) { setCameraStatus(error.name === "NotAllowedError" ? "denied" : "unavailable"); setCameraError("Camera monitoring is unavailable; this assessment can continue because camera permission is optional."); }
    } else { setCameraStatus("unavailable"); setCameraError("This browser does not support camera monitoring. Camera permission is optional for this assessment."); }
    const startedAt = session.startedAt || Date.now();
    updateSession((current) => ({ ...current, startedAt, status: "active", questionStarts: { ...current.questionStarts, [question.id]: current.questionStarts[question.id] || Date.now() } }));
    if (import.meta.env.VITE_ASSESSMENT_API_URL) {
      try { await assessmentRequest("/api/assessments/start", { method: "POST", body: JSON.stringify({ language, concept, questionIds: questions.map((item) => item.id) }) }); }
      catch (error) { setOutput(`Assessment session could not be created on the server: ${error.message}`); }
    }
  };

  const saveDraft = (nextCode = code) => updateSession((current) => ({ ...current, answers: { ...current.answers, [question.id]: { code: nextCode, savedAt: Date.now() } } }));
  const runCode = async () => {
    if (!code.trim()) { setOutput("Enter code before using Compile / Run."); return; }
    setBusy(true); setOutput("Sending code to the configured secure execution service…");
    try {
      const result = await assessmentRequest("/api/assessments/execute", { method: "POST", body: JSON.stringify({ questionId: question.id, language, code, input: customInput }) });
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) { setOutput(`Execution unavailable: ${error.message}\nNo code was executed.`); }
    finally { setBusy(false); }
  };

  const submitCode = async () => {
    if (!code.trim()) { setOutput("Enter a solution before submitting."); return; }
    if (isFinished || remaining <= 0) { setOutput("This assessment has ended. Late submissions are disabled."); return; }
    if (session.submissions[question.id]) { setOutput("This question has already been submitted."); return; }
    saveDraft(); setBusy(true); setOutput("Submitting to the assessment service…");
    try {
      const result = await assessmentRequest("/api/assessments/submit", { method: "POST", body: JSON.stringify({ questionId: question.id, language, code }) });
      updateSession((current) => ({ ...current, submissions: { ...current.submissions, [question.id]: { ...result, submittedAt: Date.now() } } }));
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) { setOutput(`Submission not recorded: ${error.message}`); }
    finally { setBusy(false); }
  };

  const endAssessment = async () => {
    endingRef.current = true;
    updateSession((current) => ({ ...current, status: "finished", finishedAt: Date.now() }));
    persistEvent("assessment-ended", "Candidate ended the assessment.");
    stopCamera(); exitWorkspaceFullscreen(); setConfirmEnd(false);
    if (import.meta.env.VITE_ASSESSMENT_API_URL) {
      try { const finalResult = await assessmentRequest("/api/assessments/end", { method: "POST", body: JSON.stringify({ language, concept }) }); updateSession((current) => ({ ...current, finalResult })); } catch { /* local result remains available */ }
    }
  };

  if (!question) return <main className="assessment-error"><h1>Question unavailable</h1><p>This question is not in the selected language and concept.</p><button onClick={() => navigate(`/coding/${language}/${concept}/questions`)}>Back to questions</button></main>;
  const answeredCount = Object.keys(session.submissions).length;
  const completed = questions.map((item, index) => session.submissions[item.id] ? index + 1 : null).filter(Boolean);
  const navigateQuestion = (number) => {
    const next = questions[number - 1]; if (next) { saveDraft(); navigate(`/coding/${language}/${concept}/question/${next.id}`); }
  };

  return (
    <div className="coding-workspace" ref={workspaceRef}>
      <header className="assessment-topbar">
        <button className="workspace-back" onClick={() => navigate(`/coding/${language}/${concept}/questions`)}>← Questions</button>
        <div className="workspace-brand"><span className="brand-mark">SQ</span><strong>SkillQuest</strong><span className="brand-divider" /><div><b>{displayText(concept)} Assessment</b><small>{displayText(language)} · {question.title}</small></div></div>
        <span className="question-count">Question {currentNumber} / {questions.length}</span>
        <div className="timer-stack" aria-live="polite"><span>Question time <b>{formatDuration(remaining)}</b></span>{TOTAL_SECONDS > 0 && <span>Total time <b>{formatDuration(Math.max(0, TOTAL_SECONDS - Math.floor((Date.now() - (session.startedAt || Date.now())) / 1000)))}</b></span>}</div>
        <span className={`camera-pill ${cameraStatus}`}>Camera · {cameraStatus}</span>
        <span className={`fullscreen-pill ${fullscreenStatus}`}>Fullscreen · {fullscreenStatus}</span>
        <button className="end-test-button" onClick={() => setConfirmEnd(true)} disabled={session.status !== "active"}>End Test</button>
      </header>
      {focusWarning && <div className="focus-warning" role="alert">You left the assessment tab. This focus event has been recorded ({session.events.filter((event) => event.type === "focus-loss").length}). Return to your work when ready.<button onClick={() => setFocusWarning(false)} aria-label="Dismiss focus warning">Dismiss</button></div>}
      {fullscreenWarning && <div className="fullscreen-warning" role="alert">Fullscreen has ended. Browser fullscreen cannot block other tabs, apps, or operating-system controls.<button onClick={requestWorkspaceFullscreen}>Re-enter fullscreen</button></div>}
      {fullscreenError && session.status !== "instructions" && <div className="fullscreen-warning" role="status">{fullscreenError}</div>}
      {cameraError && <div className="camera-warning" role="status">{cameraError}</div>}
      <div className="assessment-layout">
        <QuestionNavigator totalQuestions={questions.length} currentQuestion={currentNumber} completedQuestions={completed} onSelectQuestion={navigateQuestion} />
        <div className="assessment-content">
          <section className="problem-panel">
            <div className="problem-heading"><div><span className={`difficulty-badge ${question.difficulty}`}>{displayText(question.difficulty)}</span><h1>{question.title}</h1></div><span>Question {currentNumber} of {questions.length}</span></div>
            <p className="problem-statement">{question.statement}</p>
            {question.inputFormat && <><h3>Input format</h3><p>{question.inputFormat}</p></>}
            {question.outputFormat && <><h3>Output format</h3><p>{question.outputFormat}</p></>}
            {(question.examples || (question.sampleInput !== undefined ? [{ input: question.sampleInput, output: question.sampleOutput }] : [])).map((example, index) => <div className="example-block" key={index}><h3>Example {index + 1}</h3><div><b>Input</b><pre>{example.input}</pre></div><div><b>Output</b><pre>{example.output}</pre></div>{example.explanation && <p>{example.explanation}</p>}</div>)}
            {question.constraints && <><h3>Constraints</h3><pre className="constraints-block">{question.constraints}</pre></>}
          </section>
          <section className="editor-panel">
            <div className="editor-title"><h2>Solution</h2><label>Language <select value={language} disabled aria-label="Selected language"><option value={language}>{displayText(language)}</option></select></label></div>
            <div className="editor-shell"><Editor height="100%" theme="vs-dark" language={language === "cpp" ? "cpp" : language} value={code} onChange={(value) => { setCode(value || ""); saveDraft(value || ""); }} options={{ fontSize: 15, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, readOnly: session.status !== "active" || isFinished }} /></div>
            {language !== "sql" && <label className="custom-input">Custom input<textarea value={customInput} onChange={(event) => setCustomInput(event.target.value)} placeholder="Optional stdin for your run" /></label>}
            <div className="assessment-actions"><button className="secondary-action" onClick={() => { const starter = starterCodeFor(question, language, concept); setCode(starter); saveDraft(starter); }} disabled={isFinished}>Reset</button><button onClick={runCode} disabled={busy || isFinished}>{busy ? "Working…" : "Compile / Run"}</button><button className="submit-action" onClick={submitCode} disabled={busy || isFinished || Boolean(session.submissions[question.id])}>{session.submissions[question.id] ? "Submitted" : "Submit"}</button><button className="secondary-action" onClick={() => navigateQuestion(currentNumber + 1)} disabled={currentNumber >= questions.length}>Next Question →</button></div>
            <details className="results-panel" open>
              <summary><h2>Run and submission results</h2><span>Collapse</span></summary>
              <pre>{output || "Run your code to see results. Execution is available only when a secure backend is configured."}</pre>
            </details>
          </section>
        </div>
      </div>
      {cameraStatus === "active" && <div className="camera-preview"><video ref={videoRef} autoPlay muted playsInline /><span>Camera preview · video is not recorded</span></div>}

      {(session.status === "instructions" || (CAMERA_REQUIRED && session.status === "active" && cameraStatus !== "active")) && (
        <div className="assessment-modal-backdrop">
          <section className="assessment-modal" role="dialog" aria-modal="true" aria-labelledby="instructions-title">
            <p className="assessment-eyebrow">SKILLQUEST · ASSESSMENT</p>
            <h2 id="instructions-title">{session.status === "active" ? "Restore camera monitoring" : "Before you begin"}</h2>
            <p>{session.status === "active" ? "This assessment requires an active camera. Reconnect camera access to continue." : `You are starting ${displayText(concept)} in ${displayText(language)}. This assessment includes ${questions.length} question${questions.length === 1 ? "" : "s"}.`}</p>
            {session.status === "instructions" && <ul>
              <li>Each question timer starts the first time you open that question ({Math.floor(QUESTION_SECONDS / 60)} minutes); revisiting it does not reset the timer.{TOTAL_SECONDS > 0 ? ` Total assessment time is ${Math.floor(TOTAL_SECONDS / 60)} minutes.` : ""}</li>
              <li>Use Compile / Run to test code. Use Submit to send a final answer.</li>
              <li>When time expires, the assessment closes and late submissions are disabled. Drafts are saved in this browser.</li>
              <li>{CAMERA_REQUIRED ? "Camera permission is required. You must allow camera access to begin." : "Camera monitoring is optional and requires your permission."} A live preview is shown while monitoring is active; video is not recorded or uploaded by this page.</li>
              <li>Fullscreen is requested when you start. Leaving fullscreen during the assessment is recorded and shows a re-entry warning. Browsers cannot hide or lock other tabs, apps, or operating-system controls.</li>
              <li>Leaving or switching away from this tab may be recorded and shown for review.</li>
              <li>Do not use unauthorized assistance during the assessment.</li>
            </ul>}
            {cameraError && <p className="modal-error" role="alert">{cameraError}</p>}
            {fullscreenError && <p className="modal-error" role="alert">{fullscreenError}{FULLSCREEN_REQUIRED ? " Fullscreen is required by this assessment policy." : ""}</p>}
            <div className="modal-actions">
              <button className="secondary-action" onClick={() => session.status === "active" ? endAssessment() : navigate(`/coding/${language}/${concept}/questions`)}>{session.status === "active" ? "End Test" : "Cancel / Back"}</button>
              <button onClick={beginAssessment} disabled={cameraStatus === "requesting"}>{cameraStatus === "requesting" ? "Requesting camera…" : session.status === "active" ? "Reconnect Camera" : "I Understand — Start Assessment"}</button>
            </div>
          </section>
        </div>
      )}

      {confirmEnd && <div className="assessment-modal-backdrop"><section className="assessment-modal" role="dialog" aria-modal="true"><h2>End this assessment?</h2><p>{answeredCount} answered · {questions.length - answeredCount} unanswered.</p><p>Submitted answers and available results will be shown after you confirm.</p><div className="modal-actions"><button className="secondary-action" onClick={() => setConfirmEnd(false)}>Continue assessment</button><button className="submit-action" onClick={endAssessment}>End Test</button></div></section></div>}
      {isFinished && <div className="assessment-modal-backdrop"><section className="assessment-modal results-summary" role="dialog" aria-modal="true"><p className="assessment-eyebrow">ASSESSMENT SUMMARY</p><h2>{session.status === "expired" ? "Time expired" : "Assessment complete"}</h2><p>{displayText(concept)} · {displayText(language)}</p><div className="summary-stats"><span><b>{questions.length}</b>Total questions</span><span><b>{answeredCount}</b>Submitted</span><span><b>{questions.length - answeredCount}</b>Unanswered</span></div>{session.finalResult ? <><p>Final result returned by the assessment service:</p><pre>{JSON.stringify(session.finalResult, null, 2)}</pre></> : <p>Score, passed test cases, percentage, and XP require a configured assessment backend. No score has been invented.</p>}<p>Proctoring events recorded in this browser: {session.events.length} ({session.events.filter((event) => event.type === "focus-loss").length} focus events).</p><button onClick={() => navigate("/candidate-dashboard")}>Return to dashboard</button></section></div>}
    </div>
  );
}

export default CodingQuestion;
