import { useLocation, useNavigate } from "react-router-dom";
import "./ReasoningResult.css";

function ReasoningResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const score = location.state?.score || 0;
  const total = location.state?.total || 5;

  const accuracy = Math.round((score / total) * 100);
  const wrong = total - score;

  let xp = 20;
  let badge = "🌱 Quest Beginner";

  if (accuracy >= 90) {
    xp = 100;
    badge = "🏆 Logic Master";
  } else if (accuracy >= 80) {
    xp = 80;
    badge = "🥇 Logic Expert";
  } else if (accuracy >= 70) {
    xp = 60;
    badge = "🥈 Puzzle Solver";
  } else if (accuracy >= 50) {
    xp = 40;
    badge = "🥉 Explorer";
  }

  return (
    <div className="reasoning-result-page">

      <div className="result-card">

        <div className="result-header">

          <h1>🎉 Quest Complete!</h1>

          <p>
            Congratulations! You have completed the Logical Reasoning Quest.
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
            <p>+{xp}</p>
          </div>

          <div className="result-box">
            <h3>🏅 Badge</h3>
            <p>{badge}</p>
          </div>

          <div className="result-box">
            <h3>✅ Correct</h3>
            <p>{score}</p>
          </div>

          <div className="result-box">
            <h3>❌ Wrong</h3>
            <p>{wrong}</p>
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
            🏠 Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReasoningResult;