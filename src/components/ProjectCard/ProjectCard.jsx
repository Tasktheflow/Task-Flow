import { useNavigate } from "react-router";
import pic from "../../assets/prof.png";
import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import { useProjects } from "../Contexts/ProjectsContext";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const { deleteProject } = useProjects();

  const handleCardClick = () => {
    navigate(`/dashboard/projects/${project.id}`);
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
            style={{ backgroundColor: project.color }}
          ></span>
          <div className="relative group max-w-[200px]">
            <h3 className="truncate font-normal text-[16px]">
              {project.title}
            </h3>

            <div className="absolute z-50 hidden group-hover:block bg-white text-black text-sm px-3 py-2 rounded-lg -top-10 left-0 whitespace-normal w-max max-w-xs shadow-lg">
              {project.title}
            </div>
          </div>
        </div>
        {/* Trash icon wrapper */}
        <div
          className="
        overflow-hidden
        transition-all duration-200 ease-out
        w-0 group-hover:w-8
        flex justify-center
      "
        >
          <button
            onClick={(e) => {
              if (!window.confirm("Delete this project?")) return;
              e.preventDefault();
              e.stopPropagation();
              deleteProject(project.id);
            }}
            className="
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          text-gray-400 hover:text-red-500
          p-1 rounded hover:bg-red-50
        "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <span className=" w-full max-w-[229px] h-[7px] block bg-[#D9D9D9] mx-auto rounded-lg mt-[13px]"></span>
      <div className=" mt-[11px] flex w-full justify-between items-center">
        <p>0 of 1 tasks</p>
        <div class="flex space-x-2">
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
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
