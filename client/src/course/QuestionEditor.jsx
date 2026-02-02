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

      {safeQuestion.variants.map((variant, index) => {
        const isCorrect = safeQuestion.rightValues.includes(index + 1);

        return (
          <div
            key={index}
            onClick={() => toggleCorrect(index)}
            className={isCorrect ? "correct" : ""}
          >
            <input
              value={variant.title}
              onChange={(e) => {
                const variants = [...safeQuestion.variants];
                variants[index].title = e.target.value;

                onChange({ ...safeQuestion, variants });
              }}
            />
          </div>
        );
      })}

      <button onClick={addVariant}>+ Добавить вариант</button>

      <button
        onClick={() =>
          onChange({
            ...safeQuestion,
            rightText: safeQuestion.rightText ?? "",
          })
        }
      >
        + Добавить правильный ответ
      </button>

      {safeQuestion.rightText !== "" && (
        <input
          value={safeQuestion.rightText}
          onChange={(e) =>
            onChange({ ...safeQuestion, rightText: e.target.value })
          }
          placeholder="Правильный ответ"
        />
      )}
    </div>
  );
}

export default QuestionEditor;
