import { useState, useEffect } from "react";
import "../styles/test-runner.css";

const TestRunner = ({ test, savedTestProgress, onTestProgress }) => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    if (!test) return;

    const totalQuestions = test.questions.length;
    const correctQuestions = Object.entries(results)
      .filter(([, v]) => v === "correct")
      .map(([id]) => id);

    const completed = correctQuestions.length === totalQuestions;

    onTestProgress?.({
      answers,
      results,
      correctQuestions,
      totalQuestions,
      completed,
    });
  }, [results, answers]);

  useEffect(() => {
    if (!test) return;

    setAnswers(savedTestProgress?.answers || {});
    setResults(savedTestProgress?.results || {});
  }, [test?.id]);

  const handleRadioChange = (questionId, variantId) => {
    if (results[questionId] || results[questionId] === "correct") return;
    setAnswers((prev) => ({ ...prev, [questionId]: variantId }));
  };

  const handleCheckboxChange = (questionId, variantId) => {
    if (results[questionId] || results[questionId] === "correct") return;

    setAnswers((prev) => {
      const current = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: current.includes(variantId)
          ? current.filter((id) => id !== variantId)
          : [...current, variantId],
      };
    });
  };

  const handleInputChange = (questionId, value) => {
    if (results[questionId] || results[questionId] === "correct") return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const checkAnswer = (q) => {
    const userAnswer = answers[q.id];
    let isCorrect = false;

    if (q.variants?.length) {
      if (q.rightsVariantIds.length === 1) {
        isCorrect = userAnswer === q.rightsVariantIds[0];
      } else {
        const u = [...(userAnswer || [])].sort();
        const r = [...q.rightsVariantIds].sort();
        isCorrect = JSON.stringify(u) === JSON.stringify(r);
      }
    } else if (q.rightText !== undefined) {
      isCorrect = String(userAnswer).trim() === String(q.rightText).trim();
    }

    setResults((prev) => ({
      ...prev,
      [q.id]: isCorrect ? "correct" : "wrong",
    }));
  };

  const resetQuestion = (questionId) => {
    if (savedTestProgress?.completed) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });

    setResults((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };
  if (!test) return null;
  return (
    <div className="test-runner">
      <h2>
        🧪 Тест {test.number}: {test.title}
      </h2>

      {test.questions.map((q) => {
        const hasAnswer = answers[q.id] !== undefined;
        const result = results[q.id];
        const isMultiple = q.rightsVariantIds?.length > 1;
        const hasVariants = q.variants?.length > 0;
        const isTextAnswer = !hasVariants && q.rightText !== undefined;
        const inputType =
          isTextAnswer && !isNaN(Number(q.rightText)) ? "number" : "text";

        return (
          <div key={q.id} className="test-question">
            <div className="test-question-title">
              {q.number}. {q.question}
              {result === "correct" && <span className="ok"> ✅</span>}
              {result === "wrong" && <span className="bad"> ❌</span>}
            </div>

            {/* ВАРИАНТЫ */}
            {hasVariants &&
              q.variants.map((v) => (
                <label key={v.id} className="test-variant">
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={q.id}
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
                  {v.number}. {v.title}
                </label>
              ))}

            {/* ТЕКСТ */}
            {isTextAnswer && (
              <input
                className="input"
                type={inputType}
                value={answers[q.id] ?? ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                placeholder="Введите ответ"
              />
            )}

            {/* КНОПКИ */}
            {!result && hasAnswer && (
              <button className="test-check" onClick={() => checkAnswer(q)}>
                Проверить
              </button>
            )}

            {result === "wrong" && (
              <button
                className="test-retry"
                onClick={() => resetQuestion(q.id)}
              >
                🔄 Попробовать снова
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestRunner;
