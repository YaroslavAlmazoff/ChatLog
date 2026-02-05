import { useState } from "react";
import "../styles/test-runner.css";

const TestRunner = ({ test }) => {
  const [answers, setAnswers] = useState({});

  if (!test) return null;

  const handleRadioChange = (questionId, variantId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: variantId,
    }));
  };

  const handleCheckboxChange = (questionId, variantId) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const exists = current.includes(variantId);

      return {
        ...prev,
        [questionId]: exists
          ? current.filter((id) => id !== variantId)
          : [...current, variantId],
      };
    });
  };

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="test-runner">
      <h2>
        🧪 Тест {test.number}: {test.title}
      </h2>

      {test.questions.map((q) => {
        const isMultiple = q.rightsVariantIds?.length > 1;
        const isSingle = q.rightsVariantIds?.length === 1;
        const hasVariants = q.variants && q.variants.length > 0;
        const isTextAnswer = !hasVariants && q.rightText;

        const inputType =
          isTextAnswer && !isNaN(Number(q.rightText)) ? "number" : "text";

        return (
          <div key={q.id} className="test-question">
            <div className="test-question-title">
              {q.number}. {q.question}
            </div>

            {/* ВАРИАНТЫ ОТВЕТА */}
            {hasVariants &&
              q.variants.map((v) => (
                <label key={v.id} className="test-variant">
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={q.id}
                    value={v.id}
                    checked={
                      isMultiple
                        ? answers[q.id]?.includes(v.id)
                        : answers[q.id] === v.id
                    }
                    onChange={() =>
                      isMultiple
                        ? handleCheckboxChange(q.id, v.id)
                        : handleRadioChange(q.id, v.id)
                    }
                  />
                  <span>
                    {v.number}. {v.title}
                  </span>
                </label>
              ))}

            {/* ТЕКСТОВЫЙ / ЧИСЛОВОЙ ОТВЕТ */}
            {isTextAnswer && (
              <input
                className="test-input"
                type={inputType}
                value={answers[q.id] ?? ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                placeholder="Введите ответ"
              />
            )}
          </div>
        );
      })}

      {/* пока просто вывод для отладки */}
      <pre style={{ marginTop: 16, fontSize: 12 }}>
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
};

export default TestRunner;
