import { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getTasks, deleteTask, restoreTask } from "../../services/authService";

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

const localizer = momentLocalizer(moment);

// Detect mobile
const isMobileDevice = () => window.innerWidth < 640;

// ─── Priority config ───
const PRIORITY = {
  High: { bg: "#ef4444", light: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  Medium: { bg: "#f59e0b", light: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  Low: { bg: "#10b981", light: "#ecfdf5", text: "#065f46", dot: "#10b981" },
};

const getPriority = (p) => PRIORITY[p] || PRIORITY.Low;

// ─── Status labels ─────
const STATUS_LABEL = {
  todo: "To-Do",
  progress: "In Progress",
  review: "Review",
  done: "Done",
};

// ─── Custom event component inside calendar ─────
const CalendarEvent = ({ event }) => {
  const colors = getPriority(event.priority);
  return (
    <div
      style={{ backgroundColor: colors.bg }}
      className="px-1.5 py-0.5 rounded text-white text-xs font-medium truncate"
    >
      {event.title}
    </div>
  );
};

// ─── Task row in the list below ──────
const TaskRow = ({ task, onDelete, onRestore }) => {
  const colors = getPriority(task.priority);
  const isDeleted = task.deleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDeleted ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow group max-[370px]:flex-col max-[370px]:items-start max-[370px]"
    >
      <div className="flex items-center gap-4">
        {/* Priority dot */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: colors.dot }}
        />

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isDeleted ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {task.startDate ? moment(task.startDate).format("MMM D") : "—"} →{" "}
            {task.dueDate ? moment(task.dueDate).format("MMM D, YYYY") : "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center flex-row">
        {/* Priority badge */}
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: colors.light, color: colors.text }}
        >
          {task.priority || "—"}
        </span>
        {/* Status badge */}
        <span className="text-xs text-gray-500 shrink-0 hidden sm:block">
          {STATUS_LABEL[task.status?.toLowerCase()] || task.status || "—"}
        </span>

        {/* Actions */}
        <div
          className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
            isTouchDevice ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isDeleted ? (
            <button
              onClick={() => onRestore(task)}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
            >
              Restore
            </button>
          ) : (
            <button
              onClick={() => onDelete(task)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Calendar Page ────
const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(
    isMobileDevice() ? Views.AGENDA : Views.MONTH,
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [showDeleted, setShowDeleted] = useState(false);
  const [mobile, setMobile] = useState(isMobileDevice());

  // Track resize
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = isMobileDevice();
      setMobile(nowMobile);
      if (nowMobile && view !== Views.AGENDA) setView(Views.AGENDA);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [view]);

  // ─── Fetch all tasks ──────
  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((t) => ({ ...t, id: t.id || t._id }));
      setTasks(normalized);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Map tasks → calendar events ─────
  const events = tasks
    .filter((t) => !t.deleted && t.startDate && t.dueDate)
    .filter((t) => filterPriority === "All" || t.priority === filterPriority)
    .map((t) => ({
      id: t.id,
      title: t.title,
      start: new Date(t.startDate),
      end: new Date(t.dueDate),
      priority: t.priority,
      resource: t,
    }));

  // ─── Delete ────
  const handleDelete = async (task) => {
    try {
      await deleteTask(task.id);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, deleted: true } : t)),
      );
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // ─── Restore ───
  const handleRestore = async (task) => {
    try {
      await restoreTask(task.id);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, deleted: false } : t)),
      );
      toast.success("Task restored");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore task");
    }
  };

  // ─── Filtered task list ──
  const filteredList = tasks
    .filter((t) => (showDeleted ? t.deleted : !t.deleted))
    .filter((t) => filterPriority === "All" || t.priority === filterPriority);

  // event styling based on priority
  const eventStyleGetter = (event) => {
    const colors = getPriority(event.priority);
    return {
      style: {
        backgroundColor: colors.bg,
        borderRadius: "6px",
        border: "none",
        color: "white",
        fontSize: "12px",
        fontWeight: 500,
      },
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full px-6 py-6 font-['inter'] space-y-6  max-[400px]:px-2"
    >
      {/* ── Header ─── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            All tasks across your projects
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {/* Priority filter — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {["All", "High", "Medium", "Low"].map((p) => {
              const colors = p !== "All" ? getPriority(p) : null;
              return (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border shrink-0 ${
                    filterPriority === p
                      ? "border-transparent text-white"
                      : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
                  }`}
                  style={
                    filterPriority === p && colors
                      ? { backgroundColor: colors.bg }
                      : filterPriority === p
                        ? { backgroundColor: "#10b981", color: "white" }
                        : {}
                  }
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* View toggle */}
          {!mobile && (
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden self-end">
              <button
                onClick={() => setView(Views.MONTH)}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  view === Views.MONTH
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView(Views.WEEK)}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  view === Views.WEEK
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Week
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Calendar ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden max-[500px]:overflow-auto">
        {mobile && (
          <p className="text-xs text-gray-400 mb-2 text-center">
            Showing agenda view on mobile
          </p>
        )}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center text-gray-400 text-sm">
            Loading tasks...
          </div>
        ) : (
          <div className="">
            <Calendar
              localizer={localizer}
              events={events}
              view={view}
              onView={setView}
              startAccessor="start"
              endAccessor="end"
              style={{ height: mobile ? 400 : 520 }}
              eventPropGetter={eventStyleGetter}
              components={{ event: CalendarEvent }}
              onSelectEvent={(event) => setSelectedEvent(event.resource)}
              toolbar={true}
              popup
            />
          </div>
        )}
      </div>

      {/* ── Task detail popover ─── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: mobile ? 40 : 0,
                scale: mobile ? 1 : 0.95,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: mobile ? 40 : 0,
                scale: mobile ? 1 : 0.95,
              }}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:w-[360px] shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const colors = getPriority(selectedEvent.priority);
                return (
                  <>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="font-semibold text-gray-900 text-[16px] leading-snug">
                        {selectedEvent.title}
                      </h3>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: colors.light,
                          color: colors.text,
                        }}
                      >
                        {selectedEvent.priority}
                      </span>
                    </div>

                    {selectedEvent.description && (
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span className="text-gray-400">Start</span>
                        <span>
                          {selectedEvent.startDate
                            ? moment(selectedEvent.startDate).format(
                                "MMM D, YYYY",
                              )
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="text-gray-400">Due</span>
                        <span>
                          {selectedEvent.dueDate
                            ? moment(selectedEvent.dueDate).format(
                                "MMM D, YYYY",
                              )
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="text-gray-400">Status</span>
                        <span>
                          {STATUS_LABEL[selectedEvent.status?.toLowerCase()] ||
                            selectedEvent.status ||
                            "—"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="mt-5 w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Task list ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-gray-800">
            {showDeleted ? "Deleted Tasks" : "All Tasks"}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredList.length})
            </span>
          </h2>
          <button
            onClick={() => setShowDeleted((v) => !v)}
            className="text-sm text-gray-500 hover:text-gray-800 transition underline underline-offset-2"
          >
            {showDeleted ? "Show active tasks" : "Show deleted tasks"}
          </button>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {showDeleted ? "No deleted tasks" : "No tasks found"}
          </div>
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredList.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarPage;
