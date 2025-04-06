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
        const components = await fetchUIComponents(COMPONENT_TYPES.FORMS);
        setFormData(
          components.map((component) => UIComponent.fromJson(component))
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
