import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListItem from "../Product/List-item";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import SearchBar from "./SearchBar";
import { searchUIComponents } from "../../../services/uiComponentsService";
import "./SearchResults.css";

function SearchResults() {
  const { keyword } = useParams();
  const [contentData, setContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  const searchContents = async (page = 1, shouldAppend = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await searchUIComponents(keyword, page, pageSize);
      console.log('Search response:', response);

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
      console.error("Error searching UI components:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      setCurrentPage(1);
      setHasMore(true);
      searchContents(1, false);
    }
  }, [keyword]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchContents(nextPage, true);
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="search-header">
          <h1 className="search-title">Search Results</h1>
          <SearchBar initialValue={keyword} className="search-bar-top" />
          <p className="search-subtitle">Searching for "{keyword}"</p>
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
      <div className="search-header">
        <h1 className="search-title">Search Results</h1>
        <SearchBar initialValue={keyword} className="search-bar-top" />
        <p className="search-subtitle">
          {contentData.length > 0 
            ? `Found ${contentData.length} results for "${keyword}"`
            : `No results found for "${keyword}"`}
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
          <i className="fas fa-search no-results-icon"></i>
          <h2>No results found</h2>
          <p>Try different keywords or browse our categories</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults; 