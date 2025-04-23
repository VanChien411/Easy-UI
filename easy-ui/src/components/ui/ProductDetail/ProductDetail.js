import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaShare, FaDownload, FaCheck, FaRegCopy, FaStar, FaRegStar, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { fetchUIComponentById } from '../../../services/uiComponentsService';
import { fetchComments, addComment, updateComment, deleteComment } from '../../../services/commentsService';
import { showAlert } from '../../../components/utils/Alert';
import './ProductDetail.css';

// Component hiển thị và copy code
const CodeDisplay = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-display">
      <div className="code-header">
        <span className="language-label">{language}</span>
        <button onClick={handleCopy} className="copy-button">
          {copied ? <FaCheck /> : <FaRegCopy />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
};



// Component chính
const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('product');
  const [codeTab, setCodeTab] = useState('html');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Get user from redux state
  const authState = useSelector(state => state.auth);
  const isAuthenticated = authState?.isAuthenticated;
  const currentUser = authState?.user;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchUIComponentById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCommentsData = async () => {
      try {
        setLoadingComments(true);
        const commentsData = await fetchComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (id) {
      fetchProductData();
      fetchCommentsData();
    }
  }, [id]);

  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle submitting a new comment with rating
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      showAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để bình luận',
        type: 'warning'
      });
      return;
    }

    if (commentText.trim() === '') {
      showAlert({
        title: 'Lỗi',
        message: 'Vui lòng nhập nội dung bình luận',
        type: 'error'
      });
      return;
    }

    try {
      setSubmitting(true);
      const commentData = {
        componentId: id,
        content: commentText,
        rating: rating || null
      };

      const newComment = await addComment(commentData);
      
      // Add user info to the comment for immediate display
      // Lấy ID người dùng từ JWT payload, từ ASP.NET Core có trường nameidentifier
      const currentUserId = currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                        currentUser?.nameidentifier || 
                        currentUser?.sub || 
                        currentUser?.id || 
                        currentUser?.userId || 
                        currentUser?.nameid;
                        
      // Lấy tên người dùng từ JWT payload
      const userName = currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                       currentUser?.name || 
                       currentUser?.userName || 
                       currentUser?.email || 
                       'Người dùng';
      
      const commentWithUser = {
        ...newComment,
        creatorName: userName,
        creatorId: currentUserId,
        userId: currentUserId,
        user: {
          id: currentUserId,
          name: userName
        }
      };
      
      console.log('New comment with JWT user:', commentWithUser);
      console.log('Current user from JWT:', currentUser);
      
      setComments(prevComments => [commentWithUser, ...prevComments]);
      setCommentText('');
      setRating(0);
      
      showAlert({
        title: 'Thành công',
        message: 'Đã thêm bình luận thành công',
        type: 'success'
      });
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
    if (!editCommentText.trim()) return;

    try {
      await updateComment(editingCommentId, editCommentText);
      
      // Update the comment in the local state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === editingCommentId 
            ? { ...comment, content: editCommentText, updatedAt: new Date().toISOString() } 
            : comment
        )
      );
      
      // Reset editing state
      setEditingCommentId(null);
      setEditCommentText('');
      
      showAlert({
        title: 'Thành công',
        message: 'Bình luận đã được cập nhật',
        type: 'success'
      });
    } catch (err) {
      showAlert({
        title: 'Lỗi',
        message: 'Không thể cập nhật bình luận. Vui lòng thử lại sau.',
        type: 'error'
      });
      console.error('Error updating comment:', err);
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
      try {
        await deleteComment(commentId);
        
        // Remove the comment from local state
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentId)
        );
        
        showAlert({
          title: 'Thành công',
          message: 'Bình luận đã được xóa',
          type: 'success'
        });
      } catch (err) {
        showAlert({
          title: 'Lỗi',
          message: 'Không thể xóa bình luận. Vui lòng thử lại sau.',
          type: 'error'
        });
        console.error('Error deleting comment:', err);
      }
    }
  };


  
  // Check if the current user is the author of a comment
  const isCommentAuthor = (comment) => {
    // Log để debug
    console.log('Comment:', comment);
    console.log('Current user from JWT:', currentUser);
    
    if (!isAuthenticated || !currentUser) {
      console.log('User not authenticated or currentUser is null');
      return false;
    }
    
    // Lấy ID người dùng từ JWT token payload
    // Từ hình ảnh console, thấy JWT có trường nameidentifier chứa ID người dùng
    const currentUserId = currentUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                        currentUser.nameidentifier || 
                        currentUser.sub || 
                        currentUser.id || 
                        currentUser.userId || 
                        currentUser.nameid;
    
    console.log('Current user ID from JWT:', currentUserId);
    
    // Lấy ID người tạo comment từ nhiều trường có thể
    const commentAuthorId = comment.creatorId || comment.userId || 
                         (comment.user && comment.user.id);
    
    console.log('Comment author ID:', commentAuthorId);
    
    // Kiểm tra các trường hợp và so sánh ID
    const isAuthor = commentAuthorId && currentUserId && 
           (commentAuthorId.toString() === currentUserId.toString());
    
    console.log('Is author?', isAuthor);
    return isAuthor;
  };

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!product) {
    return <div className="not-found-container">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoChevronBackOutline /> Trở lại
        </button>
        <h1 className="product-title">{product.name}</h1>
        <div className="product-actions">
          <button className="action-button like-button" onClick={() => setIsLiked(!isLiked)}>
            {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
            <span>Yêu thích</span>
          </button>
          <button className="action-button">
            <FaShare />
            <span>Chia sẻ</span>
          </button>
          <button className="action-button download-button">
            <FaDownload />
            <span>Tải xuống</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-content">
        <div className="content-left">
          {/* Tabs */}
          <div className="content-tabs">
            <button 
              className={`tab-button ${activeTab === 'product' ? 'active' : ''}`}
              onClick={() => setActiveTab('product')}
            >
              Sản phẩm
            </button>
            <button 
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả
            </button>
            <button 
              className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Bình luận
            </button>
          </div>

          {/* Preview Area */}
          <div className="preview-area">
            {activeTab === 'product' && (
              <>
                
                <div className="source-code-section">
                  <div className="code-tabs">
                    <button 
                      className={`code-tab ${codeTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setCodeTab('preview')}
                    >
                      Preview
                    </button>
                    <button 
                      className={`code-tab ${codeTab === 'html' ? 'active' : ''}`}
                      onClick={() => setCodeTab('html')}
                    >
                      HTML
                    </button>
                    <button 
                      className={`code-tab ${codeTab === 'css' ? 'active' : ''}`}
                      onClick={() => setCodeTab('css')}
                    >
                      CSS
                    </button>
                    <button 
                      className={`code-tab ${codeTab === 'javascript' ? 'active' : ''}`}
                      onClick={() => setCodeTab('javascript')}
                    >
                      JavaScript
                    </button>
                  </div>
                  <div className="code-content">
                    {codeTab === 'preview' ? (
                      <div className="preview-iframe">
                        <iframe 
                          srcDoc={`
                            <html>
                              <style>${product.css || ''}</style>
                              <body>${product.html || ''}</body>
                              <script>${product.js || ''}</script>
                            </html>
                          `}
                          title="preview"
                        />
                      </div>
                    ) : (
                      <CodeDisplay 
                        code={
                          codeTab === 'html' 
                            ? product.html || '' 
                            : codeTab === 'css' 
                            ? product.css || '' 
                            : product.js || ''
                        } 
                        language={codeTab.toUpperCase()}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'description' && (
              <div className="description-content">
                <div className="description-section">
                  <p>{product.description || 'Không có mô tả chi tiết.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="comments-content">
                <div className="add-comment-section">
                  <div className="rating-section">
                    <h3>Đánh giá và bình luận</h3>
                    <div className="stars-container">
                      {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                          <label key={index}>
                            <input 
                              type="radio" 
                              name="rating" 
                              value={ratingValue} 
                              onClick={() => setRating(ratingValue)}
                              disabled={submitting || !isAuthenticated}
                            />
                            {ratingValue <= (hover || rating) 
                              ? <FaStar className="star" onMouseEnter={() => !submitting && setHover(ratingValue)} onMouseLeave={() => !submitting && setHover(0)} /> 
                              : <FaRegStar className="star" onMouseEnter={() => !submitting && setHover(ratingValue)} onMouseLeave={() => !submitting && setHover(0)} />}
                          </label>
                        );
                      })}
                      <span className="rating-text">{rating ? `${rating}/5` : "Chưa đánh giá"}</span>
                    </div>
                  </div>
                  
                  <textarea 
                    className="comment-input" 
                    placeholder={isAuthenticated ? "Nhập bình luận của bạn..." : "Đăng nhập để bình luận..."}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={submitting || !isAuthenticated}
                  ></textarea>
                  <button 
                    className="comment-button" 
                    onClick={handleSubmitComment} 
                    disabled={submitting || !isAuthenticated || commentText.trim() === ''}
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                  </button>
                </div>
                <div className="comments-section">
                  <h3>Các bình luận</h3>
                  {loadingComments ? (
                    <div className="loading-comments">Đang tải bình luận...</div>
                  ) : comments && comments.length > 0 ? (
                    <div className="comments-list">
                      {comments.map((comment) => (
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
                                  className="save-edit-button" 
                                  onClick={() => handleSaveEdit(comment.id)}
                                  disabled={submitting}
                                >
                                  {submitting ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button 
                                  className="cancel-edit-button" 
                                  onClick={handleCancelEdit}
                                  disabled={submitting}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </div>
                          ) : (
                            editingCommentId === comment.id ? (
                              <div className="edit-comment-form">
                                <textarea
                                  className="edit-comment-input"
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  placeholder="Chỉnh sửa bình luận..."
                                  rows="3"
                                />
                                <div className="edit-buttons">
                                  <button
                                    className="cancel-edit-button"
                                    onClick={handleCancelEdit}
                                    disabled={submitting}
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    className="save-edit-button"
                                    onClick={handleSaveEdit}
                                    disabled={submitting || !editCommentText.trim()}
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="comment-content">{comment.content}</div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-comments">Chưa có bình luận nào.</div>
                  )}
                </div> {/* Hiển thị form thêm bình luận mới */}
               
              </div>
            )}
          </div>
        </div>

        {/* Product Info Sidebar */}
        <div className="product-sidebar">

          <div className="creator-section">
            <div className="creator-info">
              <span className="creator-name">{product.creatorName || 'EasyUI'}</span>
              <span className="creator-label">Tác giả</span>
            </div>
          </div>

          <div className="product-stats">
            <div className="stat-item">
              <span className="stat-label">Cập nhật</span>
              <span className="stat-value">{formatDate(product.createdAt)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lượt tải</span>
              <span className="stat-value">{product.downloads || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lượt xem</span>
              <span className="stat-value">{product.views || 0}</span>
            </div>
            {product.rating && (
              <div className="stat-item">
                <span className="stat-label">Đánh giá</span>
                <span className="stat-value">{product.rating}/5</span>
              </div>
            )}
          </div>

          <div className="product-tags">
            <div className="tag-label">Thẻ</div>
            <div className="tags-container">
              {product.tags && product.tags.length > 0 ? (
                product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))
              ) : (
                <p>Không có thẻ nào.</p>
              )}
            </div>
          </div>

          <div className="product-categories">
            <div className="categories-label">Danh mục</div>
            <div className="categories-container">
              {product.categories && product.categories.length > 0 ? (
                product.categories.map((category, index) => (
                  <span key={index} className="category">{category}</span>
                ))
              ) : (
                <p>Không có danh mục nào.</p>
              )}
            </div>
          </div>
          
          <button className="download-button-secondary">
            <FaDownload /> Tải xuống
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 