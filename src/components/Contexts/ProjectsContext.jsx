// context/ProjectsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  // 🔹 Projects state (persisted)
  const [projects, setProjects] = useState(() => {
    const storedProjects = localStorage.getItem("projects");
    return storedProjects ? JSON.parse(storedProjects) : [];
  });

  // 🔹 Modal state (shared between Dashboard & Projects)
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔹 Persist projects to localStorage
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // 🔹 Add project
  const addProject = (project) => {
    setProjects((prev) => [
      ...prev,
      {
        id: project.id ?? crypto.randomUUID(), // ✅ ensure id
        ...project,
      },
    ]);
  };

  // 🔹 Delete project
  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        showCreateModal,
        setShowCreateModal,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
