import React from 'react'
import { useNavigate } from "react-router";

const ProjectCard = ({ project }) => {

     const navigate = useNavigate();
  return (
     <div className="mt-8 grid grid-cols-4 md:grid-cols-4 gap-4 w-full justify-between" onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
          {projects.map((project) => (
            <Link to='projectDetails'
              key={project.id}
              className="bg-white p-4 rounded-xl shadow max-w-[295px] py-[30px] px-[14.5px] border border-[#A1A3AB80] cursor-pointer"
            >
              <div className=" place-self-center flex gap-2.5 items-center">
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
                    class="w-10 h-10 rounded-full object-cover -ml-4"
                  />
                  <img
                    src={pic}
                    alt="User 2"
                    class="w-10 h-10 rounded-full object-cover -ml-4"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
  )
}

export default ProjectCard