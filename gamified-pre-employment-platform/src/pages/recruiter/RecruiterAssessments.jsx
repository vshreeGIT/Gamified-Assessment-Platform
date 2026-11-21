import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, queryString } from "../../services/recruiterService";
import RecruiterLayout, { formatDate } from "./RecruiterLayout";

function RecruiterAssessments() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", technology: "" });

  const loadAssessments = async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const query = queryString({
        search: nextFilters.search,
        status: nextFilters.status,
        technology: nextFilters.technology,
      });
      const data = await recruiterApi.assessments(query);
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    loadAssessments(filters);
  };

  const handleAction = async (assessmentId, action) => {
    try {
      await recruiterApi.assessmentAction(assessmentId, action);
      await loadAssessments();
    } catch (actionError) {
      setError(actionError.message || "Unable to complete the assessment action.");
    }
  };

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Delete this assessment? This action cannot be undone.")) return;

    try {
      await recruiterApi.deleteAssessment(assessmentId);
      await loadAssessments();
    } catch (actionError) {
      setError(actionError.message || "Unable to delete the assessment.");
    }
  };

  return (
    <RecruiterLayout
      headerLabel="ASSESSMENTS"
      title="Assessment Management"
      subtitle="Create, review, publish and monitor all recruitment assessments."
      actions={
        <button className="rq-button" type="button" onClick={() => navigate("/recruiter/assessments/create")}>
          + Create Assessment
        </button>
      }
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      <section className="rq-panel">
        <form className="filter-row" onSubmit={applyFilters}>
          <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search assessments or candidates" />
          <select name="technology" value={filters.technology} onChange={handleFilterChange}>
            <option value="">All technologies</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <button className="rq-button" type="submit">Apply</button>
        </form>
      </section>

      <section className="rq-panel">
        {loading ? (
          <div className="rq-empty-state">Loading assessments…</div>
        ) : items.length === 0 ? (
          <div className="rq-empty-state">No assessments match your filter.</div>
        ) : (
          <div className="rq-table-wrap">
            <table className="rq-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Type</th>
                  <th>Technology</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>Avg. Score</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((assessment) => (
                  <tr key={assessment.id}>
                    <td>
                      <strong>{assessment.title}</strong>
                      <div className="rq-subtext">{assessment.description}</div>
                    </td>
                    <td>{assessment.type}</td>
                    <td>{assessment.technology || "—"}</td>
                    <td>{assessment.assignedCandidates ?? assessment.assigned ?? 0}</td>
                    <td>{assessment.completedAttempts ?? 0}</td>
                    <td>{assessment.averageScore ?? 0}%</td>
                    <td>
                      <span className={`rq-status ${assessment.status || "draft"}`}>{assessment.status || "draft"}</span>
                    </td>
                    <td>{formatDate(assessment.createdAt)}</td>
                    <td>
                      <div className="rq-actions">
                        <button type="button" className="rq-small-button" onClick={() => navigate(`/recruiter/assessments/${assessment.id}`)}>Open</button>
                        <button type="button" className="rq-small-button" onClick={() => handleAction(assessment.id, "publish")}>Publish</button>
                        <button type="button" className="rq-small-button" onClick={() => handleAction(assessment.id, "duplicate")}>Copy</button>
                        <button type="button" className="rq-small-button danger" onClick={() => handleDelete(assessment.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </RecruiterLayout>
  );
}

export default RecruiterAssessments;
