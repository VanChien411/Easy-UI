import apiClient from "../config/axios";

export const fetchComments = async (componentId) => {
  try {
    const response = await apiClient.get(`/Comment/component/${componentId}`);
    
    // Process comments to ensure consistent user data structure
    const processedComments = response.data.map(comment => {
      // Extract creator ID from various possible fields
      const creatorId = comment.creatorId || 
                      comment.userId || 
                      (comment.creator && comment.creator.id) ||
                      (comment.user && comment.user.id) ||
                      comment.createdBy;
                      
      // Extract creator name from various possible fields
      const creatorName = comment.creatorName || 
                        (comment.creator && (comment.creator.name || comment.creator.userName)) ||
                        (comment.user && (comment.user.name || comment.user.userName)) ||
                        'Người dùng';
      
      // Return comment with consistent user data
      return {
        ...comment,
        creatorId: creatorId,
        userId: creatorId, // Ensure userId is also set for compatibility
        creatorName: creatorName,
        user: {
          ...(comment.user || {}),
          id: creatorId,
          name: creatorName
        }
      };
    });
    
    return processedComments;
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
