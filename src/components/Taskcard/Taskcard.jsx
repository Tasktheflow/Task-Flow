import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium truncate">{task.title}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(task.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default TaskCard;
