import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import { COMPONENT_TYPES } from "../../../constants/routes";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import "../Contents/Content.css"; // Import the same styles for load more button

function Buttons() {
  const [buttonData, setButtonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  const loadButtons = async (page = 1, shouldAppend = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      const response = await fetchUIComponents(COMPONENT_TYPES.BUTTONS, page, pageSize);
      
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
      
      const mappedComponents = components.map(component => UIComponent.fromJson(component));
      
      if (shouldAppend) {
        setButtonData(prevData => [...prevData, ...mappedComponents]);
      } else {
        setButtonData(mappedComponents);
      }
    } catch (error) {
      console.error("Error loading buttons:", error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadButtons(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadButtons(nextPage, true);
  };

  if (isLoading) {
    return (
      <div className="skeleton-grid">
        {[...Array(16)].map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <ListItem items={buttonData} />
      
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

export default Buttons;
