import React from 'react';
// Using Font Awesome icons since they're already imported in the project
import { FaCopy, FaFacebook, FaTwitter, FaPinterest, FaLinkedin } from 'react-icons/fa';
import './ProductDetail.css';

const SharePanel = ({ onClose }) => {
  const shareUrl = "https://example.com/product-details/12345";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="panel-header">
        <h3 className="panel-title">Share</h3>
        <button onClick={onClose} className="panel-close-button">
          ×
        </button>
      </div>

      <div className="panel-section">
        <div className="share-url-container">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="share-url-input"
          />
          <button
            onClick={copyToClipboard}
            className="copy-url-button"
          >
            <FaCopy size={18} />
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h4 className="section-title">Share on social media</h4>

        <div className="social-buttons">
          <button className="social-button facebook-button">
            <FaFacebook size={20} />
            <span>Share on Facebook</span>
          </button>

          <button className="social-button twitter-button">
            <FaTwitter size={20} />
            <span>Share on Twitter</span>
          </button>

          <button className="social-button pinterest-button">
            <FaPinterest size={20} />
            <span>Save to Pinterest</span>
          </button>

          <button className="social-button linkedin-button">
            <FaLinkedin size={20} />
            <span>Share on LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePanel;
