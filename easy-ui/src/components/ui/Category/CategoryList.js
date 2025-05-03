import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../../services/categoriesService";
import "./CategoryList.css";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="categories-container">
        <h1 className="categories-title">Categories</h1>
        <div className="categories-loading">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-container">
        <h1 className="categories-title">Categories</h1>
        <div className="categories-error">
          <i className="fas fa-exclamation-circle error-icon"></i>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      
      {categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              className="category-card" 
              key={category.id}
            >
              <div className="category-card-content">
                <h3 className="category-card-title">{category.name}</h3>
                {category.description && (
                  <p className="category-card-description">{category.description}</p>
                )}
              </div>
              <div className="category-card-icon">
                <i className="fas fa-angle-right"></i>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-categories">
          <i className="fas fa-folder-open no-categories-icon"></i>
          <h2>No Categories Found</h2>
          <p>There are currently no categories available.</p>
        </div>
      )}
    </div>
  );
}

export default CategoryList; 