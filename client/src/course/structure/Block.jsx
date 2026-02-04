import Expandable from "./Expandable";
import Lesson from "./Lesson";

function Block({
  block,
  partIndex,
  blockIndex,
  selectedItem,
  expanded,
  setExpanded,
  blockKey,
  onItemClick,
  renderActions,
}) {
  const key = blockKey(partIndex, blockIndex);
  const isOpen = expanded.blocks.has(key);

  const toggle = () => {
    setExpanded((prev) => {
      const next = new Set(prev.blocks);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, blocks: next };
    });
  };

  const item = {
    type: "block",
    path: { partIndex, blockIndex },
    data: block,
  };

  return (
    <Expandable
      isOpen={isOpen}
      onToggle={toggle}
      level={2}
      title={
        <div
          className="structure-item"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          onClick={() => onItemClick?.(item)}
        >
          <span>
            Блок {block.number}: {block.title}
          </span>
          {renderActions?.(item)}
        </div>
      }
    >
      {block.lessons.map((lesson, lessonIndex) => (
        <Lesson
          key={lesson.id ?? lessonIndex}
          lesson={lesson}
          path={{ partIndex, blockIndex, lessonIndex }}
          selectedItem={selectedItem}
          onItemClick={onItemClick}
          renderActions={renderActions}
        />
      ))}

      {block.test && (
        <div
          className="course-structure-item"
          style={{ marginLeft: 32, marginTop: 6 }}
          onClick={() =>
            onItemClick?.({
              type: "test",
              path: { partIndex, blockIndex },
              data: block.test,
            })
          }
        >
          🧪 Итоговый тест блока
          {renderActions?.({
            type: "test",
            path: { partIndex, blockIndex },
            data: block.test,
          })}
        </div>
      )}
    </Expandable>
  );
}

export default Block;
