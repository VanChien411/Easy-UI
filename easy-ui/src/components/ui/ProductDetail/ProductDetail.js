import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaShare, FaDownload, FaCheck, FaRegCopy } from 'react-icons/fa';
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

// Component Preview sản phẩm
const ProductPreview = ({ html, css, js }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('preview');

  const combinedCode = `
    <html>
      <style>${css}</style>
      <body>${html}</body>
      <script>${js}</script>
    </html>
  `;

  return (
    <div className="product-preview">
      <div className="code-tabs">
        <button 
          className={`tab ${activeCodeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveCodeTab('preview')}
        >
          Preview
        </button>
        <button 
          className={`tab ${activeCodeTab === 'html' ? 'active' : ''}`}
          onClick={() => setActiveCodeTab('html')}
        >
          HTML
        </button>
        <button 
          className={`tab ${activeCodeTab === 'css' ? 'active' : ''}`}
          onClick={() => setActiveCodeTab('css')}
        >
          CSS
        </button>
        <button 
          className={`tab ${activeCodeTab === 'js' ? 'active' : ''}`}
          onClick={() => setActiveCodeTab('js')}
        >
          JavaScript
        </button>
      </div>

      <div className="preview-content">
        {activeCodeTab === 'preview' ? (
          <iframe srcDoc={combinedCode} title="preview" />
        ) : activeCodeTab === 'html' ? (
          <CodeDisplay code={html} language="HTML" />
        ) : activeCodeTab === 'css' ? (
          <CodeDisplay code={css} language="CSS" />
        ) : (
          <CodeDisplay code={js} language="JavaScript" />
        )}
      </div>
    </div>
  );
};

// Component chính
const ProductDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('product');
  const [codeTab, setCodeTab] = useState('html');
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState(0);

  // Dữ liệu mẫu
  const product = {
    title: "Modern Dashboard UI Kit",
    rating: 4.8,
    reviews: 124,
    downloads: 1568,
    price: {
      current: 990000,
      original: 1290000,
      discount: 23
    },
    creator: {
      name: "Design Studio",
      avatar: "/path/to/avatar.jpg"
    },
    details: {
      lastUpdate: "15/04/2023",
      fileSize: "24.5 MB",
      tags: ["Figma", "HTML/CSS", "React"]
    },
    images: [
      "/path/to/image1.jpg",
      "/path/to/image2.jpg",
      "/path/to/image3.jpg"
    ],
    description: "A beautiful and responsive button component with multiple variants...",
    code: {
      html: "<button class='custom-btn'>Click me</button>",
      css: ".custom-btn { /* styles */ }",
      js: "document.querySelector('.custom-btn').addEventListener('click', () => {})"
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoChevronBackOutline /> Trở lại
        </button>
        <h1 className="product-title">{product.title}</h1>
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
                <div className="product-preview">
                  <div className="product-images">
                    <div className="main-image">
                      <img src={product.images[mainImage]} alt={product.title} />
                    </div>
                    <div className="image-thumbnails">
                      {product.images.map((img, index) => (
                        <img 
                          key={index}
                          src={img}
                          alt={`${product.title} ${index + 1}`}
                          onClick={() => setMainImage(index)}
                          className={mainImage === index ? 'active' : ''}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="source-code-section">
                  <h3>Xem mã nguồn</h3>
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
                              <style>${product.code.css}</style>
                              <body>${product.code.html}</body>
                              <script>${product.code.js}</script>
                            </html>
                          `}
                          title="preview"
                        />
                      </div>
                    ) : (
                      <CodeDisplay 
                        code={
                          codeTab === 'html' 
                            ? product.code.html 
                            : codeTab === 'css' 
                            ? product.code.css 
                            : product.code.js
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
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="comments-content">
                {/* Comments section */}
              </div>
            )}
          </div>
        </div>

        {/* Product Info Sidebar */}
        <div className="product-sidebar">
          <div className="price-section">
            <div className="current-price">{formatPrice(product.price.current)} đ</div>
            <div className="original-price">{formatPrice(product.price.original)} đ</div>
            <div className="discount-badge">{product.price.discount}% giảm</div>
          </div>

          <div className="creator-section">
            <img src={product.creator.avatar} alt={product.creator.name} className="creator-avatar" />
            <div className="creator-info">
              <span className="creator-name">{product.creator.name}</span>
              <span className="creator-label">Tác giả</span>
            </div>
          </div>

          <div className="product-stats">
            <div className="stat-item">
              <span className="stat-label">Cập nhật</span>
              <span className="stat-value">{product.details.lastUpdate}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Kích thước</span>
              <span className="stat-value">{product.details.fileSize}</span>
            </div>
          </div>

          <div className="product-tags">
            <div className="tag-label">Định dạng</div>
            <div className="tags-container">
              {product.details.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <button className="buy-now-button">
            <span className="cart-icon">🛒</span>
            Mua ngay
          </button>
          
          <button className="download-button-secondary">
            <FaDownload /> Tải xuống
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 