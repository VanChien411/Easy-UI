import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponentsAll } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import "./Content.css";

function Content() {
  const [contentData, setContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Components');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  const loadContents = async (page = 1, shouldAppend = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      const response = await fetchUIComponentsAll(page, pageSize);
      
      // Debug the API response
      console.log('Content API Response:', response);
      
      // Check if we have the new paginated response structure
      const components = response.items || response;
      
      // Debug the components data
      if (components && components.length > 0) {
        console.log('First content component:', components[0]);
        console.log('previewImage:', components[0].previewImage);
        console.log('views:', components[0].views);
      }
      
      // Update pagination info
      if (response.totalPages !== undefined) {
        setTotalPages(response.totalPages);
        setHasMore(page < response.totalPages);
      } else {
        // If response is empty or less than pageSize, we've reached the end
        setHasMore(!components || components.length === 0 || components.length < pageSize ? false : true);
      }
      
      const mappedComponents = components.map(component => {
        const mappedComponent = UIComponent.fromJson(component);
        console.log('Mapped content component:', mappedComponent);
        return mappedComponent;
      });
      
      if (shouldAppend) {
        setContentData(prevData => [...prevData, ...mappedComponents]);
      } else {
        setContentData(mappedComponents);
      }
    } catch (error) {
      console.error("Error loading Contents:", error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadContents(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadContents(nextPage, true);
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="skeleton-grid">
          {[...Array(16)].map((_, index) => (
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
      
      {isLoadingMore && (
        <div className="loading-more-container">
          <div className="loading-spinner"></div>
          <p>Loading more components...</p>
        </div>
      )}
      
      {hasMore && !isLoadingMore && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Content;
