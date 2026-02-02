import QuestionEditor from "./QuestionEditor";
import "./styles/test-editor.css";

function TestEditor({ test, onChange, onClose }) {
  const updateQuestion = (index, updated) => {
    const questions = [...test.questions];
    questions[index] = updated;
    onChange({ ...test, questions });
  };

  const addQuestion = () => {
    onChange({
      ...test,
      questions: [
        ...test.questions,
        {
          number: test.questions.length + 1,
          question: "",
          variants: [],
          rightValues: [],
          rightText: "",
        },
      ],
    });
  };

  return (
    <div className="test-editor">
      <h3>Редактор теста</h3>
      {test.questions.length === 0 ? (
        <button className="course-editor-add-button" onClick={addQuestion}>
          + Добавить вопрос
        </button>
      ) : (
        test.questions.map((q, i) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={(updated) => updateQuestion(i, updated)}
          />
        ))
      )}

      <button className="course-editor-ok" onClick={onClose}>
        Закрыть редактор
      </button>
    </div>
  );
}

export default TestEditor;
