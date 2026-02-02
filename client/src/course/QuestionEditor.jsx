import { useState } from "react";

function QuestionEditor({ question, onChange }) {
  const [showRightInput, setShowRightInput] = useState(false);
  const [rightValueDraft, setRightValueDraft] = useState("");

  const variants = question.variants ?? [];
  const rightValues = question.rightValues ?? [];

  const updateQuestionField = (patch) => {
    onChange({
      ...question,
      ...patch,
    });
  };

  const addVariant = () => {
    updateQuestionField({
      rightText: "",
      variants: [
        ...variants,
        {
          number: variants.length + 1,
          title: "",
        },
      ],
    });
  };

  const toggleCorrect = (variantNumber) => {
    const isCorrect = rightValues.includes(variantNumber);

    updateQuestionField({
      rightValues: isCorrect
        ? rightValues.filter((v) => v !== variantNumber)
        : [...rightValues, variantNumber],
    });
  };

  const updateVariantTitle = (index, title) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], title };
    updateQuestionField({ variants: updated });
  };

  return (
    <div className="question-editor">
      {/* Текст вопроса */}
      <input
        className="test-editor-small-input test-editor-small-input-blue"
        value={question.question}
        onChange={(e) => updateQuestionField({ question: e.target.value })}
        placeholder="Текст вопроса"
      />

      {/* Варианты ответа */}
      {variants.map((variant, index) => {
        const isCorrect = rightValues.includes(variant.number);

        return (
          <div key={variant.number} className="variant-row">
            <input
              className="test-editor-small-input test-editor-small-input-white"
              value={variant.title}
              onChange={(e) => updateVariantTitle(index, e.target.value)}
            />

            <button
              type="button"
              className="test-editor-dark-button"
              onClick={() => toggleCorrect(variant.number)}
            >
              {isCorrect ? "✔ Правильный" : "Сделать правильным"}
            </button>
          </div>
        );
      })}

      {/* Добавить вариант */}
      <button className="course-editor-add-button" onClick={addVariant}>
        + Добавить вариант
      </button>

      {/* Текстовый ответ (если нет вариантов) */}
      {variants.length === 0 && !showRightInput && (
        <button
          className="course-editor-add-button"
          onClick={() => setShowRightInput(true)}
        >
          + Добавить правильный ответ
        </button>
      )}

      {showRightInput && variants.length === 0 && (
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
              updateQuestionField({ rightText: rightValueDraft });
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
