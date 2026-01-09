function Lesson({ lesson, isActive, onSelect }) {
  return (
    <div
      onClick={() => onSelect(lesson.id)}
      style={{
        marginLeft: 2 * 16,
        cursor: "pointer",
        fontWeight: isActive ? "bold" : "normal",
        color: isActive ? "#40a4ff" : "white",
      }}
    >
      📘 Урок {lesson.number}: {lesson.title}
    </div>
  );
}

export default Lesson;
