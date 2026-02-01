function QuestionEditor({ question, onChange }) {
  const addOption = () => {
    onChange({
      ...question,
      options: [
        ...question.options,
        {
          id: crypto.randomUUID(),
          title: "",
          isCorrect: false,
        },
      ],
    });
  };

  const toggleCorrect = (id) => {
    onChange({
      ...question,
      options: question.options.map((o) =>
        o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
      ),
    });
  };

  return (
    <div className="question-editor">
      <input
        value={question.title}
        onChange={(e) => onChange({ ...question, title: e.target.value })}
        placeholder="Текст вопроса"
      />

      {question.options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => toggleCorrect(opt.id)}
          className={opt.isCorrect ? "correct" : ""}
        >
          <input
            value={opt.title}
            onChange={(e) =>
              onChange({
                ...question,
                options: question.options.map((o) =>
                  o.id === opt.id ? { ...o, title: e.target.value } : o,
                ),
              })
            }
          />
        </div>
      ))}

      <button onClick={addOption}>+ Добавить вариант</button>

      <button onClick={() => onChange({ ...question, textAnswer: "" })}>
        + Добавить правильный ответ
      </button>

      {question.textAnswer !== "" && (
        <input
          value={question.textAnswer}
          onChange={(e) =>
            onChange({ ...question, textAnswer: e.target.value })
          }
          placeholder="Правильный ответ"
        />
      )}
    </div>
  );
}

export default QuestionEditor;
