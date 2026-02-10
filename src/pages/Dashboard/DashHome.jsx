import React from "react";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import PreProjectCreation from "../../components/PreProject/PreProjectCreation";
import PostProjectCreation from "../../components/PostProject/PostProjectCreation";

const DashHome = () => {
  const { projects } = useProjects();

  const hasProjects = (projects?.length || 0) > 0;

  return (
    <div>{!hasProjects ? <PreProjectCreation /> : <PostProjectCreation />}</div>
  );
};

export default DashHome;
