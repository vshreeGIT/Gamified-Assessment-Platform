import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";
import "../../styles/RecruiterAssessmentForm.css";

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
  questionIds: [],
};

function makeQuestion(type = "MCQ") {
  const id = window.crypto?.randomUUID?.() || `question-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id,
    type,
    prompt: "",
    options: type === "SHORT_ANSWER" ? [] : ["Option 1", "Option 2"],
    correctAnswers: type === "SHORT_ANSWER" ? [""] : ["Option 1"],
    marks: 1,
  };
}

function RecruiterAssessmentForm() {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const editing = Boolean(assessmentId);
  const [form, setForm] = useState(initialState);
  const [questions, setQuestions] = useState([]);
  const [originalStatus, setOriginalStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);

  useEffect(() => {
    if (!assessmentId) return undefined;
    let active = true;
    recruiterApi.assessment(assessmentId).then((assessment) => {
      if (!active) return;
      setOriginalStatus(assessment.status || "draft");
      setForm({
        ...initialState,
        title: assessment.title || "",
        description: assessment.description || "",
        type: assessment.type || "coding",
        technology: assessment.technology || "JavaScript",
        instructions: assessment.instructions || "",
        durationMinutes: assessment.durationMinutes || 45,
        passingScore: assessment.passingScore ?? 70,
        allowedAttempts: assessment.allowedAttempts || 1,
        status: assessment.status || "draft",
        startDate: assessment.startDate ? assessment.startDate.slice(0, 16) : "",
        deadline: assessment.deadline ? assessment.deadline.slice(0, 16) : "",
        questionIds: assessment.questionIds || [],
      });
      setQuestions((assessment.questions || []).map((question) => ({
        ...question,
        options: question.options || [],
        correctAnswers: question.correctAnswers || [],
      })));
    }).catch((loadError) => {
      if (active) setError(loadError.message || "Unable to load this assessment for editing.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [assessmentId]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "durationMinutes" || name === "passingScore" || name === "allowedAttempts" ? Number(value) : value }));
  };

  const updateQuestion = (questionId, updates) => {
    setQuestions((current) => current.map((question) => question.id === questionId
      ? { ...question, ...updates }
      : question));
  };

  const updateOption = (question, optionIndex, value) => {
    const previous = question.options[optionIndex];
    const options = question.options.map((option, index) => index === optionIndex ? value : option);
    const correctAnswers = question.correctAnswers.map((answer) => answer === previous ? value : answer);
    updateQuestion(question.id, { options, correctAnswers });
  };

  const changeQuestionType = (question, type) => {
    const options = type === "SHORT_ANSWER" ? [] : ["Option 1", "Option 2"];
    updateQuestion(question.id, {
      type,
      options,
      correctAnswers: type === "SHORT_ANSWER" ? [""] : ["Option 1"],
    });
  };

  const validateQuestions = () => {
    for (const [index, question] of questions.entries()) {
      if (!question.prompt.trim()) return `Enter the prompt for question ${index + 1}.`;
      if (!Number.isInteger(Number(question.marks)) || Number(question.marks) < 1) {
        return `Set marks of at least 1 for question ${index + 1}.`;
      }
      if (question.type === "SHORT_ANSWER") {
        if (!question.correctAnswers?.[0]?.trim()) return `Enter an expected answer for question ${index + 1}.`;
        continue;
      }
      const options = question.options.map((option) => option.trim());
      if (options.length < 2 || options.some((option) => !option)
          || new Set(options.map((option) => option.toLowerCase())).size !== options.length) {
        return `Question ${index + 1} needs at least two unique, non-empty options.`;
      }
      const correctAnswers = question.correctAnswers || [];
      if (!correctAnswers.length || (question.type === "MCQ" && correctAnswers.length !== 1)
          || correctAnswers.some((answer) => !options.includes(answer))) {
        return `Choose valid correct answer${question.type === "MULTIPLE_SELECT" ? "s" : ""} for question ${index + 1}.`;
      }
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const questionError = validateQuestions();
    if (questionError) {
      setError(questionError);
      return;
    }
    const isPublishing = form.status === "published";
    const wasAlreadyPublished = editing && originalStatus === "published";
    if (isPublishing && !wasAlreadyPublished && questions.length === 0 && !form.questionIds.length) {
      setError("Add at least one question before publishing this assessment.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        questions,
        instructions: form.instructions || "Follow the selected challenge instructions and submit your best response.",
      };
      const assessment = editing
        ? await recruiterApi.updateAssessment(assessmentId, payload)
        : await recruiterApi.createAssessment(payload);
      navigate(`/recruiter/assessments/${assessment.id}`);
    } catch (submitError) {
      setError(submitError.message || "Unable to create the assessment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <RecruiterLayout headerLabel="EDIT ASSESSMENT" title="Loading assessment…"><div className="rq-empty-state">Loading assessment details…</div></RecruiterLayout>;
  }

  return (
    <RecruiterLayout
      headerLabel={editing ? "EDIT ASSESSMENT" : "CREATE ASSESSMENT"}
      title={editing ? "Edit assessment" : "Build a new assessment"}
      subtitle="Set assessment details and add questions for candidates."
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

          <section className="rq-question-builder" aria-labelledby="question-builder-title">
            <div className="rq-question-builder-heading">
              <div>
                <h2 id="question-builder-title">Questions</h2>
                <p>{questions.length} question{questions.length === 1 ? "" : "s"} · {questions.reduce((sum, question) => sum + (Number(question.marks) || 0), 0)} total marks</p>
              </div>
              <button className="rq-secondary-button" type="button" onClick={() => setQuestions((current) => [...current, makeQuestion()])}>
                ＋ Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="rq-question-empty">No questions added. Drafts can be saved empty, but assessments need at least one question before publishing.</div>
            ) : (
              <div className="rq-question-list">
                {questions.map((question, questionIndex) => (
                  <article className="rq-question-card" key={question.id}>
                    <div className="rq-question-card-heading">
                      <strong>Question {questionIndex + 1}</strong>
                      <button className="rq-small-button danger" type="button" onClick={() => setQuestions((current) => current.filter((item) => item.id !== question.id))}>
                        Remove
                      </button>
                    </div>
                    <div className="rq-question-fields">
                      <label className="rq-question-prompt">
                        Prompt
                        <textarea value={question.prompt} onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })} rows="3" maxLength="2000" required />
                      </label>
                      <label>
                        Question type
                        <select value={question.type} onChange={(event) => changeQuestionType(question, event.target.value)}>
                          <option value="MCQ">Multiple choice · one answer</option>
                          <option value="MULTIPLE_SELECT">Multiple select · several answers</option>
                          <option value="SHORT_ANSWER">Short answer</option>
                        </select>
                      </label>
                      <label>
                        Marks
                        <input type="number" min="1" max="1000" value={question.marks} onChange={(event) => updateQuestion(question.id, { marks: Number(event.target.value) })} required />
                      </label>
                    </div>

                    {question.type === "SHORT_ANSWER" ? (
                      <label className="rq-question-answer">
                        Expected answer
                        <input value={question.correctAnswers?.[0] || ""} onChange={(event) => updateQuestion(question.id, { correctAnswers: [event.target.value] })} maxLength="500" required />
                      </label>
                    ) : (
                      <fieldset className="rq-question-options">
                        <legend>{question.type === "MCQ" ? "Options · select the correct answer" : "Options · select all correct answers"}</legend>
                        {question.options.map((option, optionIndex) => (
                          <div className="rq-question-option" key={`${question.id}-option-${optionIndex}`}>
                            <input
                              type={question.type === "MCQ" ? "radio" : "checkbox"}
                              name={`correct-answer-${question.id}`}
                              aria-label={`Mark option ${optionIndex + 1} as correct`}
                              checked={question.correctAnswers.includes(option) && Boolean(option)}
                              onChange={(event) => {
                                const correctAnswers = question.type === "MCQ"
                                  ? [option]
                                  : event.target.checked
                                    ? [...question.correctAnswers.filter(Boolean), option]
                                    : question.correctAnswers.filter((answer) => answer !== option);
                                updateQuestion(question.id, { correctAnswers });
                              }}
                            />
                            <input
                              aria-label={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(event) => updateOption(question, optionIndex, event.target.value)}
                              maxLength="500"
                              required
                            />
                            <button
                              className="rq-small-button danger"
                              type="button"
                              aria-label={`Remove option ${optionIndex + 1}`}
                              disabled={question.options.length <= 2}
                              onClick={() => {
                                const nextOptions = question.options.filter((_, index) => index !== optionIndex);
                                updateQuestion(question.id, {
                                  options: nextOptions,
                                  correctAnswers: question.correctAnswers.filter((answer) => answer !== option),
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button className="rq-small-button" type="button" onClick={() => updateQuestion(question.id, { options: [...question.options, `Option ${question.options.length + 1}`] })}>
                          ＋ Add option
                        </button>
                      </fieldset>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="rq-form-actions">
            <button className="rq-button" type="submit" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Assessment" : "Create Assessment"}
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
