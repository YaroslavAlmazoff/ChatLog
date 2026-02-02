function QuestionEditor({ question, onChange }) {
  const safeQuestion = {
    variants: [],
    rightValues: [],
    ...question,
  };
  const addOption = () => {
    onChange({
      ...safeQuestion,
      options: [
        ...safeQuestion.options,
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
      ...safeQuestion,
      options: safeQuestion.options.map((o) =>
        o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
      ),
    });
  };

  return (
    <div className="question-editor">
      <input
        value={safeQuestion.title}
        onChange={(e) => onChange({ ...safeQuestion, title: e.target.value })}
        placeholder="Текст вопроса"
      />

      {safeQuestion.options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => toggleCorrect(opt.id)}
          className={opt.isCorrect ? "correct" : ""}
        >
          <input
            value={opt.title}
            onChange={(e) =>
              onChange({
                ...safeQuestion,
                options: safeQuestion.options.map((o) =>
                  o.id === opt.id ? { ...o, title: e.target.value } : o,
                ),
              })
            }
          />
        </div>
      ))}

      <button onClick={addOption}>+ Добавить вариант</button>

      <button onClick={() => onChange({ ...safeQuestion, textAnswer: "" })}>
        + Добавить правильный ответ
      </button>

      {safeQuestion.textAnswer !== "" && (
        <input
          value={safeQuestion.textAnswer}
          onChange={(e) =>
            onChange({ ...safeQuestion, textAnswer: e.target.value })
          }
          placeholder="Правильный ответ"
        />
      )}
    </div>
  );
}

export default QuestionEditor;
