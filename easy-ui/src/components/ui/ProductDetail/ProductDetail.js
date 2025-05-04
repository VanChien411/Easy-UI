import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaShare, FaBookmark, FaRegBookmark, 
  FaInfoCircle, FaCommentAlt, FaSpinner, FaRegCopy, FaCheck, FaUserPlus, FaUserCheck, FaChevronRight } from 'react-icons/fa';
// Import fetchUIComponentById to get UI component data
import { 
  fetchUIComponentById, 
  getComponentLikes,
  checkIfUserLiked,
  likeComponent,
  unlikeComponent,
  fetchTrendingUIComponents
} from '../../../services/uiComponentsService';
import useAuth from '../../../hooks/useAuth';
import CommentsPanel from './CommentsPanel';
import DetailsPanel from './DetailsPanel';
import SharePanel from './SharePanel';
import './ProductDetail.css';
import CartService from "../../../services/CartService";
import { addItem } from "../../../redux/slices/cartSlice";
import { showSuccessAlert, showErrorAlert } from "../../utils/Alert";
import { useDispatch } from 'react-redux';
import UserManagerService from '../../../services/usermanagerService';
import CardItem from '../Product/Card-item';

// Component hiển thị và copy code - Will be used later when implementing code display functionality
// This component for displaying and copying code
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

