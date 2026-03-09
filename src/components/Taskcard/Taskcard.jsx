import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { LuUser, LuCalendar, LuTrash2 } from "react-icons/lu";
import TaskDetailModal from "../TaskDetail/TaskDetailModal";
import { deleteTask } from "../../services/authService";
import { toast } from "react-toastify";
import moment from "moment";
import { FaTrash } from "react-icons/fa";
import redbin from "../../assets/redbin.png"

const getInitials = (name) =>
  name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const PRIORITY_ACCENT = {
  High:   "bg-red-400",
  Medium: "bg-orange-400",
  Low:    "bg-green-400",
};

// ── Confirmation Modal ────────────────────────────────────────────────
const DeleteConfirmModal = ({ task, onConfirm, onCancel, isDeleting }) => (
  <div
    className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center px-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-xl"
    >
      {/* Illustration */}
      <div className="w-30 h-30 rounded-10 bg-red-50 flex items-center justify-center mx-auto mb-4">
       <img src={redbin} alt=""/>
      </div>

      <h3 className="text-[17px] font-semibold text-gray-900 text-center mb-1">
        Delete Task?
      </h3>
      <p className="text-sm text-gray-400 text-center mb-6">
        <span className="font-medium text-gray-600">"{task.title}"</span> will
        be moved to bin. restore before 30 days.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </motion.div>
  </div>
);

// ── TaskCard ───
const TaskCard = ({ task, boardId, projectId, onUpdate, onDelete }) => {
  const [showDetail, setShowDetail]       = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", boardId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.5 : 1,
  };

  const assigneeName = task.assignedTo
    ? typeof task.assignedTo === "object"
      ? task.assignedTo.username || task.assignedTo.name
      : task.assignedTo
    : null;

  // ── Handle confirmed delete ───
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id || task._id);
      toast.success("Task deleted");
      onDelete?.(task.id || task._id); // remove from board state
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setShowDetail(true)}
        className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      >
        {/* Priority accent bar */}
        <div className={`w-1 shrink-0 rounded-l-xl ${PRIORITY_ACCENT[task.priority] || "bg-orange-400"}`} />

        {/* Content */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <p className="font-semibold text-gray-800 text-[15px] truncate mb-2">
            {task.title}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {assigneeName && (
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center font-semibold shrink-0">
                {getInitials(assigneeName)}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1.5 shrink-0">
                <LuCalendar size={14} className="text-gray-400" />
                <span className="text-xs">{moment(task.dueDate).format("MMM Do")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ don't open detail modal
            setShowConfirm(true);
          }}
          className="px-3 flex items-start pt-3 text-red-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
        >
          <FaTrash size={16} />
        </button>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <div onClick={(e) => e.stopPropagation()}>
            <TaskDetailModal
              task={task}
              projectId={projectId}
              onClose={() => setShowDetail(false)}
              onUpdate={(updatedTask) => {
                onUpdate?.(updatedTask);
                setShowDetail(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteConfirmModal
              task={task}
              onConfirm={handleDelete}
              onCancel={() => setShowConfirm(false)}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskCard;