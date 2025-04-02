import React, { useEffect, useState } from "react";
import ListItem from "../List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";

function Buttons() {
  const [buttonData, setButtonData] = useState([]);
  useEffect(() => {
    const loadButtons = async () => {
      try {
        const components = await fetchUIComponents();
        setButtonData(
          components.map((component) => UIComponent.fromJson(component))
        );
      } catch (error) {
        console.error("Error loading buttons:", error.message);
      }
    };

    loadButtons();
  }, []);

  return <ListItem items={buttonData} />;
}

export default Buttons;
