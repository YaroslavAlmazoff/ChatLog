import Expandable from "./Expandable";
import Lesson from "./Lesson";

function Block({
  block,
  activeLessonId,
  onSelectLesson,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  mode = "view",
  partIndex,
  blockIndex,
}) {
  const blockItem = {
    type: "block",
    path: { partIndex, blockIndex },
  };

  const blockTestItem = {
    type: "test",
    path: { partIndex, blockIndex },
  };
  const confirmDelete = (text) => window.confirm(text);
  return (
    <Expandable
      level={2}
      title={
        <div
          className="structure-item"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          onClick={() => mode === "editor" && onSelectItem?.(blockItem)}
        >
          <span>
            Блок {block.number}: {block.title}
          </span>

          {mode === "editor" && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(blockItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirmDelete(
                      "Удалить блок? Все уроки и тест внутри будут удалены.",
                    )
                  ) {
                    onDeleteItem?.(blockItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      }
    >
      {/* УРОКИ */}
      {block.lessons.map((lesson, lessonIndex) => (
        <Lesson
          key={lesson.id ?? lessonIndex}
          lesson={lesson}
          isActive={lessonIndex === activeLessonId}
          mode={mode}
          path={{ partIndex, blockIndex, lessonIndex }}
          onSelectLesson={onSelectLesson}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}

      {/* ИТОГОВЫЙ ТЕСТ БЛОКА */}
      {block.test && (
        <div
          className="course-structure-item"
          style={{ marginLeft: 32, marginTop: 6 }}
          onClick={() => mode === "editor" && onSelectItem?.(blockTestItem)}
        >
          🧪 Итоговый тест блока
          {mode === "editor" && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(blockTestItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDelete("Удалить итоговый тест блока?")) {
                    onDeleteItem?.(blockTestItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      )}
    </Expandable>
  );
}

export default Block;
