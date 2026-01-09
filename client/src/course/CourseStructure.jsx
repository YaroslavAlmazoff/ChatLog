import course from "./course.json";
import Part from "./structure/Part";
import { useState } from "react";
import "./styles/course-structure.css";

function CourseStructure() {
  const [activeLessonId, setActiveLessonId] = useState(null);

  return (
    <div className="course-structure">
      {course.parts.map((part) => (
        <Part
          key={part.id}
          part={part}
          activeLessonId={activeLessonId}
          onSelectLesson={setActiveLessonId}
        />
      ))}
    </div>
  );
}

export default CourseStructure;
