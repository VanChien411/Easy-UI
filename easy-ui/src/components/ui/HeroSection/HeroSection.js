import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import SearchBar from '../Search/SearchBar';

function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const trendingSearches = [
    'buttons', 
    'forms', 
    'cards', 
    'navigation', 
    'modals', 
    'layout'
  ];

  const handleTagClick = (tag) => {
    navigate(`/search/${encodeURIComponent(tag)}`);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Discover the world's<br />top UI components</h1>
          <p className="hero-subtitle">
            Explore beautiful, responsive UI components built by top developers
            <br />ready to use in your next project
          </p>
        </div>

        {/* Search Bar */}
        <div className="hero-search-wrapper">
          <SearchBar placeholder="What are you looking for?" />
        </div>

        {/* Trending Searches */}
        <div className="trending-searches">
          <span className="trending-label">Trending:</span>
          <div className="trending-tags">
            {trendingSearches.map((tag, index) => (
              <a 
                key={index} 
                onClick={() => handleTagClick(tag)} 
                className="trending-tag"
                style={{ cursor: 'pointer' }}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HeroSection;
