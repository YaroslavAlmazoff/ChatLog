function TestEditor({ test, onChange, onClose, showTitleEdit }) {
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
          id: crypto.randomUUID(),
          title: "",
          options: [],
          textAnswer: "",
        },
      ],
    });
  };

  return (
    <div className="test-editor">
      <h3>Редактор теста</h3>

      {showTitleEdit && (
        <input
          value={test.title}
          onChange={(e) => onChange({ ...test, title: e.target.value })}
          placeholder="Название теста"
        />
      )}

      {test.questions.length === 0 ? (
        <button onClick={addQuestion}>+ Добавить вопрос</button>
      ) : (
        test.questions.map((q, i) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={(updated) => updateQuestion(i, updated)}
          />
        ))
      )}

      <button onClick={onClose}>Закрыть редактор</button>
    </div>
  );
}

export default TestEditor;
