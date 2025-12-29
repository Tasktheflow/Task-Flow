import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "../Ui/Dropdown";

const CreateTaskModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    dueDate: "",
    personal: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Task title is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.priority) newErrors.priority = "Priority is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onCreate({
      ...form,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ADD THIS LINE
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-['inter']">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-[700px] p-10 overflow-y-auto h-[95%] [&::-webkit-scrollbar]:w-0"
      >
        <h2 className="text-[20px] font-semibold mb-[33px]">Create New Task</h2>
        <span className=" h-px w-full bg-[#74747480] block mb-[33px]"></span>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="text-[20px] font-normal">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design website dashboard"
              className="w-full mt-1 border rounded-lg px-3 py-[18.5px] pl-6 text-[18px] border-[#A1A3AB] placeholder:text-[20px]"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[20px]  font-normal">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this task about?"
              className="w-full mt-1 border rounded-lg px-6 py-4 text-[18px] min-h-[190px] border-[#A1A3AB] placeholder:text-[20px]"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Dropdown
                label="Status"
                required
                value={form.status}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, status: value }));
                  if (errors.status) {
                    setErrors((prev) => ({ ...prev, status: "" }));
                  }
                }}
                options={[
                  { label: "To-Do", value: "todo" },
                  { label: "In Progress", value: "progress" },
                  { label: "Review", value: "review" },
                  { label: "Done", value: "done" },
                ]}
              />

              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
              )}
            </div>

            <div>
              <Dropdown
                label="Priority"
                required
                value={form.priority}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, priority: value }));
                  if (errors.priority) {
                    setErrors((prev) => ({ ...prev, priority: "" }));
                  }
                }}
                options={[
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ]}
              />
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Assign + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Assign To"
              value={form.assignee}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, assignee: value }))
              }
              options={[
                { label: "Ada", value: "Ada" },
                { label: "Dave", value: "Dave" },
                { label: "Tems", value: "Tems" },
              ]}
            />

            <div>
              <label className="text-[20px] font-normal">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-6 py-[18.5px] text-[16px]  border-[#A1A3AB]"
              />
            </div>
          </div>

          {/* Personal */}
          <label className="flex items-center gap-2 text-[16px]">
            <input
              type="checkbox"
              name="personal"
              checked={form.personal}
              onChange={handleChange}
            />
            Mark as personal task
          </label>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-[247px] py-2 border rounded-lg text-[15px] text-green-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[247px] py-2 bg-green-600 text-white rounded-lg text-[15px]"
            >
              + Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;