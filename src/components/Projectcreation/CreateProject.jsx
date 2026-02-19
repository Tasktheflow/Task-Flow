import { useProjects } from "../Contexts/ProjectsContext";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { addMember } from "../../services/authService";
import { toast } from "react-toastify";

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const CreateProjectModal = ({ onClose, closeModal }) => {
  const { addProject, setShowCreateModal } = useProjects();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([]); // [{ email, checked }]
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    color: "#10B981",
  });

  const [errors, setErrors] = useState({});

  const colors = ["green", "blue", "gray", "red", "yellow", "teal", "orange"];

  const selectedCount = invitedEmails.filter((m) => m.checked).length;

  // ─── Validation ───────────────────────────────────────────────────────────

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

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

  // ─── Add email locally (no API call yet) ─────────────────────────────────

  const handleAddEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setEmailError("Please enter an email address.");
      return;
    }
    if (!validateEmail(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (invitedEmails.find((m) => m.email === trimmed)) {
      setEmailError("This email has already been added.");
      return;
    }

    setInvitedEmails((prev) => [...prev, { email: trimmed, checked: true }]);
    setEmail("");
    setEmailError("");
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") handleAddEmail(e);
  };

  const toggleMember = (targetEmail) => {
    setInvitedEmails((prev) =>
      prev.map((m) =>
        m.email === targetEmail ? { ...m, checked: !m.checked } : m
      )
    );
  };

  const removeMember = (targetEmail) => {
    setInvitedEmails((prev) => prev.filter((m) => m.email !== targetEmail));
  };

  // ─── Submit: create project first → then addMember for each selected ──────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await addProject(formData);

      if (!res.success) {
        toast.error(res.message || "Failed to create project");
        return;
      }

      toast.success("Project created!");

      // Close immediately — don't wait for member invites
      setShowCreateModal(false);
      closeModal();
      navigate("/dashboard/projects");

      // Add members in the background
      const projectId = res.data?._id;
      const selectedEmails = invitedEmails
        .filter((m) => m.checked)
        .map((m) => m.email);

        console.log("projectId:", projectId, "emails:", selectedEmails)

      if (projectId && selectedEmails.length > 0) {
        Promise.allSettled(
          selectedEmails.map((memberEmail) => addMember(projectId, memberEmail))
        ).then((memberResults) => {
          memberResults.forEach((result, i) => {
            if (result.status === "rejected") {
              const errMsg =
                result.reason?.response?.data?.message || "Unknown error";
              toast.error(`Could not add ${selectedEmails[i]}: ${errMsg}`);
            }
          });

          const successCount = memberResults.filter(
            (r) => r.status === "fulfilled"
          ).length;

          if (successCount > 0) {
            toast.success(
              `${successCount} member${successCount > 1 ? "s" : ""} added!`
            );
          }
        });
      }
    } catch (error) {
      console.error("handleSubmit error:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────

  return (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen bg-[#000000BD] flex justify-center items-center py-7 z-50 font-['inter']"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="bg-white w-[52.64%] h-[99%] rounded-2xl p-10 overflow-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-gray-100 max-[1024px]:w-[80%] max-[600px]:w-[90%] max-[410px]:w-full max-[410px]:p-4">
        <form onSubmit={handleSubmit}>
          <h1 className="font-semibold text-[20px]">Create New Project</h1>
          <span className="w-full h-px bg-[#74747480] mt-[25px] block" />

          <div className="mt-[25px]">

            {/* Project Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => {
                  const value = capitalizeWords(e.target.value);
                  setFormData((prev) => ({ ...prev, projectTitle: value }));
                  if (errors.projectTitle)
                    setErrors((prev) => ({ ...prev, projectTitle: "" }));
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
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
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Color Picker */}
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

            {/* Invite by Email */}
            <div className="space-y-2 mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Invite Team Members
              </label>
              <div className="flex gap-3 max-[430px]:flex-col">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onKeyUp={handleKeyUp}
                  placeholder="samirnasr99@gmail.com"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  disabled={!email.trim()}
                  className="px-7 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 active:bg-green-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Team Members List */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Team Members
              </label>
              <div className="border border-gray-300 rounded-lg p-4 space-y-3 min-h-[83px]">
                {invitedEmails.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Added emails will appear here
                  </p>
                ) : (
                  invitedEmails.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition group"
                    >
                      <input
                        type="checkbox"
                        id={`member-${member.email}`}
                        checked={member.checked}
                        onChange={() => toggleMember(member.email)}
                        className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-2 focus:ring-green-500 cursor-pointer"
                      />
                      {/* Avatar initial */}
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center uppercase shrink-0">
                        {member.email[0]}
                      </div>
                      <label
                        htmlFor={`member-${member.email}`}
                        className="flex-1 text-sm cursor-pointer text-gray-800"
                      >
                        {member.email}
                      </label>
                      {/* Remove — visible on hover */}
                      <button
                        type="button"
                        onClick={() => removeMember(member.email)}
                        className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Remove"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {selectedCount} member{selectedCount !== 1 ? "s" : ""} selected
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 max-[500px]:flex-col">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating…" : "+ Create Project"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProjectModal;
