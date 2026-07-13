import { useNavigate, useParams } from "react-router-dom";
import difficultyLevels from "../../../data/difficultyLevels";
import "../../../styles/CodingDifficulty.css";

function CodingDifficulty() {
  const navigate = useNavigate();
  const { language, concept } = useParams();
  const conceptTitle = concept?.replace(/-/g, " ") || "";

  return (
    <div className="difficulty-page">
      <div className="difficulty-header">
        <button onClick={() => navigate(`/coding/${language}`)}>← Back</button>
        <h1>{conceptTitle}</h1>
        <p>Select Difficulty Level</p>
      </div>

      <div className="difficulty-grid">
        {difficultyLevels.map((level) => (
          <div
            key={level.id}
            className="difficulty-card"
            onClick={() =>
              navigate(`/coding/${language}/${concept}/${level.name.toLowerCase()}`)
            }
          >
            <div className="difficulty-icon" style={{ color: level.color }}>
              {level.icon}
            </div>

            <h2>{level.name}</h2>
            <p>{level.description}</p>

            <div className="difficulty-details">
              <span>📄 {level.questions} Questions</span>
              <span>⏱ {level.time}</span>
              <span>⚡ {level.xp} XP</span>
            </div>

            <button>Start Challenge →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodingDifficulty;
