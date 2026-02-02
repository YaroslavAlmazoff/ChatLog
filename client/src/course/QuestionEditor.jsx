function QuestionEditor({ question, onChange }) {
  const safeQuestion = {
    variants: [],
    rightValues: [],
    ...question,
  };
  const addVariant = () => {
    onChange({
      ...safeQuestion,
      variants: [
        ...safeQuestion.variants,
        {
          number: safeQuestion.variants.length + 1,
          title: "",
        },
      ],
    });
  };

  const toggleCorrect = (index) => {
    const exists = safeQuestion.rightValues.includes(index + 1);

    onChange({
      ...safeQuestion,
      rightValues: exists
        ? safeQuestion.rightValues.filter((v) => v !== index + 1)
        : [...safeQuestion.rightValues, index + 1],
    });
  };

  return (
    <div className="question-editor">
      <input
        value={safeQuestion.title}
        onChange={(e) => onChange({ ...safeQuestion, title: e.target.value })}
        placeholder="Текст вопроса"
      />

      {safeQuestion.variants.map((opt) => (
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
                variants: safeQuestion.variants.map((o) =>
                  o.id === opt.id ? { ...o, title: e.target.value } : o,
                ),
              })
            }
          />
        </div>
      ))}

      <button onClick={addVariant}>+ Добавить вариант</button>

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
