import React, { useEffect, useState } from "react";
import ListItem from "../List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import { COMPONENT_TYPES } from "../../../constants/routes";

function Cards() {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const components = await fetchUIComponents();
        setCardData(
          components
            .filter((component) => component.type === COMPONENT_TYPES.CARDS)
            .map((component) => UIComponent.fromJson(component))
        );
      } catch (error) {
        console.error("Error loading cards:", error.message);
      }
    };

    loadCards();
  }, []);

  return <ListItem items={cardData} />;
}

export default Cards;
