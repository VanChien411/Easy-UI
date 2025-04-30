import React, { useState } from 'react';
import './HeroSection.css';

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingSearches = [
    'buttons', 
    'forms', 
    'cards', 
    'navigation', 
    'modals', 
    'layout'
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search query - you could redirect to search results page
    console.log('Search query:', searchQuery);
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
          <form className="hero-search-form" onSubmit={handleSearchSubmit}>
            <div className="hero-search-container">
              <input
                type="text"
                className="hero-search-input"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="hero-search-button">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Trending Searches */}
        <div className="trending-searches">
          <span className="trending-label">Trending:</span>
          <div className="trending-tags">
            {trendingSearches.map((tag, index) => (
              <a key={index} href={`/search?q=${tag}`} className="trending-tag">
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
