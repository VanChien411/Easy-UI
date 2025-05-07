import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://easy-ui-backend.onrender.com/api" ,
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true // Enable credentials for CORS
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Check all possible token storage locations
    const token = 
      localStorage.getItem("authToken") || 
      localStorage.getItem("auth_token") || 
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");
    
    if (token) {
      console.log("Found auth token, adding to request headers");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No auth token found for request");
    }
    
    // Log the final request config for debugging
    console.log(`${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    
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
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
