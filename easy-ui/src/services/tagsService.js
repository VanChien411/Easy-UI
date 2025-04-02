import apiClient from "../config/axios";

export const fetchTags = async () => {
  try {
    const response = await apiClient.get("/Tag");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch tags!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
