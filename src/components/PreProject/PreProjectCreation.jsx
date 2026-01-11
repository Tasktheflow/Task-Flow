import React from 'react'
import { LuRocket } from "react-icons/lu";
import { Users, CheckSquare, Mail } from "lucide-react";
import { IoMdCalendar } from "react-icons/io";
import { IoMdCheckboxOutline } from "react-icons/io";
import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProjects } from '../Contexts/ProjectsContext';
import CreateProjectModal from '../Projectcreation/CreateProject';

const PreProjectCreation = () => {

 const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();



  const { addProject } = useProjects();



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
      avatar: "👨🏽",
    },
    {
      id: 3,
      name: "H. Oladamola",
      email: "h.olatunde03@gmail.com",
      avatar: "👨🏽",
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
  }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      color: "#10B981",
      teamMembers: [],
    });
    setErrors({});
    setSubmitted(false);
  };

  const toggleTeamMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }));
  };

  return (
      <div>
      {/* introduction to TaskFlow */}

      <div className=" w-full flex flex-col gap-5 font-['inter'] bg-[url('/src/assets/dashbg.png')] p-[50px]">
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

        {/* quick start Guide */}

        <h4 className='font-["inter"] text-[20px] font-normal text-center'>
          {" "}
          Quick Start Guide
        </h4>
        <div className="flex w-full justify-between mb-8">
          <div className="bg-[#CCEDEF]  rounded-2xl p-[35px] relative w-[309px]">
            <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
              1
            </div>
            <div className="size-8 bg-[#0251BA] rounded-lg flex items-center justify-center mb-4 shadow-[0px_1px_4px_0px_#00000040]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 0H14.25C15.216 0 16 0.784 16 1.75V14.25C16 14.7141 15.8156 15.1592 15.4874 15.4874C15.1592 15.8156 14.7141 16 14.25 16H1.75C1.28587 16 0.840752 15.8156 0.512563 15.4874C0.184374 15.1592 0 14.7141 0 14.25L0 1.75C0 0.784 0.784 0 1.75 0ZM1.5 1.75V14.25C1.5 14.388 1.612 14.5 1.75 14.5H14.25C14.3163 14.5 14.3799 14.4737 14.4268 14.4268C14.4737 14.3799 14.5 14.3163 14.5 14.25V1.75C14.5 1.6837 14.4737 1.62011 14.4268 1.57322C14.3799 1.52634 14.3163 1.5 14.25 1.5H1.75C1.6837 1.5 1.62011 1.52634 1.57322 1.57322C1.52634 1.62011 1.5 1.6837 1.5 1.75ZM11.75 3C11.9489 3 12.1397 3.07902 12.2803 3.21967C12.421 3.36032 12.5 3.55109 12.5 3.75V11.25C12.5 11.4489 12.421 11.6397 12.2803 11.7803C12.1397 11.921 11.9489 12 11.75 12C11.5511 12 11.3603 11.921 11.2197 11.7803C11.079 11.6397 11 11.4489 11 11.25V3.75C11 3.55109 11.079 3.36032 11.2197 3.21967C11.3603 3.07902 11.5511 3 11.75 3ZM3.5 3.75C3.5 3.55109 3.57902 3.36032 3.71967 3.21967C3.86032 3.07902 4.05109 3 4.25 3C4.44891 3 4.63968 3.07902 4.78033 3.21967C4.92098 3.36032 5 3.55109 5 3.75V9.25C5 9.44891 4.92098 9.63968 4.78033 9.78033C4.63968 9.92098 4.44891 10 4.25 10C4.05109 10 3.86032 9.92098 3.71967 9.78033C3.57902 9.63968 3.5 9.44891 3.5 9.25V3.75ZM8 3C8.19891 3 8.38968 3.07902 8.53033 3.21967C8.67098 3.36032 8.75 3.55109 8.75 3.75V7.25C8.75 7.44891 8.67098 7.63968 8.53033 7.78033C8.38968 7.92098 8.19891 8 8 8C7.80109 8 7.61032 7.92098 7.46967 7.78033C7.32902 7.63968 7.25 7.44891 7.25 7.25V3.75C7.25 3.55109 7.32902 3.36032 7.46967 3.21967C7.61032 3.07902 7.80109 3 8 3Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3 className=" text-[15px]/[19px] mb-2 font-light">
              Create Your First Project
            </h3>
            <p className="  text-[15px]/[19px] font-light mb-[26px]">
              Organize your work by creating a project workspace
            </p>
            <button
              className="w-full bg-[#0251BA] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Project
            </button>
            {/* Create Project */}
            <AnimatePresence>
              {showCreateModal && (
               <CreateProjectModal closeModal={() => setShowCreateModal(false)}/>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-[#C4F2C3] rounded-2xl p-[35px] relative w-[309px]">
            <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
              2
            </div>
            <div className="size-8 bg-[#05A301] rounded-lg flex items-center justify-center mb-4 shadow-[0px_1px_4px_0px_#00000040]">
              <Users className="text-white" size={16} />
            </div>
            <h3 className="text-[15px]/[19px] mb-2 font-light">
              Invite Team Members
            </h3>
            <p className="text-[15px]/[19px] font-light mb-[26px]">
              Collaborate better by inviting your team
            </p>
            <button className="w-full bg-[#05A301] text-white py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"  onClick={() => navigate("/dashboard/projects")}>
              + Invite Team
            </button>
          </div>

          <div className="bg-[#E2C3F7] rounded-2xl p-[35px] relative w-[309px]">
            <div className="absolute top-4 right-4 size-[31px] bg-white rounded-full flex items-center justify-center text-sm font-semibold shadow-[0px_1px_4px_0px_#00000040]">
              3
            </div>
            <div className="size-8 bg-[#7600CA] rounded-lg flex items-center justify-center mb-4 shadow-[0px_1px_4px_0px_#00000040]">
              <CheckSquare className="text-white" size={16} />
            </div>
            <h3 className="text-[15px]/[19px] mb-2 font-light">
              Add Your First Task
            </h3>
            <p className="text-[15px]/[19px] font-light mb-[26px] W-[247px]">
              Start tracking your work by adding a task
            </p>
            <button className="w-full bg-[#7600CA] text-white py-2 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"  onClick={() => navigate("/dashboard/projects")}>
              + Create Task
            </button>
          </div>
        </div>

        {/* Taskflow Functionalities */}

        <div className="bg-white rounded-xl border border-[#A1A3AB80] pt-4 pb-[41px] px-[43.5px] mb-8 shadow-[0px_1px_4px_0px_#00000040]">
          <h2 className="text-xl font-medium  mb-2 text-center">
            What You Can Do with TaskFlow
          </h2>
          <p className="text-center text-[16px] mb-[31px] font-light">
            Everything you need for simple yet structured task management
          </p>

          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <IoMdCheckboxOutline className="text-green-600" size={16} />
              </div>
              <h3 className="text-[16px] mb-2">Clean Kanban Boards</h3>
              <p className="text-sm font-light">
                Organize tasks with drag-and-drop simplicity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <IoMdCalendar className="text-green-600" size={16} />
              </div>
              <h3 className="text-[16px] mb-2">Personalized Calendar</h3>
              <p className="text-sm font-light">
                Never miss a deadline with visual scheduling
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="text-green-600" size={16} />
              </div>
              <h3 className="text-[16px] mb-2">Team Collaboration</h3>
              <p className="text-sm font-light">
                Comments, mentions, and real-time updates
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="text-green-600" size={16} />
              </div>
              <h3 className="text-[16px] mb-2">Personalized Inbox</h3>
              <p className="text-sm font-light">
                Surfacing the most relevant messages for faster, more focused
                action
              </p>
            </div>
          </div>
        </div>

        {/* Explore Taskflow */}

        <div className=" pt-[27px] pb-8 w-full  bg-white border border-[#A1A3AB80] shadow-[0px_1px_4px_0px_#00000040] rounded-2xl">
          <div className=" flex flex-col gap-5">
            <div className=" px-[11px] py-[9.5px] bg-[#05A301] place-self-center flex items-center justify-between rounded-[5px]">
              <span className="material-symbols-outlined size-6 text-white ">
                star_shine
              </span>
            </div>
            <div className=" place-self-center">
              <h2 className=" text-[20px] font-medium text-center mb-2.5">
                Want to Explore First?
              </h2>
              <p className=" font-light text-[16px] text-center w-[570px]">
                You're currently viewing a clean dashboard. In the demo version,
                sample projects and tasks would appear here to help you explore
                TaskFlow's features.
              </p>
            </div>
            <div className=" text-[15px] font-medium flex gap-[42px] place-self-center">
              <button className=" text-white bg-[#05A301] px-[26.5px] py-2.5 rounded-lg shadow-[0px_1px_4px_0px_#00000040] cursor-pointer" onClick={() => setShowCreateModal(true)}>
                + Create Your First Project
              </button>
              <button className=" py-2.5 w-[247px] rounded-lg shadow-[0px_1px_4px_0px_#00000040] border border-[#05A301] text-[#05A301] cursor-pointer" onClick={() => navigate("/dashboard/projects")}>
                + Add A Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* tips section */}

      <div className=" w-full bg-white pt-[81px] pb-[69px] ">
        <div className=" flex justify-evenly">
          <div className=" px-[23px] pt-[17px] pb-[26px] flex gap-[11px] border border-[#74747480] rounded-2xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <IoMdCheckboxOutline className="text-green-600" size={16} />
            </div>
            <div className=" text-[12px] font-['inter'] w-[201px]">
              <h4 className=" mb-2">Pro Tip</h4>
              <p>
                Use keyboard shortcuts: Press 'C' to create a new task quickly
              </p>
            </div>
          </div>
          <div className=" px-[23px] pt-[17px] pb-[26px] flex gap-[11px] border border-[#74747480] rounded-2xl">
            <div className="w-12 h-12 bg-[#C8EAFB80] rounded-lg flex items-center justify-center mx-auto">
              <IoMdCalendar className="text-[#0225FF]" size={16} />
            </div>
            <div className=" text-[12px] font-['inter'] w-[201px]">
              <h4 className=" mb-2">Stay Organized</h4>
              <p>
                Set due dates and priorities to manage your workload effectively
              </p>
            </div>
          </div>
          <div className=" px-[23px] pt-[17px] pb-[26px] flex gap-[11px] border border-[#74747480] rounded-2xl">
            <div className="w-12 h-12 bg-[#E2C3F780] rounded-lg flex items-center justify-center mx-auto">
              <Users className="text-[#A845EF]" size={16} />
            </div>
            <div className=" text-[12px] font-['inter'] w-[201px]">
              <h4 className=" mb-2">Collaborate</h4>
              <p>
                Invite team members to projects and assign tasks to stay in sync
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreProjectCreation