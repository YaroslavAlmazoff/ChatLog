function Lesson({ lesson, path, selectedItem, onItemClick, renderActions }) {
  const isSelected =
    selectedItem?.type === "lesson" &&
    JSON.stringify(selectedItem.path) === JSON.stringify(path);

  return (
    <div style={{ marginLeft: 32 }}>
      <div
        className={`course-structure-item ${isSelected ? "selected" : ""}`}
        onClick={() => onItemClick?.({ type: "lesson", path })}
      >
        📘 Урок {lesson.number}: {lesson.title}
        {renderActions?.({
          type: "lesson",
          path,
          data: lesson,
        })}
      </div>

      {lesson.video && (
        <div
          className="course-structure-subitem"
          onClick={() => onItemClick?.({ type: "video", path })}
        >
          🎬 {lesson.video.title}
          {renderActions?.({
            type: "video",
            path,
            data: lesson.video,
          })}
        </div>
      )}
    </div>
  );
}
