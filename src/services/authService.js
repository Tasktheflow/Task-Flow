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

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreProject = async (id) => {
  const response = await api.patch(`/api/projects/${id}/restore`);
  return response.data;
};

export const inviteMember = async (projectId, email) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/members`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMember = async (projectId, email) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/invite`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectMembers = async (projectId) => {
  try {
    const response = await api.get(`/api/projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTasks = async (form) => {
  const payload = {
    ...form,
    status: "todo",
  };

  const response = await api.post("/api/tasks", payload);
  return response.data;
};

export const getTasks = async (projectId) => {
  const response = await api.get(`/api/tasks?project=${projectId}`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

export const restoreTask = async (id) => {
  const response = await api.patch(`/api/tasks/${id}/restore`);
  return response.data;
};

export const getDeletedProjects = async () => {
  const response = await api.get("/api/projects/deleted");
  return response.data;
};

export const getDeletedTasks = async () => {
  const response = await api.get("/api/tasks/deleted");
  return response.data;
};

export const getMyNotifications = async () => {
  const response = await api.get("/api/getMyNotifications");
  return response.data;
};
