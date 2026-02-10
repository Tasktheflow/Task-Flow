import { useNavigate } from "react-router";
import pic from "../../assets/prof.png";
import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import { useProjects } from "../Contexts/ProjectsContext";
import { toast } from "react-toastify";
import { useState } from "react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { deleteProject } = useProjects();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteProject(project._id);
      toast.success("Project deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleCardClick = () => {
    console.log("🔍 Navigating to project ID:", project._id);
    navigate(`/dashboard/projects/${project._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-4 rounded-xl shadow max-w-[295px] py-[30px] px-[14.5px] border border-[#A1A3AB80] cursor-pointer group"
    >
      <div className=" flex justify-between items-center">
        <div className=" flex gap-2.5 items-center">
          <span
            className=" size-[19px] block rounded-[50%] "
            style={{ backgroundColor: project.color || "#10B981" }}
          ></span>
          <div className="relative group max-w-[200px] max-[500px]:w-full">
            <h3 className="truncate font-normal text-[16px] w-full">
              {project.projectTitle}
            </h3>

            {/* <div className="absolute z-50 hidden group-hover:block bg-black text-white text-[12px] px-3 py-2 rounded-lg -bottom-10 left-0 whitespace-normal w-max max-w-xs shadow-lg">
              {project.projectTitle} 
            </div> */}
          </div>
        </div>
        {/* Trash icon wrapper */}
        <div
          className="
        overflow-hidden
        transition-all duration-200 ease-out
        w-0 group-hover:w-8
         max-[800px]:w-8 
        flex justify-center
      "
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          text-gray-400 hover:text-red-500
          p-1 rounded hover:bg-red-50 max-[800px]:opacity-100 max-[800px]:group-hover:opacity-0
        "
          >
            <Trash2 size={18} />
          </button>
        </div>
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(false);
            }}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete "{project.projectTitle}"?
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <span className=" w-full max-w-[229px] h-[7px] block bg-[#D9D9D9] mx-auto rounded-lg mt-[13px]"></span>
      <div className=" mt-[11px] flex w-full justify-between items-center">
        <p>0 of 1 tasks</p>
        {/* <div class="flex space-x-2">
          <img
            src={pic}
            alt="User 2"
            class="w-10 h-10 rounded-full object-cover"
          />
          <img
            src={pic}
            alt="User 2"
            class="w-10 h-10 rounded-full object-cover -ml-6"
          />
          <img
            src={pic}
            alt="User 2"
            class="w-10 h-10 rounded-full object-cover -ml-6"
          />
        </div> */}
      </div>
    </div>
  );
};

export default ProjectCard;
