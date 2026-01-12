import React from "react";
import StatsCards from "../DashStatsCards/StatsCards";
import { useProjects } from "../Contexts/ProjectsContext";

const PostProjectCreation = () => {
  const { projects } = useProjects();
  const tasks = projects.flatMap((p) => p.tasks || []);

  const stats = {
    today: 0,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: 0,
    projects: projects.length,
  };
  return (
    <div className=" bg-[url('/src/assets/dashbg.png')] pt-[62px] h-screen px-[54px]">
        <div className=" mb-[30px] font-['inter']">
            <h1 className=" text-[24px] font-medium">Welcome back, Ada <span className=" size-[42px]">👋</span></h1>
            <p className=" text-[20px] font-light">You have 0 tasks to complete today</p>
        </div>
      <StatsCards stats={stats} />
    </div>
  );
};

export default PostProjectCreation;
