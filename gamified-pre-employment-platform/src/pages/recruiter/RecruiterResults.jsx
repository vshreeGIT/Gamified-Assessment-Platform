import { useEffect, useState } from "react";
import { recruiterApi, queryString } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

function RecruiterResults() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", technology: "" });

  const loadResults = async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const data = await recruiterApi.results(queryString({
        search: nextFilters.search,
        status: nextFilters.status,
        technology: nextFilters.technology,
      }));
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <RecruiterLayout
      headerLabel="RESULTS"
      title="Candidate results and rankings"
      subtitle="Compare completion outcomes, rank positions and shortlist recommendations."
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      <section className="rq-panel">
        <div className="filter-row">
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search candidate or assessment" />
          <select value={filters.technology} onChange={(event) => setFilters({ ...filters, technology: event.target.value })}>
            <option value="">All technologies</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All status</option>
            <option value="completed">Completed</option>
          </select>
          <button type="button" className="rq-button" onClick={() => loadResults(filters)}>Apply</button>
        </div>
      </section>

      <section className="rq-panel">
        {loading ? (
          <div className="rq-empty-state">Loading results…</div>
        ) : items.length === 0 ? (
          <div className="rq-empty-state">No results available.</div>
        ) : (
          <div className="rq-table-wrap">
            <table className="rq-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Assessment</th>
                  <th>Technology</th>
                  <th>Score</th>
                  <th>Decision</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((result) => (
                  <tr key={result.id || result.attemptId}>
                    <td>{result.rank || "—"}</td>
                    <td>{result.candidateName}</td>
                    <td>{result.assessmentName}</td>
                    <td>{result.technology || "—"}</td>
                    <td>{result.score ?? result.percentage ?? 0}%</td>
                    <td>{result.decision || "Pending"}</td>
                    <td><span className={`rq-status ${result.status || "completed"}`}>{result.status || "completed"}</span></td>
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

export default RecruiterResults;
