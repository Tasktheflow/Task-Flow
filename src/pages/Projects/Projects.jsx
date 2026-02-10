import { Outlet, useParams, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import { useState } from "react";
import CreateProjectModal from "../../components/Projectcreation/CreateProject";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import octicon from "../../assets/octicon.png"

const Projects = () => {
  const { projects, loading } = useProjects();
  const { projectId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();

  const isProjectDetails = Boolean(projectId);

  return (
    <div className="bg-[url('/src/assets/dashbg.png')] h-screen pt-[45px] font-['inter']">
      {!isProjectDetails && (
        <>
          <div className="flex items-center justify-between px-10 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2.5">
            <div>
              <h1 className="text-[24px] font-medium">All projects</h1>
              <p className="mt-[11px] text-[20px] font-light">
                Manage your projects and track progress
              </p>
            </div>

            <button
              className="flex items-center gap-2.5 bg-[#05A301] px-5 py-2.5 rounded-lg"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-white">+</span>
              <p className="text-white text-[15px] font-medium">Add Project</p>
            </button>
          </div>

          {loading && <p className="px-10 mt-6">Loading projects...</p>}

          {!loading && projects?.length === 0 && (
            <div className=" mt-20 w-full flex justify-center items-center">
             <div className="flex flex-col items-center justify-center text-center">
              <img src={octicon} alt="" className=" mb-[25px]"/>
              <p className=" text-[16px] font-light mb-[11px]">No Projects Yet</p>
              <h4 className="  font-light text-[20px]">Create your first project to start organizing your team's work!</h4>
             </div>
            </div>
          )}

          {!loading && projects?.length > 0 && (
            <div className="mt-8 grid grid-cols-4 gap-4 px-10 max-[1250px]:grid-cols-3 max-[1010px]:grid-cols-2 max-[600px]:grid-cols-1">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      {showCreateModal && (
        <CreateProjectModal closeModal={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Projects;