// Component for displaying code with tabs and preview
const CodePanel = ({ html, css, js, onClose }) => {
  const [activeTab, setActiveTab] = useState('html');
  const iframeRef = React.useRef(null);

  const updatePreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    
    const combinedCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `;
    
    iframeDoc.write(combinedCode);
    iframeDoc.close();
  }, [html, css, js]);

  const handleDownload = useCallback(() => {
    // Create a combined HTML file with all code
    const fullCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UI Component</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;

    // Create a blob from the code
    const blob = new Blob([fullCode], { type: 'text/html' });
    
    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ui-component.html';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }, [html, css, js]);

  useEffect(() => {
    if (iframeRef.current) {
      updatePreview();
    }
  }, [activeTab, updatePreview]);

  return (
    <div className="code-panel-container">
      <div className="panel-header">
        <h3>Component Code</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="code-preview-layout">
        <div className="code-section">
          <div className="code-tabs">
            <button 
              className={`tab-button ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              HTML
            </button>
            <button 
              className={`tab-button ${activeTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              CSS
            </button>
            <button 
              className={`tab-button ${activeTab === 'js' ? 'active' : ''}`}
              onClick={() => setActiveTab('js')}
            >
              JavaScript
            </button>
          </div>
          
          <div className="code-editor-container">
            {activeTab === 'html' && <CodeDisplay code={html} language="HTML" />}
            {activeTab === 'css' && <CodeDisplay code={css} language="CSS" />}
            {activeTab === 'js' && <CodeDisplay code={js} language="JavaScript" />}
          </div>
        </div>
        
        <div className="preview-section">
          <div className="preview-actions">
            <button className="download-button" onClick={handleDownload}>
              Download
            </button>
            <button className="preview-button" onClick={updatePreview}>
              Preview
            </button>
          </div>
          <iframe 
            ref={iframeRef}
            className="live-preview-frame" 
            title="Live Preview"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// Component for displaying similar products with horizontal scrolling
const SimilarProducts = ({ currentProductId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch random trending products
        const response = await fetchTrendingUIComponents('popular', 1, 8);
        const products = response.items || response;
        
        // Filter out the current product if present
        const filteredProducts = products.filter(product => 
          product.id !== currentProductId
        );
        
        setSimilarProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setSimilarProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSimilarProducts();
  }, [currentProductId]);
  
  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 300; // Amount to scroll each time
    const currentScroll = container.scrollLeft;
    
    container.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };
  
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
    // Scroll to top when navigating to a new product
    window.scrollTo(0, 0);
  };
  
  if (isLoading) {
    return (
      <div className="similar-products-section">
        <div className="similar-products-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  if (similarProducts.length === 0) {
    return null; // Don't render section if no similar products
  }
  
  return (
    <div className="similar-products-section">
      
      <div className="similar-products-container">
        <button 
          className="scroll-button scroll-left"
          onClick={() => handleScroll('left')}
        >
          &#10094;
        </button>
        
        <div className="similar-products-scroll" ref={scrollContainerRef}>
          {similarProducts.map((product) => (
            <div 
              key={product.id} 
              className="similar-product-card"
              onClick={() => handleCardClick(product.id)}
            >
              <div className="similar-product-image">
                <img 
                  src={product.previewImage || '/placeholder.svg'} 
                  alt={product.name || 'UI Component'} 
                />
              </div>
              <div className="similar-product-info">
                <h3 className="similar-product-title">{product.name || 'UI Component'}</h3>
                <p className="similar-product-author">
                  {product.createdBy?.name || product.createdBy?.fullName || 'Designer'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="scroll-button scroll-right"
          onClick={() => handleScroll('right')}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, userId } = useAuth();
  const dispatch = useDispatch();
  
  // States for UI
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activePanel, setActivePanel] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [creatorId, setCreatorId] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const [creatorComponents, setCreatorComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const [product, setProduct] = useState({
    id: "123",
    title: "Modern UI Component",
    description: "An elegant UI component for modern web applications",
    image: "/placeholder.svg?height=600&width=800",
    designer: {
      name: "Design Studio",
      // Will be replaced with "Design Studio for [username]" when data is fetched
      company: "EasyUI", 
      avatar: "/placeholder.svg?height=40&width=40",
      available: true
    }
  });
  
  // Check if current user is the creator
  const isCurrentUserCreator = useMemo(() => {
    if (!userId || !creatorId) return false;
    return String(userId) === String(creatorId);
  }, [userId, creatorId, user]);
      
  // Fetch follow status when component mounts
  const fetchFollowStatus = useCallback(async () => {
    if (!isAuthenticated || !creatorId || isCurrentUserCreator) {
      return;
    }
    
    try {
      // Use the dedicated follow checking method
      const isFollowing = await UserManagerService.isFollowingUser(creatorId);
      // Lưu trạng thái follow vào localStorage để giữ nguyên trạng thái
      if (isFollowing) {
        localStorage.setItem(`follow_${creatorId}`, 'true');
      } else {
        localStorage.removeItem(`follow_${creatorId}`);
      }
      setIsFollowing(!!isFollowing); // Ensure boolean value
    } catch (error) {
      // Kiểm tra trong localStorage nếu API lỗi
      const storedFollowState = localStorage.getItem(`follow_${creatorId}`);
      if (storedFollowState === 'true') {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
      console.error('Failed to fetch follow status:', error);
    }
  }, [isAuthenticated, creatorId, isCurrentUserCreator]);

  // Update useEffect to fetch data including follow status
  useEffect(() => {
    // Use a ref to track if the component is mounted to prevent duplicate fetches
    let isMounted = true;
    let hasLoaded = false;

    const fetchData = async () => {
      if (hasLoaded) return; // Skip if already loaded

      try {
        setLoading(true);
        
        // Fetch UI component data using the ID from URL params
        if (id) {
          try {
            // Get UI component data which should include author information
            const componentData = await fetchUIComponentById(id);
            
            // Check if component is still mounted before updating state
            if (!isMounted) return;
            
            // If we have the component data, update our product state
            if (componentData) {
              // Extract the creator information from the component data
              const creator = componentData.creator || {};
              const authorName = creator.fullName || creator.userName || "Unknown Author";
              const authorAvatar = creator.avatar || "/placeholder.svg?height=40&width=40";
              
              // Store the creator ID for follow functionality - ensure it's a string for comparison
              const extractedCreatorId = creator.id || null;
              setCreatorId(extractedCreatorId);
              setCreatorName(authorName);
              
              // Multiple possible locations for isFollowedByCurrentUser
              let followStatus = false;
              
              if (creator.hasOwnProperty('isFollowedByCurrentUser')) {
                followStatus = creator.isFollowedByCurrentUser;
              } else if (componentData.hasOwnProperty('isFollowedByCurrentUser')) {
                followStatus = componentData.isFollowedByCurrentUser;
              } else if (componentData.hasOwnProperty('isFollowing')) {
                followStatus = componentData.isFollowing;
              } else if (creator.hasOwnProperty('isFollowing')) {
                followStatus = creator.isFollowing;
              }
              
              // Set the follow status if found
              if (typeof followStatus === 'boolean') {
                setIsFollowing(followStatus);
              }
              
              // Update the product with data from API
              setProduct({
                id: componentData.id,
                title: componentData.name || "UI Component",
                description: componentData.description || "An elegant UI component for modern web applications",
                image: componentData.previewImage || "/placeholder.svg?height=600&width=800",
                // Include HTML, CSS, JS code if available
                html: componentData.html || "",
                css: componentData.css || "",
                js: componentData.js || "",
                price: componentData.price || 0,
                views: componentData.views || 0,
                downloads: componentData.downloads || 0,
                rating: componentData.rating || 0,
                likesCount: componentData.likesCount || 0,
                createdAt: componentData.createdAt,
                categories: componentData.categories || [],
                tags: componentData.tags || [],
                comments: componentData.comments || [],
                designer: {
                  name: authorName,
                  // Format with the creator's name
                  company: `${authorName}`,
                  avatar: authorAvatar,
                  available: true
                },
                creator: creator
              });
            }
          } catch (error) {
            // Keep using the default product data if there's an error
          }
          
          // Fetch likes count for this component (only if component is still mounted)
          if (isMounted) {
            try {
              // Get the like count directly without using fetchLikesData
              // to avoid dependency issues
              const likesData = await getComponentLikes(id);
              
              // Make sure we have a number
              const likesCount = typeof likesData === 'number' ? likesData : 
                                (typeof likesData === 'object' && likesData !== null && 'count' in likesData) ? 
                                likesData.count : 
                                Array.isArray(likesData) ? likesData.length : 0;
              
              console.log('Processed likes count:', likesCount);
              setLikesCount(likesCount);
              
              // Check if the current user has liked this component
              if (isAuthenticated) {
                const hasLiked = await checkIfUserLiked(id);
                setIsFavorited(hasLiked);
              }
            } catch (error) {
              console.error("Error fetching likes data:", error);
            }
          }
        } else {
          console.warn("No component ID provided in URL");
        }
        
        if (isMounted) {
          setLoading(false);
          hasLoaded = true;
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, userId]);

  // Explicitly fetch follow status if we didn't get it from component data
  useEffect(() => {
    if (creatorId && !isCurrentUserCreator && isAuthenticated) {
      console.log("Fetching follow status separately for creator:", creatorId);
      fetchFollowStatus();
    }
  }, [creatorId, isCurrentUserCreator, isAuthenticated, fetchFollowStatus]);

  // Separate function to fetch likes data to be reused
  const fetchLikesData = useCallback(async () => {
    if (!id) return;
    
    try {
      console.log('Fetching likes data for component:', id);
      
      // Get the like count
      const likesData = await getComponentLikes(id);
      console.log('Raw likes data:', likesData);
      
      // Make sure we have a number
      const likesCount = typeof likesData === 'number' ? likesData : 
                       (typeof likesData === 'object' && likesData !== null && 'count' in likesData) ? 
                       likesData.count : 
                       Array.isArray(likesData) ? likesData.length : 0;
      
      console.log('Processed likes count:', likesCount);
      setLikesCount(likesCount);
      
      // Check if the current user has liked this component
      if (isAuthenticated) {
        const hasLiked = await checkIfUserLiked(id);
        console.log('User has liked this component:', hasLiked);
        setIsFavorited(hasLiked);
      }
      
      return likesCount;
    } catch (error) {
      console.error('Error in fetchLikesData:', error);
      return 0;
    }
  }, [id, isAuthenticated]);

  // Handle follow/unfollow actions
  const handleFollowUser = async () => {
    if (!isAuthenticated) {
      alert("Please login to follow this user!");
      return;
    }
    
    if (!creatorId || isCurrentUserCreator) return;
    
    setIsFollowingLoading(true);
    try {
      if (isFollowing) {
        await UserManagerService.unfollowUser(creatorId);
        localStorage.removeItem(`follow_${creatorId}`);
        setIsFollowing(false);
        showSuccessAlert("Unfollowed successfully!");
      } else {
        await UserManagerService.followUser(creatorId);
        localStorage.setItem(`follow_${creatorId}`, 'true');
        setIsFollowing(true);
        showSuccessAlert("Following successfully!");
      }
    } catch (error) {
      showErrorAlert(error.message || "Failed to update follow status!");
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // Kiểm tra trạng thái từ localStorage khi component mount
  useEffect(() => {
    if (creatorId && !isCurrentUserCreator && isAuthenticated) {
      const storedFollowState = localStorage.getItem(`follow_${creatorId}`);
      if (storedFollowState === 'true') {
        setIsFollowing(true);
      }
    }
  }, [creatorId, isCurrentUserCreator, isAuthenticated]);

  // Fetch creator's other components
  useEffect(() => {
    const fetchCreatorComponents = async () => {
      if (!creatorId || !id) return;
      
      setComponentsLoading(true);
      try {
        const response = await UserManagerService.getUserComponents(creatorId, 1, 6);
        
        // Filter out the current component
        const otherComponents = response.components
          .filter(comp => comp.id !== id)
          .slice(0, 5); // Limit to 5 components max
        
        setCreatorComponents(otherComponents);
      } catch (error) {
        console.error("Error fetching creator's components:", error);
      } finally {
        setComponentsLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorComponents();
    }
  }, [creatorId, id]);

  // Handle card expand/collapse
  const handleCardExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  // View profile handler
  const handleViewProfile = () => {
    if (creatorId) {
      navigate(`/profile/${creatorId}`);
    }
  };
  
  // Sample related products
  const moreByDesigner = [
    {
      id: 101,
      title: "Button Component",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 102,
      title: "Card Component",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 103,
      title: "Form Component",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 104,
      title: "Modal Component",
      image: "/placeholder.svg?height=300&width=400",
    },
  ];

  const youMightAlsoLike = [
    {
      id: 201,
      title: "Colorful UI Kit",
      image: "/placeholder.svg?height=300&width=400",
      designer: { name: "Creative Studio" },
    },
    {
      id: 202,
      title: "Minimalist Components",
      image: "/placeholder.svg?height=300&width=400",
      designer: { name: "Design Lab" },
    },
  ];

  // For future implementation: fetch actual product data
  // useEffect(() => {
  //   const fetchProductData = async () => {
  //     try {
  //       const data = await fetchUIComponentById(id);
  //       setProduct(data);
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //       // showAlert("Failed to load product details", "error");
  //     }
  //   };
  //
  //   if (id) {
  //     fetchProductData();
  //   }
  // }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  const toggleLike = async () => {
    if (!isAuthenticated) {
      // If user is not authenticated, show alert or redirect to login
      alert("Vui lòng đăng nhập để thích nội dung này!");
      return;
    }
    
    // Prevent multiple clicks
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      if (isFavorited) {
        // Unlike the component
        const result = await unlikeComponent(id);
        if (result.success) {
          setIsFavorited(false);
          // Ensure likesCount never goes below 0
          setLikesCount(prev => Math.max(0, prev - 1));
          console.log('Successfully unliked component. New likes count:', likesCount - 1);
        } else {
          console.error('Error unliking component:', result.error);
        }
      } else {
        // Like the component
        const result = await likeComponent(id);
        if (result.success) {
          setIsFavorited(true);
          setLikesCount(prev => prev + 1);
          console.log('Successfully liked component. New likes count:', likesCount + 1);
        } else {
          console.error('Error liking component:', result.error);
        }
      }
      
      // Refresh likes data from the server to ensure accuracy
      setTimeout(() => {
        fetchLikesData();
      }, 500);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleSave = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleGetInTouch = () => {
    setShowCodeModal(true);
  };

  const [showCodeModal, setShowCodeModal] = useState(false);

  // Add a handler for adding to cart
  const handleAddToCart = async () => {
    if (!id) return;
    
    setIsAddingToCart(true);
    try {
      await CartService.addToCart({ uiComponentId: id, quantity: 1 });
      dispatch(addItem({ 
        uiComponentId: id, 
        name: product.title, 
        price: product.price || 0,
        quantity: 1 
      }));
      showSuccessAlert("Added to cart successfully!");
    } catch (error) {
      showErrorAlert(error.message || "Failed to add item to cart!");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Debugging effect to log user and creator information
  useEffect(() => {
    console.log("Current user/creator status:", { 
      userId, 
      creatorId, 
      isCurrentUserCreator,
      user: user ? `ID: ${user.id || 'unknown'}` : 'No user' 
    });
  }, [userId, creatorId, isCurrentUserCreator, user]);

  // Handler for navigating to profile
  const navigateToProfile = () => {
    if (creatorId) {
      navigate(`/profile/${creatorId}`);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="product-detail-container loading-container">
        <FaSpinner className="loading-spinner" />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="back-button"
        aria-label="Go back"
      >
        <IoChevronBackOutline size={24} />
      </button>

      <div className="product-detail-content">
        <div className="mx-auto px-4 pt-4 pb-8">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2">{product.title}</h2>

          {/* Designer info */}
          <div className="designer-info">
            <div className="designer-profile">
              <div className="avatar" onClick={navigateToProfile}>
                <img
                  src={product.designer.avatar}
                  alt={product.designer.name}
                  className="avatar-image"
                />
              </div>
              <div>
                <div className="designer-name" onClick={navigateToProfile}>
                  <span className="font-medium">{product.designer.name}</span>
                  <span className="text-gray-500"> for </span>
                  <span className="font-medium clickable">{product.designer.company}</span>
                </div>
                <div className="designer-status">
                  <span className="availability">Available for work</span>
                  {!isCurrentUserCreator && creatorId && isAuthenticated && (
                    <button 
                      className={`follow-button ${isFollowing ? 'following' : ''}`}
                      onClick={handleFollowUser}
                      disabled={isFollowingLoading}
                    >
                      {isFollowingLoading ? (
                        <FaSpinner className="spin-icon" />
                      ) : isFollowing ? (
                        <>
                          <FaUserCheck />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <FaUserPlus />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <div className="like-container">
                <button
                  className={`like-button ${isFavorited ? "liked" : ""}`}
                  onClick={toggleLike}
                  disabled={isLiking}
                >
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span className="likes-count">{likesCount}</span>
              </div>
              <button
                className={`save-button ${isBookmarked ? "saved" : ""}`}
                onClick={toggleSave}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              
              {product.price > 0 ? (
                <button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
              ) : (
              <button 
                className="contact-button"
                onClick={handleGetInTouch}
              >
                Get in touch
              </button>
              )}
            </div>
          </div>

          {/* Main content with image and action buttons */}
          <div className={`product-main-content ${activePanel ? "with-panel" : ""}`}>
            {/* Main image container - shrinks when panel is active */}
            <div className={`product-image-container ${activePanel ? "with-panel" : ""}`}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image-content"
                />
              </div>
            </div>

            {/* Side panels */}
            {activePanel === "comments" && (
              <div className="panel-container">
                <CommentsPanel onClose={() => setActivePanel(null)} componentId={id} />
              </div>
            )}

            {activePanel === "share" && (
              <div className="panel-container">
                <SharePanel onClose={() => setActivePanel(null)} />
              </div>
            )}

            {activePanel === "details" && (
              <div className="panel-container">
                <DetailsPanel design={product} onClose={() => setActivePanel(null)} />
              </div>
            )}
          </div>

          {/* Action buttons outside the image */}
          <div className="panel-toggle-buttons">
            <button
              className={`panel-toggle-button ${activePanel === "comments" ? "active" : ""}`}
              onClick={() => togglePanel("comments")}
              aria-label="Comments"
            >
              <FaCommentAlt size={20} />
            </button>
            <button
              className={`panel-toggle-button ${activePanel === "share" ? "active" : ""}`}
              onClick={() => togglePanel("share")}
              aria-label="Share"
            >
              <FaShare size={20} />
            </button>
            <button
              className={`panel-toggle-button ${activePanel === "details" ? "active" : ""}`}
              onClick={() => togglePanel("details")}
              aria-label="Details"
            >
              <FaInfoCircle size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="product-description">
            <p className="description-text">
              {product.description || "A modern UI component for your web applications."}
            </p>
          </div>

          {/* Contact section */}
          <div className="contact-section">
            <h3 className="contact-heading">Contact us to get your custom UI component</h3>
            <p className="contact-subheading">or branding project done</p>

            <div className="contact-divider">
              <hr className="divider-line" />
              <div className="divider-icon">
                <FaShare className="icon-white" />
              </div>
              <hr className="divider-line" />
            </div>

            <div className="company-info">
              <h4 className="company-name">{product.designer.company || "EasyUI Studio"}</h4>
            </div>
            <p className="company-description">Welcome to our component portfolio</p>
            <button className="contact-us-button">Get in touch</button>
          </div>

          {/* More by designer */}
          {creatorId && creatorComponents.length > 0 && (
          <div className="more-by-designer">
            <div className="section-header">
                <h2 className="section-title">More by {creatorName}</h2>
                <button onClick={handleViewProfile} className="view-profile-link">
                  View profile <FaChevronRight size={12} />
              </button>
            </div>
              
              <div className="creator-components-scroll">
                <div className="creator-components-container">
                  {componentsLoading ? (
                    <div className="components-loading">
                      <div className="loading-spinner" />
                      <p>Loading components...</p>
                    </div>
                  ) : (
                    creatorComponents.map((component, index) => (
                      <div key={component.id || index} className="creator-component-item">
                        <CardItem
                          item={{
                            ...component,
                            createdBy: {
                              id: creatorId,
                              name: creatorName,
                              avatar: product.designer.avatar
                            }
                          }}
                          isExpanded={expandedCardIndex === index}
                          onExpand={() => handleCardExpand(index)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Modal - displayed as a full-screen overlay when showCodeModal is true */}
      {showCodeModal && (
        <div className="code-modal-overlay">
          <div className="code-modal">
            <CodePanel 
              html={product.html} 
              css={product.css} 
              js={product.js} 
              onClose={() => setShowCodeModal(false)} 
            />
          </div>
        </div>
      )}

      {/* Add the SimilarProducts component at the bottom */}
      <SimilarProducts currentProductId={id} />
    </div>
  );
};

export default ProductDetail;
