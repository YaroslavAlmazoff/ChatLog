import { useState, useEffect } from "react";

function QuestionEditor({ question, onChange }) {
  const [showRightInput, setShowRightInput] = useState(false);

  // Инициализируем safeQuestion с правильными значениями по умолчанию
  const safeQuestion = {
    id: Date.now(),
    question: "",
    variants: [],
    rightVariantIds: [],
    rightText: "",
    ...question,
  };

  // Синхронизируем rightValueDraft с rightText вопроса
  const [rightValueDraft, setRightValueDraft] = useState(
    safeQuestion.rightText,
  );

  // Обновляем драфт при изменении вопроса
  useEffect(() => {
    setRightValueDraft(safeQuestion.rightText);
  }, [safeQuestion.rightText]);

  const toggleCorrect = (variantId) => {
    onChange({
      ...safeQuestion,
      rightVariantIds: safeQuestion.rightVariantIds.includes(variantId)
        ? safeQuestion.rightVariantIds.filter((id) => id !== variantId)
        : [...safeQuestion.rightVariantIds, variantId],
      rightText: "", // Очищаем текстовый ответ при выборе варианта
    });
  };

  const addVariant = () => {
    const newVariant = {
      id: Date.now() + Math.random(), // Уникальный ID
      number: safeQuestion.variants.length + 1,
      title: "",
    };

    onChange({
      ...safeQuestion,
      variants: [...safeQuestion.variants, newVariant],
      rightText: "", // Очищаем текстовый ответ при добавлении варианта
    });
  };

  const deleteVariant = (variantId) => {
    const updatedVariants = safeQuestion.variants.filter(
      (v) => v.id !== variantId,
    );
    const updatedRightVariantIds = safeQuestion.rightVariantIds.filter(
      (id) => id !== variantId,
    );

    // Обновляем номера
    const renumberedVariants = updatedVariants.map((v, index) => ({
      ...v,
      number: index + 1,
    }));

    onChange({
      ...safeQuestion,
      variants: renumberedVariants,
      rightVariantIds: updatedRightVariantIds,
    });
  };

  const updateVariant = (variantId, newTitle) => {
    onChange({
      ...safeQuestion,
      variants: safeQuestion.variants.map((v) =>
        v.id === variantId ? { ...v, title: newTitle } : v,
      ),
    });
  };

  const saveRightText = () => {
    onChange({
      ...safeQuestion,
      rightText: rightValueDraft,
      rightVariantIds: [], // Очищаем выбор вариантов при текстовом ответе
    });
    setShowRightInput(false);
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

      {/* Отображение вариантов ответа */}
      {safeQuestion.variants.length > 0 && (
        <div className="variants-list">
          {safeQuestion.variants.map((v) => (
            <div key={v.id} className="variant-row">
              <span className="variant-number">{v.number}.</span>
              <input
                className="variant-input"
                value={v.title}
                onChange={(e) => updateVariant(v.id, e.target.value)}
                placeholder={`Вариант ${v.number}`}
              />

              <button
                className={`variant-toggle-btn ${
                  safeQuestion.rightVariantIds.includes(v.id) ? "correct" : ""
                }`}
                onClick={() => toggleCorrect(v.id)}
              >
                {safeQuestion.rightVariantIds.includes(v.id)
                  ? "✓ Правильный"
                  : "Сделать правильным"}
              </button>

              <button
                className="variant-delete-btn"
                onClick={() => deleteVariant(v.id)}
                title="Удалить вариант"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Кнопки для управления вариантами */}
      <div className="question-controls">
        <button className="course-editor-add-button" onClick={addVariant}>
          + Добавить вариант ответа
        </button>

        {safeQuestion.variants.length === 0 && (
          <button
            className="course-editor-add-button"
            onClick={() => setShowRightInput(true)}
          >
            + Текстовый ответ
          </button>
        )}
      </div>

      {/* Поле для текстового ответа (только если нет вариантов) */}
      {showRightInput && safeQuestion.variants.length === 0 && (
        <div className="right-text-editor">
          <input
            className="test-editor-small-input test-editor-small-input-blue"
            value={rightValueDraft}
            onChange={(e) => setRightValueDraft(e.target.value)}
            placeholder="Введите правильный ответ"
            onKeyDown={(e) => e.key === "Enter" && saveRightText()}
          />

          <div className="right-text-controls">
            <button className="course-editor-ok" onClick={saveRightText}>
              Сохранить
            </button>

            <button
              className="course-editor-cancel"
              onClick={() => {
                setRightValueDraft(safeQuestion.rightText);
                setShowRightInput(false);
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Отображение сохраненного текстового ответа */}
      {!showRightInput &&
        safeQuestion.rightText &&
        safeQuestion.variants.length === 0 && (
          <div className="right-text-display">
            <span>Правильный ответ: {safeQuestion.rightText}</span>
            <button
              className="edit-text-btn"
              onClick={() => setShowRightInput(true)}
            >
              Изменить
            </button>
          </div>
        )}
    </div>
  );
}

export default QuestionEditor;
