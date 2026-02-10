import { useParams } from "react-router";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import CreateTaskModal from "../../components/Tasks/CreateTasksModal";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import Board from "../../components/Board/Board";
import InviteMemberModal from "../../components/InviteMembers/InviteMemberModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [boards, setBoards] = useState([
    { id: "todo", title: "To-Do", tasks: [] },
    { id: "progress", title: "In Progress", tasks: [] },
    { id: "review", title: "Review", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag must move 8px to activate
      },
    }),
  );

  const handleDragStart = (event) => {
    const { active } = event;

    // Find the task being dragged
    for (const board of boards) {
      const task = board.tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null); // Clear active task

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceBoardId = null;
    let draggedTask = null;
    let sourceIndex = -1;

    for (const board of boards) {
      const foundIndex = board.tasks.findIndex((t) => t.id === activeId);
      if (foundIndex !== -1) {
        sourceBoardId = board.id;
        draggedTask = board.tasks[foundIndex];
        sourceIndex = foundIndex;
        break;
      }
    }

    if (!draggedTask) return;

    let targetBoardId = null;
    let targetIndex = -1;

    const boardMatch = boards.find((b) => b.id === overId);
    if (boardMatch) {
      targetBoardId = boardMatch.id;
      targetIndex = boardMatch.tasks.length;
    } else {
      for (const board of boards) {
        const foundIndex = board.tasks.findIndex((t) => t.id === overId);
        if (foundIndex !== -1) {
          targetBoardId = board.id;
          targetIndex = foundIndex;
          break;
        }
      }
    }

    if (!targetBoardId) return;

    if (sourceBoardId === targetBoardId) {
      if (sourceIndex === targetIndex) return;

      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id === sourceBoardId) {
            const newTasks = [...board.tasks];
            newTasks.splice(sourceIndex, 1);
            newTasks.splice(targetIndex, 0, draggedTask);
            return { ...board, tasks: newTasks };
          }
          return board;
        }),
      );
    } else {
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id === sourceBoardId) {
            return {
              ...board,
              tasks: board.tasks.filter((t) => t.id !== draggedTask.id),
            };
          }

          if (board.id === targetBoardId) {
            const newTasks = [...board.tasks];
            newTasks.splice(targetIndex, 0, draggedTask);
            return { ...board, tasks: newTasks };
          }

          return board;
        }),
      );
    }
  };

  const addTask = (task) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === task.status // status comes from modal dropdown
          ? { ...board, tasks: [...board.tasks, task] }
          : board,
      ),
    );
  };

 const project = projects?.find((p) => p._id === projectId);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className=" w-full"
    >
      <header className=" px-[57px] flex items-center w-full justify-between border-b border-[#A1A3AB4D] pb-[25px] max-[1250px]:px-3 max-[500px]:pb-2.5 max-[460px]:flex-col max-[460px]:items-start max-[460px]:gap-2">
        <div>
          <div className=" flex gap-7 max-[800px]:gap-2 max-[460px]:gap-10">
            <button onClick={() => navigate(-1)}>
              <IoArrowBackOutline size={24} className=" font-light" />
            </button>
            <div className=" flex items-center justify-between gap-2.5">
              {" "}
              <span
                className=" size-[19px] block rounded-[50%] "
                 style={{ backgroundColor: project.color || '#10B981' }}
              ></span>
              <h2 className="text-[20px] font-light ">{project.projectTitle}</h2>
            </div>
          </div>
          {/* <p className="mt-2 text-gray-600">{project.description}</p> */}
        </div>
        <div className=" flex gap-[17px] items-center max-[550px]:text-[12px] max-[550px]:gap-1.5">
          <button
            className=" flex items-center justify-center bg-[#05A301] px-5 py-2.5 rounded-lg gap-2.5 text-white cursor-pointer"
            onClick={() => setShowTaskModal(true)}
          >
            {" "}
            <span className=" text-[16px] max-[550px]:text-[12px]">+</span>Add Task
          </button>
          <button
            className=" flex items-center justify-center px-5 py-2.5 bg-transparent border border-[#05A301] text-[#05A301] text-[15px] font-medium rounded-lg gap-[7px] cursor-pointer max-[550px]:px-2 max-[550px]:py-1.5"
            onClick={() => setShowInviteModal(true)}
          >
            <MdGroupAdd className=" size-[19.5px]" />
            Add Members
          </button>
        </div>
      </header>
      <div className="p-6 overflow-auto">
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
        >
          <div className=" max-[1090px]:w-[1050px]">
            <div className="grid grid-cols-4 gap-4 items-start ">
              {boards.map((board) => (
                <Board key={board.id} board={board} />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-3 rounded-lg shadow-lg cursor-grabbing rotate-3 opacity-90">
                <p className="font-medium truncate">{activeTask.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activeTask.createdAt).toLocaleString()}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreate={addTask}
        />
      )}

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          projectId={projectId}
        />
      )}
    </motion.div>
  );
};

export default ProjectDetails;
