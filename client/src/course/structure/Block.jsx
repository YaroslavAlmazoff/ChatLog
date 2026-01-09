import Expandable from "./Expandable";
import Lesson from "./Lesson";

function Block({ block, activeLessonId, onSelectLesson }) {
  return (
    <Expandable title={`Блок ${block.number}: ${block.title}`} level={2}>
      {block.lessons.map((lesson) => (
        <Lesson
          key={lesson.id}
          lesson={lesson}
          isActive={lesson.id === activeLessonId}
          onSelect={onSelectLesson}
        />
      ))}

      {block.test?.length > 0 && (
        <div style={{ marginLeft: 48, marginTop: 6, cursor: "pointer" }}>
          🧪 Итоговый тест блока
        </div>
      )}
    </Expandable>
  );
}

export default Block;
