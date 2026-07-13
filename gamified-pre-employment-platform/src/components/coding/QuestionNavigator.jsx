import "../../styles/QuestionNavigator.css";

function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  completedQuestions,
  onSelectQuestion,
}) {
  return (
    <div className="question-nav">
      <div className="nav-header">
        <h3>Questions</h3>
        <p>
          {currentQuestion} / {totalQuestions}
        </p>
      </div>

      <div className="question-list">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const number = index + 1;
          let status = "pending";

          if (completedQuestions.includes(number)) status = "completed";
          else if (number === currentQuestion) status = "current";

          return (
            <button
              key={number}
              className={`question-btn ${status}`}
              onClick={() => onSelectQuestion(number)}
            >
              {completedQuestions.includes(number) ? "✔" : number}
            </button>
          );
        })}
      </div>

      <div className="legend">
        <div>
          <span className="legend-box completed-box"></span>
          Completed
        </div>
        <div>
          <span className="legend-box current-box"></span>
          Current
        </div>
        <div>
          <span className="legend-box pending-box"></span>
          Pending
        </div>
      </div>
    </div>
  );
}

export default QuestionNavigator;
