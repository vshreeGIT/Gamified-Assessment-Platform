import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { startReasoningQuiz } from "../../../services/assessmentService";
import "./ReasoningDifficulty.css";

function ReasoningDifficulty() {
  const navigate = useNavigate();
  const { difficulty: paramDifficulty } = useParams();
  const location = useLocation();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const difficultyParam = (paramDifficulty || location.state?.difficulty || "beginner").toLowerCase();

  const configs = {
    beginner: {
      key: "beginner",
      title: "Explorer Quest",
      badge: "Beginner",
      icon: "🧠",
      questions: 10,
      time: "10 Minutes",
      xp: "+80 XP",
      passing: "70%",
      topics: [
        "🧩 Number Series",
        "🧭 Direction Sense",
        "👨‍👩‍👧 Blood Relations",
        "🔤 Coding-Decoding",
        "⚖️ Syllogism",
      ],
    },
    intermediate: {
      key: "intermediate",
      title: "Tactician Quest",
      badge: "Intermediate",
      icon: "🧩",
      questions: 15,
      time: "15 Minutes",
      xp: "+150 XP",
      passing: "70%",
      topics: [
        "📈 Complex Number & Letter Series",
        "📐 Direction & Vector Logic",
        "👥 Multi-step Blood Relations",
        "🪑 Linear Seating Arrangement",
        "⏰ Clock & Calendar Logic",
      ],
    },
    advanced: {
      key: "advanced",
      title: "Grandmaster Quest",
      badge: "Advanced",
      icon: "👑",
      questions: 20,
      time: "20 Minutes",
      xp: "+250 XP",
      passing: "70%",
      topics: [
        "🔄 Circular & Complex Seating",
        "🔍 Critical Reasoning & Arguments",
        "🎲 3D Cubes & Spatial Puzzles",
        "💡 Data Sufficiency",
        "⚙️ Machine Input-Output Deduction",
      ],
    },
  };

  const config = configs[difficultyParam] || configs.beginner;

  async function handleStart() {
    setStarting(true);
    setError("");
    try {
      const quiz = await startReasoningQuiz(config.key);
      sessionStorage.setItem(`skillquest_reasoning_${config.key}`, quiz.submissionKey);
      navigate(`/reasoning/question/${config.key}`);
    } catch (err) {
      setError(err.message || "Unable to start your quest.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="reasoning-difficulty-page">
      <div className="reasoning-difficulty-container">
        {/* Header */}
        <div className="difficulty-header">
          <h1>🧠 Logical Reasoning Quest</h1>
          <p>
            Prepare yourself before starting the quest. Read the instructions
            carefully and earn maximum XP by completing all questions.
          </p>
        </div>

        {/* Main Card */}
        <div className="difficulty-card">
          <div className="difficulty-top">
            <div className="difficulty-icon">{config.icon}</div>

            <div>
              <h2>{config.title}</h2>
              <span className="difficulty-badge">{config.badge}</span>
            </div>
          </div>

          {/* Details */}
          <div className="difficulty-info">
            <div className="info-box">
              <h3>📋 Questions</h3>
              <p>{config.questions}</p>
            </div>

            <div className="info-box">
              <h3>⏱ Time</h3>
              <p>{config.time}</p>
            </div>

            <div className="info-box">
              <h3>⚡ Reward</h3>
              <p>{config.xp}</p>
            </div>

            <div className="info-box">
              <h3>🎯 Passing</h3>
              <p>{config.passing}</p>
            </div>
          </div>

          {/* Topics and Rules */}
          <div className="details-grid">
            <div className="topics">
              <h3>📚 Topics Covered</h3>
              <ul>
                {config.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>

            <div className="rules">
              <h3>📜 Quest Rules</h3>
              <ul>
                <li>✔ One mark for every correct answer.</li>
                <li>✔ No negative marking.</li>
                <li>✔ Timer cannot be paused once started.</li>
                <li>✔ Auto-submits when time expires.</li>
                <li>✔ Score 70%+ to pass and earn XP & badges.</li>
              </ul>
            </div>
          </div>

          <button
            className="start-btn"
            onClick={handleStart}
            disabled={starting}
          >
            ▶ Start Quest
          </button>
          {error && <p role="alert" className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ReasoningDifficulty;
