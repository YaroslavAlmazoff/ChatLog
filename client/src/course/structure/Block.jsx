import Expandable from "./Expandable";
import Lesson from "./Lesson";

function Block({
  block,
  activeLessonId,
  onSelectLesson,
  onSelectItem,
  onEditItem,
  mode = "view",
  partIndex,
  blockIndex,
}) {
  const item = {
    type: "block",
    path: { partIndex, blockIndex },
    data: {
      number: block.number,
      title: block.title,
    },
  };

  return (
    <Expandable
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span>
            Блок {block.number}: {block.title}
          </span>

          {mode === "editor" && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onEditItem?.(item);
              }}
              style={{ opacity: 0.7 }}
            >
              ✏️
            </span>
          )}
        </span>
      }
      level={2}
      onTitleClick={mode === "editor" ? () => onSelectItem?.(item) : undefined}
    >
      {block.lessons.map((lesson, lessonIndex) => (
        <Lesson
          key={lessonIndex}
          lesson={lesson}
          isActive={lessonIndex === activeLessonId}
          mode={mode}
          path={{ partIndex, blockIndex, lessonIndex }}
          onSelectLesson={onSelectLesson}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
        />
      ))}

      {block.test && (
        <div
          style={{ marginLeft: 2 * 16, marginTop: 6, cursor: "pointer" }}
          onClick={() =>
            mode === "editor" &&
            onSelectItem?.({
              type: "test",
              path: { partIndex, blockIndex },
              data: block.test,
            })
          }
        >
          🧪 Итоговый тест блока
          {mode === "editor" && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onEditItem?.({
                  type: "test",
                  path: { partIndex, blockIndex },
                  data: block.test,
                });
              }}
            >
              {" "}
              ✏️
            </span>
          )}
        </div>
      )}
    </Expandable>
  );
}

export default Block;
