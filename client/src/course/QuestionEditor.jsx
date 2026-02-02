import { useState } from "react";

function QuestionEditor({ question, onChange }) {
  const [showRightInput, setShowRightInput] = useState(false);
  const [rightValueDraft, setRightValueDraft] = useState("");

  const safeQuestion = {
    variants: [],
    rightValues: [],
    ...question,
  };
  const addVariant = () => {
    onChange({
      ...safeQuestion,
      rightText: "",
      variants: [
        ...safeQuestion.variants,
        {
          number: safeQuestion.variants.length + 1,
          title: "",
        },
      ],
    });
  };

  return (
    <div className="question-editor">
      <input
        className="test-editor-small-input test-editor-small-input-blue"
        value={safeQuestion.question}
        onChange={(e) =>
          onChange({
            ...safeQuestion,
            question: e.target.value,
          })
        }
        placeholder="Текст вопроса"
      />

      {safeQuestion.variants.map((variant, index) => {
        const isCorrect = safeQuestion.rightValues.includes(variant.number);

        return (
          <div key={variant.id} className="variant-row">
            <input
              className="test-editor-small-input test-editor-small-input-white"
              value={variant.title}
              onChange={(e) => {
                const variants = [...safeQuestion.variants];
                variants[index] = {
                  ...variants[index],
                  title: e.target.value,
                };
                onChange({ ...safeQuestion, variants });
              }}
            />

            <button
              type="button"
              className={`correct-btn ${isCorrect ? "active" : ""}`}
              onClick={() => {
                const exists = safeQuestion.rightValues.includes(
                  variant.number,
                );

                onChange({
                  ...safeQuestion,
                  rightValues: exists
                    ? safeQuestion.rightValues.filter(
                        (v) => v !== variant.number,
                      )
                    : [...safeQuestion.rightValues, variant.number],
                });
              }}
            >
              {isCorrect ? "✔ Правильный" : "Сделать правильным"}
            </button>
          </div>
        );
      })}

      <button className="course-editor-add-button" onClick={addVariant}>
        + Добавить вариант
      </button>

      {safeQuestion.variants.length === 0 && (
        <button
          className="course-editor-add-button"
          onClick={() => setShowRightInput(true)}
        >
          + Добавить правильный ответ
        </button>
      )}

      {showRightInput && safeQuestion.variants.length === 0 && (
        <div className="right-text-editor">
          <input
            className="test-editor-small-input test-editor-small-input-blue"
            value={rightValueDraft}
            onChange={(e) => setRightValueDraft(e.target.value)}
            placeholder="Правильный ответ"
          />

          <button
            className="course-editor-ok"
            onClick={() => {
              onChange({
                ...safeQuestion,
                rightText: rightValueDraft,
              });

              setRightValueDraft("");
              setShowRightInput(false);
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionEditor;
