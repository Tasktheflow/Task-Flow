import { Outlet, useParams } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import { useState } from "react";
import CreateProjectModal from "../../components/Projectcreation/CreateProject";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { useLocation } from "react-router";

const Projects = () => {
  const { projects } = useProjects();
  const { projectId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();

  const isProjectDetails = Boolean(projectId);

  return (
    <div className="bg-[url('/src/assets/dashbg.png')] h-screen  pt-[45px] font-['inter']">
      {!isProjectDetails && (
        <>
          <div
            className={`${
              projects.length > 0
                ? "flex items-center justify-between"
                : "block"
            } px-10`}
          >
            <div>
              <h1 className="text-[24px] font-medium">All projects</h1>
              <p className="mt-[11px] text-[20px] font-light">
                Manage your projects and track progress
              </p>
            </div>

            <button
              className={`flex items-center gap-2.5 bg-[#05A301] px-5 py-2.5 rounded-lg cursor-pointer
              ${projects.length === 0 ? "mt-[34px]" : ""}`}
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-white">+</span>
              <p className="text-white text-[15px] font-medium">Add Project</p>
            </button>
          </div>

          {/* Project cards */}
          {projects.length > 0 && (
            <div className="mt-8 grid grid-cols-4 gap-4 px-10">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {/*  Project details render here */}
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
