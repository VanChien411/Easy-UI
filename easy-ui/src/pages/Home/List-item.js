import React, { useState } from "react";
import CardItem from "../../components/ui/Card-item";

function ListItem() {
  const [items, setItems] = useState([
    { id: 2, name: "Item 2" },
    { id: 1, name: "Item 1" },
    { id: 1, name: "Item 1" },
    { id: 1, name: "Item 1" },
    { id: 1, name: "Item 1" },
    { id: 1, name: "Item 1" },
    { id: 1, name: "Item 1" },
  ]); // Example items

  return (
    <div>
      <style>
        {`
          .container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            gap: 10px;
            padding: 10px;
            align-content: stretch;
           
          }
       
          .sort-button {
            margin-bottom: 10px;
          }
        `}
      </style>
      <div className="container">
        {items.map((item, index) => (
          <CardItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default ListItem;
