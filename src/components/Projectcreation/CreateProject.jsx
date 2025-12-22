import { useProjects } from "../Contexts/ProjectsContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const CreateProjectModal = ({ onClose, closeModal }) => {
  const { addProject, showCreateModal, setShowCreateModal  } = useProjects();
  const navigate = useNavigate();

//   const handleSubmit = () => {
//     const newProject = {
//       id: Date.now(),
//       title: "My New Project",
//     };

//     addProject(newProject);
//     onClose();
//     navigate("/dashboard/projects");
//   };


   const [formData, setFormData] = useState({
      title: "",
      description: "",
      color: "#10B981",
      teamMembers: [],
    });
  
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
  
    const teamMembersList = [
      {
        id: 1,
        name: "Samson Adebayo",
        email: "samson.a1996@gmail.com",
        avatar: "👨🏾",
      },
      {
        id: 2,
        name: "Seyibadoo",
        email: "seyibadoo123@gmail.com",
        avatar: "👨🏿‍🦳",
      },
      {
        id: 3,
        name: "H. Oladamola",
        email: "h.olatunde03@gmail.com",
        avatar: "🧑🏿‍🦲",
      },
    ];
  
    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.title.trim()) {
        newErrors.title = "Project title is required";
      } else if (formData.title.trim().length < 3) {
        newErrors.title = "Project title must be at least 3 characters";
      }
  
      if (!formData.description.trim()) {
        newErrors.description = "Project description is required";
      } else if (formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = () => {
      if (validateForm()) {
      addProject({
        id: Date.now(),
        ...formData,
      });
  
      
      // 2. Mark form submitted
      setSubmitted(true);
  
      // 3. Optionally log
      console.log("Project Data:", formData);
  
      // 4. Close modal (if you have a state for modal)
      setShowCreateModal(false);
  
      // 5. Navigate to Projects page
      navigate("/dashboard/projects");

      closeModal();
    }
    };
  
    // const handleCancel = () => {
    //   setFormData({
    //     title: "",
    //     description: "",
    //     color: "#10B981",
    //     teamMembers: [],
    //   });
    //   setErrors({});
    //   setSubmitted(false);
    // };
  
    const toggleTeamMember = (memberId) => {
      setFormData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.includes(memberId)
          ? prev.teamMembers.filter((id) => id !== memberId)
          : [...prev.teamMembers, memberId],
      }));
    };
  
  
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
                  <div className=" bg-white  w-[52.64%] h-[99%] rounded-2xl p-10 overflow-auto">
                    <form className=" ">
                      <h1 className=" font-semibold text-[20px]">
                        Create New Project
                      </h1>
                      <span className=" w-full h-px bg-[#74747480] mt-[25px] block"></span>
                      <div className=" mt-[25px] ">
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Project Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              });
                              if (errors.title)
                                setErrors({ ...errors, title: "" });
                            }}
                            placeholder="e.g., Website Redesign"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              errors.title
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.title}
                            </p>
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
                              errors.description
                                ? "border-red-500"
                                : "border-gray-300"
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
                          <div className="flex gap-3">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, color })
                                }
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

                        {/* Team Members */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-3">
                            Team members
                          </label>
                          <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                            {teamMembersList.map((member) => (
                              <label
                                key={member.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.teamMembers.includes(
                                    member.id
                                  )}
                                  onChange={() => toggleTeamMember(member.id)}
                                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                />
                                <div className="text-2xl">{member.avatar}</div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {member.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {member.email}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {formData.teamMembers.length} member
                            {formData.teamMembers.length !== 1 ? "s" : ""}{" "}
                            selected
                          </p>
                        </div>
                        <div className="flex gap-3">
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
