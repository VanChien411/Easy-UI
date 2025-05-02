import { useState, useEffect, useCallback } from 'react';
import { fetchComments, addComment, updateComment, deleteComment } from '../services/commentsService';
import useAuth from './useAuth';

/**
 * Custom hook to manage comments functionality
 * @param {string} componentId - The ID of the component to fetch comments for
 * @returns {Object} Comment state and functions
 */
const useComments = (componentId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch comments
  const loadComments = useCallback(async () => {
    if (!componentId) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching comments for component: ${componentId}`);
      const data = await fetchComments(componentId);
      console.log("Fetched comments:", data);
      
      // Add user information to comments if missing
      const processedComments = data.map(comment => ({
        ...comment,
        creatorName: comment.creatorName || comment.userName || 'Người dùng',
      }));
      
      setComments(processedComments);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [componentId]);

  // Add a new comment
  const createComment = async (content, rating = null) => {
    if (!isAuthenticated || !componentId) {
      return { success: false, message: 'Authentication required' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the comment data according to the API schema seen in Swagger
      const commentData = {
        componentId: componentId,
        content: content,
        // Only include rating if it's provided and not null
        ...(rating && { rating: rating })
      };
      
      console.log("Creating comment with data:", commentData);
      const newComment = await addComment(commentData);
      console.log("API response for new comment:", newComment);
      
      // Make sure we have a properly formatted comment object
      const commentWithUser = {
        ...newComment,
        componentId: componentId,
        creatorName: user?.name || user?.userName || 'Người dùng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setComments(prev => [commentWithUser, ...prev]);
      return { success: true, comment: commentWithUser };
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      console.error('Error adding comment:', err);
      return { success: false, message: err.message || 'Failed to add comment' };
    } finally {
      setLoading(false);
    }
  };

  // Edit a comment
  const editComment = async (commentId, content) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Authentication required' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Editing comment ${commentId} with content: ${content}`);
      await updateComment(commentId, content);
      
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content, updatedAt: new Date().toISOString() } 
            : comment
        )
      );
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update comment');
      console.error('Error updating comment:', err);
      return { success: false, message: err.message || 'Failed to update comment' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const removeComment = async (commentId) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Authentication required' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Deleting comment ${commentId}`);
      await deleteComment(commentId);
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      console.error('Error deleting comment:', err);
      return { success: false, message: err.message || 'Failed to delete comment' };
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user is the author of a comment
  const isCommentAuthor = (comment) => {
    if (!isAuthenticated || !user) {
      console.log('Not authenticated or no user data');
      return false;
    }
    
    // Get current user ID from various possible JWT token fields
    const currentUserId = user.id || 
                      user.nameid || 
                      user.sub || 
                      user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
    if (!currentUserId) {
      console.log('Cannot determine current user ID');
      return false;
    }
    
    // Get comment author ID from various possible fields
    const commentAuthorId = comment.creatorId || 
                         comment.userId || 
                         (comment.creator && comment.creator.id) ||
                         (comment.user && comment.user.id) ||
                         comment.createdBy;
    
    console.log('Comparing user IDs:', {
      commentData: comment,
      commentAuthorId,
      currentUserId,
      currentUser: user,
      isMatch: commentAuthorId && commentAuthorId.toString() === currentUserId.toString()
    });
    
    if (!commentAuthorId) {
      console.log('Cannot determine comment author ID');
      return false;
    }
    
    // Compare IDs as strings to handle different formats
    return commentAuthorId.toString() === currentUserId.toString();
  };

  // Load comments on mount or componentId change
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    loadComments,
    createComment,
    editComment,
    removeComment,
    isCommentAuthor
  };
};

export default useComments;
