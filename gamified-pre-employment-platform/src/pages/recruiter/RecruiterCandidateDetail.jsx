import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout, { formatDateTime } from "./RecruiterLayout";

const decisionOptions = [
  { value: "shortlisted", label: "Shortlisted" },
  { value: "review", label: "In review" },
  { value: "rejected", label: "Rejected" },
];

function RecruiterCandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCandidate = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await recruiterApi.candidate(candidateId);
      setCandidate(data);
    } catch (loadError) {
      setError(loadError.message || "Unable to load candidate details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  const updateDecision = async (decision) => {
    setSaving(true);
    try {
      await recruiterApi.decision(candidateId, { decision, notes: candidate?.recruiterNotes || "" });
      await loadCandidate();
    } catch (saveError) {
      setError(saveError.message || "Unable to update decision.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <RecruiterLayout headerLabel="CANDIDATE" title="Loading profile…"><div className="rq-empty-state">Loading candidate profile…</div></RecruiterLayout>;
  }

  if (error || !candidate) {
    return <RecruiterLayout headerLabel="CANDIDATE" title="Candidate profile"><div className="rq-alert rq-alert-error">{error || "Candidate not found."}</div></RecruiterLayout>;
  }

  return (
    <RecruiterLayout
      headerLabel="CANDIDATE PROFILE"
      title={candidate.name}
      subtitle={candidate.headline || "Candidate review"}
      actions={
        <div className="rq-action-row">
          {decisionOptions.map((option) => (
            <button
              key={option.value}
              className={candidate.decision === option.value ? "rq-button" : "rq-secondary-button"}
              type="button"
              onClick={() => updateDecision(option.value)}
              disabled={saving}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      <section className="rq-panel">
        <div className="detail-grid">
          <div>
            <p className="detail-label">Email</p>
            <p>{candidate.email}</p>
          </div>
          <div>
            <p className="detail-label">Assessment</p>
            <p>{candidate.assessmentName || "—"}</p>
          </div>
          <div>
            <p className="detail-label">Current score</p>
            <p>{candidate.score ?? 0}%</p>
          </div>
          <div>
            <p className="detail-label">Status</p>
            <p>{candidate.status || "in_progress"}</p>
          </div>
          <div>
            <p className="detail-label">Completed</p>
            <p>{candidate.completedAt ? formatDateTime(candidate.completedAt) : "In progress"}</p>
          </div>
          <div>
            <p className="detail-label">Decision</p>
            <p>{candidate.decision || "Pending"}</p>
          </div>
        </div>
      </section>

      <section className="rq-panel">
        <div className="rq-section-header">
          <h2>Assessment history</h2>
        </div>
        {candidate.assessments && candidate.assessments.length > 0 ? (
          <div className="rq-table-wrap">
            <table className="rq-table">
              <thead>
                <tr>
                  <th>Assessment name</th>
                  <th>Completed</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {candidate.assessments.map((attempt) => (
                  <tr key={attempt.id || attempt.attemptId}>
                    <td>{attempt.assessmentName}</td>
                    <td>{attempt.completedAt ? formatDateTime(attempt.completedAt) : "—"}</td>
                    <td>{Math.round((attempt.durationSeconds || 0) / 60)} min</td>
                    <td>{attempt.score ?? 0}%</td>
                    <td>{attempt.outcome || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rq-empty-state">No assessment history yet.</div>
        )}
      </section>

      <section className="rq-panel">
        <div className="rq-section-header">
          <h2>Skills</h2>
        </div>
        <div className="chip-list">
          {(candidate.skillBreakdown || []).map((skill) => (
            <span key={`${skill.language}-${skill.concept}`} className="rq-chip">
              {skill.language} · {skill.concept} · {skill.score}%
            </span>
          ))}
        </div>
      </section>

      <div className="rq-form-actions">
        <button className="rq-secondary-button" type="button" onClick={() => navigate("/recruiter/candidates")}>Back to candidates</button>
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterCandidateDetail;
