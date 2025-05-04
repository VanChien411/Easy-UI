import React, { useState, useEffect } from 'react';
// Using Font Awesome icons since they're already imported in the project
import { FaCopy, FaFacebook, FaTwitter, FaPinterest, FaLinkedin, FaCheck } from 'react-icons/fa';
import './ProductDetail.css';

const SharePanel = ({ onClose }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Get current URL when component mounts
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Handle social media sharing
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const saveOnPinterest = () => {
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
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
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? <FaCheck size={18} /> : <FaCopy size={18} />}
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h4 className="section-title">SHARE ON SOCIAL MEDIA</h4>

        <div className="social-buttons">
          <button className="social-button facebook-button" onClick={shareOnFacebook}>
            <FaFacebook size={20} />
            <span>Share on Facebook</span>
          </button>

          <button className="social-button twitter-button" onClick={shareOnTwitter}>
            <FaTwitter size={20} />
            <span>Share on Twitter</span>
          </button>

          <button className="social-button pinterest-button" onClick={saveOnPinterest}>
            <FaPinterest size={20} />
            <span>Save to Pinterest</span>
          </button>

          <button className="social-button linkedin-button" onClick={shareOnLinkedIn}>
            <FaLinkedin size={20} />
            <span>Share on LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePanel;
