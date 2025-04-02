import apiClient from "../config/axios";

export const fetchUIComponents = async () => {
  try {
    const response = await apiClient.get("/UIComponent");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch UI components!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
