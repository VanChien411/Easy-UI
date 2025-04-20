import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponentsAll } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import Skeleton from "../../utils/Skeleton/SkeletonCard";

function Content() {
  const [contentData, setContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="skeleton-grid">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  return <ListItem items={contentData} />;
}

export default Content;
