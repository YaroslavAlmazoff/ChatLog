import QuestionEditor from "./QuestionEditor";
import "./styles/test-editor.css";

function TestEditor({ test, onChange, onClose }) {
  const questions = test.questions ?? [];

  const updateQuestions = (updatedQuestions) => {
    onChange({
      ...test,
      questions: updatedQuestions.map((q, i) => ({
        ...q,
        number: i + 1,
      })),
    });
  };

  const addQuestion = () => {
    updateQuestions([
      ...questions,
      {
        number: questions.length + 1,
        question: "",
        variants: [],
        rightValues: [],
        rightText: "",
      },
    ]);
  };

  const updateQuestion = (index, updated) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updated;
    updateQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    updateQuestions(updatedQuestions);
  };

  if (!test) return null;

  return (
    <div className="test-editor">
      <h3>Редактор теста: {test.title}</h3>

      {questions.map((q, index) => (
        <div key={q.number} className="question-wrapper">
          <QuestionEditor
            question={q}
            onChange={(updated) => updateQuestion(index, updated)}
          />

          <button
            className="test-editor-red-button"
            onClick={() => removeQuestion(index)}
          >
            🗑 Удалить вопрос
          </button>
        </div>
      ))}

      <button className="course-editor-add-button" onClick={addQuestion}>
        + Добавить вопрос
      </button>

      <div className="test-editor-footer">
        <button className="course-editor-ok" onClick={onClose}>
          Закрыть редактор
        </button>
      </div>
    </div>
  );
}

export default TestEditor;
