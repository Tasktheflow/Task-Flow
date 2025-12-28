import { DndContext, useDraggable } from "@dnd-kit/core";

function DragTest() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "test",
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <DndContext
      onDragEnd={() => console.log("✅ DND WORKS")}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="w-40 h-20 bg-green-500 text-white flex items-center justify-center cursor-grab"
      >
        Drag me
      </div>
    </DndContext>
  );
}

export default DragTest;
