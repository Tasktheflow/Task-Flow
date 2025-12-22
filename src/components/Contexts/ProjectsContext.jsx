// context/ProjectsContext.jsx
import { createContext, useContext, useState } from "react";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
   const [showCreateModal, setShowCreateModal] = useState(false);

  const addProject = (project) => {
    setProjects(prev => [...prev, project]);
  };

  

  return (
    <ProjectsContext.Provider value={{ projects, addProject, showCreateModal, setShowCreateModal }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
