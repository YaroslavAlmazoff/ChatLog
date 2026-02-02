import QuestionEditor from "./QuestionEditor";
import "./styles/test-editor.css";

function TestEditor({ test, onChange, onClose }) {
  // Создаем безопасный объект теста с дефолтными значениями
  const safeTest = {
    id: Date.now(),
    title: "",
    questions: [],
    ...test,
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...safeTest.questions];
    updatedQuestions[index] = updatedQuestion;

    onChange({
      ...safeTest,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      question: `Вопрос ${safeTest.questions.length + 1}`,
      variants: [],
      rightVariantIds: [],
      rightText: "",
    };

    onChange({
      ...safeTest,
      questions: [...safeTest.questions, newQuestion],
    });
  };

  const deleteQuestion = (questionId) => {
    const updatedQuestions = safeTest.questions.filter(
      (q) => q.id !== questionId,
    );

    // Обновляем порядковые номера
    const renumberedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      number: index + 1,
    }));

    onChange({
      ...safeTest,
      questions: renumberedQuestions,
    });
  };

  return (
    <div className="test-editor">
      <div className="test-editor-header">
        <h3>Редактор теста</h3>
        <button className="test-editor-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="test-questions-list">
        {safeTest.questions.length === 0 ? (
          <div className="no-questions">
            <p>В тесте пока нет вопросов</p>
            <button className="course-editor-add-button" onClick={addQuestion}>
              + Добавить первый вопрос
            </button>
          </div>
        ) : (
          safeTest.questions.map((question, index) => (
            <div key={question.id} className="question-editor-wrapper">
              <div className="question-header">
                <span className="question-number">Вопрос {index + 1}</span>
                <button
                  className="question-delete-btn"
                  onClick={() => deleteQuestion(question.id)}
                  title="Удалить вопрос"
                >
                  ×
                </button>
              </div>

              <QuestionEditor
                question={question}
                onChange={(updated) => updateQuestion(index, updated)}
              />

              {index < safeTest.questions.length - 1 && (
                <hr className="question-divider" />
              )}
            </div>
          ))
        )}
      </div>

      {safeTest.questions.length > 0 && (
        <button className="course-editor-add-button" onClick={addQuestion}>
          + Добавить ещё вопрос
        </button>
      )}

      <div className="test-editor-footer">
        <button className="course-editor-ok" onClick={onClose}>
          Закрыть редактор
        </button>
      </div>
    </div>
  );
}

export default TestEditor;
