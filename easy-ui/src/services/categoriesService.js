import apiClient from "../config/axios";

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/Category");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch categories!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
