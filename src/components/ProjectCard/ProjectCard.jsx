import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import { useProjects } from "../Contexts/ProjectsContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import redbin from "../../assets/redbin.png";
import { getProjectsTasks } from "../../services/authService";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { deleteProject } = useProjects();

  useEffect(() => {
    getProjectsTasks(project._id)
      .then((data) => setTasks(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
  }, [project._id]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteProject(project._id);
      toast.success("Project deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/projects/${project._id}`)}
      className="bg-white p-4 rounded-xl shadow max-w-[295px] py-[30px] px-[14.5px] border border-[#A1A3AB80] cursor-pointer group max-[500px]:max-w-[90%]"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2.5 items-center">
          <span
            className="size-[19px] block rounded-[50%]"
            style={{ backgroundColor: project.color || "#10B981" }}
          />
          <h3 className="truncate font-normal text-[16px] max-w-[170px]">
            {project.projectTitle}
          </h3>
        </div>

        {/* Delete button */}
        <div className="overflow-hidden transition-all duration-200 ease-out w-0 group-hover:w-8 max-[800px]:w-8 flex justify-center">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(true); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 max-[800px]:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[229px] h-[7px] bg-[#D9D9D9] mx-auto rounded-lg mt-[13px] overflow-hidden">
        <div
          className="h-full rounded-lg transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: project.color || "#10B981",
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-[11px] flex w-full justify-between items-center">
        <p className="text-sm text-gray-500">
          {completedTasks} of {totalTasks} tasks
        </p>
        <span className="text-xs text-gray-400">{progress}%</span>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-30 h-30 rounded-10 bg-red-50 flex items-center justify-center mx-auto mb-4">
                <img src={redbin} alt="" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  "{project.projectTitle}" will be moved to the Recycle Bin. It will be permanently deleted after 30 days.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;