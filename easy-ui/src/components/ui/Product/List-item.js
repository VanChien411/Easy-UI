import React, { useState } from "react";
import CardItem from "./Card-item";
import "./List-item.css";

function ListItem({ items }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="list-item-container">
      <div className="component-grid">
        {items.map((item, index) => (
          <CardItem
            key={index}
            item={item}
            isExpanded={expandedCard === index}
            onExpand={() => handleExpand(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ListItem;
