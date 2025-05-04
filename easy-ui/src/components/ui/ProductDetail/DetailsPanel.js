import React from 'react';
import './ProductDetail.css';
import { formatDate } from '../../../utils/formatUtils';

const DetailsPanel = ({ design, onClose }) => {
  // Format createdAt date if available
  const formatCreatedDate = () => {
    if (!design || !design.createdAt) return 'N/A';
    return formatDate(design.createdAt) || 'N/A';
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="panel-header">
        <h3 className="panel-title">Component details</h3>
        <button onClick={onClose} className="panel-close-button">
          ×
        </button>
      </div>

      <div className="panel-section">
        <p className="detail-date">Posted {formatCreatedDate()}</p>
      </div>

      <div className="detail-stats">
        <div className="stat-item">
          <h4 className="stat-label">Views</h4>
          <p className="stat-value">{formatNumber(design.views)}</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Downloads</h4>
          <p className="stat-value">{formatNumber(design.downloads)}</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Likes</h4>
          <p className="stat-value">{formatNumber(design.likesCount)}</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Rating</h4>
          <p className="stat-value">{design.rating ? design.rating.toFixed(1) : 'N/A'}</p>
        </div>
      </div>

      {design.categories && design.categories.length > 0 && (
        <div className="panel-section">
          <h4 className="section-title">Categories</h4>
          <div className="tags-container">
            {design.categories.map((category) => (
              <span key={category.id || category} className="tag-item category-tag">
                {typeof category === 'object' ? category.name : category}
              </span>
            ))}
          </div>
        </div>
      )}

      {design.tags && design.tags.length > 0 && (
        <div className="panel-section">
          <h4 className="section-title">Tags</h4>
          <div className="tags-container">
            {design.tags.map((tag) => (
              <span key={typeof tag === 'object' ? tag.id : tag} className="tag-item">
                {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {design.creator && (
        <div className="panel-section">
          <h4 className="section-title">Creator</h4>
          <div className="creator-info">
            <p className="creator-name">
              {design.creator.fullName || design.creator.userName || "Unknown"}
            </p>
            {design.creator.email && (
              <p className="creator-email">{design.creator.email}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPanel;
