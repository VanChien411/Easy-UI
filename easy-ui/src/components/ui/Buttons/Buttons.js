import React, { useEffect, useState } from "react";
import ListItem from "../List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";

function Buttons() {
  const [buttonData, setButtonData] = useState([]);

  useEffect(() => {
    const loadButtons = async () => {
      try {
        const components = await fetchUIComponents();
        setButtonData(
          components.map((component) => ({
            id: component.id,
            name: component.name,
            buttonClass: component.type, // Assuming `type` maps to button class
            html: component.code,
            css: "", // Add CSS if available in the component data
          }))
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
