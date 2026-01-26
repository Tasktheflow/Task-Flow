import axios from "axios";

const api = axios.create({
  baseURL: "https://taskflow-backend-64ud.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
