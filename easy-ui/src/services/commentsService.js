import apiClient from "../config/axios";

export const fetchComments = async (componentId) => {
  try {
    const response = await apiClient.get(`/Comment?componentId=${componentId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch comments!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
