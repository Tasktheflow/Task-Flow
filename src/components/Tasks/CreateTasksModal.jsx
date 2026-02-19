import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "../Ui/Dropdown";
import { toast } from "react-toastify";
import { createTasks } from "../../services/authService";

const CreateTaskModal = ({ onClose, onCreate, projectId }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "",
    assignedTo: "",
    dueDate: "",
    startDate: "",
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
    if (!form.priority) newErrors.priority = "Priority is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const newTask = await createTasks({ ...form, projectId });

    const formattedTask = {
  ...newTask.data,
  id: newTask.data.id,
  status: "todo",   
};

  console.log("Created Task:", formattedTask);
    onCreate(formattedTask); 

    toast.success("Task created successfully!");

    onClose();
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(
      error.response?.data?.message || "Failed to create task"
    );
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-['inter']">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-[700px] p-10 overflow-y-auto h-[95%] [&::-webkit-scrollbar]:w-0 max-[820px]:w-[90%] max-[450px]:p-4"
      >
        <h2 className="text-[20px] font-semibold mb-[33px]">Create New Task</h2>
        <span className=" h-px w-full bg-[#74747480] block mb-[33px]"></span>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="text-[20px] font-normal max-[500px]:text-[16px]">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design website dashboard"
              className="w-full mt-1 border rounded-lg px-3 py-[18.5px] pl-6 text-[18px] border-[#A1A3AB] placeholder:text-[20px] max-[400px]:px-1.5 max-[500px]:placeholder:text-[16px] max-[500px]:py-3"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[20px]  font-normal max-[500px]:text-[16px]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this task about?"
              className="w-full mt-1 border rounded-lg px-6 py-4 text-[18px] min-h-[190px] border-[#A1A3AB] placeholder:text-[20px] max-[350px]:px-1.5  max-[500px]:placeholder:text-[16px]"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3 max-[490px]:grid-cols-1">
            <div>
              <label className="text-[20px] font-normal max-[500px]:text-[16px]">
                Due Date
                <span className="text-red-500 pl-1">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-6 py-[18.5px] text-[16px]  border-[#A1A3AB]"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
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
                  { label: "Low", value: "Low" },
                  { label: "Medium", value: "Medium" },
                  { label: "High", value: "High" },
                ]}
              />
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Assign + Due date */}
          <div className="grid grid-cols-2 gap-3 max-[490px]:grid-cols-1">
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
              <label className="text-[20px] font-normal max-[500px]:text-[16px]">Due Date</label>
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
          <label className="flex items-center gap-2 text-[16px] max-[500px]:text-[12px]">
            <input
              type="checkbox"
              name="personal"
              checked={form.personal}
              onChange={handleChange}
            />
            Mark as personal task
          </label>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-4 max-[325px]:flex-col-reverse max-[325px]:w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-[247px] py-2 border rounded-lg text-[15px] text-green-600 max-[325px]:w-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[247px] py-2 bg-green-600 text-white rounded-lg text-[15px] max-[325px]:w-full"
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
