import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = ({ className = "", placeholder = "What are you looking for?", initialValue = "" }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`hero-search-form ${className}`}>
      <div className="hero-search-container">
        <input
          type="text"
          className="hero-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="hero-search-button">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 