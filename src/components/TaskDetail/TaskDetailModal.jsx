import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCalendar,
  LuX,
  LuPaperclip,
  LuTag,
  LuSend,
  LuCheck,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import {
  getProjectMembers,
  updateTask,
  addComment,
  getComments,
} from "../../services/authService";
import { toast } from "react-toastify";
import moment from "moment";
import Dropdown from "../Ui/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MembersDropdown from "../Ui/Addmembersdropdown";

const currentUser = JSON.parse(localStorage.getItem("user"));

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const PRIORITY_COLORS = {
  High: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  Medium: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  Low: { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
};

const STATUS_OPTIONS = [
  { label: "To-Do", value: "Todo" },
  { label: "In Progress", value: "Inprogress" },
  { label: "Review", value: "Review" },
  { label: "Done", value: "Done" },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

// ─── TaskDetailModal ─────────────────────────────────────────────────
const TaskDetailModal = ({ task, projectId, onClose, onUpdate, onRefresh}) => {
  const [form, setForm] = useState({ ...task });
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [savingField, setSavingField] = useState(null); // field name being saved
  const titleRef = useRef(null);
  const fileRef = useRef(null);
  const commentRef = useRef(null);

  // ── Fetch members & comments on mount ─────────
  useEffect(() => {
    const load = async () => {
      try {
        const membersData = await getProjectMembers(projectId);
        const list = membersData?.members ?? membersData?.data?.members ?? [];
        setMembers(list.map((m) => ({ label: m.username, value: m._id })));
      } catch {
        /* silent */
      }

      try {
        const res = await getComments(task._id || task.id);
        const list = res?.data ?? [];
        setComments(list);
      } catch {
        /* silent */
      }
    };
    load();
  }, [projectId, task._id, task.id]);

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);

  // ── Auto-save helper ────
 const autoSave = async (field, value) => {
  setSavingField(field);
  try {
    const res = await updateTask(task._id || task.id, { [field]: value });
      console.log("update response:", res);
    const updated = { ...form, [field]: value };
    setForm(updated);
    onUpdate?.(updated);
    await onRefresh?.();
  } catch  (err) {
    console.log("full error:", err); // 👈 change this
  console.error("error message:", err.message);
  console.error("error stack:", err.stack);
     console.error("autoSave error:", err.response?.data);
    toast.error("Failed to save change");
  } finally {
    setTimeout(() => setSavingField(null), 800);
  }
};

  // ── Title save ─────
  const handleTitleSave = async () => {
    setEditingTitle(false);
    if (titleValue.trim() && titleValue !== form.title) {
      await autoSave("title", titleValue.trim());
    }
  };

  // ── Tag add / remove ────
  const handleAddTag = async () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const newTags = [...tags, trimmed];
    setTags(newTags);
    setTagInput("");
    await autoSave("tags", newTags);
  };

  const handleRemoveTag = async (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    await autoSave("tags", newTags);
  };

  // ── Attachments ───────
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      file: f,
      type: f.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    // call autoSave("attachments", urls)
    toast.info("Attachments added");
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Comments ────────
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(task._id || task.id, commentText.trim());

      const newComment = {
        _id: Date.now(),
        text: commentText.trim(),
        createdAt: new Date(),
        author: {
          name: currentUser?.username || currentUser?.name || "You",
          isCurrentUser: true,
        },
      };

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      setTimeout(
        () => commentRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch (err) {
      console.error("Comment error:", err.response?.data);
      toast.error("Failed to add comment");
    }
  };

  // ── Complete ─────
const handleComplete = async () => {
  await autoSave("status", "Done"); // 👈 capital D
  toast.success("Task marked as complete!");
  onClose();
};

  const priorityColors = PRIORITY_COLORS[form.priority] || PRIORITY_COLORS.Low;

  const assignedName =
    form.assignedTo && typeof form.assignedTo === "object"
      ? form.assignedTo.name
      : (members.find((m) => m.value === form.assignedTo)?.label ?? null);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 font-['inter']"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[780px] max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200"
      >
        {/* ── Header ─ */}
        <div className="sticky top-0 bg-white z-10 px-8 pt-7 pb-4 border-b border-gray-100 max-[400px]:px-4">
          <div className="flex items-start justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {editingTitle ? (
                <input
                  ref={titleRef}
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  className="text-[20px] font-semibold text-gray-900 border-b-2 border-green-500 outline-none w-full bg-transparent"
                />
              ) : (
                <h2 className="text-[20px] font-semibold text-gray-900 truncate">
                  {form.title}
                </h2>
              )}
              <button
                onClick={() => setEditingTitle((v) => !v)}
                className="text-gray-400 hover:text-green-600 transition shrink-0"
              >
                <LuPencil size={16} />
              </button>
            </div>

            {/* Priority badge + close */}
            <div className="flex items-center gap-3 shrink-0">
              {/* {form.priority && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    backgroundColor: priorityColors.bg,
                    color: priorityColors.text,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: priorityColors.dot }}
                  />
                  {form.priority}
                </span>
              )} */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition"
              >
                <LuX size={18} />
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Created {moment(task.createdAt).format("MMM D, YYYY")}</span>
            {assignedName && (
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center font-semibold">
                  {getInitials(assignedName)}
                </span>
                {assignedName}
              </span>
            )}
            {savingField && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className=" font-medium"
              >
                Saving…
              </motion.span>
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="px-8 py-6 space-y-7 max-[300px]:px-4">
          {/* Row 1 — Status + Priority */}
          <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
            <Dropdown
              label="Status"
              value={form.status}
              options={STATUS_OPTIONS}
              onChange={(val) => autoSave("status", val)}
            />
            <Dropdown
              label="Priority"
              value={form.priority}
              options={PRIORITY_OPTIONS}
              onChange={(val) => autoSave("priority", val)}
            />
          </div>

          {/* Row 2 — Assign To + Due Date */}
          <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
            <MembersDropdown
              label="Assign To"
              value={
                form.assignedTo && typeof form.assignedTo === "object"
                  ? form.assignedTo._id
                  : form.assignedTo
              }
              options={members}
              onChange={(val) => autoSave("assignedTo", val)}
            />

            {/*  DatePicker */}
            <div>
              <label className="text-[16px] font-normal text-gray-700 block mb-1">
                Due Date
              </label>
              <DatePicker
                selected={form.dueDate ? new Date(form.dueDate) : null}
                onChange={(date) => autoSave("dueDate", date.toISOString())}
                placeholderText="Select due date"
                dateFormat="MMM d, yyyy"
                className="w-full border rounded-lg px-4 py-[18.5px] text-[16px] border-[#A1A3AB]"
              />
            </div>
          </div>

          {/* Description */}
          {form.description && (
            <div>
              <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                {form.description}
              </p>
            </div>
          )}

          {/* ── Tags ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <LuTag size={13} /> Tags
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-100"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-green-400 hover:text-green-700 transition"
                    >
                      <LuX size={11} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2 max-[350px]:flex-col">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add a tag…"
                className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition max-[400px]:text-[10px]"
              >
                Add
              </button>
            </div>
          </div>

          {/* ── Attachments ──────────────────────────────────────── */}
          <div>
            <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <LuPaperclip size={13} /> Attachments
            </p>
            <div className="space-y-2 mb-3">
              <AnimatePresence>
                {attachments.map((att, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <LuPaperclip size={14} className="text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {att.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {att.size ? `${(att.size / 1024).toFixed(1)} KB` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(i)}
                      className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <LuTrash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition w-full justify-center"
            >
              <LuPaperclip size={15} /> Add Attachments
            </button>
          </div>

          {/* ── Comments ────────── */}
          <div>
            <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-3">
              Comments ({comments.length})
            </p>

            {/* Comment list */}
            <div className="space-y-3 mb-4 max-h-[220px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence>
                {comments.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No comments yet
                  </p>
                )}
                {comments.map((c) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <span className="w-7 h-7 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center font-semibold shrink-0 mt-0.5">
                      {getInitials(c.author?.name || "U")}
                    </span>
                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {c.author?.name || "User"}
                          {c.author?.isCurrentUser && (
                            <span className="text-gray-400 font-normal ml-1">
                              (you)
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {moment(c.createdAt).fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {c.text ?? c.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={commentRef} />
            </div>

            {/* Comment input */}
            <div className="flex gap-2 items-end max-[300px]:flex-col max-[300px]:items-center">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment…"
                rows={2}
                className="flex-1 border border-[#A1A3AB] rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 max-[300px]:w-full max-[300px]:flex max-[300px]:justify-center max-[300px]:items-center"
              >
                <LuSend size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-center">
          <button
            onClick={handleComplete}
           disabled={form.status === "Done"}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium px-8 py-2.5 rounded-xl transition"
          >
            <LuCheck size={16} />
           {form.status === "Done" ? "Completed" : "Complete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
