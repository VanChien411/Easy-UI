import apiClient from "../config/axios";

export const fetchComments = async (componentId) => {
  try {
    const response = await apiClient.get(`/Comment/component/${componentId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch comments!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const addComment = async (commentData) => {
  try {
    const response = await apiClient.post(`/Comment`, commentData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to add comment!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await apiClient.put(`/Comment/${commentId}`, { content });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update comment!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/Comment/${commentId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete comment!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
