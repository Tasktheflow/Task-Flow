import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task, boardId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      boardId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
      transition: transition || "transform 200ms ease", 
    opacity: isDragging ? 0.5 : 1, 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm cursor-default active:cursor-grabbing"
    >
      <p className="font-medium truncate">{task.title}</p>
      <p className="text-xs text-gray-400 mt-1">
        {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
      </p>
    </div>
  );
};

export default TaskCard;
