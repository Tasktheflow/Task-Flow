import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "../Ui/Dropdown";
import { toast } from "react-toastify";
import { createTasks } from "../../services/authService";
import { getProjectMembers } from "../../services/authService";
import MembersDropdown from "../Ui/Addmembersdropdown";


const CreateTaskModal = ({ onClose, onCreate, projectId }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignedTo: "",
    dueDate: "",
    startDate: "",
    personal: false,
  });

  const [members, setMembers] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getProjectMembers(projectId);
        console.log("Fetched Members:", data);
        const mapped = data.members.map((m) => ({
          label: m.username,
          value: m._id,
        }));
        setMembers(mapped);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    if (projectId) fetchMembers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true); // 👈 disable button
    try {
      const newTask = await createTasks({ ...form, projectId });
      const formattedTask = {
        ...newTask.data,
        id: newTask.data._id || newTask.data.id,
        status: "todo",
        assignedTo: newTask.data.assignedTo ?? null,
      };
      onCreate(formattedTask);
      toast.success("Task created successfully!");
      onClose();
    } catch (error) {
      console.error("Full error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsSubmitting(false); // 👈 re-enable on success or error
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
            <label className="text-[16px] font-normal max-[500px]:text-[14px]">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design website dashboard"
              className="w-full mt-1 border rounded-lg px-3 py-[18.5px] pl-6 text-[18px] border-[#A1A3AB] placeholder:text-[16px] max-[400px]:px-1.5 max-[500px]:placeholder:text-[16px] max-[500px]:py-3"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[16px]  font-normal max-[500px]:text-[14px]">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this task about?"
              className="w-full mt-1 border rounded-lg px-6 py-4 text-[18px] min-h-[190px] border-[#A1A3AB] placeholder:text-[16px] max-[350px]:px-1.5  max-[500px]:placeholder:text-[16px]"
            />
          </div>

          {/* Start Date + Priority */}
          <div className="grid grid-cols-2 gap-3 max-[490px]:grid-cols-1">
            <div>
              <label className="text-[16px] font-normal max-[500px]:text-[14px]">
                Start Date
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
            <MembersDropdown
              label="Assign To"
              value={form.assignedTo}
              onChange={(value) => {
                console.log("Dropdown returned:", value);
                setForm((prev) => ({ ...prev, assignedTo: value }));
              }}
              options={members}
            />

            <div>
              <label className="text-[16px] font-normal max-[500px]:text-[14px]">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-6 py-[18.5px] text-[16px]  border-[#A1A3AB]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-4 max-[325px]:flex-col-reverse max-[325px]:w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-[247px] py-2 border rounded-lg text-[15px] text-green-600 max-[325px]:w-full max-[325px]:mb-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[247px] py-2 bg-green-600 text-white rounded-lg text-[15px] max-[325px]:w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "+ Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
