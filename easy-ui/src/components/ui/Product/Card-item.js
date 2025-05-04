import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addItem } from "../../../redux/slices/cartSlice";
import AddUi from "../Develop/AddUi";
import { showAlert, showSuccessAlert, showErrorAlert } from "../../utils/Alert";
import CartService from "../../../services/CartService";
import { isFreeProduct, getComponentLikes, checkIfUserLiked, likeComponent, unlikeComponent } from "../../../services/uiComponentsService";

function CardItem({
  item,
  isExpanded,
  onExpand,
}) {
  const cardRef = useRef(null);
  const { name, html, css, js, id: uiComponentId, price, createdBy, previewImage, views, likesCount: initialLikesCount, isLikedByCurrentUser } = item || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isBuying, setIsBuying] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser || false);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle click outside to close expanded card
  useEffect(() => {
    function handleClickOutside(event) {
      if (isExpanded && cardRef.current && !cardRef.current.contains(event.target)) {
        onExpand();
      }
    }

    // Add event listener when card is expanded
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scrolling
      document.body.style.overflow = "auto";
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, onExpand]);
  
  // Only fetch likes if not provided from API
  useEffect(() => {
    const fetchLikesData = async () => {
      if (uiComponentId && (initialLikesCount === undefined || isLikedByCurrentUser === undefined)) {
        try {
          const likes = await getComponentLikes(uiComponentId);
          setLikesCount(likes);
          
          const userLiked = await checkIfUserLiked(uiComponentId);
          setIsLiked(userLiked);
        } catch (error) {
          console.error("Error fetching likes data:", error);
        }
      }
    };
    
    fetchLikesData();
  }, [uiComponentId, initialLikesCount, isLikedByCurrentUser]);
  
  const isFree = !price || price === 0;

  const handleAction = async () => {
    if (isFree) {
      navigate(`/product/${uiComponentId}`);
      return;
    }

    setIsBuying(true);
    try {
      await CartService.addToCart({ uiComponentId, quantity: 1 });
      dispatch(addItem({ 
        uiComponentId, 
        name, 
        price: price || 0,
        quantity: 1 
      }));
      showSuccessAlert("Added to cart successfully!");
    } catch (error) {
      showErrorAlert(error.message || "Failed to add item to cart!");
    } finally {
      setIsBuying(false);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await unlikeComponent(uiComponentId);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likeComponent(uiComponentId);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${uiComponentId}`);
  };

  const handleCardClick = () => {
    if (!isExpanded) {
      onExpand();
    }
  };

  const handleUserProfileClick = (e) => {
    e.stopPropagation();
    if (createdBy?.id) {
      navigate(`/profile/${createdBy.id}`);
    }
  };

  return (
    <>
      <div 
        ref={cardRef} 
        className={`card ${isExpanded ? "expanded" : ""} group`}
        onClick={handleUserProfileClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isExpanded ? (
          <AddUi
            html={html}
            css={css}
            js={js}
            name={name}
            isEdit={false}
          />
        ) : (
          <>
            {/* Preview Image with hover effect */}
            <div className="card-preview" onClick={handleImageClick}>
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={name || "UI Component"} 
                  className="preview-image"
                />
              ) : (
                <div className="preview-placeholder">
                  <span>{name || html || "UI Component"}</span>
                </div>
              )}
              <div className="preview-overlay"></div>
            </div>

            {/* Like button (visible on hover) */}
            <div className={`like-button-container ${isHovered ? 'visible' : ''}`}>
              <button 
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLikeToggle}
              >
                <i className={`fa${isLiked ? 's' : 'r'} fa-heart`}></i>
              </button>
            </div>

            {/* Component info and stats */}
            <div className="component-info">
              <div className="component-author" onClick={handleUserProfileClick}>
                <div className="author-avatar">
                  {createdBy?.avatar ? (
                    <img 
                      src={createdBy.avatar} 
                      alt={createdBy.name || createdBy.fullName || 'Designer'} 
                      className="avatar-img"
                    />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <span className="author-name">
                  {createdBy?.name || createdBy?.fullName || createdBy?.userName || 'Designer'}
                </span>
              </div>

              <div className="component-stats">
                <div className="stat-item">
                  <i className="far fa-heart"></i>
                  <span>{likesCount}</span>
                </div>
                <div className="stat-item">
                  <i className="far fa-eye"></i>
                  <span>{views || 0}</span>
                </div>
              </div>
            </div>

            {/* Price Tag (positioned absolutely) */}
            <div className="price-tag">
              {isFree ? (
                <span className="free-label">Free</span>
              ) : (
                <span className="price-label">${Number(price).toFixed(2)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CardItem;
