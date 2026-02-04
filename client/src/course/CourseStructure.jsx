import Part from "./structure/Part";
import { useState } from "react";
import "./styles/course-structure.css";

function CourseStructure({
  course,
  mode = "view",
  selectedItem,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  controlledExpanded,
  setControlledExpanded,
}) {
  const partKey = (p) => `p-${p}`;
  const blockKey = (p, b) => `b-${p}-${b}`;
  const lessonKey = (p, b, l) => `l-${p}-${b}-${l}`;
  const isEditor = mode === "editor";
  const [internalExpanded, setInternalExpanded] = useState({
    parts: new Set(),
    blocks: new Set(),
    lessons: new Set(),
  });

  const expanded = controlledExpanded ?? internalExpanded;
  const setExpanded = setControlledExpanded ?? setInternalExpanded;

  if (!course?.parts?.length) return null;
  return (
    <div className="course-structure">
      {course?.parts?.map((part, partIndex) => (
        <Part
          key={partIndex}
          part={part}
          partIndex={partIndex}
          mode={mode}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          expanded={expanded}
          setExpanded={setExpanded}
          partKey={partKey}
          blockKey={blockKey}
          isEditor={isEditor}
        />
      ))}
    </div>
  );
}

export default CourseStructure;
