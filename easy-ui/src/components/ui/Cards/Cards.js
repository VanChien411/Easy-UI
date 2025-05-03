import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import { COMPONENT_TYPES } from "../../../constants/routes";
import Skeleton from "../../utils/Skeleton/SkeletonCard";
import "../Contents/Content.css"; // Import the same styles for load more button

function Cards() {
  const [cardData, setCardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  const loadCards = async (page = 1, shouldAppend = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      const response = await fetchUIComponents(COMPONENT_TYPES.CARDS, page, pageSize);
      
      // Debug the API response
      console.log('API Response:', response);
      
      // Check if we have the new paginated response structure
      const components = response.items || response;
      
      // Debug the components data
      if (components && components.length > 0) {
        console.log('First component:', components[0]);
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
        console.log('Mapped component:', mappedComponent);
        return mappedComponent;
      });
      
      if (shouldAppend) {
        setCardData(prevData => [...prevData, ...mappedComponents]);
      } else {
        setCardData(mappedComponents);
      }
    } catch (error) {
      console.error("Error loading cards:", error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCards(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadCards(nextPage, true);
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
      <ListItem items={cardData} />
      
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

export default Cards;
