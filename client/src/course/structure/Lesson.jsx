function Lesson({
  lesson,
  mode = "view",
  path,
  selectedItem,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  isEditor,
}) {
  const lessonItem = { type: "lesson", path };
  const videoItem = {
    type: "video",
    path: { ...path, kind: "video" },
  };

  const testItem = {
    type: "test",
    path: { ...path, kind: "test" },
  };

  const confirmDelete = (text) => window.confirm(text);

  const isSelected = (type) =>
    isEditor &&
    selectedItem?.type === type &&
    selectedItem.path?.lessonIndex === path.lessonIndex &&
    selectedItem.path?.blockIndex === path.blockIndex &&
    selectedItem.path?.partIndex === path.partIndex;

  return (
    <div style={{ marginLeft: 32 }}>
      {/* УРОК */}
      <div
        className={`course-structure-item ${
          isSelected("lesson") ? "selected" : ""
        }`}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
        onClick={() => {
          onSelectItem?.({
            type: "lesson",
            path,
            lesson,
          });
          if (!isEditor) {
            localStorage.setItem(
              "lastLesson",
              JSON.stringify({
                partIndex: path.partIndex,
                blockIndex: path.blockIndex,
                lessonIndex: path.lessonIndex,
              }),
            );
          }
        }}
      >
        <span>
          📘 Урок {lesson.number}: {lesson.title}
        </span>

        {mode === "editor" && (
          <>
            <span
              className="course-structure-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem?.(lessonItem);
              }}
            >
              ✏️
            </span>

            <span
              className="course-structure-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirmDelete(
                    "Удалить урок? Видео и тест внутри также будут удалены.",
                  )
                ) {
                  onDeleteItem?.(lessonItem);
                }
              }}
            >
              🗑
            </span>
          </>
        )}
      </div>

      {/* ВИДЕО */}
      {lesson.video && (
        <div
          className={`course-structure-subitem ${
            isSelected("video") ? "selected" : ""
          }`}
          style={{ marginLeft: 16 }}
          onClick={
            isEditor
              ? () => onSelectItem?.(videoItem)
              : () =>
                  onSelectItem?.({
                    type: "video",
                    path,
                    lesson,
                  })
          }
        >
          🎬 {lesson.video.title}
          {isEditor && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(videoItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDelete("Удалить видеоурок?")) {
                    onDeleteItem?.(videoItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      )}

      {/* ТЕСТ */}
      {lesson.test && (
        <div
          className={`course-structure-subitem ${
            isSelected("test") ? "selected" : ""
          }`}
          style={{ marginLeft: 16 }}
          onClick={
            isEditor
              ? () => onSelectItem?.(testItem)
              : () =>
                  onSelectItem?.({
                    type: "test",
                    path,
                    lesson,
                  })
          }
        >
          🧪 {lesson.test.title}
          {isEditor && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(testItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDelete("Удалить тест урока?")) {
                    onDeleteItem?.(testItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Lesson;
