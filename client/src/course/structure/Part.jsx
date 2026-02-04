import Block from "./Block";
import Expandable from "./Expandable";

function Part({
  part,
  partIndex,
  mode,
  selectedItem,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  activeLessonId,
  onSelectLesson,
  expanded,
  setExpanded,
  partKey,
  blockKey,
}) {
  const isSelected =
    selectedItem?.type === "part" && selectedItem.path?.partIndex === partIndex;
  const confirmDelete = (text) => window.confirm(text);
  const key = partKey(partIndex);
  const isOpen = expanded.parts.has(key);

  const toggle = () => {
    setExpanded((prev) => {
      const next = new Set(prev.parts);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, parts: next };
    });
  };

  return (
    <Expandable
      onToggle={toggle}
      isOpen={isOpen}
      title={
        <div
          className={`structure-item ${isSelected ? "selected" : ""}`}
          onClick={() =>
            mode === "editor" &&
            onSelectItem?.({
              type: "part",
              path: { partIndex },
              data: part,
            })
          }
        >
          Часть {part.number}: {part.title}
          {mode === "editor" && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.({
                    type: "part",
                    path: { partIndex },
                  });
                }}
              >
                &nbsp;✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDelete("Удалить часть?")) {
                    onDeleteItem?.({
                      type: "part",
                      path: { partIndex },
                    });
                  }
                }}
              >
                &nbsp;🗑
              </span>
            </>
          )}
        </div>
      }
      level={1}
    >
      {part.blocks.map((block, blockIndex) => (
        <Block
          key={blockIndex}
          block={block}
          partIndex={partIndex}
          blockIndex={blockIndex}
          mode={mode}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          activeLessonId={activeLessonId}
          onSelectLesson={onSelectLesson}
          expanded={expanded}
          setExpanded={setExpanded}
          blockKey={blockKey}
        />
      ))}
    </Expandable>
  );
}

export default Part;
