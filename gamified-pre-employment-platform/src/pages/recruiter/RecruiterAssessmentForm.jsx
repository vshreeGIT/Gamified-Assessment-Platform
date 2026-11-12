import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

const initialState = {
  title: "",
  description: "",
  type: "coding",
  technology: "JavaScript",
  instructions: "",
  durationMinutes: 45,
  startDate: "",
  deadline: "",
  passingScore: 70,
  allowedAttempts: 1,
  status: "draft",
};

function RecruiterAssessmentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "durationMinutes" || name === "passingScore" || name === "allowedAttempts" ? Number(value) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        instructions: form.instructions || "Follow the selected challenge instructions and submit your best response.",
      };
      const assessment = await recruiterApi.createAssessment(payload);
      navigate(`/recruiter/assessments/${assessment.id}`);
    } catch (submitError) {
      setError(submitError.message || "Unable to create the assessment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RecruiterLayout
      headerLabel="CREATE ASSESSMENT"
      title="Build a new assessment"
      subtitle="Configure the test details, timing and evaluation criteria for candidates."
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      <section className="rq-panel">
        <form className="rq-form" onSubmit={handleSubmit}>
          <div className="rq-form-grid">
            <label>
              Assessment title
              <input name="title" value={form.title} onChange={updateField} placeholder="Senior Frontend Developer Assessment" required />
            </label>
            <label>
              Assessment type
              <select name="type" value={form.type} onChange={updateField}>
                <option value="coding">Coding Assessment</option>
                <option value="aptitude">Aptitude Assessment</option>
                <option value="skill">Skill Assessment</option>
              </select>
            </label>
            <label>
              Technology
              <select name="technology" value={form.technology} onChange={updateField}>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
                <option value="Java">Java</option>
              </select>
            </label>
            <label>
              Duration (minutes)
              <input type="number" min="15" name="durationMinutes" value={form.durationMinutes} onChange={updateField} required />
            </label>
            <label>
              Passing score (%)
              <input type="number" min="0" max="100" name="passingScore" value={form.passingScore} onChange={updateField} required />
            </label>
            <label>
              Allowed attempts
              <input type="number" min="1" max="5" name="allowedAttempts" value={form.allowedAttempts} onChange={updateField} required />
            </label>
            <label className="wide">
              Description
              <textarea name="description" value={form.description} onChange={updateField} rows="3" placeholder="Describe the role and the skills this assessment evaluates." required />
            </label>
            <label className="wide">
              Instructions
              <textarea name="instructions" value={form.instructions} onChange={updateField} rows="4" placeholder="Provide candidate instructions, submission guidance and any evaluation notes." />
            </label>
            <label>
              Start date
              <input type="datetime-local" name="startDate" value={form.startDate} onChange={updateField} />
            </label>
            <label>
              Deadline
              <input type="datetime-local" name="deadline" value={form.deadline} onChange={updateField} />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={updateField}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </label>
          </div>

          <div className="rq-form-actions">
            <button className="rq-button" type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create Assessment"}
            </button>
            <button className="rq-secondary-button" type="button" onClick={() => navigate("/recruiter/assessments")}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </RecruiterLayout>
  );
}

export default RecruiterAssessmentForm;
