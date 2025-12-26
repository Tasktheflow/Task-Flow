import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../Taskcard/Taskcard";

const Board = ({ board }) => {
  const { setNodeRef } = useDroppable({ id: board.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 rounded-xl p-4 min-h-[300px]"
    >
      <h2 className="font-medium mb-4">{board.title}</h2>

      <SortableContext
        items={board.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {board.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Board;
