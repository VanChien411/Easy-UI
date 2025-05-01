import React from 'react';
import './ProductDetail.css';

const DetailsPanel = ({ design, onClose }) => {
  // Sample tags
  const tags = [
    "ai",
    "web3",
    "crypto",
    "transfer",
    "fintech",
    "blockchain",
    "lettering",
    "icon",
    "gradient",
    "identity",
    "branding",
    "logo",
  ]

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="panel-header">
        <h3 className="panel-title">Component details</h3>
        <button onClick={onClose} className="panel-close-button">
          ×
        </button>
      </div>

      <div className="panel-section">
        <p className="detail-date">Posted May 1, 2023</p>
      </div>

      <div className="detail-stats">
        <div className="stat-item">
          <h4 className="stat-label">Views</h4>
          <p className="stat-value">5,219</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Saves</h4>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Likes</h4>
          <p className="stat-value">56</p>
        </div>
        <div className="stat-item">
          <h4 className="stat-label">Comments</h4>
          <p className="stat-value">13</p>
        </div>
      </div>

      <div className="panel-section">
        <h4 className="section-title">Tags</h4>
        <div className="tags-container">
          {tags.map((tag) => (
            <span key={tag} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DetailsPanel
