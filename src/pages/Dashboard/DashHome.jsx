import React, { useState, useEffect } from "react";
import { useProjects } from "../../components/Contexts/ProjectsContext";
import PreProjectCreation from "../../components/PreProject/PreProjectCreation";
import PostProjectCreation from "../../components/PostProject/PostProjectCreation";

const DashHome = () => {
  const { projects } = useProjects();
  const [hasSeenWelcome, setHasSeenWelcome] = useState(
    () => localStorage.getItem("hasSeenWelcome") === "true"
  );

  const hasProjects = (projects?.length || 0) > 0;

  useEffect(() => {
    if (!hasSeenWelcome) {
      localStorage.setItem("hasSeenWelcome", "true");
      setHasSeenWelcome(true);
    }
  }, []);

  // Show welcome screen only on first ever visit
  if (!hasSeenWelcome) {
    return <PreProjectCreation />;
  }

  return <div>{!hasProjects ? <PostProjectCreation /> : <PostProjectCreation />}</div>;
};

export default DashHome;