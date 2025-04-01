import apiClient from "../config/axios"; // Correct relative path

export const register = async (data) => {
  try {
    const response = await apiClient.post("/Auth/register", data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem("authToken", token); // Save token to localStorage
    }
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed!";
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error with message
  }
};

export const login = async (data) => {
  try {
    const response = await apiClient.post("/Auth/login", data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem("authToken", token); // Save token to localStorage
    }
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed!";
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error with message
  }
};
