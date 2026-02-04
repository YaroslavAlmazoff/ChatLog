import Part from "./structure/Part";
import { useState } from "react";
import "./styles/course-structure.css";

function CourseStructure({
  course,
  mode = "view",
  activeLessonId: controlledActiveLessonId,
  selectedItem,
  onSelectLesson,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  expanded,
  setExpanded,
}) {
  const [internalActiveLessonId, setInternalActiveLessonId] = useState(null);

  const activeLessonId = controlledActiveLessonId ?? internalActiveLessonId;

  const handleSelectLesson = (lessonId) => {
    if (onSelectLesson) onSelectLesson(lessonId);
    else setInternalActiveLessonId(lessonId);
  };

  return (
    <div className="course-structure">
      {course.parts.map((part, partIndex) => (
        <Part
          key={partIndex}
          part={part}
          partIndex={partIndex}
          mode={mode}
          activeLessonId={activeLessonId}
          selectedItem={selectedItem}
          onSelectLesson={handleSelectLesson}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </div>
  );
}

export default CourseStructure;
