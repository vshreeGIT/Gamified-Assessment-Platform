import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout, { formatDateTime } from "./RecruiterLayout";

function RecruiterAssessmentDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssessment = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await recruiterApi.assessment(assessmentId);
      setAssessment(data);
    } catch (loadError) {
      setError(loadError.message || "Unable to load assessment details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  const performAction = async (action) => {
    try {
      await recruiterApi.assessmentAction(assessmentId, action);
      await loadAssessment();
    } catch (actionError) {
      setError(actionError.message || "Unable to update the assessment.");
    }
  };

  if (loading) {
    return <RecruiterLayout headerLabel="ASSESSMENT" title="Loading assessment…"><div className="rq-empty-state">Loading assessment details…</div></RecruiterLayout>;
  }

  if (error || !assessment) {
    return (
      <RecruiterLayout headerLabel="ASSESSMENT" title="Assessment details">
        <div className="rq-alert rq-alert-error">{error || "Assessment not found."}</div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout
      headerLabel="ASSESSMENT"
      title={assessment.title}
      subtitle={assessment.type || "Assessment"}
      actions={
        <div className="rq-action-row">
          <button className="rq-button" type="button" onClick={() => performAction("publish")}>Publish</button>
          <button className="rq-secondary-button" type="button" onClick={() => performAction("close")}>Close</button>
          <button className="rq-secondary-button" type="button" onClick={() => performAction("duplicate")}>Duplicate</button>
        </div>
      }
    >
      <section className="rq-panel">
        <div className="rq-section-header">
          <h2>Assessment Overview</h2>
          <span className={`rq-status ${assessment.status || "draft"}`}>{assessment.status || "draft"}</span>
        </div>

        <div className="detail-grid">
          <div>
            <p className="detail-label">Description</p>
            <p>{assessment.description || "No description provided."}</p>
          </div>
          <div>
            <p className="detail-label">Instructions</p>
            <p>{assessment.instructions || "No candidate instructions provided."}</p>
          </div>
          <div>
            <p className="detail-label">Technology</p>
            <p>{assessment.technology || "Not specified"}</p>
          </div>
          <div>
            <p className="detail-label">Duration</p>
            <p>{assessment.durationMinutes || 0} minutes</p>
          </div>
          <div>
            <p className="detail-label">Passing score</p>
            <p>{assessment.passingScore || 0}%</p>
          </div>
          <div>
            <p className="detail-label">Allowed attempts</p>
            <p>{assessment.allowedAttempts || 1}</p>
          </div>
          <div>
            <p className="detail-label">Assigned candidates</p>
            <p>{assessment.assignedCandidates ?? 0}</p>
          </div>
          <div>
            <p className="detail-label">Completed attempts</p>
            <p>{assessment.completedAttempts ?? 0}</p>
          </div>
          <div>
            <p className="detail-label">Created</p>
            <p>{formatDateTime(assessment.createdAt)}</p>
          </div>
          <div>
            <p className="detail-label">Deadline</p>
            <p>{assessment.deadline ? formatDateTime(assessment.deadline) : "No deadline set"}</p>
          </div>
        </div>
      </section>

      <section className="rq-panel">
        <div className="rq-section-header">
          <h2>Quick links</h2>
        </div>
        <div className="rq-action-row">
          <button className="rq-secondary-button" type="button" onClick={() => navigate("/recruiter/assessments")}>Back to list</button>
          <button className="rq-secondary-button" type="button" onClick={() => navigate(`/recruiter/candidates`)}>View candidates</button>
        </div>
      </section>
    </RecruiterLayout>
  );
}

export default RecruiterAssessmentDetail;
