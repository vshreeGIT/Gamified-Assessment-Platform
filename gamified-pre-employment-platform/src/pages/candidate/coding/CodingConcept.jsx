import { useNavigate, useParams } from "react-router-dom";
import codingConcepts from "../../../data/codingConcepts";
import "../../../styles/CodingConcept.css";

function CodingConcept() {
  const { language } = useParams();
  const navigate = useNavigate();
  const concepts = codingConcepts[language] || [];

  return (
    <div className="concept-page">
      <div className="concept-header">
        <button className="back-btn" onClick={() => navigate("/coding")}>
          ← Back
        </button>

        <h1>{language?.toUpperCase()}</h1>
        <p>Choose a concept to begin your challenge.</p>
      </div>

      <div className="concept-grid">
        {concepts.map((concept) => (
          <div
            className="concept-card"
            key={concept}
            onClick={() =>
              navigate(
                `/coding/${language}/${concept.toLowerCase().replace(/\s+/g, "-")}`
              )
            }
          >
            <div className="concept-icon">📘</div>
            <h2>{concept}</h2>
            <p>20 Coding Problems</p>
            <span>Start →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodingConcept;
