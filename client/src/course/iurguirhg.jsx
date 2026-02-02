import QuestionEditor from "./QuestionEditor";
import "./styles/test-editor.css";

function TestEditor({ test, onChange, onClose }) {
  const updateField = (patch) => {
    onChange({
      ...test,
      ...patch,
    });
  };

  const updateQuestion = (index, updated) => {
    const questions = [...test.questions];
    questions[index] = updated;
    updateField({ questions });
  };

  const addQuestion = () => {
    updateField({
      questions: [
        ...test.questions,
        {
          id: crypto.randomUUID(),
          number: test.questions.length + 1,
          question: "",
          variants: [],
          rightsVariantIds: [],
          rightText: "",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    updateQuestions(updatedQuestions);
  };

  return (
    <div className="test-editor">
      <span className="test-editor-title">Редактор теста</span>
      {/* Название теста */}
      <input
        className="test-editor-title-input"
        value={test.title}
        onChange={(e) => updateField({ title: e.target.value })}
        placeholder="Название теста"
      />

      {/* Вопросы */}
      {test.questions.length === 0 ? (
        <button className="course-editor-add-button" onClick={addQuestion}>
          + Добавить вопрос
        </button>
      ) : (
        test.questions.map((q, i) => (
          <div key={q.number} className="question-wrapper">
            <QuestionEditor
              key={q.id}
              question={q}
              onChange={(updated) => updateQuestion(i, updated)}
            />
            <button
              className="test-editor-red-button"
              onClick={() => removeQuestion(i)}
            >
              🗑 Удалить вопрос
            </button>
          </div>
        ))
      )}

      <div style={{ marginTop: 16 }}>
        <button className="course-editor-ok" onClick={onClose}>
          Закрыть редактор
        </button>
      </div>
    </div>
  );
}

export default TestEditor;
