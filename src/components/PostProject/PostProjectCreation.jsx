
// This page shows the dashboard after a project is created. It welcomes the user and shows some stats about their projects and tasks. It also includes an image to make the dashboard more visually appealing.

// The component uses the `useProjects` hook to access the projects data and calculate the stats. It also retrieves the user's name from local storage to personalize the welcome message. The stats include the number of tasks in progress and the total number of projects.


import React from "react";
import StatsCards from "../DashStatsCards/StatsCards";
import { useProjects } from "../Contexts/ProjectsContext";
import proimage from "../../assets/productivity.png";

const PostProjectCreation = () => {
  const { projects } = useProjects();
  const tasks = projects.flatMap((p) => p.tasks || []);
  const user = JSON.parse(localStorage.getItem("user"));

  const stats = {
    today: 0,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: 0,
    projects: projects.length,
  };
  return (
    <div className=" bg-[url('/src/assets/dashbg.png')] pt-[62px] h-screen px-[54px] max-[500px]:px-3.5 max-[500px]:pt-3">
        <div className=" mb-[30px] font-['inter']">
            <h1 className=" text-[24px] font-medium">Welcome back, {user?.username} <span className=" size-[42px]">👋</span></h1>
            <p className=" text-[20px] font-light">You have 0 tasks to complete today</p>
        </div>
        <div>
          {/* <img src={proimage} alt="Productivity" className=" h-[300px] w-[70%]"/> */}
        </div>
      <StatsCards stats={stats} />
    </div>
  );
};

export default PostProjectCreation;
