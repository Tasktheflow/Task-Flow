import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  getDeletedProjects,
  getDeletedTasks,
  restoreTask,
  deleteTask,
  deleteProject,
  restoreProject,
} from "../../services/authService";

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

const getCurrentUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const getDaysRemaining = (deletedAt) => {
  if (!deletedAt) return null;
  const deleted = new Date(deletedAt);
  const expires = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
  const remaining = Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, remaining);
};

const DaysChip = ({ deletedAt }) => {
  const days = getDaysRemaining(deletedAt);
  if (days === null) return null;

  const urgent = days <= 5;
  const warning = days <= 10;

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 hidden sm:block ${
        urgent
          ? "bg-red-50 text-red-600"
          : warning
            ? "bg-amber-50 text-amber-600"
            : "bg-gray-100 text-gray-500"
      }`}
    >
      {days}d left
    </span>
  );
};

// ─── Confirm Deletion ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ item, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 px-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:w-[380px] shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
      <h3 className="text-center font-semibold text-gray-900 mb-1">
        Delete permanently?
      </h3>
      <p className="text-center text-sm text-gray-500 mb-5">
        <span className="font-medium text-gray-700">
          "{item?.projectTitle || item?.title}"
        </span>{" "}
        will be gone forever and cannot be recovered.
      </p>
      <div className="flex gap-3 max-[330px]:flex-col">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition"
        >
          Delete forever
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onRestore, onDelete, isOwner }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow group max-[700px]:flex-col max-[700px]:items-start gap-3"
  >
    <div className="flex items-center gap-3">
      {/* Color dot */}
      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: project.color || "#10b981" }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0 max-[700px]:w-full">
        <p className="text-sm font-medium text-gray-500 line-through truncate">
          {project.projectTitle}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate max-[700px]:w-[300px]">
          {project.description}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {/* Days remaining */}
      <DaysChip deletedAt={project.deletedAt} />

      {/* Owner badge */}
      {isOwner && (
        <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full shrink-0 hidden sm:block">
          Owner
        </span>
      )}

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onRestore(project)}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium whitespace-nowrap"
        >
          Restore
        </button>
        {/* Only owner can permanently delete */}
        {isOwner && (
          <button
            onClick={() => onDelete(project)}
            className={`text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium whitespace-nowrap ${
              isTouchDevice
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            Delete forever
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Task Card ────────────────────────────────────────────────────────────────
const PRIORITY = {
  High: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  Medium: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  Low: { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
};

const TaskCard = ({ task, onRestore, onDelete }) => {
  const colors = PRIORITY[task.priority] || PRIORITY.Low;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow group"
    >
      {/* Priority dot */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: colors.dot }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 line-through truncate">
          {task.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {task.dueDate
            ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
            : "No due date"}
        </p>
      </div>

      {/* Days remaining */}
      <DaysChip deletedAt={task.deletedAt} />

      {/* Priority badge */}
      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 hidden sm:block"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {task.priority || "—"}
      </span>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onRestore(task)}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium whitespace-nowrap"
        >
          Restore
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium hidden group-hover:block lg:block whitespace-nowrap max-[800px]:opacity-100 max-[800px]:group-hover:opacity-0"
        >
          Delete forever
        </button>
      </div>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <svg
        className="w-7 h-7 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </div>
    <p className="text-gray-500 font-medium text-sm">No deleted {label}</p>
    <p className="text-gray-400 text-xs mt-1">
      Deleted {label} will appear here for 30 days
    </p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const RecycleBin = () => {
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [search, setSearch] = useState("");
  const [confirmItem, setConfirmItem] = useState(null);

  const currentUser = getCurrentUser();

  // ─── Fetch deleted projects ─────────────────────────────────────────────
  const fetchDeletedProjects = useCallback(async () => {
    try {
      const res = await getDeletedProjects();
      const data = Array.isArray(res.data) ? res.data : [];
      setDeletedProjects(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load deleted projects");
    }
  }, []);

  // ─── Fetch deleted tasks ────────────────────────────────────────────────
  const fetchDeletedTasks = useCallback(async () => {
    try {
      const res = await getDeletedTasks();
      const data = Array.isArray(res.data) ? res.data : [];
      setTasks(data.map((t) => ({ ...t, id: t.id || t._id })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load deleted tasks");
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchDeletedProjects(), fetchDeletedTasks()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchDeletedProjects, fetchDeletedTasks]);

  // ─── Filtered lists ─────────────────────────────────────────────────────
  const filteredProjects = deletedProjects.filter(
    (p) =>
      p.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()),
  );

  // ─── Restore project ────────────────────────────────────────────────────
  const handleRestoreProject = async (project) => {
    try {
      await restoreProject(project._id);
      setDeletedProjects((prev) => prev.filter((p) => p._id !== project._id));
      toast.success(`"${project.projectTitle}" restored!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore project");
    }
  };

  // ─── Restore task ───────────────────────────────────────────────────────
  const handleRestoreTask = async (task) => {
    try {
      await restoreTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success(`"${task.title}" restored!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore task");
    }
  };

  // ─── Permanent delete ───────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    const { item, type } = confirmItem;
    try {
      if (type === "project") {
        await deleteProject(item._id);
        setDeletedProjects((prev) => prev.filter((p) => p._id !== item._id));
        toast.success("Project permanently deleted");
      } else {
        await deleteTask(item.id);
        setTasks((prev) => prev.filter((t) => t.id !== item.id));
        toast.success("Task permanently deleted");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setConfirmItem(null);
    }
  };

  const totalDeleted = deletedProjects.length + tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full px-4 sm:px-6 py-6 font-['inter'] space-y-5"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Recycle Bin
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {totalDeleted} deleted item{totalDeleted !== 1 ? "s" : ""} ·
          Auto-deleted after 30 days
        </p>
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search deleted projects or tasks..."
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "projects", label: "Projects", count: filteredProjects.length },
          { id: "tasks", label: "Tasks", count: filteredTasks.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeTab === tab.id
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          Loading...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "projects" ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredProjects.length === 0 ? (
                <EmptyState label="projects" />
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => {
                    const isOwner = currentUser?.id === project.owner;
                    return (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        isOwner={isOwner}
                        onRestore={handleRestoreProject}
                        onDelete={(p) =>
                          setConfirmItem({ item: p, type: "project" })
                        }
                      />
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredTasks.length === 0 ? (
                <EmptyState label="tasks" />
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onRestore={handleRestoreTask}
                      onDelete={(t) =>
                        setConfirmItem({ item: t, type: "task" })
                      }
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Confirm Dialog ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmItem && (
          <ConfirmDialog
            item={confirmItem.item}
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmItem(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecycleBin;
