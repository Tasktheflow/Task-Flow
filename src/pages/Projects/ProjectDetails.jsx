import { useParams } from "react-router";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const project = projects.find((p) => String(p.id) === projectId);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className=" w-full"
    >
      <header className=" px-[57px] flex items-center w-full justify-between border-b border-[#A1A3AB4D] pb-[25px]">
        <div>
          <div className=" flex gap-7">
            <button onClick={() => navigate(-1)}>
              <IoArrowBackOutline size={24} className=" font-light" />
            </button>
            <div className=" flex items-center justify-between gap-2.5">
              {" "}
              <span
                className=" size-[19px] block rounded-[50%] "
                style={{ backgroundColor: project.color }}
              ></span>
              <h2 className="text-[20px] font-light ">{project.title}</h2>
            </div>
          </div>
          {/* <p className="mt-2 text-gray-600">{project.description}</p> */}
        </div>
        <div className=" flex gap-[17px] items-center">
          <button className=" flex items-center justify-center bg-[#05A301] px-5 py-2.5 rounded-lg gap-2.5 text-white cursor-pointer">
            {" "}
            <span className=" text-[16px] ">+</span>Add Task
          </button>
          <button className=" flex items-center justify-center px-5 py-2.5 bg-transparent border border-[#05A301] text-[#05A301] text-[15px] font-medium rounded-lg gap-[7px] cursor-pointer">
            <MdGroupAdd className=" size-[19.5px]" />
            Add Task
          </button>
        </div>
      </header>
    </motion.div>
  );
};

export default ProjectDetails;
