import axios from "axios";

// Create API base URL based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API methods
export const getInitialSymptoms = () => {
  return apiClient.get("/api/get_initial_symptoms");
};

export const diagnoseSymptoms = (symptoms) => {
  return apiClient.post("/api/diagnose", { symptoms });
};

export default apiClient;
