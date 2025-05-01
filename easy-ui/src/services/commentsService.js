import apiClient from "../config/axios";

export const fetchComments = async (componentId) => {
  try {
    console.log(`API Call: Fetching comments for component ID: ${componentId}`);
    
    // Based on the Swagger screenshot, the correct endpoint is: GET /api/Comment/component/{componentId}
    // But our baseURL already has /api, so we use: /Comment/component/{componentId}
    const url = `/Comment/component/${componentId}`;
    console.log('Making GET request to:', url);
    
    const response = await apiClient.get(url, {
      timeout: 30000 // 30 seconds timeout
    });
    
    console.log('Raw API response:', response);
    
    // Check if response data is array, if not handle appropriately
    const commentsData = Array.isArray(response.data) ? response.data : [];
    
    if (commentsData.length === 0) {
      console.log('No comments found for this component');
    }
    
    // Process comments to ensure consistent user data structure
    const processedComments = commentsData.map(comment => {
      console.log('Processing comment:', comment);
      
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
    
    console.log('Processed comments:', processedComments);
    return processedComments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    
    // Provide more detailed error info
    const errorInfo = {
      message: error.response?.data?.message || error.message || "Failed to fetch comments!",
      status: error.response?.status,
      data: error.response?.data,
      isTimeout: error.code === 'ECONNABORTED'
    };
    
    console.error("Error details:", errorInfo);
    throw new Error(errorInfo.message);
  }
};

export const addComment = async (commentData) => {
  try {
    console.log('Adding comment with data:', commentData);
    const response = await apiClient.post(`/Comment`, commentData);
    console.log('Add comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to add comment!";
    throw new Error(errorMessage);
  }
};

export const updateComment = async (commentId, content) => {
  try {
    console.log(`Updating comment ${commentId} with content:`, content);
    const response = await apiClient.put(`/Comment/${commentId}`, { content });
    console.log('Update comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to update comment!";
    throw new Error(errorMessage);
  }
};

export const deleteComment = async (commentId) => {
  try {
    console.log(`Deleting comment ${commentId}`);
    const response = await apiClient.delete(`/Comment/${commentId}`);
    console.log('Delete comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to delete comment!";
    throw new Error(errorMessage);
  }
};
