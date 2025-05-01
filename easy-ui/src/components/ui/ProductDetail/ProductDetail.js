import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaShare, FaBookmark, FaRegBookmark, 
  FaInfoCircle, FaCommentAlt, FaSpinner } from 'react-icons/fa';
// Import fetchUIComponentById to get UI component data
import { fetchUIComponentById } from '../../../services/uiComponentsService';
import CommentsPanel from './CommentsPanel';
import DetailsPanel from './DetailsPanel';
import SharePanel from './SharePanel';
import './ProductDetail.css';

// Component hiển thị và copy code - Will be used later when implementing code display functionality
// This component is preserved for future implementation
/*
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
*/

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States for UI
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activePanel, setActivePanel] = useState(null); 
  const [loading, setLoading] = useState(false);

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

  // Fetch product and designer data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch UI component data using the ID from URL params
        if (id) {
          try {
            // Get UI component data which should include author information
            const componentData = await fetchUIComponentById(id);
            
            // If we have the component data, update our product state
            if (componentData) {
              // Extract the author name from the component data
              const authorName = componentData.authorName || "Unknown Author";
              
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
                designer: {
                  name: "Design Studio",
                  // Format as "Design Studio for [authorName]"
                  company: `${authorName}`,
                  avatar: "/placeholder.svg?height=40&width=40",
                  available: true
                }
              });
              
              console.log("Loaded UI component data:", componentData);
            }
          } catch (error) {
            console.error("Error fetching UI component data:", error);
            // Keep using the default product data if there's an error
          }
        } else {
          console.warn("No component ID provided in URL");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Re-fetch when the ID changes
  
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
  //       showAlert("Failed to load product details", "error");
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

  const toggleLike = () => {
    setIsFavorited(!isFavorited);
  };

  const toggleSave = () => {
    setIsBookmarked(!isBookmarked);
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
              <div className="avatar">
                <img
                  src={product.designer.avatar}
                  alt={product.designer.name}
                  className="avatar-image"
                />
              </div>
              <div>
                <div className="designer-name">
                  <span className="font-medium">{product.designer.name}</span>
                  <span className="text-gray-500"> for </span>
                  <span className="font-medium">{product.designer.company}</span>
                </div>
                <div className="designer-status">
                  <span className="availability">Available for work</span>
                  <button className="follow-button">Follow</button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className={`like-button ${isFavorited ? "liked" : ""}`}
                onClick={toggleLike}
              >
                {isFavorited ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button
                className={`save-button ${isBookmarked ? "saved" : ""}`}
                onClick={toggleSave}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button className="contact-button">
                Get in touch
              </button>
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
          <div className="more-by-designer">
            <div className="section-header">
              <h3 className="section-title">More by {product.designer.company || "EasyUI Studio"}</h3>
              <button className="view-profile-link">
                View profile
              </button>
            </div>
            <div className="more-items-grid">
              {moreByDesigner.map((item) => (
                <div key={item.id} className="more-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="more-item-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* You might also like */}
          <div className="recommendations">
            <h3 className="section-title">You might also like</h3>
            <div className="recommended-items-grid">
              {youMightAlsoLike.map((item) => (
                <div key={item.id} className="recommended-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="recommended-item-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
