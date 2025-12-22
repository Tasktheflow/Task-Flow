import React from "react";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import { div } from "framer-motion/client";
import { useState } from "react";
import CreateProjectModal from "../../components/Projectcreation/CreateProject";
import pic from "../../assets/prof.png"



const Projects = () => {
  const { projects } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className=" bg-[url('/src/assets/dashbg.png')] h-screen px-[58px] pt-[55px] font-['inter'] ">
      <div
        className={`${
          projects.length > 0 ? "flex items-center justify-between" : "block"
        } `}
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
      {projects.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 rounded-xl shadow max-w-[295px] py-[30px] px-[14.5px] border border-[#A1A3AB80]"
            >
              
                <div className=" place-self-center flex gap-2.5 items-center">
                  <span
                    className=" size-[19px] block rounded-[50%] "
                    style={{ backgroundColor: project.color }}
                  ></span>
                  <h3 className="font-normal text-[16px]">{project.title}</h3>
                </div>
               <span className=" w-full max-w-[229px] h-[7px] block bg-[#D9D9D9] mx-auto rounded-lg mt-[13px]"></span>
               <div className=" mt-[11px] flex w-full justify-between items-center">
                <p>0 of 1 tasks</p>
                <div class="flex space-x-2">
    <img src={pic} alt="User 2" class="w-10 h-10 rounded-full object-cover" />
    <img src={pic} alt="User 2" class="w-10 h-10 rounded-full object-cover -ml-4" />
    <img src={pic} alt="User 2" class="w-10 h-10 rounded-full object-cover -ml-4" />
  </div>

               </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal closeModal={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Projects;
