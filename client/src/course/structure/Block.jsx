import Expandable from "./Expandable";
import Lesson from "./Lesson";

function Block({
  block,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  selectedItem,
  mode = "view",
  partIndex,
  blockIndex,
  expanded,
  setExpanded,
  blockKey,
  isEditor,
}) {
  const blockItem = {
    type: "block",
    path: { partIndex, blockIndex },
  };

  const blockTestItem = {
    type: "test",
    path: { partIndex, blockIndex },
  };
  const confirmDelete = (text) => window.confirm(text);

  const key = blockKey(partIndex, blockIndex);
  const isOpen = expanded?.blocks?.has(key);

  const isSelected =
    isEditor &&
    selectedItem?.type === "block" &&
    selectedItem.path?.partIndex === partIndex &&
    selectedItem.path?.blockIndex === blockIndex;

  const toggle = () => {
    setExpanded((prev) => {
      const next = new Set(prev.blocks);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, blocks: next };
    });
  };
  return (
    <Expandable
      onToggle={toggle}
      isOpen={isOpen}
      level={2}
      title={
        <div
          className={`course-structure-item ${isSelected ? "selected" : ""}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          onClick={() => isEditor && onSelectItem?.(blockItem)}
        >
          <span>
            Блок {block.number}: {block.title}
          </span>

          {mode === "editor" && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(blockItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirmDelete(
                      "Удалить блок? Все уроки и тест внутри будут удалены.",
                    )
                  ) {
                    onDeleteItem?.(blockItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      }
    >
      {/* УРОКИ */}
      {block.lessons.map((lesson, lessonIndex) => (
        <Lesson
          key={lesson.id ?? lessonIndex}
          lesson={lesson}
          mode={mode}
          path={{ partIndex, blockIndex, lessonIndex }}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          selectedItem={selectedItem}
          isEditor={isEditor}
        />
      ))}

      {/* ИТОГОВЫЙ ТЕСТ БЛОКА */}
      {block.test && (
        <div
          className="course-structure-item"
          style={{ marginLeft: 32, marginTop: 6 }}
          onClick={() => isEditor && onSelectItem?.(blockTestItem)}
        >
          🧪 Итоговый тест блока
          {isEditor && (
            <>
              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem?.(blockTestItem);
                }}
              >
                ✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDelete("Удалить итоговый тест блока?")) {
                    onDeleteItem?.(blockTestItem);
                  }
                }}
              >
                🗑
              </span>
            </>
          )}
        </div>
      )}
    </Expandable>
  );
}

export default Block;
