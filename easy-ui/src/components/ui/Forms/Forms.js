import React, { useEffect, useState } from "react";
import ListItem from "../List-item";
import { fetchUIComponents } from "../../../services/uiComponentsService";
import UIComponent from "../../../models/UIComponents";
import { COMPONENT_TYPES } from "../../../constants/routes";

function Forms() {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const components = await fetchUIComponents();
        setFormData(
          components
            .filter((component) => component.type === COMPONENT_TYPES.FORMS)
            .map((component) => UIComponent.fromJson(component))
        );
      } catch (error) {
        console.error("Error loading forms:", error.message);
      }
    };

    loadForms();
  }, []);

  return <ListItem items={formData} />;
}

export default Forms;
