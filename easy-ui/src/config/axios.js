import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.example.com", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
