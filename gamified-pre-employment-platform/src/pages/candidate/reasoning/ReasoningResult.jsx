import { useLocation, useNavigate } from "react-router-dom";
import "./ReasoningResult.css";

function ReasoningResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateResult = location.state?.result;
  const timedOut = Boolean(location.state?.timedOut);

  // If no result is present in state (e.g. direct URL visit or full browser reload without history)
  if (!stateResult && !location.state?.score) {
    return (
      <div className="reasoning-result-page">
        <div className="result-card">
          <div className="result-header">
            <h1>Quest Summary</h1>
            <p>No recent assessment result found in this session.</p>
          </div>
          <div className="result-buttons" style={{ marginTop: "2rem" }}>
            <button className="play-again-btn" onClick={() => navigate("/reasoning")}>
              🧠 Go to Quests
            </button>
            <button className="dashboard-btn" onClick={() => navigate("/candidate-dashboard")}>
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const result = stateResult || {};
  const score = result.score ?? location.state?.score ?? 0;
  const total = result.totalQuestions ?? location.state?.total ?? 10;
  const accuracy = result.accuracy ?? (total > 0 ? Math.round((score / total) * 100) : 0);
  const earnedXp = result.earnedXp ?? 20;
  const badge = result.badge ?? "🌱 Quest Beginner";
  const passed = result.passed !== undefined ? result.passed : accuracy >= 70;
  const correct = result.correctAnswers ?? score;
  const wrong = result.wrongAnswers ?? Math.max(0, total - score);

  return (
    <div className="reasoning-result-page">
      <div className="result-card">
        <div className="result-header">
          {timedOut && (
            <p style={{ color: "#f59e0b", fontWeight: 600, marginBottom: "0.5rem" }}>
              ⏱ Time expired! Your answers were automatically submitted.
            </p>
          )}

          <h1>{passed ? "🎉 Quest Complete!" : "⚔️ Quest Finished!"}</h1>

          <p>
            {passed
              ? "Outstanding performance! You passed the Logical Reasoning Quest and unlocked your reward."
              : "Good effort! Practice more questions to improve your accuracy and pass this quest."}
          </p>
        </div>

        <div className="result-grid">
          <div className="result-box">
            <h3>⭐ Score</h3>
            <p>{score} / {total}</p>
          </div>

          <div className="result-box">
            <h3>🎯 Accuracy</h3>
            <p>{accuracy}%</p>
          </div>

          <div className="result-box">
            <h3>⚡ XP Earned</h3>
            <p style={{ color: "#22c55e", fontWeight: "bold" }}>+{earnedXp} XP</p>
          </div>

          <div className="result-box">
            <h3>🏅 Badge</h3>
            <p>{badge}</p>
          </div>

          <div className="result-box">
            <h3>Status</h3>
            <p style={{ color: passed ? "#22c55e" : "#f59e0b", fontWeight: "bold" }}>
              {passed ? "PASSED ✅" : "NEEDS PRACTICE ⚠️"}
            </p>
          </div>

          <div className="result-box">
            <h3>✅ Correct / ❌ Wrong</h3>
            <p>{correct} / {wrong}</p>
          </div>
        </div>

        <div className="result-buttons">
          <button
            className="play-again-btn"
            onClick={() => navigate("/reasoning")}
          >
            🔄 Play Again
          </button>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/candidate-dashboard")}
          >
            🏠 View in Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReasoningResult;