import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import CodingHeader from "../../../components/coding/CodingHeader";
import QuestionNavigator from "../../../components/coding/QuestionNavigator";
import codingQuestions from "../../../data/codingQuestions";
import "../../../styles/CodingQuestion.css";

const displayText = (value = "") => {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

function CodingQuestion() {
  const navigate = useNavigate();
  const { language, concept, difficulty } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [time, setTime] = useState(20 * 60);
  const [output, setOutput] = useState("");
  const [session, setSession] = useState(null);
  const [sessionError, setSessionError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const question = useMemo(() => {
    return (
      codingQuestions.find(
        (item) =>
          item.language === language &&
          item.concept === concept &&
          item.difficulty === difficulty
      ) || codingQuestions[0]
    );
  }, [concept, difficulty, language]);

  const [code, setCode] = useState(question.starterCode);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("skillquest_token");
    fetch(`http://localhost:8080/api/coding/${language}/${concept}/${difficulty}/start`, {
      method: "POST", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Unable to start Coding Arena.");
      return body;
    }).then((body) => {
      if (!active) return;
      setSession(body);
      setTime(Math.max(0, Math.ceil((new Date(body.deadlineAt).getTime() - Date.now()) / 1000)));
    }).catch((error) => { if (active) setSessionError(error.message); });
    return () => { active = false; };
  }, [language, concept, difficulty]);

  useEffect(() => {
    setCode(question.starterCode);
    setOutput("");
  }, [question]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const runCode = () => {
    setOutput("Code execution is not connected to a server evaluator. You can submit this response for a saved attempt, but the current system does not score or run the code.");
  };

  const submitCode = useCallback(async () => {
    if (!session || submitting || time <= 0) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("skillquest_token");
      const response = await fetch(`http://localhost:8080/api/coding/${language}/${concept}/${difficulty}/submit`, {
        method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ sessionKey: session.sessionKey, questionNumber: currentQuestion, code }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Unable to save Coding Arena submission.");
      setCompletedQuestions((prev) => prev.includes(currentQuestion) ? prev : [...prev, currentQuestion]);
      setOutput(body.message || "Coding response saved.");
    } catch (error) { setOutput(error.message); }
    finally { setSubmitting(false); }
  }, [code, concept, currentQuestion, difficulty, language, session, submitting, time]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resetCode = () => {
    setCode(question.starterCode);
    setOutput("");
  };

  const goNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, 10));
  };

  return (
    <div className="coding-workspace">
      <CodingHeader
        language={displayText(language)}
        concept={displayText(concept)}
        difficulty={displayText(difficulty)}
        timer={formatTime(time)}
        xp={420}
        level={3}
      />

      <div className="workspace">
        <QuestionNavigator
          totalQuestions={10}
          currentQuestion={currentQuestion}
          completedQuestions={completedQuestions}
          onSelectQuestion={(num) => setCurrentQuestion(num)}
        />

        <div className="question-area">
          <div className="left-panel">
            <button
              className="question-back-btn"
              onClick={() => navigate(`/coding/${language}/${concept}`)}
            >
              ← Difficulty
            </button>

            <div className="progress-label">
              Question {currentQuestion} / 10
              <span>{Math.round((currentQuestion / 10) * 100)}%</span>
            </div>
            <div className="question-progress">
              <div
                className="question-progress-fill"
                style={{ width: `${(currentQuestion / 10) * 100}%` }}
              ></div>
            </div>

            <h3>{question.title}</h3>
            <p>{question.statement}</p>

            <h4>Sample Input</h4>
            <pre>{question.sampleInput}</pre>

            <h4>Sample Output</h4>
            <pre>{question.sampleOutput}</pre>

            <h4>Constraints</h4>
            <pre>{question.constraints}</pre>
          </div>

          <div className="right-panel">
            <div className="editor-shell">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div className="button-row">
              <button className="secondary-action" onClick={resetCode}>
                Reset
              </button>
              <button onClick={runCode}>▶ Run</button>
              <button onClick={submitCode} disabled={!session || submitting || time <= 0}>{submitting ? "Saving…" : "✅ Submit"}</button>
              <button className="secondary-action" onClick={goNext}>
                Next →
              </button>
            </div>

            <div className="output">
              <h3>Output</h3>
              <pre>{sessionError || output || (time <= 0 ? "Time expired. This assessment was not submitted." : "Run your code to see test results here.")}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodingQuestion;
