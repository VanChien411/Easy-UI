import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListItem from "../Product/List-item";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import { fetchComponentsByCategory, fetchCategoryById } from "../../../services/categoriesService";
import "./CategoryComponents.css";

function CategoryComponents({ categoryId: propCategoryId }) {
  const { categoryId: paramCategoryId } = useParams();
  const categoryId = propCategoryId || paramCategoryId;
  
  const [contentData, setContentData] = useState([]);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  // Fetch category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) return;
      
      try {
        const categoryData = await fetchCategoryById(categoryId);
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };
    
    fetchCategoryDetails();
  }, [categoryId]);

  // Fetch components by category
  const fetchComponents = async (page = 1, shouldAppend = false) => {
    if (!categoryId) return;
    
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await fetchComponentsByCategory(categoryId, page, pageSize);
      console.log('Category components response:', response);

      // Check if response has items array or use the response directly
      const components = response.items || response || [];
      
      // Update pagination information
      if (response.totalPages !== undefined) {
        setTotalPages(response.totalPages);
        setHasMore(page < response.totalPages);
      } else if (response.pageSize !== undefined) {
        // Alternative pagination info format
        setHasMore(components.length === pageSize);
      } else {
        // If no pagination info, check if we received fewer items than requested
        setHasMore(components.length === pageSize);
      }
      
      // Map each component to UIComponent model
      const mappedComponents = components.map(component => 
        UIComponent.fromJson(component)
      );
      
      if (shouldAppend) {
        setContentData(prevData => [...prevData, ...mappedComponents]);
      } else {
        setContentData(mappedComponents);
      }
    } catch (error) {
      console.error(`Error fetching components for category ${categoryId}:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      setCurrentPage(1);
      setHasMore(true);
      fetchComponents(1, false);
    }
  }, [categoryId]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchComponents(nextPage, true);
  };

  if (isLoading) {
    return (
      <div className="category-container">
        <div className="category-header">
          <h1 className="category-title">Loading Category</h1>
          <div className="category-skeleton-title"></div>
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
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">{category?.name || 'Category Components'}</h1>
        {category?.description && (
          <p className="category-description">{category.description}</p>
        )}
        <p className="category-subtitle">
          {contentData.length > 0 
            ? `Found ${contentData.length} components in this category`
            : `No components found in this category`}
        </p>
      </div>
      
      {contentData.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="no-results">
          <i className="fas fa-box-open no-results-icon"></i>
          <h2>No components found</h2>
          <p>This category currently has no components</p>
        </div>
      )}
    </div>
  );
}

export default CategoryComponents;