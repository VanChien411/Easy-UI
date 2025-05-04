import React, { useEffect, useState, useRef } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponentsAll, fetchTrendingUIComponents } from "../../../services/uiComponentsService";
import { fetchCategories, fetchComponentsByCategory } from "../../../services/categoriesService";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import "./Content.css";

function Content() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // null means "All Components"
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [sortFilter, setSortFilter] = useState('Popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const pageSize = 16;
  
  // Mapping cho sortBy parameter
  const getSortByParameter = (filter) => {
    switch(filter) {
      case 'Most View':
        return 'views_desc';
      case 'Most Like':
        return 'likes_desc';
      case 'Popular':
      default:
        return 'popular';
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Fetch categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await fetchCategories();
        console.log('Categories data:', data);
        setCategoriesList(data);
      } catch (error) {
        console.error("Error loading categories:", error.message);
        setCategoriesList([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const loadContents = async (page = 1, shouldAppend = false, categoryId = activeCategory) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      let response;
      
      // Chuyển đổi sortFilter thành tham số sortBy cho API
      const sortBy = getSortByParameter(sortFilter);
      
      if (categoryId === null) {
        // Fetch trending components with sort parameter
        response = await fetchTrendingUIComponents(sortBy, page, pageSize);
      } else {
        // Fetch components by category ID
        // Lưu ý: API fetchComponentsByCategory hiện không hỗ trợ sortBy, 
        // nên sắp xếp sẽ chỉ áp dụng cho All Components
        response = await fetchComponentsByCategory(categoryId, page, pageSize);
      }
      
      // Debug the API response
      console.log('Content API Response:', response);
      
      // Check if we have the new paginated response structure
      const components = response.items || response;
      
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

  // Load components when active category or sort filter changes
  useEffect(() => {
    if (!isCategoriesLoading) { // Only load contents after categories are loaded
      loadContents(1, false, activeCategory);
      setCurrentPage(1);
    }
  }, [activeCategory, isCategoriesLoading, sortFilter]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadContents(nextPage, true, activeCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortFilterChange = (filter) => {
    setSortFilter(filter);
    setIsFilterOpen(false);
  };

  // Get active category name for display
  const getActiveCategoryName = () => {
    if (activeCategory === null) return "All Components";
    
    const category = categoriesList.find(cat => cat.id === activeCategory);
    return category ? category.name : "Components";
  };

  if (isCategoriesLoading) {
    return (
      <div className="content-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="category-navigation">
          <div className="categories-container">
            <div className="filter-dropdown" ref={filterRef}>
              <button className="filter-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                {sortFilter} <span className="dropdown-arrow">▼</span>
              </button>
            </div>
            
            <div className="category-nav-items">
              <button 
                key="all" 
                className={`category-nav-item ${activeCategory === null ? 'active' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                All Components
              </button>
              
              {categoriesList.map((category) => (
                <button 
                  key={category.id} 
                  className={`category-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="skeleton-grid">
          {[...Array(16)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="category-navigation">
        <div className="categories-container">
          <div className="filter-dropdown" ref={filterRef}>
            <button className="filter-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              {sortFilter} <span className="dropdown-arrow">▼</span>
            </button>
            {isFilterOpen && (
              <div className="filter-dropdown-content">
                <button 
                  className={`filter-option ${sortFilter === 'Popular' ? 'active' : ''}`}
                  onClick={() => handleSortFilterChange('Popular')}
                >
                  Popular
                </button>
                <button 
                  className={`filter-option ${sortFilter === 'Most View' ? 'active' : ''}`}
                  onClick={() => handleSortFilterChange('Most View')}
                >
                  Most View
                </button>
                <button 
                  className={`filter-option ${sortFilter === 'Most Like' ? 'active' : ''}`}
                  onClick={() => handleSortFilterChange('Most Like')}
                >
                  Most Like
                </button>
              </div>
            )}
          </div>
          
          <div className="category-nav-items">
            <button 
              key="all" 
              className={`category-nav-item ${activeCategory === null ? 'active' : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              All Components
            </button>
            
            {categoriesList.map((category) => (
              <button 
                key={category.id} 
                className={`category-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="content-header">
        <h2 className="content-title">
          {getActiveCategoryName()} {activeCategory !== null ? 'Components' : ''}
        </h2>
        <p className="content-subtitle">
          {activeCategory === null
            ? 'Discover our most popular and trending UI elements'
            : `Browse our collection of ${getActiveCategoryName().toLowerCase()} components`}
        </p>
      </div>
      
      {contentData.length > 0 ? (
        <ListItem items={contentData} />
      ) : (
        <div className="no-content-message">
          <p>No components found for this category. Try another one or check back later.</p>
        </div>
      )}
      
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
