import Part from "./structure/Part";
import "./styles/course-structure.css";

function CourseStructure({
  course,
  selectedItem,
  onItemClick,
  renderActions,
  expanded,
  setExpanded,
  partKey,
  blockKey,
}) {
  return (
    <div className="course-structure">
      {course.parts.map((part, partIndex) => (
        <Part
          key={partIndex}
          part={part}
          path={{ partIndex }}
          selectedItem={selectedItem}
          onItemClick={onItemClick}
          renderActions={renderActions}
          expanded={expanded}
          setExpanded={setExpanded}
          partKey={partKey}
          blockKey={blockKey}
        />
      ))}
    </div>
  );
}

export default CourseStructure;
