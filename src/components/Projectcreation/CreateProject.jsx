import { useProjects } from "../Contexts/ProjectsContext";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { createProject } from "../../services/authService";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const CreateProjectModal = ({ onClose, closeModal }) => {
  const { addProject, showCreateModal, setShowCreateModal } = useProjects();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    color: "#10B981",
    teamMembers: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value ? capitalizeWords(value) : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const colors = [
    "#10B981", // green
    "#0000FF", // blue
    "#9CA3AF", // gray
    "#EF4444", // red
    "#FFFF00", // yellow
    "#00FFFF", // cyan
    "#FF8C00", // orange
  ];

  // const teamMembersList = [
  //   {
  //     id: 1,
  //     name: "Samson Adebayo",
  //     email: "samson.a1996@gmail.com",
  //     avatar: "👨🏾",
  //   },
  //   {
  //     id: 2,
  //     name: "Seyibadoo",
  //     email: "seyibadoo123@gmail.com",
  //     avatar: "👨🏿‍🦳",
  //   },
  //   {
  //     id: 3,
  //     name: "H. Oladamola",
  //     email: "h.olatunde03@gmail.com",
  //     avatar: "🧑🏿‍🦲",
  //   },
  // ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    } else if (formData.projectTitle.trim().length < 3) {
      newErrors.projectTitle = "Project title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendInvite = (e) => {
    e.preventDefault();
     e.stopPropagation();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage({ text: "Please enter an email address", type: "error" });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setMessage({
      text: `Invitation sent successfully to ${trimmedEmail}!`,
      type: "success",
    });

    setTimeout(() => {
      setEmail("");
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendInvite();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const res = await addProject(formData); // context handles API

      if (res.success) {
        toast.success("Project created");

        setSubmitted(true);
        setShowCreateModal(false);
        navigate("/dashboard/projects");
        closeModal();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  // const toggleTeamMember = (memberId) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     teamMembers: prev.teamMembers.includes(memberId)
  //       ? prev.teamMembers.filter((id) => id !== memberId)
  //       : [...prev.teamMembers, memberId],
  //   }));
  // };

  return (
    <motion.div
      className=" fixed top-0 left-0 w-screen h-screen bg-[#000000BD] flex justify-center items-center py-7 z-50 font-['inter'] "
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <div className=" bg-white  w-[52.64%] h-[99%] rounded-2xl p-10 overflow-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-gray-100 max-[1024px]:w-[80%] max-[600px]:w-[90%] max-[410px]:w-full max-[410px]:p-4">
        <form className=" ">
          <h1 className=" font-semibold text-[20px]">Create New Project</h1>
          <span className=" w-full h-px bg-[#74747480] mt-[25px] block"></span>
          <div className=" mt-[25px] ">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => {
                  const value = capitalizeWords(e.target.value);

                  setFormData((prev) => ({
                    ...prev,
                     projectTitle: value,
                  }));

                  if (errors.projectTitle) {
                    setErrors((prev) => ({
                      ...prev,
                      projectTitle: "",
                    }));
                  }
                }}
                placeholder="e.g., Website Redesign"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.projectTitle ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.projectTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.projectTitle}</p>
              )}
            </div>
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  });
                  if (errors.description)
                    setErrors({ ...errors, description: "" });
                }}
                placeholder="What is this project about?"
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Project Color
              </label>
              <div className="flex gap-3 max-[505px]:grid max-[505px]:grid-cols-4 max-[505px]:gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-14 h-14 rounded-lg transition-transform ${
                      formData.color === color
                        ? "ring-4 ring-offset-2 ring-gray-400 scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyUp={handleKeyPress}
                  placeholder="samirnasr99@gmail.com"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
                <button
                  onClick={sendInvite} 
                  type="button" 
                  className="px-7 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 active:bg-green-800 transition-colors whitespace-nowrap"
                >
                  Send Invite
                </button>
              </div>

              {message.text && (
                <div
                  className={`mt-3 p-3 rounded-md text-sm border ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>

            {/* Team Members */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Team members
              </label>
              <div className="border border-gray-300 rounded-lg p-4 space-y-3 min-h-[83px]">
                {/* {teamMembersList.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.teamMembers.includes(member.id)}
                      onChange={() => toggleTeamMember(member.id)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="text-2xl">{member.avatar}</div>
                    <div className="flex-1 ">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500 ">
                        {member.email}
                      </div>
                    </div>
                  </label>
                ))} */}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formData.teamMembers.length} member
                {formData.teamMembers.length !== 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="flex gap-3 max-[500px]:flex-col">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Create Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProjectModal;
