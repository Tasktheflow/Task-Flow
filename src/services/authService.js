import api from "../api/base";


export const registerUser = async (formData) => {
  const response = await api.post("/api/auth/register", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/api/auth/login", formData);
  return response.data;
};

