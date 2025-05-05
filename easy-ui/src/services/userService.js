import apiClient from "../config/axios"; // Correct relative path

export const register = async (data) => {
  try {
    // Đảm bảo gửi đúng dữ liệu theo model AspNetUsers
    const userData = {
      userName: data.userName || "",  // Sử dụng email làm username nếu không có
      email: data.email || "",
      password: data.password || "",
      fullName: data.fullName || "",
      phoneNumber: data.phoneNumber || "",
      avatar: data.avatar || ""
    };
    
    const response = await apiClient.post("/Auth/register", userData);
    const { token, user } = response.data;
    
    // Return both token and user data for Redux store
    return { token, user };
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
    const { token, user } = response.data;
    
    // Return both token and user data for Redux store
    return { token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed!";
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error with message
  }
};

// Get the current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/Auth/me");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch user profile!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch user data!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
