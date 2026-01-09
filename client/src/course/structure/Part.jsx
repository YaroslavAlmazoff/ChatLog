import Block from "./Block";
import Expandable from "./Expandable";

function Part({ part, activeLessonId, onSelectLesson }) {
  return (
    <Expandable title={`Часть ${part.number}: ${part.title}`} level={1}>
      {part.blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          activeLessonId={activeLessonId}
          onSelectLesson={onSelectLesson}
        />
      ))}
    </Expandable>
  );
}

export default Part;
