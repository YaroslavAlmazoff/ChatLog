import { useState } from "react";

function QuestionEditor({ question, onChange }) {
  const [showRightInput, setShowRightInput] = useState(false);
  const [rightValueDraft, setRightValueDraft] = useState("");
  const [hint, setHint] = useState("");
  const [showHintInput, setShowHintInput] = useState(false);

  const variants = question.variants ?? [];
  const rightsVariantIds = question.rightsVariantIds ?? [];

  const updateQuestionField = (patch) => {
    onChange({
      ...question,
      ...patch,
    });
  };

  /* ---------- add variant ---------- */

  const addVariant = () => {
    updateQuestionField({
      rightText: "",
      variants: [
        ...variants,
        {
          id: crypto.randomUUID(),
          number: variants.length + 1,
          title: "",
        },
      ],
    });
  };

  /* ---------- delete variant ---------- */

  const deleteVariant = (variantId) => {
    const updatedVariants = variants
      .filter((v) => v.id !== variantId)
      .map((v, index) => ({
        ...v,
        number: index + 1,
      }));

    updateQuestionField({
      variants: updatedVariants,
      rightsVariantIds: rightsVariantIds.filter((id) => id !== variantId),
    });
  };

  /* ---------- toggle correct ---------- */

  const toggleCorrect = (variantId) => {
    const isCorrect = rightsVariantIds.includes(variantId);

    updateQuestionField({
      rightsVariantIds: isCorrect
        ? rightsVariantIds.filter((id) => id !== variantId)
        : [...rightsVariantIds, variantId],
    });
  };

  /* ---------- update title ---------- */

  const updateVariantTitle = (index, title) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], title };
    updateQuestionField({ variants: updated });
  };

  return (
    <div className="question-editor">
      {/* Текст вопроса */}
      <input
        style={{ minWidth: "75%" }}
        className="test-editor-small-input test-editor-small-input-blue"
        value={question.question}
        onChange={(e) => updateQuestionField({ question: e.target.value })}
        placeholder="Текст вопроса"
      />

      {/* Варианты ответа */}
      {variants.map((variant, index) => {
        const isCorrect = rightsVariantIds.includes(variant.id);

        return (
          <div key={variant.id} className="variant-row">
            <input
              className="test-editor-small-input test-editor-small-input-white"
              value={variant.title}
              onChange={(e) => updateVariantTitle(index, e.target.value)}
            />

            <button
              type="button"
              className="test-editor-dark-button"
              onClick={() => toggleCorrect(variant.id)}
            >
              {isCorrect ? "✔ Правильный" : "Сделать правильным"}
            </button>

            {/* ❌ удалить вариант */}
            <button
              type="button"
              className="variant-delete-button"
              onClick={() => deleteVariant(variant.id)}
              title="Удалить вариант"
            >
              ✖
            </button>
          </div>
        );
      })}

      {/* Добавить вариант */}
      <button className="course-editor-add-button" onClick={addVariant}>
        + Добавить вариант
      </button>

      {/* Текстовый ответ */}
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

      <button
        className="course-editor-add-button"
        onClick={() => setShowHintInput(true)}
      >
        + Добавить тайм-код
      </button>
      {showHintInput && (
        <div className="right-text-editor">
          <input
            className="test-editor-small-input test-editor-small-input-blue"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Тайм-код подсказка"
          />

          <button
            className="course-editor-ok"
            onClick={() => {
              updateQuestionField({ timeCode: hint });
              setShowHintInput(false);
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
