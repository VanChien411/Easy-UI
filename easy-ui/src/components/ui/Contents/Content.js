import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponentsAll } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import "./Content.css";

function Content() {
  const [contentData, setContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Components');

  useEffect(() => {
    const loadContents = async () => {
      try {
        setIsLoading(true);
        const components = await fetchUIComponentsAll();
        setContentData(
          components.map((component) => UIComponent.fromJson(component))
        );
      } catch (error) {
        console.error("Error loading Contents:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadContents();
  }, []);

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="skeleton-grid">
          {[...Array(12)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const categories = [
    'All Components', 'Buttons', 'Cards', 'Forms', 'Navigation', 'Modals'
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Here you would filter content based on category
    // For now, we'll just update the active state
  };

  return (
    <div className="content-container">
      <div className="category-navigation">
        <div className="category-nav-items">
          {categories.map((category) => (
            <button 
              key={category} 
              className={`category-nav-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="content-header">
        <h2 className="content-title">Popular UI Components</h2>
        <p className="content-subtitle">Discover our most popular and trending UI elements</p>
      </div>
      
      <ListItem items={contentData} />
    </div>
  );
}

export default Content;
