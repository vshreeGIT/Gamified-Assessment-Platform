import { useCallback, useEffect, useState } from "react";
import RecruiterLayout from "./RecruiterLayout";
import { recruiterApi } from "../../services/recruiterService";
import "../../styles/RecruiterJobs.css";
import "../../styles/RecruiterJobs.css";

const emptyForm = () => ({
  title: "",
  company: "",
  companyLogo: "",
  logoColor: "blue",
  description: "",
  location: "",
  workMode: "Remote",
  employmentType: "Full Time",
  salary: "",
  experienceLevel: "",
  minimumExperienceYears: 0,
  requiredSkills: [],
  preferredSkillsText: "",
  skillWeights: {},
});

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [publishedAssessments, setPublishedAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [editingJobId, setEditingJobId] = useState(null);
  const [skillDraft, setSkillDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setJobs(await recruiterApi.jobs());
    } catch (requestError) {
      setError(requestError.message || "Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  function setField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "minimumExperienceYears" ? Number(value) : value,
    }));
  }

  function beginCreate() {
    setEditingJobId(null);
    setForm(emptyForm());
    setSkillDraft("");
    setError("");
    setNotice("");
  }

  function beginEdit(job) {
    setEditingJobId(job.id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      companyLogo: job.companyLogo || "",
      logoColor: job.logoColor || "blue",
      description: job.description || "",
      location: job.location || "",
      workMode: job.workMode || "Remote",
      employmentType: job.employmentType || "Full Time",
      salary: job.salary || "",
      experienceLevel: job.experienceLevel || "",
      minimumExperienceYears: job.minimumExperienceYears || 0,
      requiredSkills: job.requiredSkills || [],
      preferredSkillsText: (job.preferredSkills || []).join(", "),
      skillWeights: job.skillWeights || {},
    });
    setSkillDraft("");
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addRequiredSkill() {
    const skill = skillDraft.trim();
    if (!skill || form.requiredSkills.some((item) => item.toLowerCase() === skill.toLowerCase())) return;
    setForm((current) => ({
      ...current,
      requiredSkills: [...current.requiredSkills, skill],
      skillWeights: { ...current.skillWeights, [skill]: 1 },
    }));
    setSkillDraft("");
  }

  function removeRequiredSkill(skill) {
    setForm((current) => {
      const weights = { ...current.skillWeights };
      delete weights[skill];
      return { ...current, requiredSkills: current.requiredSkills.filter((item) => item !== skill), skillWeights: weights };
    });
  }

  function updateWeight(skill, value) {
    setForm((current) => ({
      ...current,
      skillWeights: { ...current.skillWeights, [skill]: Math.max(1, Number(value) || 1) },
    }));
  }

  async function saveJob(event) {
    event.preventDefault();
    if (!form.requiredSkills.length) {
      setError("Add at least one required skill before saving a job.");
      return;
    }
    const payload = {
      ...form,
      preferredSkills: form.preferredSkillsText.split(",").map((skill) => skill.trim()).filter(Boolean),
      skillWeights: Object.fromEntries(form.requiredSkills.map((skill) => [skill, Number(form.skillWeights[skill]) || 1])),
    };
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (editingJobId) await recruiterApi.updateJob(editingJobId, payload);
      else await recruiterApi.createJob(payload);
      const savedNotice = editingJobId ? "Job updated." : "Draft job created. Publish it when ready.";
      beginCreate();
      setNotice(savedNotice);
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message || "Unable to save this job.");
    } finally {
      setSaving(false);
    }
  }

  async function changeJobStatus(job) {
    const action = job.status === "PUBLISHED" ? "close" : "publish";
    setError("");
    setNotice("");
    try {
      await recruiterApi.jobAction(job.id, action);
      setNotice(action === "publish" ? "Job published to candidates." : "Job closed to new applications.");
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message || "Unable to update job status.");
    }
  }

  async function viewApplications(job) {
    setSelectedJob(job);
    setApplications([]);
    setSelectedAssessments({});
    setError("");
    try {
      const [items, assessmentResponse] = await Promise.all([
        recruiterApi.jobApplications(job.id),
        recruiterApi.assessments("?status=published"),
      ]);
      setApplications(items || []);
      setPublishedAssessments(assessmentResponse?.items || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load job applications.");
    }
  }

  async function setApplicationStatus(application, status) {
    if (!selectedJob) return;
    try {
      const updated = await recruiterApi.updateJobApplication(selectedJob.id, application.id, { status });
      setApplications((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`Application moved to ${status.replaceAll("_", " ").toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update the application status.");
    }
  }

  async function assignAssessment(application) {
    const assessmentId = selectedAssessments[application.id];
    if (!assessmentId) return;
    try {
      await recruiterApi.assignCandidate(assessmentId, { email: application.candidateEmail });
      setNotice(`Assessment assigned to ${application.candidateName}.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to assign this assessment.");
    }
  }

  return (
    <RecruiterLayout
      headerLabel="RECRUITER JOBS"
      title="Job management"
      subtitle="Create published opportunities and review candidate applications."
      actions={<button className="rq-button" type="button" onClick={beginCreate}>＋ New Job</button>}
    >
      {error && <div className="rq-alert rq-alert-error" role="alert">{error}</div>}
      {notice && <div className="rq-alert rq-alert-success" role="status">{notice}</div>}

      <section className="rq-panel">
        <div className="rq-section-header"><h2>{editingJobId ? "Edit job" : "Create a job"}</h2></div>
        <form className="rq-form" onSubmit={saveJob}>
          <div className="rq-form-grid recruiter-job-form-grid">
            <label>Job title<input name="title" value={form.title} onChange={setField} required maxLength="160" /></label>
            <label>Company<input name="company" value={form.company} onChange={setField} required maxLength="160" /></label>
            <label>Location<input name="location" value={form.location} onChange={setField} required maxLength="160" /></label>
            <label>Work mode<select name="workMode" value={form.workMode} onChange={setField}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
            <label>Employment type<select name="employmentType" value={form.employmentType} onChange={setField}><option>Full Time</option><option>Part Time</option><option>Internship</option><option>Contract</option></select></label>
            <label>Salary / compensation<input name="salary" value={form.salary} onChange={setField} maxLength="80" /></label>
            <label>Experience requirement<input name="experienceLevel" value={form.experienceLevel} onChange={setField} placeholder="e.g. 1–3 years" maxLength="100" /></label>
            <label>Minimum experience (years)<input type="number" min="0" max="50" name="minimumExperienceYears" value={form.minimumExperienceYears} onChange={setField} /></label>
            <label className="wide">Job description<textarea name="description" value={form.description} onChange={setField} required rows="4" maxLength="10000" /></label>
            <label className="wide">Preferred skills<input value={form.preferredSkillsText} onChange={(event) => setForm((current) => ({ ...current, preferredSkillsText: event.target.value }))} placeholder="Git, Docker, TypeScript" /></label>
          </div>

          <div className="recruiter-job-skill-editor">
            <div className="rq-section-header"><div><h2>Required skills and importance</h2><p className="rq-subtext">Candidates are scored using verified results. Unrated skills contribute zero.</p></div></div>
            <div className="recruiter-job-add-skill">
              <input aria-label="Required skill" value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} placeholder="Add required skill" maxLength="80" />
              <button className="rq-secondary-button" type="button" onClick={addRequiredSkill}>Add skill</button>
            </div>
            {form.requiredSkills.map((skill) => (
              <div className="recruiter-job-skill-row" key={skill}>
                <strong>{skill}</strong>
                <label>Importance weight<input aria-label={`${skill} importance weight`} type="number" min="1" max="1000" value={form.skillWeights[skill] || 1} onChange={(event) => updateWeight(skill, event.target.value)} /></label>
                <button className="rq-small-button danger" type="button" onClick={() => removeRequiredSkill(skill)}>Remove</button>
              </div>
            ))}
            {form.requiredSkills.length === 0 && <p className="rq-empty-state">Add at least one required skill to enable a meaningful match score.</p>}
          </div>

          <div className="rq-form-actions">
            <button className="rq-button" type="submit" disabled={saving}>{saving ? "Saving…" : editingJobId ? "Save job" : "Save draft job"}</button>
            <button className="rq-secondary-button" type="button" onClick={beginCreate}>Clear form</button>
          </div>
        </form>
      </section>

      <section className="rq-panel">
        <div className="rq-section-header"><h2>Your jobs</h2><button className="rq-small-button" type="button" onClick={loadJobs}>Refresh</button></div>
        {loading ? <div className="rq-empty-state">Loading jobs…</div> : jobs.length === 0 ? <div className="rq-empty-state">No jobs yet. Save a draft above to get started.</div> : (
          <div className="rq-table-wrap"><table className="rq-table recruiter-jobs-table">
            <thead><tr><th>Job</th><th>Status</th><th>Required skills</th><th>Applicants</th><th>Actions</th></tr></thead>
            <tbody>{jobs.map((job) => <tr key={job.id}>
              <td><strong>{job.title}</strong><div className="rq-subtext">{job.location} · {job.workMode}</div></td>
              <td><span className={`rq-status ${job.status?.toLowerCase()}`}>{job.status}</span></td>
              <td>{(job.requiredSkills || []).join(", ")}</td>
              <td>{job.applicationCount ?? 0}</td>
              <td><div className="rq-actions recruiter-job-actions">
                <button className="rq-small-button" type="button" onClick={() => beginEdit(job)}>Edit</button>
                <button className="rq-small-button" type="button" onClick={() => changeJobStatus(job)}>{job.status === "PUBLISHED" ? "Close" : "Publish"}</button>
                <button className="rq-small-button" type="button" onClick={() => viewApplications(job)}>Applicants</button>
              </div></td>
            </tr>)}</tbody>
          </table></div>
        )}
      </section>

      {selectedJob && (
        <section className="rq-panel recruiter-applications-panel">
          <div className="rq-section-header"><div><p className="dashboard-label">{selectedJob.title}</p><h2>Applications ({applications.length})</h2></div><button className="rq-secondary-button" type="button" onClick={() => setSelectedJob(null)}>Close</button></div>
          {applications.length === 0 ? <div className="rq-empty-state">No applications for this job yet.</div> : (
            <div className="recruiter-applicant-list">
              {applications.map((application) => (
                <article className="recruiter-applicant-card" key={application.id}>
                  <header><div><h3>{application.candidateName}</h3><p>{application.candidateEmail} · Level {application.candidateLevel} · {application.candidateXp} XP</p></div><span className={`rq-status ${application.status.toLowerCase()}`}>{application.status.replaceAll("_", " ")}</span></header>
                  <div className="recruiter-applicant-match"><strong>{application.matchScore}% weighted match</strong><span>{application.matchExplanation}</span></div>
                  <div className="recruiter-applicant-skills"><b>Declared skills:</b> {application.candidateSkills.length ? application.candidateSkills.join(", ") : "None provided"}</div>
                  {application.skillBreakdown.length > 0 && <div className="recruiter-applicant-skills"><b>Verified required skills:</b> {application.skillBreakdown.map((skill) => `${skill.skill}: ${skill.candidateScore === null ? "Unrated" : `${skill.candidateScore}%`} (weight ${skill.weight})`).join(" · ")}</div>}
                  <details className="recruiter-applicant-history"><summary>Challenge history ({application.challengeHistory.length})</summary>
                    {application.challengeHistory.length ? application.challengeHistory.map((attempt, index) => <p key={`${attempt.module}-${attempt.completedAt}-${index}`}>{attempt.module} · {attempt.evaluated ? `${attempt.score}%${attempt.passed ? " · Passed" : ""}` : "Submitted · not evaluated"} · {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : "Date unavailable"}</p>) : <p>No saved challenge activity.</p>}
                  </details>
                  <details className="recruiter-applicant-history"><summary>Assessment results ({application.assessmentResults.length})</summary>
                    {application.assessmentResults.length ? application.assessmentResults.map((result, index) => <p key={`${result.assessmentName}-${index}`}>{result.assessmentName} · {result.technology} · {result.score ?? "—"}% · {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : "Date unavailable"}</p>) : <p>No assessment results from this recruiter yet.</p>}
                  </details>
                  <footer className="recruiter-applicant-actions">
                    <label>Assign assessment<select value={selectedAssessments[application.id] || ""} onChange={(event) => setSelectedAssessments((current) => ({ ...current, [application.id]: event.target.value }))}><option value="">Choose published assessment</option>{publishedAssessments.map((assessment) => <option key={assessment.id} value={assessment.id}>{assessment.title}</option>)}</select></label>
                    <button className="rq-secondary-button" type="button" disabled={!selectedAssessments[application.id]} onClick={() => assignAssessment(application)}>Assign</button>
                    <label>Application status<select value={application.status} onChange={(event) => setApplicationStatus(application, event.target.value)}><option value="APPLIED">Applied</option><option value="IN_REVIEW">In Review</option><option value="SHORTLISTED">Shortlisted</option><option value="REJECTED">Rejected</option></select></label>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </RecruiterLayout>
  );
}

export default RecruiterJobs;