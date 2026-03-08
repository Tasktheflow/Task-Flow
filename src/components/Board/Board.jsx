import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../Taskcard/Taskcard";

const Board = ({ board, projectId , onDeleteTask}) => {
  const { setNodeRef } = useDroppable({ id: board.id });
  const taskCount = board.tasks.length;

  return (
    <div
      ref={setNodeRef}
      className=" rounded-xl  min-h-[300px] bg-[#A1A3AB12] min-w-[250px]"
    >
      <div className=" bg-[#A1A3AB12] flex w-full justify-between items-center px-5 py-[5px]">
        <h2 className="font-medium">{board.title}</h2>
        <span className="bg-white text-gray-600 text-[14px] font-medium p-2.5  rounded-lg text-center flex justify-center items-center">
          {taskCount}
        </span>
      </div>

      <SortableContext
        items={board.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 p-[13px]">
          {taskCount === 0 ? (
            // Empty state
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-[14px]">
              No tasks
            </div>
          ) : (
            // Task cards
            board.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                boardId={board.id}
                projectId={projectId}
               onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Board;
