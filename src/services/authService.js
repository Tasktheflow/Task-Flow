import api from "../api/base";

export const registerUser = async (formData) => {
  const response = await api.post("/api/auth/register", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/api/auth/login", formData);
  return response.data;
};

export const createProject = async (formData) => {
  const response = await api.post("/api/projects", formData);
  return response.data;
};

export const getMyProjects = async () => {
  const response = await api.get("/api/projects");
  return response.data;
};

// services/authService.js

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/api/projects/${projectId}`); // ✅ This matches your backend route
    return response.data;
  } catch (error) {
    throw error;
  }
};
