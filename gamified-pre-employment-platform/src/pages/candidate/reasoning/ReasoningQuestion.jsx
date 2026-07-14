import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReasoningQuestion.css";

function ReasoningQuestion() {
  const navigate = useNavigate();

  const questions = [
    {
      question: "Which number comes next? 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "44"],
      answer: "42",
    },
    {
      question: "If CAT = 24, then DOG = ?",
      options: ["26", "32", "34", "38"],
      answer: "26",
    },
    {
      question: "Find the odd one out.",
      options: ["Circle", "Square", "Triangle", "Apple"],
      answer: "Apple",
    },
    {
      question: "A clock shows 3:00. What is the angle between the hands?",
      options: ["60°", "75°", "90°", "120°"],
      answer: "90°",
    },
    {
      question: "Which word does NOT belong?",
      options: ["Rose", "Lily", "Tulip", "Potato"],
      answer: "Potato",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format Timer
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Save Answer
  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
  };

  // Previous
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Next
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Submit
  const submitQuiz = () => {
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    navigate("/reasoning/result", {
      state: {
        score,
        total: questions.length,
        answers,
      },
    });
  };

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="reasoning-question-page">
      <div className="question-container">

        {/* Header */}

        <div className="question-header">

          <div>
            <h1>🧠 Logical Reasoning Quest</h1>
            <p>Level : Explorer</p>
          </div>

          <div className="timer">
            ⏱ {formatTime()}
          </div>

        </div>

        {/* Progress */}

        <div className="progress-section">

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>

          </div>

          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>

        </div>

        {/* Question */}

        <div className="question-card">

          <h2>{questions[currentQuestion].question}</h2>

          <div className="options">

            {questions[currentQuestion].options.map((option, index) => (

              <label
                key={index}
                className={`option ${
                  answers[currentQuestion] === option
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  checked={
                    answers[currentQuestion] === option
                  }
                  onChange={() => handleAnswer(option)}
                />

                {option}

              </label>

            ))}

          </div>

        </div>

        {/* Navigation */}

        <div className="navigation">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (

            <button
              className="submit-btn"
              onClick={submitQuiz}
            >
              🏁 Submit Quest
            </button>

          ) : (

            <button onClick={nextQuestion}>
              Next →
            </button>

          )}

        </div>

        {/* Question Navigator */}

        <div className="question-navigator">

          <h3>Question Navigator</h3>

          <div className="navigator-grid">

            {questions.map((_, index) => (

              <button
                key={index}
                className={`
                  nav-btn
                  ${currentQuestion === index ? "active" : ""}
                  ${answers[index] ? "answered" : ""}
                `}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ReasoningQuestion;