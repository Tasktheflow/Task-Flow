// context/ProjectsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getMyProjects,
  createProject,
  deleteProject as deleteProjectAPI,
} from "../../services/authService";

const ProjectsContext = createContext(null);

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getMyProjects();
      setProjects(res.data);
    } catch (error) {
      console.log("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  // In ProjectsContext.jsx - addProject function
  const addProject = async (projectData) => {
    try {
      const res = await createProject(projectData);
      if (res.success) {
        await fetchProjects();
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  // In ProjectsContext.jsx
  const deleteProject = async (projectId) => {
    try {
      const res = await deleteProjectAPI(projectId);

      if (res.success) {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId),
        );
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
        addProject,
        deleteProject,
        showCreateModal,
        setShowCreateModal,
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
