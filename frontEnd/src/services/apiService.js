import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("No response from server. Is the backend running?");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Patient API calls
export const patientAPI = {
  getAllPatients: () => apiClient.get("/patients"),
  createPatient: (patientData) => apiClient.post("/patients", patientData),
};

// Appointment API calls
export const appointmentAPI = {
  getAllAppointments: () => apiClient.get("/appointments"),
  createAppointment: (appointmentData) =>
    apiClient.post("/appointments", appointmentData),
};

export default apiClient;
