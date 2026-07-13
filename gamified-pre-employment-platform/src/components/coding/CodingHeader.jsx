import { useNavigate } from "react-router-dom";
import "../../styles/CodingHeader.css";

function CodingHeader({ language, concept, difficulty, timer, xp, level }) {
  const navigate = useNavigate();

  return (
    <header className="challenge-header">
      <div className="header-left">
        <button className="challenge-back-btn" onClick={() => navigate("/coding")}>
          ← Dashboard
        </button>

        <div className="challenge-info">
          <h2>{language.toUpperCase()}</h2>
          <span>{concept}</span>
          <span className="difficulty-tag">{difficulty}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-card">
          <small>Timer</small>
          <h3>{timer}</h3>
        </div>

        <div className="header-card">
          <small>XP</small>
          <h3>⚡ {xp}</h3>
        </div>

        <div className="header-card">
          <small>Level</small>
          <h3>{level}</h3>
        </div>
      </div>
    </header>
  );
}

export default CodingHeader;
