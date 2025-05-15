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
    const { token, refreshToken, user } = response.data;
    
    // Return both token and user data for Redux store
    return { token, refreshToken, user };
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
    const { token, refreshToken, user } = response.data;
    
    // Return both token, refreshToken and user data for Redux store
    return { token, refreshToken, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed!";
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error with message
  }
};

// Google login function
export const googleLogin = async (googleToken) => {
  try {
    const response = await apiClient.post("/Auth/google-login", { googleToken });
    const { token, refreshToken, user } = response.data;
    
    // Return both token, refreshToken and user data for Redux store
    return { token, refreshToken, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Google login failed!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Refresh token function - lấy token mới khi token hiện tại hết hạn
export const refreshToken = async (refreshTokenStr) => {
  try {
    const response = await apiClient.post("/Auth/refresh-token", { 
      refreshToken: refreshTokenStr 
    });
    
    const { token, refreshToken: newRefreshToken } = response.data;
    
    return { token, refreshToken: newRefreshToken };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to refresh token!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Revoke token function - vô hiệu hóa refresh token khi logout
export const revokeToken = async (refreshTokenStr) => {
  try {
    await apiClient.post("/Auth/revoke-token", { 
      refreshToken: refreshTokenStr 
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to revoke token!";
    console.error(errorMessage);
    // Không throw error ở đây để không làm gián đoạn quá trình logout
    return { success: false, error: errorMessage };
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
