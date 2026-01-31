function Lesson({
  lesson,
  isActive,
  mode = "view",
  path,
  onSelectLesson,
  onSelectItem,
  onEditItem,
}) {
  const item = {
    type: "lesson",
    path,
    data: {
      number: lesson.number,
      title: lesson.title,
    },
  };

  const handleClick = () => {
    if (mode === "view") {
      onSelectLesson?.(path.lessonIndex);
    } else {
      onSelectItem?.(item);
    }
  };

  return (
    <div
      className="course-structure-item"
      onClick={handleClick}
      style={{
        marginLeft: 2 * 16,
        cursor: "pointer",
        fontWeight: isActive ? "bold" : "normal",
        color: isActive ? "#40a4ff" : "white",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
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
            onEditItem?.(item);
          }}
        >
          ✏️
        </span>
      )}
    </div>
  );
}

export default Lesson;
