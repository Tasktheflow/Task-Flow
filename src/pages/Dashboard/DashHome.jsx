import React from "react";
import { LuRocket } from "react-icons/lu";
import { Users, CheckSquare, Layout } from "lucide-react";

const DashHome = () => {
  return (
    <div className=" w-full flex flex-col gap-5">
      <div className=" size-12.5 bg-[#05A301] rounded-lg flex items-center justify-center shadow-[0px_4px_4px_0px_#00000040] place-self-center">
        <LuRocket size={22.75} color="white" />
      </div>
      <h2 className=' text-center font-["inter"] text-[24px] font-medium '>
        Welcome to TaskFlow, Ada! 🎉
      </h2>
      <p className='w-full  font-["inter"] text-[24px]/[34px] text-center font-light max-w-[859px] place-self-center'>
        You're all set! Let's get you started with your first project or task.
        TaskFlow helps you stay organized and get work done efficiently.
      </p>
      <h4 className='font-["inter"] text-[20px] font-normal text-center'>
        {" "}
        Quick Start Guide
      </h4>
      <div className="flex w-full justify-between mb-8">
        <div
          className="bg-[#CCEDEF]  rounded-2xl p-[35px] relative w-[309px]"
        >
          <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
            1
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Layout className="text-white" size={24} />
          </div>
          <h3 className=" text-[15px]/[19px] mb-2 font-light">
            Create Your First Project
          </h3>
          <p className="  text-[15px]/[19px] font-light mb-[26px]">
            Organize your work by creating a project workspace
          </p>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
            + Create Project
          </button>
        </div>

        <div className="bg-[#C4F2C3] rounded-2xl p-[35px] relative w-[309px]">
          <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
            2
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-white" size={24} />
          </div>
          <h3 className="text-[15px]/[19px] mb-2 font-light">
            Invite Team Members
          </h3>
          <p className="text-[15px]/[19px] font-light mb-[26px]">
            Collaborate better by inviting your team
          </p>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
            + Invite Team
          </button>
        </div>

        <div className="bg-[#E2C3F7] rounded-2xl p-[35px] relative w-[309px]">
          <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
            3
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <CheckSquare className="text-white" size={24} />
          </div>
          <h3 className="text-[15px]/[19px] mb-2 font-light">
            Add Your First Task
          </h3>
          <p className="text-[15px]/[19px] font-light mb-[26px] W-[247px]">
            Start tracking your work by adding a task
          </p>
          <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
            + Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
