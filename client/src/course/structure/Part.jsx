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
}) {
  const isSelected =
    selectedItem?.type === "part" && selectedItem.path?.partIndex === partIndex;

  return (
    <Expandable
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
                    data: part,
                  });
                }}
              >
                &nbsp;✏️
              </span>

              <span
                className="course-structure-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Удалить часть?")) {
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
        />
      ))}
    </Expandable>
  );
}

export default Part;
