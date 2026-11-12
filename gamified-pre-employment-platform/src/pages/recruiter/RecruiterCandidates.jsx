import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, queryString } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

function RecruiterCandidates() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", technology: "" });

  const loadCandidates = async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const data = await recruiterApi.candidates(queryString({
        search: nextFilters.search,
        status: nextFilters.status,
        technology: nextFilters.technology,
      }));
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <RecruiterLayout
      headerLabel="CANDIDATES"
      title="Candidate pipeline"
      subtitle="Monitor shortlist quality, performance and progression across all assessments."
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      <section className="rq-panel">
        <div className="filter-row">
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search candidate or email" />
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In progress</option>
          </select>
          <select value={filters.technology} onChange={(event) => setFilters({ ...filters, technology: event.target.value })}>
            <option value="">All technologies</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
          </select>
          <button className="rq-button" type="button" onClick={() => loadCandidates(filters)}>Apply</button>
        </div>
      </section>

      <section className="rq-panel">
        {loading ? (
          <div className="rq-empty-state">Loading candidates…</div>
        ) : items.length === 0 ? (
          <div className="rq-empty-state">No candidates found.</div>
        ) : (
          <div className="rq-table-wrap">
            <table className="rq-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Assessment</th>
                  <th>Technology</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Decision</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <strong>{candidate.name}</strong>
                      <div className="rq-subtext">{candidate.email}</div>
                    </td>
                    <td>{candidate.assessmentName || candidate.assessmentId || "N/A"}</td>
                    <td>{candidate.technology || "—"}</td>
                    <td>{candidate.score ?? 0}%</td>
                    <td><span className={`rq-status ${candidate.status || "in_progress"}`}>{candidate.status || "in_progress"}</span></td>
                    <td>{candidate.decision || "Pending"}</td>
                    <td>
                      <button type="button" className="rq-small-button" onClick={() => navigate(`/recruiter/candidates/${candidate.id}`)}>Open</button>
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

export default RecruiterCandidates;
