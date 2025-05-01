import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import useComments from '../../../hooks/useComments';
import useAuth from '../../../hooks/useAuth';
import { fetchComments } from '../../../services/commentsService';
import './ProductDetail.css';

const CommentsPanel = ({ onClose, componentId }) => {
  // Get auth state
  const { isAuthenticated } = useAuth();
  
  // State for direct testing and display
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [displayComments, setDisplayComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  
  // Use the custom hook to manage comments
  const { 
    comments, 
    loading: loadingComments, 
    createComment, 
    editComment, 
    removeComment, 
    isCommentAuthor 
  } = useComments(componentId);
  
  // Direct test function to call API without the hook
  const testDirectApiCall = useCallback(async () => {
    setTestLoading(true);
    try {
      const result = await fetchComments(componentId);
      setTestResult({ success: true, data: result });
      
      // Update display comments with the directly fetched results
      if (Array.isArray(result) && result.length > 0) {
        setDisplayComments(result);
      }
    } catch (error) {
      console.error('Direct API test error:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setTestLoading(false);
    }
  }, [componentId]);
  
  // Test API directly on mount
  useEffect(() => {
    if (componentId) {
      testDirectApiCall();
    }
  }, [componentId, testDirectApiCall]);
  
  // Update displayComments whenever comments from the hook changes
  useEffect(() => {
    if (Array.isArray(comments) && comments.length > 0) {
      setDisplayComments(comments);
    } else if (testResult && testResult.success && Array.isArray(testResult.data) && testResult.data.length > 0) {
      // Fallback to test data if hook data is empty
      setDisplayComments(testResult.data);
    }
  }, [comments, testResult]);
  
  // State for adding new comments
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // State for editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Show alert message
  const showAlert = ({ title, message, type }) => {
    // Simple implementation - replace with your preferred alert system
    console.log(`[${title}]: ${message} (${type})`);
    alert(`${title}: ${message}`);
  };

  // Handle submitting a new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting || !isAuthenticated) return;
    
    setSubmitting(true);
    
    try {
      const result = await createComment(commentText, rating || null);
      
      if (result.success) {
        setCommentText('');
        setRating(0);
        
        showAlert({
          title: 'Thành công',
          message: 'Đã thêm bình luận thành công',
          type: 'success'
        });
      } else {
        showAlert({
          title: 'Lỗi',
          message: result.message || 'Không thể thêm bình luận. Vui lòng thử lại sau.',
          type: 'error'
        });
      }
    } catch (err) {
      showAlert({
        title: 'Lỗi',
        message: 'Không thể thêm bình luận. Vui lòng thử lại sau.',
        type: 'error'
      });
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  // Save edited comment
  const handleSaveEdit = async () => {
    if (!editCommentText.trim() || submitting) return;
    
    setSubmitting(true);
    
    try {
      const result = await editComment(editingCommentId, editCommentText);
      
      if (result.success) {
        // Reset editing state
        setEditingCommentId(null);
        setEditCommentText('');
        
        showAlert({
          title: 'Thành công',
          message: 'Bình luận đã được cập nhật',
          type: 'success'
        });
      } else {
        showAlert({
          title: 'Lỗi',
          message: result.message || 'Không thể cập nhật bình luận. Vui lòng thử lại sau.',
          type: 'error'
        });
      }
    } catch (err) {
      showAlert({
        title: 'Lỗi',
        message: 'Không thể cập nhật bình luận. Vui lòng thử lại sau.',
        type: 'error'
      });
      console.error('Error updating comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      setSubmitting(true);
      
      try {
        const result = await removeComment(commentId);
        
        if (result.success) {
          showAlert({
            title: 'Thành công',
            message: 'Bình luận đã được xóa',
            type: 'success'
          });
        } else {
          showAlert({
            title: 'Lỗi',
            message: result.message || 'Không thể xóa bình luận. Vui lòng thử lại sau.',
            type: 'error'
          });
        }
      } catch (err) {
        showAlert({
          title: 'Lỗi',
          message: 'Không thể xóa bình luận. Vui lòng thử lại sau.',
          type: 'error'
        });
        console.error('Error deleting comment:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="panel-header">
        <h3 className="panel-title">Bình luận & Đánh giá</h3>
        <button onClick={onClose} className="panel-close-button">
          ×
        </button>
      </div>

      {isAuthenticated ? (
        <div className="add-comment-section">
          <form onSubmit={handleSubmitComment}>
            <div className="rating-input">
              <p>Đánh giá:</p>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <span 
                    key={index} 
                    onClick={() => setRating(index + 1)}
                    className="rating-star-input"
                  >
                    {index < rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
            </div>
            
            <textarea
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              rows="3"
              disabled={submitting}
            ></textarea>
            
            <button 
              type="submit" 
              className="submit-comment-button"
              disabled={submitting || !commentText.trim()}
            >
              {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-notice">
          <p>Vui lòng đăng nhập để bình luận.</p>
        </div>
      )}

      <div className="comments-section">
        <h3>Các bình luận</h3>
        {testLoading || loadingComments ? (
          <div className="loading-comments">Đang tải bình luận...</div>
        ) : displayComments && displayComments.length > 0 ? (
          <>
            <div className="comments-list">
              {(showAllComments ? displayComments : displayComments.slice(0, 3)).map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-user-info">
                      <span className="comment-author">{comment.creatorName || 'Người dùng'}</span>
                      {comment.rating && (
                        <div className="comment-rating">
                          {[...Array(5)].map((_, index) => (
                            <span key={index}>
                              {index < comment.rating ? <FaStar className="rating-star" /> : <FaRegStar className="rating-star" />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="comment-meta">
                      <span className="comment-date">{formatDate(comment.updatedAt || comment.createdAt)}</span>
                      {isCommentAuthor(comment) && (
                        <div className="comment-actions">
                          <button 
                            className="action-button edit-button" 
                            onClick={() => handleEditComment(comment)}
                            aria-label="Chỉnh sửa bình luận"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-button delete-button" 
                            onClick={() => handleDeleteComment(comment.id)}
                            aria-label="Xóa bình luận"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="edit-comment-form">
                      <textarea 
                        className="edit-comment-input" 
                        value={editCommentText} 
                        onChange={(e) => setEditCommentText(e.target.value)}
                        disabled={submitting}
                      ></textarea>
                      <div className="edit-buttons">
                        <button 
                          className="cancel-edit-button" 
                          onClick={handleCancelEdit}
                          disabled={submitting}
                        >
                          <FaTimes />
                        </button>
                        <button 
                          className="save-edit-button" 
                          onClick={handleSaveEdit}
                          disabled={submitting || !editCommentText.trim()}
                        >
                          {submitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-content">{comment.content}</div>
                  )}
                </div>
              ))}
            </div>
            
            {displayComments.length > 3 && !showAllComments && (
              <div className="show-more-comments">
                <button 
                  className="show-more-button"
                  onClick={() => setShowAllComments(true)}
                >
                  Xem thêm bình luận ({displayComments.length - 3})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-comments">Chưa có bình luận nào.</div>
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;
