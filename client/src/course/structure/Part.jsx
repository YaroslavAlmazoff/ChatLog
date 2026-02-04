import Block from "./Block";
import Expandable from "./Expandable";

function Part({
  part,
  partIndex,
  selectedItem,
  expanded,
  setExpanded,
  partKey,
  blockKey,
  onItemClick,
  renderActions,
}) {
  const key = partKey(partIndex);
  const isOpen = expanded.parts.has(key);

  const isSelected =
    selectedItem?.type === "part" && selectedItem.path?.partIndex === partIndex;

  const toggle = () => {
    setExpanded((prev) => {
      const next = new Set(prev.parts);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, parts: next };
    });
  };

  const item = {
    type: "part",
    path: { partIndex },
    data: part,
  };

  return (
    <Expandable
      isOpen={isOpen}
      onToggle={toggle}
      level={1}
      title={
        <div
          className={`structure-item ${isSelected ? "selected" : ""}`}
          onClick={() => onItemClick?.(item)}
        >
          Часть {part.number}: {part.title}
          {renderActions?.(item)}
        </div>
      }
    >
      {part.blocks.map((block, blockIndex) => (
        <Block
          key={blockIndex}
          block={block}
          partIndex={partIndex}
          blockIndex={blockIndex}
          selectedItem={selectedItem}
          expanded={expanded}
          setExpanded={setExpanded}
          blockKey={blockKey}
          onItemClick={onItemClick}
          renderActions={renderActions}
        />
      ))}
    </Expandable>
  );
}

export default Part;
