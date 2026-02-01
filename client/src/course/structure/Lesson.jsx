function Lesson({
  lesson,
  mode = "view",
  path,
  isActive,
  onSelectLesson,
  onSelectItem,
  onEditItem,
}) {
  const lessonItem = {
    type: "lesson",
    path,
    data: lesson,
  };

  return (
    <div style={{ marginLeft: 2 * 16 }}>
      {/* УРОК */}
      <div
        className={`course-structure-item ${isActive ? "active" : ""}`}
        onClick={() =>
          mode === "editor"
            ? onSelectItem?.(lessonItem)
            : onSelectLesson?.(path.lessonIndex)
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
        }}
      >
        <span>
          📘 Урок {lesson.number}: {lesson.title}
        </span>

        {mode === "editor" && (
          <span
            className="course-structure-edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              onEditItem?.(lessonItem);
            }}
          >
            ✏️
          </span>
        )}
      </div>

      {/* ВИДЕО */}
      {lesson.video && (
        <div
          className="course-structure-subitem"
          style={{ marginLeft: 16 }}
          onClick={() =>
            onSelectItem?.({
              type: "video",
              path,
              data: lesson.video,
            })
          }
        >
          🎬 {lesson.video.title}
          {mode === "editor" && (
            <span
              className="course-structure-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem?.({
                  type: "video",
                  path,
                  data: lesson.video,
                });
              }}
            >
              ✏️
            </span>
          )}
        </div>
      )}

      {/* ТЕСТ */}
      {lesson.test && (
        <div
          className="course-structure-subitem"
          style={{ marginLeft: 16 }}
          onClick={() =>
            onSelectItem?.({
              type: "test",
              path,
              data: lesson.test,
            })
          }
        >
          🧪 {lesson.test.title}
          {mode === "editor" && (
            <span
              className="course-structure-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem?.({
                  type: "test",
                  path,
                  data: lesson.test,
                });
              }}
            >
              ✏️
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Lesson;
