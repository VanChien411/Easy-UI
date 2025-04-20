import React, { useEffect, useState } from "react";
import ListItem from "../Product/List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import { COMPONENT_TYPES } from "../../../constants/routes";
import Skeleton from "../../utils/Skeleton/SkeletonCard";

function Buttons() {
  const [buttonData, setButtonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadButtons = async () => {
      try {
        setIsLoading(true);
        const components = await fetchUIComponents(COMPONENT_TYPES.BUTTONS);
        setButtonData(
          components.map((component) => UIComponent.fromJson(component))
        );
      } catch (error) {
        console.error("Error loading buttons:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadButtons();
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

  return <ListItem items={buttonData} />;
}

export default Buttons;
